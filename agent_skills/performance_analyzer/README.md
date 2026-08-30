# 🚀 Universal Performance Analyzer Agent Skill

**Kiến trúc:** Agent Skill Toàn vòng đời Kiểm thử Hiệu năng & Chặn Cổng Chất lượng (CI/CD Quality Gate)  
**Đặc tính:** Generic, Reusable, Framework-Agnostic, Environment-Driven  

---

## 📌 1. Giới thiệu Tổng quan
`performance_analyzer` là một **Agent Skill toàn diện** được thiết kế độc lập, có thể tái sử dụng cho bất kỳ hệ thống Web App / REST API nào (Node.js, Java Spring, Python Django, Go, .NET...) để tự động hóa:
1. **Kiểm tra kết nối SUT (Healthcheck):** Tự động thăm dò tình trạng sẵn sàng qua các endpoint chuẩn (`/api/health`, `/health`, `/`).
2. **Nạp dữ liệu động (Data Provisioning):** Tự động phát hiện và thực thi script nạp dữ liệu môi trường (nếu có yêu cầu).
3. **Thực thi Kiểm thử Tự động (Execution):** Tự động phát hiện vị trí cài đặt Apache JMeter trên mọi hệ điều hành và chạy kịch bản `.jmx`.
4. **Bóc tách Log thô & Tính Bách phân vị:** Parse trực tiếp file log CSV/JTL, tính toán phân vị độ trễ ($p_{50}, p_{90}, p_{95}, p_{99}$), Throughput (TPS), và Tỷ lệ lỗi.
5. **Đánh giá Cổng chất lượng (CI Quality Gate):** So sánh với mốc chuẩn Baseline, phát hiện sớm suy thoái hiệu năng ($\Delta p_{95} > 15\%$, $p_{95} > 500\text{ms}$, Error $> 1.0\%$).
6. **Chẩn đoán Điểm nghẽn bằng AI (Heuristic Diagnostics):** Tự động phát hiện tranh chấp khóa ghi CSDL (Lock Contention), thiếu Index bảng, và lệch đuôi độ trễ, in ra giải pháp tối ưu cụ thể.
7. **Xuất báo cáo Markdown:** Tự động tạo file báo cáo Markdown tổng hợp sẵn sàng cho Pull Request Comment hoặc CI Artifact.

---

## 📁 2. Cấu trúc Thư mục
```
agent_skills/performance_analyzer/
├── SKILL.md                 # Định nghĩa chuẩn Agent Skill (Agentic Framework)
├── README.md                # Tài liệu hướng dẫn sử dụng và tham số CLI
├── index.js                 # Mã nguồn thực thi chính (Node.js engine)
├── perf_config.json         # File cấu hình Declarative hỗ trợ biến môi trường
└── perf_baseline.json       # File dữ liệu mốc chuẩn Benchmark hiệu năng
```

---

## 💻 3. Hướng dẫn Sử dụng (Quickstart)

### Cách 1: Chạy trọn gói End-to-End (Healthcheck -> Seed -> Run -> Analyze -> Quality Gate)
```bash
node agent_skills/performance_analyzer/index.js
```

### Cách 2: Phân tích trực tiếp file log JTL có sẵn (Standalone Log Analysis)
```bash
# Phân tích log bài test bất kỳ
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl

# Phân tích và tự động tạo mốc chuẩn Baseline mới
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl --init-baseline

# Phân tích với các ngưỡng SLA tùy biến
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl --sla-p95 400 --sla-regression 10
```

---

## ⚙️ 4. Bảng Tham số Cấu hình & Biến Môi trường

### Các cờ dòng lệnh (CLI Flags):
| Cờ (Flag) | Mặc định | Ý nghĩa |
| :--- | :--- | :--- |
| `--jtl <path>` | *(Không có)* | Phân tích trực tiếp file log `.jtl` (bỏ qua chạy test). |
| `--plan <path>` | `test-plans/*.jmx` | Đường dẫn file kịch bản JMeter cần chạy. |
| `--config <path>` | `perf_config.json` | Đường dẫn file cấu hình JSON tùy chỉnh. |
| `--url <url>` | `http://localhost:3000` | URL máy chủ mục tiêu (Target SUT URL). |
| `--seed <script>` | `scripts/seed_users.js` | Đường dẫn script nạp dữ liệu kiểm thử. |
| `--no-seed` | `false` | Bỏ qua bước nạp dữ liệu. |
| `--baseline <path>` | `perf_baseline.json` | Đường dẫn file mốc chuẩn hiệu năng. |
| `--init-baseline` | `false` | Lấy kết quả hiện tại làm mốc chuẩn Baseline mới. |
| `--sla-p95 <ms>` | `500` | Ngưỡng SLA tối đa cho phép của $p_{95}$ (ms). |
| `--sla-error <%>` | `1.0` | Ngưỡng tỷ lệ lỗi tối đa cho phép (%). |
| `--sla-regression <%>`| `15.0` | Ngưỡng phần trăm suy thoái $\Delta p_{95}$ cho phép so với Baseline. |
| `--report <path>` | `reports/perf_summary_report.md` | Đường dẫn file báo cáo Markdown xuất ra. |

### Các biến môi trường hỗ trợ (Environment Variables):
- `TARGET_URL`: URL của máy chủ SUT.
- `HEALTHCHECK_ENDPOINT`: Endpoint kiểm tra sức khỏe hệ thống.
- `TEST_PLAN`: Đường dẫn file kịch bản `.jmx`.
- `SEED_SCRIPT`: Đường dẫn script nạp dữ liệu.
- `PERF_BASELINE`: Đường dẫn file baseline.
- `PERF_REPORT`: Đường dẫn xuất báo cáo Markdown.
