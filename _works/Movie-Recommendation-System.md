---
title: AI Recommendation Engine
category: Content
category_slug: f-content
type: content
image: assets/img/works/mrsbup.png
description: "Batch and real-time ingestion flows with PySpark & Structured Streaming on Databricks for 20M+ records, Delta Lake checkpointing, and FastAPI vector retrieval."
button_url: https://github.com/pavanbadempet/Movie-Recommendation-System
demo_url: https://movie-recommendation-system.streamlit.app
tags: [python, pyspark, databricks, structured-streaming, delta-lake, airflow, fastapi]
---

**AI Recommendation Engine | Python, PySpark, Databricks, Structured Streaming, Delta Lake, Airflow, FastAPI**

A scalable, high-throughput recommendation platform handling millions of records with real-time streaming and fast vector similarity search.

### Tech Stack
*   **Big Data & Streaming:** Python, PySpark, Spark SQL, Databricks, Structured Streaming, Delta Lake
*   **Vector Search & Serving:** FastAPI, pgvector / FAISS, SBERT
*   **Orchestration & CI/CD:** Apache Airflow, GitHub Actions, Docker

### Key Highlights & Results
*   **High-Volume Ingestion & Streaming:** Engineered batch and real-time ingestion flows using PySpark, SQL, and Structured Streaming on Databricks for 20M+ records, enforcing data quality checks, Delta Lake checkpointing, and incremental loading.
*   **Sub-50ms Vector Retrieval:** Built a low-latency serving API using FastAPI and vector retrieval engine with pgvector/FAISS indexing for candidate matching, enabling sub-50ms lookups across 100K+ items.
*   **Automated Pipeline Operations:** Integrated automated validation and pipeline scheduling via Apache Airflow and GitHub Actions.

### Recommendation Pipeline
<div class="mermaid" style="background: transparent; padding: 10px; border-radius: 8px;">
graph TD
    User([User]) -->|Input Movie Query| UI[Streamlit UI]
    UI -->|Query String| API[FastAPI Gateway]
    
    subgraph Pipelines [Data & Recommendation Pipelines]
        API -->|Vectorize Text| SBERT[SBERT MPNet Embedder]
        SBERT -->|768-dim Embeddings| FAISS[(FAISS Index)]
        FAISS -->|Top K Candidates| MMR[MMR Diversity Filter]
        MMR -->|Diverse Matches| ReRank[Multi-Factor Re-ranking]
        ReRank -->|Refined Suggestions| TMDB[TMDB Metadata Integration]
    end

    TMDB -->|Posters & Trailers| API
    API -->|Result Cards| UI
</div>