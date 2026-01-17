---
title: Movie Recommendation System Based on User Preferences
category: Content
category_slug: f-content
type: content
image: assets/img/works/mrsbup.png
button_url: https://github.com/pavanbadempet/Movie-Recommendation-System
tags: [python, machine-learning, nlp, api]
---

**Movie Recommendation System Based on SBERT & FAISS**

A sophisticated recommendation engine leveraging **SBERT (MPNet)** and **FAISS** for high-performance vector search. The system balances relevance with diversity using **Maximal Marginal Relevance (MMR)** and enhances user engagement through multi-factor re-ranking (Director, Franchise, Quality).

### Tech Stack
*   **Language:** Python, PySpark
*   **AI/ML:** SBERT (all-mpnet-base-v2), FAISS (Facebook AI Similarity Search)
*   **Backend:** FastAPI (Async)
*   **Frontend:** Streamlit (Video Backgrounds)
*   **Infrastructure:** Render (Backend), Streamlit Cloud (Frontend), Docker

### Key Features
*   **Advanced Vector Search:** 768-dimensional embeddings using MPNet for deep semantic understanding.
*   **Blazing Fast Retrieval:** Sub-100ms nearest neighbor lookups using FAISS.
*   **Smart Re-ranking:** Multi-factor logic (Director, Franchise, Era, Quality) to refine recommendations.
*   **MMR Diversity:** Balances relevance with diversity to prevent repetitive suggestions.
*   **Rich Media UI:** Premium dark-mode interface with trailers and poster integration via TMDB.