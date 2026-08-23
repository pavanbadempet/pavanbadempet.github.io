//! Portfolio AI High-Performance Rust WebAssembly Engine
//!
//! Provides ultra-fast, zero-overhead computation for:
//! - Vector Math: Cosine similarity, dot products, euclidean distance
//! - Search & IR: BM25 relevance scoring, fuzzy token matching
//! - LLM Utilities: Fast BPE-style token count estimation

use std::alloc::{alloc, dealloc, Layout};
use std::slice;

// =========================================================================
// Memory Management for WebAssembly JS Interop
// =========================================================================

#[unsafe(no_mangle)]
pub extern "C" fn wasm_alloc(size: usize) -> *mut u8 {
    let layout = Layout::from_size_align(size, 8).unwrap_or(Layout::new::<u8>());
    unsafe { alloc(layout) }
}

#[unsafe(no_mangle)]
pub extern "C" fn wasm_dealloc(ptr: *mut u8, size: usize) {
    if ptr.is_null() {
        return;
    }
    let layout = Layout::from_size_align(size, 8).unwrap_or(Layout::new::<u8>());
    unsafe { dealloc(ptr, layout) }
}

// =========================================================================
// Vector Mathematics
// =========================================================================

/// Calculates cosine similarity between two float vector arrays.
/// Cosine similarity = (A · B) / (||A|| * ||B||)
#[unsafe(no_mangle)]
pub extern "C" fn cosine_similarity(a_ptr: *const f32, b_ptr: *const f32, len: usize) -> f32 {
    if a_ptr.is_null() || b_ptr.is_null() || len == 0 {
        return 0.0;
    }

    let a = unsafe { slice::from_raw_parts(a_ptr, len) };
    let b = unsafe { slice::from_raw_parts(b_ptr, len) };

    let mut dot_product = 0.0f32;
    let mut norm_a = 0.0f32;
    let mut norm_b = 0.0f32;

    for i in 0..len {
        let val_a = a[i];
        let val_b = b[i];
        dot_product += val_a * val_b;
        norm_a += val_a * val_a;
        norm_b += val_b * val_b;
    }

    let denominator = norm_a.sqrt() * norm_b.sqrt();
    if denominator < 1e-8 {
        0.0
    } else {
        (dot_product / denominator).clamp(-1.0, 1.0)
    }
}

/// Calculates dot product between two float vectors.
#[unsafe(no_mangle)]
pub extern "C" fn dot_product(a_ptr: *const f32, b_ptr: *const f32, len: usize) -> f32 {
    if a_ptr.is_null() || b_ptr.is_null() || len == 0 {
        return 0.0;
    }

    let a = unsafe { slice::from_raw_parts(a_ptr, len) };
    let b = unsafe { slice::from_raw_parts(b_ptr, len) };

    let mut sum = 0.0f32;
    for i in 0..len {
        sum += a[i] * b[i];
    }
    sum
}

// =========================================================================
// Information Retrieval: Okapi BM25 Scoring
// =========================================================================

/// Calculates Okapi BM25 score for a term.
/// k1 = 1.2, b = 0.75
#[unsafe(no_mangle)]
pub extern "C" fn bm25_term_score(
    doc_tf: f32,
    doc_len: f32,
    avg_doc_len: f32,
    total_docs: f32,
    doc_freq: f32,
) -> f32 {
    if doc_tf <= 0.0 || total_docs <= 0.0 || doc_freq <= 0.0 {
        return 0.0;
    }

    let k1: f32 = 1.2;
    let b: f32 = 0.75;

    // Standard Lucene / Robertson IDF
    let idf = ((total_docs - doc_freq + 0.5) / (doc_freq + 0.5) + 1.0).ln();
    let norm_doc_len = if avg_doc_len > 0.0 {
        doc_len / avg_doc_len
    } else {
        1.0
    };

    let tf_component = (doc_tf * (k1 + 1.0)) / (doc_tf + k1 * (1.0 - b + b * norm_doc_len));
    idf * tf_component
}

// =========================================================================
// Fast Fuzzy Substring & Keyword Matching
// =========================================================================

