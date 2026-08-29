---
name: performance_analyzer
description: Full-lifecycle Continuous Performance Testing and Log Analyzer Agent Skill. Automatically seeds test data, executes JMeter performance test plans, parses raw JTL logs, computes p50/p90/p95/p99 latency percentiles and throughput, evaluates CI Quality Gate against baseline regressions, diagnoses database lock bottlenecks, and exports markdown summary reports.
---

# Performance Analyzer Agent Skill

## 1. Overview
The `performance_analyzer` skill automates the complete end-to-end performance testing and regression detection lifecycle for REST API web services:
1. **Pre-flight & Provisioning:** Verifies backend health and provisions test accounts via automated seeding.
2. **Execution:** Triggers JMeter Non-GUI execution or ingests raw `.jtl` log files.
3. **Log Analysis:** Parses CSV/JTL samples, calculating true tail latency percentiles ($p_{50}, p_{90}, p_{95}, p_{99}$), error rates, and throughput (TPS).
4. **CI Quality Gate:** Assesses performance regressions against `perf_baseline.json` ($\Delta p_{95} > 15\%$, SLA $p_{95} > 500\text{ms}$, Error $> 1.0\%$).
5. **Root-Cause Diagnostics:** Detects SQLite write lock contention, missing database indexes, and tail latency skewness, offering actionable code-level optimizations.
6. **Reporting:** Generates production-ready Markdown summary reports for Pull Request comments and CI artifacts.

## 2. File Structure
- `perf_config.json`: Declarative configuration file specifying targets, plans, SLAs, and paths.
- `perf_baseline.json`: Stable baseline benchmark data for regression comparisons.
- `index.js`: Main execution script for the Agent Skill.
- `README.md`: User manual, usage examples, and command reference.

## 3. How to Use

### Mode A: Full End-to-End Pipeline (Run Test + Analyze)
```bash
node agent_skills/performance_analyzer/index.js
```
*(Reads `perf_config.json`, performs healthcheck, seeds test data, executes JMeter test plan, calculates percentiles, and checks Quality Gate).*

### Mode B: Standalone JTL Log Analysis
```bash
# Analyze Load Test Log
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl

# Analyze Stress Test Log (Flags Regressions & Suggests SQLite WAL fix)
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl
```

### CLI Options Reference
- `--config <path>`: Custom configuration JSON file (default: `perf_config.json`).
- `--jtl <path>`: Directly analyze an existing `.jtl` results file.
- `--plan <path>`: Custom `.jmx` test plan to execute.
- `--baseline <path>`: Custom baseline benchmark file.
- `--sla-p95 <num>`: Max allowable $p_{95}$ latency in ms (default: `500`).
- `--sla-regression <num>`: Max allowable $\Delta p_{95}$ regression percentage (default: `15.0`).
- `--report <path>`: Custom markdown report output destination (default: `reports/perf_summary_report.md`).
