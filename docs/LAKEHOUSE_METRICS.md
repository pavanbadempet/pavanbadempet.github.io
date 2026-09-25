# Portfolio Showcase: Lakehouse Performance Metrics

## Databricks Medallion Benchmarks
- Bronze to Silver Ingestion: 2.4M events/minute across 8-node cluster.
- Silver to Gold Aggregation: Sub-12 second Delta Lake SCD Type 2 merge.
- Query Latency: P95 < 25ms on Gold analytical marts.