/// Computes a normalized matching score between a query and document text.
/// Returns a score between 0.0 and 1.0 (with bonus for exact match and prefix match).
#[unsafe(no_mangle)]
pub extern "C" fn fast_text_score(
    query_ptr: *const u8,
    query_len: usize,
    doc_ptr: *const u8,
    doc_len: usize,
) -> f32 {
    if query_ptr.is_null() || doc_ptr.is_null() || query_len == 0 || doc_len == 0 {
        return 0.0;
    }

    let query_bytes = unsafe { slice::from_raw_parts(query_ptr, query_len) };
    let doc_bytes = unsafe { slice::from_raw_parts(doc_ptr, doc_len) };

    // Convert to lowercase ASCII for fast matching
    let query_lower: Vec<u8> = query_bytes.iter().map(|b| b.to_ascii_lowercase()).collect();
    let doc_lower: Vec<u8> = doc_bytes.iter().map(|b| b.to_ascii_lowercase()).collect();

    // Check exact substring match
    let mut score = 0.0f32;
    if query_len <= doc_len {
        for window in doc_lower.windows(query_len) {
            if window == query_lower.as_slice() {
                score += 1.0;
                break;
            }
        }
    }

    // Token-level overlap
    let query_words: Vec<&[u8]> = query_lower
        .split(|&b| b == b' ' || b == b'\n' || b == b',' || b == b'.' || b == b'-')
        .filter(|w| !w.is_empty())
        .collect();

    let doc_words: Vec<&[u8]> = doc_lower
        .split(|&b| b == b' ' || b == b'\n' || b == b',' || b == b'.' || b == b'-')
        .filter(|w| !w.is_empty())
        .collect();

    if query_words.is_empty() || doc_words.is_empty() {
        return score;
    }

    let mut matched_words = 0;
    for qw in &query_words {
        for dw in &doc_words {
            if dw == qw {
                matched_words += 1;
                break;
            } else if dw.starts_with(qw) {
                matched_words += 1;
                break;
            }
        }
    }

    let word_ratio = (matched_words as f32) / (query_words.len() as f32);
    score + (word_ratio * 0.8)
}

// =========================================================================
// LLM Utilities: Fast BPE Token Estimator
// =========================================================================

/// Estimates the token count of a UTF-8 text string (optimized for Llama 3/GPT-4 tokenization).
#[unsafe(no_mangle)]
pub extern "C" fn estimate_tokens(text_ptr: *const u8, text_len: usize) -> u32 {
    if text_ptr.is_null() || text_len == 0 {
        return 0;
    }

    let bytes = unsafe { slice::from_raw_parts(text_ptr, text_len) };
    let mut tokens: u32 = 0;
    let mut in_word = false;
    let mut word_len: u32 = 0;

    for &b in bytes {
        if b.is_ascii_whitespace() {
            if in_word {
                tokens += 1;
                if word_len > 6 {
                    tokens += (word_len - 1) / 6;
                }
                in_word = false;
                word_len = 0;
            }
            // Continuous newlines or tabs cost tokens
            if b == b'\n' {
                tokens += 1;
            }
        } else if b.is_ascii_punctuation() {
            if in_word {
                tokens += 1;
                if word_len > 6 {
                    tokens += (word_len - 1) / 6;
                }
                in_word = false;
                word_len = 0;
            }
            tokens += 1;
        } else {
            in_word = true;
            word_len += 1;
        }
    }

    if in_word {
        tokens += 1;
        if word_len > 6 {
            tokens += (word_len - 1) / 6;
        }
    }

    tokens.max(1)
}

// =========================================================================
// Unit Tests
// =========================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cosine_similarity() {
        let a = [1.0f32, 0.0, 1.0];
        let b = [1.0f32, 0.0, 1.0];
        let sim = cosine_similarity(a.as_ptr(), b.as_ptr(), 3);
        assert!((sim - 1.0).abs() < 1e-5);

        let c = [0.0f32, 1.0, 0.0];
        let sim_orthogonal = cosine_similarity(a.as_ptr(), c.as_ptr(), 3);
        assert!((sim_orthogonal - 0.0).abs() < 1e-5);
    }

    #[test]
    fn test_bm25_term_score() {
        let score = bm25_term_score(2.0, 100.0, 120.0, 50.0, 5.0);
        assert!(score > 0.0);
    }

    #[test]
    fn test_fast_text_score() {
        let query = b"pyspark data engineer";
        let doc = b"Pavan Badempet is a Data Engineer proficient in PySpark and Databricks.";
        let score = fast_text_score(query.as_ptr(), query.len(), doc.as_ptr(), doc.len());
        assert!(score > 0.5);
    }

    #[test]
    fn test_estimate_tokens() {
        let text = b"Hello world! This is a fast Rust WebAssembly engine for portfolio search.";
        let tokens = estimate_tokens(text.as_ptr(), text.len());
        assert!(tokens >= 10 && tokens <= 20);
    }
}
