/**
 * Portfolio AI — retrieval + inference for static GitHub Pages.
 * BM25 over ai_chunks.json, Universe Dex–style context package, multi-provider chat.
 */
(function (global) {
    'use strict';

    var webllmEngine = null;
    var webllmModelId = null;

    var chunkStore = [];
    var bm25Index = null;
    var lastSources = [];

    var STOPWORDS = new Set(
        'a an the and or but if in on at to for of as is was are were be been being it its this that these those with from by not no yes all any can could should would will just only also very more most some such than then so into about over out up down than per via'.split(
            ' '
        )
    );

    function getConfig() {
        var el = document.getElementById('cp-ai-config');
        if (!el) return {};
        try {
            return JSON.parse(String(el.textContent).replace(/^\uFEFF/, '').trim());
        } catch (e) {
            return {};
        }
    }

    function isWebGpuAvailable() {
        return typeof navigator !== 'undefined' && !!navigator.gpu;
    }

    function tokenize(text) {
        return String(text || '')
            .toLowerCase()
            .match(/[a-z0-9_]{2,}/g) || [];
    }

    function termFreqMap(text) {
        var m = {};
        var toks = tokenize(text);
        for (var i = 0; i < toks.length; i++) {
            var t = toks[i];
            if (STOPWORDS.has(t)) continue;
            m[t] = (m[t] || 0) + 1;
        }
        return m;
    }

    function buildBm25Index(chunks) {
        var k1 = 1.2;
        var b = 0.75;
        var docs = chunks.map(function (chunk) {
            var text = [chunk.title, chunk.tags, chunk.category, chunk.body].join(' \n ');
            var tf = termFreqMap(text);
            var dl = 0;
            for (var k in tf) {
                if (Object.prototype.hasOwnProperty.call(tf, k)) dl += tf[k];
            }
            if (dl < 1) dl = 1;
            return { tf: tf, dl: dl, chunk: chunk };
        });
        var N = docs.length;
        var df = {};
        for (var i = 0; i < docs.length; i++) {
            var keys = Object.keys(docs[i].tf);
            for (var j = 0; j < keys.length; j++) {
                var term = keys[j];
                df[term] = (df[term] || 0) + 1;
            }
        }
        var avgdl = docs.reduce(function (s, d) {
            return s + d.dl;
        }, 0) / Math.max(N, 1);
        return { docs: docs, N: N, df: df, avgdl: avgdl, k1: k1, b: b };
    }

    function idf(N, dfTerm) {
        return Math.log((N - dfTerm + 0.5) / (dfTerm + 0.5) + 1);
    }

    function scoreBm25(index, queryTerms) {
        var docs = index.docs;
        var N = index.N;
        var df = index.df;
        var avgdl = index.avgdl;
        var k1 = index.k1;
        var b = index.b;
        var scores = [];
        for (var i = 0; i < docs.length; i++) {
            var d = docs[i];
            var s = 0;
            for (var qi = 0; qi < queryTerms.length; qi++) {
                var q = queryTerms[qi];
                var f = d.tf[q] || 0;
                if (!f) continue;
                var dfq = df[q] || 1;
                var idfq = idf(N, dfq);
                var denom = f + k1 * (1 - b + (b * d.dl) / avgdl);
                s += (idfq * (f * (k1 + 1))) / denom;
            }
            scores.push({ chunk: d.chunk, score: s });
        }
        scores.sort(function (a, b) {
            return b.score - a.score;
        });
        return scores;
    }

    /**
     * Replace corpus (call after loading ai_chunks.json).
     */
    function setCorpus(chunks) {
        chunkStore = Array.isArray(chunks) ? chunks : [];
        bm25Index = chunkStore.length ? buildBm25Index(chunkStore) : null;
        lastSources = [];
    }

    /**
     * BM25 top-k over the active corpus.
     */
    function retrieveTopK(query, k) {
        k = k || 8;
        lastSources = [];
        if (!chunkStore.length) return [];
        if (!bm25Index) bm25Index = buildBm25Index(chunkStore);

        var raw = String(query || '').trim();
        var terms = [...new Set(tokenize(raw))].filter(function (t) {
            return !STOPWORDS.has(t) && t.length > 1;
        });

        /* Too-short or stopword-only queries: do not inject random first chunks (bad UX / false "sources"). */
        if (raw.length < 4 || !terms.length) {
            return [];
        }

        var scored = scoreBm25(bm25Index, terms);
        var positive = scored.filter(function (x) {
            return x.score > 1e-6;
        });
        if (!positive.length) {
            return [];
        }

        var seen = {};
        var deduped = [];
        for (var i = 0; i < positive.length && deduped.length < k; i++) {
            var ch = positive[i].chunk;
            var key = (ch.url || '') + '|' + (ch.id || '');
            if (seen[key]) continue;
            seen[key] = true;
            deduped.push(positive[i]);
        }

        lastSources = deduped.map(function (p, idx) {
            return {
                index: idx + 1,
                id: p.chunk.id,
                title: p.chunk.title,
                url: p.chunk.url,
                score: Math.round(p.score * 1000) / 1000,
            };
        });
        return deduped.map(function (p) {
            return p.chunk;
        });
    }

    function getLastSources() {
        return lastSources.slice();
    }

    function buildContextPackage(retrieved, cfg) {
        return {
            task: 'answer_question',
            contract: (cfg && cfg.contractVersion) || 'portfolio-ai-v2',
            facts: (cfg && cfg.aiFacts) || {},
            sources: retrieved.map(function (c, i) {
                return {
                    index: i + 1,
                    id: c.id,
                    type: c.category || 'document',
                    title: c.title,
                    route: c.url,
                    excerpt: String(c.body || '').slice(0, 1100),
                };
            }),
        };
    }

    function buildRagBlock(retrieved) {
        return retrieved
            .map(function (c, i) {
                var body = String(c.body || '').slice(0, 2400);
                return (
                    '[' +
                    (i + 1) +
                    '] **' +
                    (c.title || '') +
                    '** (' +
                    (c.category || '') +
                    ') — ' +
                    (c.url || '') +
                    '\n' +
                    body
                );
            })
            .join('\n\n---\n\n');
    }

    function buildSystemPrompt(retrieved, cfg) {
        cfg = cfg || getConfig();
        var rag = buildRagBlock(retrieved);
        var pkg = buildContextPackage(retrieved, cfg);
        var pkgJson = JSON.stringify(pkg);
        var card = cfg.siteCard
            ? '\nSITE_CARD (short public summary; use for tone and high-level positioning):\n' +
              cfg.siteCard +
              '\n'
            : '';

        return (
            'You are the portfolio copilot for Pavan Badempet (static site; answers must be grounded).\n' +
            'CONTRACT: ' +
            (pkg.contract || 'portfolio-ai-v2') +
            '. Use CONTEXT indices [1], [2], … when citing facts drawn from CONTEXT. If CONTEXT and FACTS do not support a claim, refuse the claim and suggest Resume, Portfolio, or email.\n' +
            card +
            '\nCONTEXT_PACKAGE_JSON (machine-readable; excerpts must match prose CONTEXT below):\n' +
            pkgJson +
            '\n\nCONTEXT (same sources as CONTEXT_PACKAGE_JSON.sources[*].excerpt; human-readable):\n' +
            rag +
            '\n\nOutput: Markdown. Be concise unless the user asks for depth. End with a **Sources:** line listing [n] titles only when you used CONTEXT.'
        );
    }

    function inferTemperature(cfg) {
        var t = cfg && cfg.temperature;
        if (typeof t === 'number' && !isNaN(t)) return Math.min(1, Math.max(0, t));
        return 0.45;
    }

    async function callPollinations(messages, temperature) {
        var res = await fetch('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: messages, model: 'openai', temperature: temperature }),
        });
        if (!res.ok) {
            var errBody = '';
            try {
                errBody = (await res.text()).trim().slice(0, 240);
            } catch (e0) {
                /* ignore */
            }
            throw new Error(
                'Pollinations HTTP ' + res.status + (errBody ? ': ' + errBody : ' (empty body; check network / ad blockers)')
            );
        }
        return res.text();
    }

    async function callWorker(workerUrl, model, messages, temperature) {
        var url = workerUrl.replace(/\/$/, '') + '/v1/chat/completions';
        var res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: temperature,
                max_tokens: 1000,
            }),
        });
        if (!res.ok) throw new Error('Worker HTTP ' + res.status);
        var data = await res.json();
        if (data.error && data.error.message) throw new Error(data.error.message);
        return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    }

    function getOllamaChatUrl(cfg) {
        cfg = cfg || getConfig();
        var raw = (cfg.ollamaBaseUrl && String(cfg.ollamaBaseUrl).trim()) || '';
        if (!raw) {
            raw = 'http://127.0.0.1:11434';
        }
        raw = raw.replace(/\/$/, '');
        if (raw.indexOf('/api/chat') !== -1) {
            return raw;
        }
        return raw + '/api/chat';
    }

    function assertOllamaFetchAllowed(chatUrl) {
        if (typeof location === 'undefined' || location.protocol !== 'https:') {
            return;
        }
        if (String(chatUrl).indexOf('http://') === 0) {
            throw new Error(
                'This site is served over https://, so the browser blocks http:// Ollama. Set ollama_base_url in _config.yml to an https:// tunnel or reverse-proxy (e.g. cloudflared), or use Pollinations / Worker / WebLLM.'
            );
        }
    }

    async function callOllama(model, messages, temperature) {
        var cfg = getConfig();
        var chatUrl = getOllamaChatUrl(cfg);
        assertOllamaFetchAllowed(chatUrl);

        var res = await fetch(chatUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false,
                options: { temperature: temperature },
            }),
        });
        if (!res.ok)
            throw new Error(
                'Ollama HTTP ' +
                    res.status +
                    '. Check the tunnel/proxy, model name, and CORS (OLLAMA_ORIGINS must include ' +
                    (typeof location !== 'undefined' ? location.origin : 'this site') +
                    ').'
            );
        var data = await res.json();
        return (data.message && data.message.content) || '';
    }

    async function callWebLlm(modelId, messages, onProgress, temperature) {
        if (!isWebGpuAvailable()) {
            throw new Error(
                'WebGPU is not available in this browser. Try Chrome/Edge on desktop, or pick another inference option.'
            );
        }
        var mod;
        try {
            mod = await import('https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.73/+esm');
        } catch (e1) {
            throw new Error('Could not load WebLLM from CDN.');
        }
        var CreateMLCEngine = mod.CreateMLCEngine;
        if (typeof CreateMLCEngine !== 'function')
            throw new Error('WebLLM CreateMLCEngine not available in this package build.');

        if (webllmEngine && webllmModelId !== modelId) {
            try {
                if (typeof webllmEngine.unload === 'function') await webllmEngine.unload();
            } catch (e2) {
                /* ignore */
            }
            webllmEngine = null;
            webllmModelId = null;
        }

        if (!webllmEngine) {
            webllmEngine = await CreateMLCEngine(modelId, {
                initProgressCallback: function (report) {
                    if (typeof onProgress === 'function') onProgress(report);
                },
            });
            webllmModelId = modelId;
        }

        var out = await webllmEngine.chat.completions.create({
            messages: messages,
            temperature: temperature,
            max_tokens: 1000,
        });
        return (out.choices && out.choices[0] && out.choices[0].message && out.choices[0].message.content) || '';
    }

    function disposeWebLlm() {
        if (webllmEngine && typeof webllmEngine.unload === 'function') {
            Promise.resolve(webllmEngine.unload()).catch(function () {
                /* ignore */
            });
        }
        webllmEngine = null;
        webllmModelId = null;
    }

    /**
     * @param {object} opts
     * @param {string} opts.provider
     * @param {Array<{role:string,content:string}>} opts.messages
     * @param {function(object):void} [opts.onProgress]
     */
    async function callProvider(opts) {
        var provider = opts.provider;
        var messages = opts.messages;
        var cfg = getConfig();
        var onProgress = opts.onProgress;
        var temperature = inferTemperature(cfg);

        if (provider === 'worker') {
            if (!cfg.workerUrl) throw new Error('Worker URL not configured (site.ai_worker_url in _config.yml).');
            return callWorker(cfg.workerUrl, cfg.workerModel || 'gpt-4o-mini', messages, temperature);
        }
        if (provider === 'ollama') {
            return callOllama(cfg.ollamaModel || 'llama3.2', messages, temperature);
        }
        if (provider === 'webllm') {
            return callWebLlm(
                cfg.webllmModel || 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
                messages,
                onProgress,
                temperature
            );
        }
        return callPollinations(messages, temperature);
    }

    global.PortfolioAI = {
        getConfig: getConfig,
        tokenize: tokenize,
        setCorpus: setCorpus,
        retrieveTopK: retrieveTopK,
        getLastSources: getLastSources,
        buildSystemPrompt: buildSystemPrompt,
        callProvider: callProvider,
        disposeWebLlm: disposeWebLlm,
        isWebGpuAvailable: isWebGpuAvailable,
    };
})(typeof window !== 'undefined' ? window : this);
