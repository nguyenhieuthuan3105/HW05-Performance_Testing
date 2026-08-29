#!/usr/bin/env node
/**
 * ============================================================================
 * AGENT SKILL: Performance Testing & Log Analyzer (CI/CD Quality Gate)
 * Generic, Reusable, Full-Lifecycle Performance Testing Agent Skill
 * MSSV: 23127125 | Họ và tên: Nguyễn Hiếu Thuận
 * ============================================================================
 * Quy trình thực thi:
 * 1. Đọc và ưu tiên tham số người dùng nhập (CLI Flags > perf_config.json > Fallbacks)
 * 2. Pre-flight check & Tự động nạp dữ liệu kiểm thử (nếu được cấu hình)
 * 3. Thực thi kịch bản JMeter Non-GUI (nếu chỉ định Test Plan)
 * 4. Bóc tách log thô .jtl, tự động gom nhóm động mọi Sampler bất kỳ
 * 5. Tính toán phân vị chính xác: p50, p90, p95, p99, Throughput, Error %
 * 6. Kiểm tra Quality Gate động: Đối chiếu Baseline & SLA
 * 7. Tự động chẩn đoán điểm nghẽn dựa trên mẫu hành vi (Heuristic Diagnostics)
 * 8. Hỗ trợ tự động tạo / cập nhật mốc chuẩn (--init-baseline)
 * 9. Xuất báo cáo Markdown tổng hợp & Trả về Exit Code
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const http = require('http');

// 1. Phân tích CLI Arguments & Trợ giúp (--help)
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--help' || args[i] === '-h') {
            options.help = true;
        } else if (args[i].startsWith('--')) {
            const key = args[i].substring(2);
            const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
            options[key] = val;
        }
    }
    return options;
}

function printHelp() {
    console.log(`
================================================================================
🚀 AGENT SKILL: Performance Testing & Log Analyzer (CI/CD Quality Gate)
================================================================================
Cú pháp:
  node index.js [options]

Các tùy chọn tham số đầu vào (CLI Flags):
  --jtl <path>              Phân tích trực tiếp file log .jtl có sẵn (bỏ qua chạy test).
  --plan <path>             File kịch bản JMeter (.jmx) cần thực thi.
  --config <path>           File cấu hình tham số JSON tùy chỉnh (mặc định: perf_config.json).
  --url <url>               URL máy chủ SUT cần kiểm thử (mặc định: http://localhost:3000).
  --seed <script>           Đường dẫn script nạp dữ liệu môi trường (mặc định: scripts/seed_users.js).
  --no-seed                 Bỏ qua bước nạp dữ liệu kiểm thử.
  --baseline <path>         File mốc chuẩn so sánh hiệu năng (mặc định: perf_baseline.json).
  --init-baseline           Tự động lấy kết quả bài test hiện tại làm mốc chuẩn baseline mới.
  --sla-p95 <ms>            Ngưỡng SLA tối đa cho phép của độ trễ p95 (mặc định: 500 ms).
  --sla-error <percent>     Ngưỡng tỷ lệ lỗi tối đa cho phép (mặc định: 1.0%).
  --sla-regression <pct>    Ngưỡng suy thoái p95 tối đa so với Baseline (mặc định: 15.0%).
  --report <path>           Đường dẫn file báo cáo Markdown xuất ra (mặc định: reports/perf_summary_report.md).
  -h, --help                Hiển thị hướng dẫn sử dụng này.

Ví dụ sử dụng:
  1. Phân tích file log có sẵn:
     node index.js --jtl test-results/load_results.jtl
  2. Chạy kịch bản và tự tạo mốc chuẩn baseline:
     node index.js --jtl test-results/load_results.jtl --init-baseline
  3. Phân tích với ngưỡng SLA khắt khe:
     node index.js --jtl test-results/stress_results.jtl --sla-p95 300 --sla-regression 10
================================================================================
`);
}

// 2. Nạp cấu hình theo thứ tự ưu tiên: CLI > Config File > Fallback Defaults
function loadConfig(options) {
    // Cấu hình mặc định nền (Fallback Defaults)
    let config = {
        target: { serverUrl: 'http://localhost:3000', healthcheckEndpoint: '/api/products' },
        setup: { autoSeed: true, seedScript: 'scripts/seed_users.js' },
        testExecution: { testPlan: 'test-plans/23127125_Load_20260828.jmx', outputJtl: 'test-results/skill_run_results.jtl' },
        qualityGate: { baselineFile: path.resolve(__dirname, 'perf_baseline.json'), slaMaxP95Ms: 500, slaMaxErrorPercent: 1.0, maxP95RegressionPercent: 15.0 },
        reporting: { markdownReport: 'reports/perf_summary_report.md' }
    };

    // Đọc file cấu hình perf_config.json nếu tồn tại
    const configPath = options.config 
        ? path.resolve(options.config)
        : path.resolve(__dirname, 'perf_config.json');

    if (fs.existsSync(configPath)) {
        try {
            const raw = fs.readFileSync(configPath, 'utf8');
            const fileConfig = JSON.parse(raw);
            config = {
                ...config,
                ...fileConfig,
                target: { ...config.target, ...(fileConfig.target || {}) },
                setup: { ...config.setup, ...(fileConfig.setup || {}) },
                testExecution: { ...config.testExecution, ...(fileConfig.testExecution || {}) },
                qualityGate: { ...config.qualityGate, ...(fileConfig.qualityGate || {}) },
                reporting: { ...config.reporting, ...(fileConfig.reporting || {}) }
            };
        } catch (e) {
            console.warn(`⚠️ [WARN] Lỗi cú pháp trong file cấu hình tại ${configPath}. Sử dụng fallback defaults.`);
        }
    }

    // Ưu tiên cao nhất: Tham số người dùng truyền qua dòng lệnh (CLI Flags Override)
    if (options.jtl) config.testExecution.inputJtl = options.jtl;
    if (options.plan) config.testExecution.testPlan = options.plan;
    if (options.url) config.target.serverUrl = options.url;
    if (options.seed) config.setup.seedScript = options.seed;
    if (options['no-seed']) config.setup.autoSeed = false;
    if (options.baseline) config.qualityGate.baselineFile = options.baseline;
    if (options.report) config.reporting.markdownReport = options.report;
    if (options['sla-p95']) config.qualityGate.slaMaxP95Ms = parseFloat(options['sla-p95']);
    if (options['sla-error']) config.qualityGate.slaMaxErrorPercent = parseFloat(options['sla-error']);
    if (options['sla-regression']) config.qualityGate.maxP95RegressionPercent = parseFloat(options['sla-regression']);
    if (options['init-baseline']) config.qualityGate.initBaseline = true;

    return config;
}

// 3. Pre-flight Healthcheck
async function checkHealth(url, endpoint) {
    return new Promise((resolve) => {
        try {
            const fullUrl = new URL(endpoint || '/', url);
            const req = http.get(fullUrl.toString(), (res) => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    resolve({ ok: true, status: res.statusCode });
                } else {
                    resolve({ ok: false, status: res.statusCode });
                }
            });
            req.on('error', (err) => resolve({ ok: false, error: err.message }));
            req.setTimeout(3000, () => {
                req.destroy();
                resolve({ ok: false, error: 'Timeout' });
            });
        } catch (e) {
            resolve({ ok: false, error: e.message });
        }
    });
}

// 4. Parse file JTL / CSV tổng quát (Dynamic Sampler Discovery)
function parseJtl(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File log kết quả không tồn tại: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length <= 1) {
        throw new Error(`File log rỗng hoặc không hợp lệ: ${filePath}`);
    }

    const header = lines[0].split(',');
    const idxElapsed = header.indexOf('elapsed');
    const idxLabel = header.indexOf('label');
    const idxSuccess = header.indexOf('success');
    const idxTimeStamp = header.indexOf('timeStamp');
    const idxResponseCode = header.indexOf('responseCode');

    if (idxElapsed === -1 || idxLabel === -1) {
        throw new Error(`File JTL thiếu các trường bắt buộc (elapsed, label): ${filePath}`);
    }

    const samplers = {};
    let minTime = Infinity;
    let maxTime = -Infinity;

    for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < header.length) continue;

        const label = parts[idxLabel].trim();
        const elapsed = parseInt(parts[idxElapsed], 10);
        const success = idxSuccess !== -1 ? (parts[idxSuccess].trim().toLowerCase() === 'true') : true;
        const code = idxResponseCode !== -1 ? parts[idxResponseCode].trim() : '200';
        const timeStamp = idxTimeStamp !== -1 ? parseInt(parts[idxTimeStamp], 10) : 0;

        if (isNaN(elapsed)) continue;

        if (timeStamp > 0) {
            if (timeStamp < minTime) minTime = timeStamp;
            if (timeStamp + elapsed > maxTime) maxTime = timeStamp + elapsed;
        }

        if (!samplers[label]) {
            samplers[label] = {
                label,
                samples: [],
                errors: 0,
                totalElapsed: 0
            };
        }

        samplers[label].samples.push(elapsed);
        samplers[label].totalElapsed += elapsed;
        if (!success || (code !== '200' && code !== '201')) {
            samplers[label].errors++;
        }
    }

    const durationSec = (maxTime > minTime && minTime !== Infinity) ? (maxTime - minTime) / 1000 : 1;
    return { samplers, durationSec };
}

// 5. Tính toán bách phân vị và thống kê tổng quát
function calculateMetrics(samplers, durationSec) {
    const stats = {};
    let allSamples = [];
    let totalErrors = 0;
    let totalCount = 0;

    for (const [label, data] of Object.entries(samplers)) {
        const sorted = data.samples.slice().sort((a, b) => a - b);
        const count = sorted.length;
        const sum = data.totalElapsed;
        const avg = count > 0 ? sum / count : 0;
        const min = count > 0 ? sorted[0] : 0;
        const max = count > 0 ? sorted[count - 1] : 0;
        const p50 = count > 0 ? sorted[Math.floor(0.50 * count)] : 0;
        const p90 = count > 0 ? sorted[Math.floor(0.90 * count)] : 0;
        const p95 = count > 0 ? sorted[Math.floor(0.95 * count)] : 0;
        const p99 = count > 0 ? sorted[Math.floor(0.99 * count)] : 0;
        const errorRate = count > 0 ? (data.errors / count) * 100 : 0;
        const throughput = durationSec > 0 ? count / durationSec : 0;

        stats[label] = {
            label,
            count,
            errors: data.errors,
            errorRate,
            avg,
            min,
            max,
            p50,
            p90,
            p95,
            p99,
            throughput
        };

        allSamples = allSamples.concat(sorted);
        totalErrors += data.errors;
        totalCount += count;
    }

    allSamples.sort((a, b) => a - b);
    const overallCount = allSamples.length;
    const overallSum = allSamples.reduce((a, b) => a + b, 0);

    const overall = {
        count: overallCount,
        errors: totalErrors,
        errorRate: overallCount > 0 ? (totalErrors / overallCount) * 100 : 0,
        avg: overallCount > 0 ? overallSum / overallCount : 0,
        min: overallCount > 0 ? allSamples[0] : 0,
        max: overallCount > 0 ? allSamples[overallCount - 1] : 0,
        p50: overallCount > 0 ? allSamples[Math.floor(0.50 * overallCount)] : 0,
        p90: overallCount > 0 ? allSamples[Math.floor(0.90 * overallCount)] : 0,
        p95: overallCount > 0 ? allSamples[Math.floor(0.95 * overallCount)] : 0,
        p99: overallCount > 0 ? allSamples[Math.floor(0.99 * overallCount)] : 0,
        throughput: durationSec > 0 ? overallCount / durationSec : 0
    };

    return { samplers: stats, overall };
}

// 6. Quality Gate: So sánh Baseline linh hoạt & Kiểm tra SLA
function evaluateQualityGate(metrics, config) {
    let baseline = null;
    const baselinePath = config.qualityGate.baselineFile;

    // Tự động khởi tạo baseline nếu được yêu cầu
    if (config.qualityGate.initBaseline) {
        const newBaseline = {
            generatedAt: new Date().toISOString(),
            overall: {
                totalSamples: metrics.overall.count,
                throughput: parseFloat(metrics.overall.throughput.toFixed(2)),
                errorRate: parseFloat(metrics.overall.errorRate.toFixed(2)),
                avgLatency: parseFloat(metrics.overall.avg.toFixed(2)),
                p50Latency: metrics.overall.p50,
                p90Latency: metrics.overall.p90,
                p95Latency: metrics.overall.p95,
                p99Latency: metrics.overall.p99,
                maxLatency: metrics.overall.max
            },
            samplers: {}
        };
        for (const [name, s] of Object.entries(metrics.samplers)) {
            newBaseline.samplers[name] = {
                avg: parseFloat(s.avg.toFixed(2)),
                p90: s.p90,
                p95: s.p95,
                p99: s.p99
            };
        }
        try {
            fs.writeFileSync(baselinePath, JSON.stringify(newBaseline, null, 2), 'utf8');
            console.log(`✨ [BASELINE] Đã tạo thành công mốc chuẩn Baseline mới tại: ${baselinePath}`);
            baseline = newBaseline;
        } catch (e) {
            console.warn(`⚠️ [WARN] Không thể lưu file baseline: ${e.message}`);
        }
    } else if (baselinePath && fs.existsSync(baselinePath)) {
        try {
            baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
        } catch (e) {
            console.warn(`⚠️ [WARN] Không thể đọc baseline từ ${baselinePath}`);
        }
    }

    const slaP95 = config.qualityGate.slaMaxP95Ms;
    const slaError = config.qualityGate.slaMaxErrorPercent;
    const maxRegression = config.qualityGate.maxP95RegressionPercent;

    const checks = [];
    let isPassed = true;

    // Check 1: Absolute p95 SLA
    const p95Pass = metrics.overall.p95 <= slaP95;
    checks.push({
        name: `Độ trễ Phân vị 95 Tuyệt đối (p95 <= ${slaP95} ms)`,
        actual: `${metrics.overall.p95.toFixed(2)} ms`,
        threshold: `${slaP95} ms`,
        status: p95Pass ? 'PASS' : 'FAIL',
        impact: p95Pass ? 'Đạt SLA' : 'Vi phạm SLA hệ thống'
    });
    if (!p95Pass) isPassed = false;

    // Check 2: Error Rate SLA
    const errorPass = metrics.overall.errorRate <= slaError;
    checks.push({
        name: `Tỷ lệ Lỗi Tổng thể (Error Rate <= ${slaError}%)`,
        actual: `${metrics.overall.errorRate.toFixed(2)}%`,
        threshold: `${slaError}%`,
        status: errorPass ? 'PASS' : 'FAIL',
        impact: errorPass ? 'Đạt độ tin cậy' : 'Tỷ lệ lỗi cao'
    });
    if (!errorPass) isPassed = false;

    // Check 3: Baseline Regression Delta p95
    let deltaP95 = 0;
    if (baseline && baseline.overall && (baseline.overall.p95Latency || baseline.overall.p95)) {
        const baseP95 = baseline.overall.p95Latency || baseline.overall.p95;
        deltaP95 = ((metrics.overall.p95 - baseP95) / baseP95) * 100;
        const regressionPass = deltaP95 <= maxRegression;
        checks.push({
            name: `Độ suy thoái Hiệu năng Δp95 so với Baseline (<= +${maxRegression}%)`,
            actual: `${deltaP95 >= 0 ? '+' : ''}${deltaP95.toFixed(2)}% (Mốc: ${baseP95.toFixed(2)} ms -> Hiện tại: ${metrics.overall.p95.toFixed(2)} ms)`,
            threshold: `+${maxRegression}%`,
            status: regressionPass ? 'PASS' : 'FAIL',
            impact: regressionPass ? 'Không suy thoái' : 'PHÁT HIỆN PERFORMANCE REGRESSION'
        });
        if (!regressionPass) isPassed = false;
    } else {
        checks.push({
            name: `So sánh Hồi quy Baseline`,
            actual: `Chưa có Baseline`,
            threshold: `N/A`,
            status: 'INFO',
            impact: 'Chạy với cờ --init-baseline để thiết lập mốc so sánh đầu tiên.'
        });
    }

    return { isPassed, checks, baseline, deltaP95 };
}

// 7. Chẩn đoán nguyên nhân gốc Tổng quát (Heuristic Pattern Diagnostics)
function generateAiDiagnostics(metrics) {
    const suggestions = [];

    // Heuristic 1: Phát hiện các Sampler Ghi (Transactional / Write) bị nghẽn độ trễ
    const writeKeywords = ['cancel', 'checkout', 'create', 'order', 'insert', 'update', 'write', 'post', 'put', 'delete', 'buy', 'pay'];
    const slowWriteSamplers = Object.values(metrics.samplers).filter(s => {
        const lower = s.label.toLowerCase();
        const isWrite = writeKeywords.some(kw => lower.includes(kw));
        return isWrite && s.p95 > 200;
    });

    if (slowWriteSamplers.length > 0) {
        const names = slowWriteSamplers.map(s => `\`${s.label}\` (p95 = ${s.p95} ms)`).join(', ');
        suggestions.push({
            type: 'DATABASE_LOCK_CONTENTION',
            severity: 'CRITICAL',
            title: 'Nghẽn Khóa Ghi Cơ sở dữ liệu (Database Write Lock Contention)',
            finding: `Các thao tác Ghi dữ liệu đồng thời [${names}] bị suy thoái độ trễ nghiêm trọng do tranh chấp khóa độc quyền (Exclusive Lock).`,
            solution: 'Đối với SQLite: Bật chế độ WAL (Write-Ahead Logging) và tăng Busy Timeout. Đối với RDBMS khác: Kiểm tra isolation level hoặc tối ưu transaction scope.',
            codeSnippet: 'db.run("PRAGMA journal_mode = WAL;");\ndb.run("PRAGMA busy_timeout = 5000;");'
        });
    }

    // Heuristic 2: Phát hiện các Sampler Đọc (Read / Query) bị chậm do quét toàn bảng
    const readKeywords = ['get', 'read', 'find', 'list', 'search', 'query', 'my-orders', 'history', 'filter'];
    const slowReadSamplers = Object.values(metrics.samplers).filter(s => {
        const lower = s.label.toLowerCase();
        const isRead = readKeywords.some(kw => lower.includes(kw));
        return isRead && s.p95 > 100;
    });

    if (slowReadSamplers.length > 0) {
        const names = slowReadSamplers.map(s => `\`${s.label}\` (p95 = ${s.p95} ms)`).join(', ');
        suggestions.push({
            type: 'MISSING_DATABASE_INDEX',
            severity: 'HIGH',
            title: 'Thiếu Database Index trên các trường tra cứu (Full Table Scan)',
            finding: `Các truy vấn Đọc dữ liệu [${names}] có độ trễ cao khi số lượng bản ghi tăng lên.`,
            solution: 'Bổ sung Database Index cho các trường trong mệnh đề WHERE / JOIN (ví dụ: user_id, category_id, status):',
            codeSnippet: 'CREATE INDEX IF NOT EXISTS idx_entity_lookup ON target_table(foreign_key_column);'
        });
    }

    // Heuristic 3: Phát hiện lệch đuôi phân phối độ trễ toàn hệ thống (Tail Latency Skewness)
    if (metrics.overall.p99 > 3 * metrics.overall.p50 && metrics.overall.p99 > 300) {
        suggestions.push({
            type: 'TAIL_LATENCY_SKEW',
            severity: 'MEDIUM',
            title: 'Hiện tượng Lệch Đuôi Phân Phối Độ Trễ (Heavy Tail Latency)',
            finding: `Thời gian trung vị p50 rất nhanh (${metrics.overall.p50} ms) nhưng p99 vọt lên (${metrics.overall.p99} ms), biểu hiện hiện tượng tích tụ hàng đợi xử lý tài nguyên.`,
            solution: 'Áp dụng Connection Pooling, điều chỉnh Thread Pool, hoặc triển khai In-memory Caching cho dữ liệu ít thay đổi.',
            codeSnippet: 'const nodeCache = new NodeCache({ stdTTL: 60 });'
        });
    }

    return suggestions;
}

// 8. Xuất file Báo cáo Markdown tổng hợp
function exportMarkdownReport(metrics, qg, suggestions, outputPath) {
    let md = `# Performance Test Analysis & Quality Gate Summary\n\n`;
    md += `**Thời gian thực thi:** ${new Date().toLocaleString('vi-VN')}  \n`;
    md += `**Trạng thái Quality Gate:** ${qg.isPassed ? '🟢 **PASSED**' : '🔴 **FAILED / REGRESSION DETECTED**'}  \n\n`;

    md += `---\n\n## 1. Tổng quan Hiệu năng Toàn hệ thống\n\n`;
    md += `| Tổng Samples | Throughput | Tỷ lệ Lỗi | Avg Latency | p50 (Median) | p90 | p95 (Phân vị 95) | p99 | Max Latency |\n`;
    md += `| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
    md += `| **${metrics.overall.count.toLocaleString()}** | **${metrics.overall.throughput.toFixed(2)} req/s** | **${metrics.overall.errorRate.toFixed(2)}%** | **${metrics.overall.avg.toFixed(2)} ms** | **${metrics.overall.p50} ms** | **${metrics.overall.p90} ms** | **${metrics.overall.p95} ms** | **${metrics.overall.p99} ms** | **${metrics.overall.max} ms** |\n\n`;

    md += `## 2. Chi tiết từng Sampler / Endpoint\n\n`;
    md += `| Sampler / API Endpoint | Samples | Throughput | Error % | Avg (ms) | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | Max (ms) |\n`;
    md += `| :---| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;

    for (const [label, s] of Object.entries(metrics.samplers)) {
        md += `| \`${label}\` | ${s.count} | ${s.throughput.toFixed(2)}/s | ${s.errorRate.toFixed(2)}% | ${s.avg.toFixed(2)} | ${s.p50} | ${s.p90} | ${s.p95} | ${s.p99} | ${s.max} |\n`;
    }

    md += `\n---\n\n## 3. Tiêu chuẩn Quality Gate & Đối chiếu Baseline\n\n`;
    md += `| Tiêu chí Quality Gate | Giá trị Đo được | Ngưỡng Tiêu chuẩn | Trạng thái | Đánh giá Tác động |\n`;
    md += `| :---| :---: | :---: | :---: | :---|\n`;
    for (const c of qg.checks) {
        const icon = c.status === 'PASS' ? '✅' : (c.status === 'FAIL' ? '❌' : 'ℹ️');
        md += `| **${c.name}** | \`${c.actual}\` | \`${c.threshold}\` | **${icon} ${c.status}** | ${c.impact} |\n`;
    }

    if (suggestions.length > 0) {
        md += `\n---\n\n## 4. Chẩn đoán Điểm nghẽn & Đề xuất Tối ưu hóa (Heuristic AI Suggestions)\n\n`;
        for (const s of suggestions) {
            md += `### 🔍 [${s.severity}] ${s.title}\n`;
            md += `- **Phát hiện:** ${s.finding}\n`;
            md += `- **Giải pháp tối ưu:** ${s.solution}\n`;
            md += `\`\`\`javascript\n${s.codeSnippet}\n\`\`\`\n\n`;
        }
    }

    const resolvedPath = path.resolve(outputPath);
    const dir = path.dirname(resolvedPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(resolvedPath, md, 'utf8');
    console.log(`📄 [EXPORT] Đã xuất báo cáo chi tiết ra: ${resolvedPath}`);
}

// 9. Main Workflow
async function main() {
    const options = parseArgs();

    if (options.help) {
        printHelp();
        process.exit(0);
    }

    console.log(`\n========================================================================`);
    console.log(`🚀 AGENT SKILL: Performance Testing & Log Analyzer (CI/CD Quality Gate)`);
    console.log(`👤 Sinh viên: Nguyễn Hiếu Thuận | MSSV: 23127125`);
    console.log(`========================================================================\n`);

    const config = loadConfig(options);
    let targetJtl = config.testExecution.inputJtl;

    // Chế độ 1: Thực thi kiểm thử trọn gói (End-to-End Execution)
    if (!targetJtl) {
        console.log(`[BƯỚC 1/5] Kiểm tra kết nối SUT Server (${config.target.serverUrl})...`);
        const health = await checkHealth(config.target.serverUrl, config.target.healthcheckEndpoint);
        if (!health.ok) {
            console.error(`❌ [ERROR] SUT Server không phản hồi tại ${config.target.serverUrl} (${health.error || health.status}). Hãy bật backend trước!`);
            process.exit(1);
        }
        console.log(`✅ [OK] SUT Server đang hoạt động tốt (Status ${health.status}).\n`);

        if (config.setup.autoSeed && config.setup.seedScript && fs.existsSync(config.setup.seedScript)) {
            console.log(`[BƯỚC 2/5] Nạp dữ liệu kiểm thử tự động (Data Provisioning: ${config.setup.seedScript})...`);
            try {
                execSync(`node "${config.setup.seedScript}"`, { stdio: 'inherit' });
            } catch (e) {
                console.warn(`⚠️ [WARN] Lỗi khi chạy seed script: ${e.message}`);
            }
            console.log();
        }

        console.log(`[BƯỚC 3/5] Thực thi Kịch bản Kiểm thử JMeter (${config.testExecution.testPlan})...`);
        targetJtl = path.resolve(config.testExecution.outputJtl);
        const jmxPath = path.resolve(config.testExecution.testPlan);

        if (!fs.existsSync(jmxPath)) {
            console.error(`❌ [ERROR] File kịch bản Test Plan không tồn tại: ${jmxPath}`);
            process.exit(1);
        }

        if (fs.existsSync(targetJtl)) fs.unlinkSync(targetJtl);

        const jmeterCmd = `jmeter -n -t "${jmxPath}" -l "${targetJtl}"`;
        console.log(`⚡ Executing CLI: ${jmeterCmd}`);
        try {
            execSync(jmeterCmd, { stdio: 'inherit' });
            console.log(`✅ [OK] Kiểm thử hoàn tất! Dữ liệu đã lưu tại: ${targetJtl}\n`);
        } catch (e) {
            console.warn(`⚠️ [WARN] Không thể gọi trực tiếp lệnh 'jmeter' từ PATH.`);
            if (!fs.existsSync(targetJtl)) {
                console.error(`❌ [ERROR] Không tìm thấy dữ liệu JTL để phân tích. Hãy truyền file log qua cờ --jtl <path>.`);
                process.exit(1);
            }
        }
    } else {
        console.log(`[CHẾ ĐỘ STANDALONE] Phân tích file log JTL: ${targetJtl}\n`);
    }

    console.log(`[BƯỚC 4/5] Bóc tách dữ liệu log thô & Tính toán bách phân vị...`);
    const { samplers, durationSec } = parseJtl(targetJtl);
    const metrics = calculateMetrics(samplers, durationSec);

    // In bảng Console
    console.log(`\n-----------------------------------------------------------------------------------------------------------------`);
    console.log(`SAMPLER NAME                      | COUNT  | TPS    | ERR %  | AVG(ms) | p50(ms) | p90(ms) | p95(ms) | p99(ms) | MAX(ms)`);
    console.log(`-----------------------------------------------------------------------------------------------------------------`);
    for (const [label, s] of Object.entries(metrics.samplers)) {
        const name = label.padEnd(33, ' ').substring(0, 33);
        const count = s.count.toString().padStart(6, ' ');
        const tps = s.throughput.toFixed(1).padStart(6, ' ');
        const err = (s.errorRate.toFixed(1) + '%').padStart(6, ' ');
        const avg = s.avg.toFixed(1).padStart(7, ' ');
        const p50 = s.p50.toString().padStart(7, ' ');
        const p90 = s.p90.toString().padStart(7, ' ');
        const p95 = s.p95.toString().padStart(7, ' ');
        const p99 = s.p99.toString().padStart(7, ' ');
        const max = s.max.toString().padStart(7, ' ');
        console.log(`${name} | ${count} | ${tps} | ${err} | ${avg} | ${p50} | ${p90} | ${p95} | ${p99} | ${max}`);
    }
    console.log(`-----------------------------------------------------------------------------------------------------------------`);
    const totName = 'TOTAL / OVERALL'.padEnd(33, ' ');
    const totCount = metrics.overall.count.toString().padStart(6, ' ');
    const totTps = metrics.overall.throughput.toFixed(1).padStart(6, ' ');
    const totErr = (metrics.overall.errorRate.toFixed(1) + '%').padStart(6, ' ');
    const totAvg = metrics.overall.avg.toFixed(1).padStart(7, ' ');
    const totP50 = metrics.overall.p50.toString().padStart(7, ' ');
    const totP90 = metrics.overall.p90.toString().padStart(7, ' ');
    const totP95 = metrics.overall.p95.toString().padStart(7, ' ');
    const totP99 = metrics.overall.p99.toString().padStart(7, ' ');
    const totMax = metrics.overall.max.toString().padStart(7, ' ');
    console.log(`${totName} | ${totCount} | ${totTps} | ${totErr} | ${totAvg} | ${totP50} | ${totP90} | ${totP95} | ${totP99} | ${totMax}`);
    console.log(`-----------------------------------------------------------------------------------------------------------------\n`);

    console.log(`[BƯỚC 5/5] Kiểm tra Tiêu chuẩn Quality Gate & Chẩn đoán AI...`);
    const qg = evaluateQualityGate(metrics, config);
    const suggestions = generateAiDiagnostics(metrics);

    console.log(`\n📋 KẾT QUẢ QUALITY GATE:`);
    for (const c of qg.checks) {
        const icon = c.status === 'PASS' ? '✅' : (c.status === 'FAIL' ? '❌' : 'ℹ️');
        console.log(`  ${icon} [${c.status}] ${c.name} -> Thực tế: ${c.actual} (Ngưỡng: ${c.threshold})`);
    }

    if (suggestions.length > 0) {
        console.log(`\n💡 CHẨN ĐOÁN & GỢI Ý TỐI ƯU HÓA TỪ AI:`);
        for (const s of suggestions) {
            console.log(`  👉 [${s.severity}] ${s.title}:`);
            console.log(`     • ${s.finding}`);
            console.log(`     • Khắc phục: ${s.solution}`);
        }
    }

    // Xuất Markdown Report
    if (config.reporting.markdownReport) {
        exportMarkdownReport(metrics, qg, suggestions, config.reporting.markdownReport);
    }

    console.log(`\n========================================================================`);
    if (qg.isPassed) {
        console.log(`🟢 KẾT LUẬN: [QUALITY GATE PASSED] - Bản build đạt chuẩn chất lượng hiệu năng!`);
        console.log(`========================================================================\n`);
        process.exit(0);
    } else {
        console.log(`🔴 KẾT LUẬN: [QUALITY GATE FAILED] - Phát hiện suy thoái hiệu năng! Chặn Merge.`);
        console.log(`========================================================================\n`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(`💥 [FATAL ERROR]`, err);
    process.exit(1);
});
