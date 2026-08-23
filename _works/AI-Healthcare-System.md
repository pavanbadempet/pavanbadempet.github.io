---
title: AI Healthcare System
category: Content
category_slug: f-content
type: content
image: assets/img/works/hs.png
description: "ETL workflows handling 500K+ healthcare records using Delta Lake Medallion Architecture and SCD Type 2 modeling, with FastAPI, PostgreSQL, Airflow, Docker, and RAG."
button_url: https://github.com/pavanbadempet/AI-Healthcare-System
demo_url: https://ai-healthcare-system.streamlit.app
tags: [python, pyspark, databricks, delta-lake, airflow, postgresql, docker, rag]
---

**AI Healthcare System | Python, PySpark, Databricks, Delta Lake, Airflow, PostgreSQL, Docker, RAG**

A production-grade healthcare data platform designed for scalable ETL processing, dimensional modeling, and low-latency clinical retrieval.

### Tech Stack
*   **Big Data & Lakehouse:** PySpark, Databricks, Delta Lake (Medallion Architecture), SCD Type 2
*   **Orchestration & Database:** Apache Airflow, PostgreSQL
*   **Backend & Containerization:** FastAPI, Docker
*   **GenAI / Search:** RAG pipeline, Cloudflare AI embeddings, Local Vector Cache

### Key Highlights & Results
*   **Lakehouse ETL & Modeling:** Designed ETL workflows handling 500K+ healthcare records using Delta Lake Medallion Architecture and SCD Type 2 modeling, optimizing partitioned storage and MERGE operations to reduce runtime by 40%.
*   **High-Performance Serving:** Delivered FastAPI endpoints and PostgreSQL indexing to lower analytical query latency by 35%, containerized workloads with Docker, and scheduled jobs using Airflow DAGs.
*   **Optimized RAG Architecture:** Implemented a Retrieval Augmented Generation pipeline integrating Cloudflare AI embeddings with a local vector cache, compressing context payload size by 80% and achieving sub-100ms response times.

### System Architecture
<div class="mermaid" style="background: transparent; padding: 10px; border-radius: 8px;">
graph TD
    User([User / Patient]) -->|Vitals & Queries| App[Streamlit App]
    App -->|API Request| Backend[FastAPI Backend]
    
    subgraph Engine [AI & Analytics Engine]
        Backend -->|Extract Lab Reports| GeminiVision[Gemini Vision API]
        Backend -->|Run Symptoms Classifier| XGBoost[XGBoost ML Models]
        Backend -->|Semantic Search| FAISS[(FAISS Vector DB)]
        FAISS -->|Retrieve Context| GeminiPro[Gemini Pro RAG]
    end

    XGBoost -->|Diagnostic Prediction| Backend
    GeminiPro -->|Grounded Medical Assist| Backend
    Backend -->|Response Payload| App
</div>