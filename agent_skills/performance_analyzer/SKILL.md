---
name: performance_analyzer
description: Universal full-lifecycle Continuous Performance Testing and Log Analyzer Agent Skill. Dynamically executes JMeter performance test plans, parses raw JTL logs, computes p50/p90/p95/p99 latency percentiles and throughput, evaluates CI Quality Gates against baseline regressions, diagnoses database lock bottlenecks, and exports markdown summary reports for any web application or REST API.
---

# Universal Performance Analyzer Agent Skill

## 1. Overview
The `performance_analyzer` skill provides a framework-agnostic, generic automation pipeline for performance testing, log parsing, and CI/CD quality gate enforcement:
1. **Pre-flight Healthcheck:** Flexibly probes backend health across standard endpoints (`/api/health`, `/health`, `/`).
2. **Data Provisioning:** Dynamically executes optional environment seed scripts.
3. **Automated Test Execution:** Automatically locates JMeter CLI across platforms and triggers `.jmx` test plans.
4. **Log Analysis:** Parses CSV/JTL logs, computing true tail latency percentiles ($p_{50}, p_{90}, p_{95}, p_{99}$), error rates, and throughput (TPS) per endpoint.
5. **Quality Gate Enforcement:** Compares build metrics against benchmark baselines ($\Delta p_{95} > 15\%$, SLA $p_{95} > 500\text{ms}$, Error $> 1.0\%$).
6. **Heuristic AI Diagnostics:** Identifies database write lock contention, missing query indexes, and tail latency skewness with actionable code solutions.
7. **Reporting:** Exports clean Markdown summary reports for CI artifacts and PR comments.

## 2. File Structure
- `perf_config.json`: Declarative configuration supporting environment variable interpolation (`${VAR:-default}`).
- `perf_baseline.json`: Stable benchmark dataset for regression comparisons.
- `index.js`: Main generic execution engine (Node.js).
- `README.md`: Comprehensive user manual and CLI flag reference.

## 3. Usage Modes

### Mode A: Full End-to-End Pipeline
```bash
node agent_skills/performance_analyzer/index.js
```
*(Executes healthcheck, seeds test data if configured, runs JMeter test plan, parses JTL logs, checks Quality Gate, and generates Markdown report).*

### Mode B: Standalone JTL Log Analysis
```bash
# Analyze test results directly
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl

# Analyze stress results with custom SLA thresholds
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl --sla-p95 300 --sla-regression 10
```

### Environment Variables & Customization
- `TARGET_URL`: Base URL of the target SUT server.
- `TEST_PLAN`: Path to the `.jmx` test plan.
- `SEED_SCRIPT`: Path to the optional database provisioning script.
- `PERF_BASELINE`: Path to the baseline benchmark JSON file.
- `PERF_REPORT`: Path for the generated markdown summary report.
