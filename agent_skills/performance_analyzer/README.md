# 🚀 Performance Analyzer Agent Skill

**Tác giả:** Nguyễn Hiếu Thuận  
**MSSV:** 23127125  
**Học phần:** Kiểm thử phần mềm (HW05 - Performance Testing & AI Collaboration)  

---

## 📌 1. Giới thiệu Tổng quan
`performance_analyzer` là một **Agent Skill toàn vòng đời (Full-Lifecycle Performance Testing Skill)** được thiết kế để tự động hóa hoàn toàn quy trình kiểm thử hiệu năng, phân tích dữ liệu thô và chặn cổng chất lượng (Quality Gate) trong quy trình CI/CD.

### 🌟 Các tính năng cốt lõi:
1. **Khởi tạo dữ liệu tự động (Pre-test Provisioning):** Tự động kiểm tra SUT Server (`http://localhost:3000`) và nạp 6 tài khoản kiểm thử nếu thiếu.
2. **Thực thi kiểm thử tự động (Execution):** Gọi JMeter Non-GUI CLI chạy kịch bản Test Plan (`.jmx`) và thu thập file log `.jtl`.
3. **Bóc tách log thô & Tính toán bách phân vị:** Parse CSV/JTL theo từng sampler API, tính toán chính xác $Avg, Min, Max, p_{50}, p_{90}, p_{95}, p_{99}$, Throughput (TPS) và Error Rate (%).
4. **Kiểm tra Quality Gate & Phát hiện Regression:** Đối chiếu với mốc chuẩn `perf_baseline.json`, phát hiện suy thoái hiệu năng khi $\Delta p_{95} > +15\%$, $p_{95} > 500\text{ ms}$, hoặc $\text{Error} > 1.0\%$.
5. **Chẩn đoán nguyên nhân & Đề xuất AI:** Tự động nhận diện điểm nghẽn (SQLite Lock Contention, Missing Index) và in ra giải pháp tối ưu hóa cụ thể (Code snippet).
6. **Xuất báo cáo tự động:** Sinh file báo cáo Markdown (`reports/perf_summary_report.md`) sẵn sàng gắn vào PR Comment.

---

## 📁 2. Cấu trúc Thư mục
```
agent_skills/performance_analyzer/
├── SKILL.md                 # Định nghĩa chuẩn Agent Skill (Antigravity Agentic Framework)
├── README.md                # Tài liệu hướng dẫn sử dụng chi tiết
├── index.js                 # Mã nguồn thực thi chính (Node.js)
├── perf_config.json         # File cấu hình tham số đầu vào (Declarative Config)
└── perf_baseline.json       # File dữ liệu mốc chuẩn so sánh hồi quy hiệu năng
```

---

## 💻 3. Hướng dẫn Sử dụng (Quickstart)

### Yêu cầu môi trường:
- Node.js version $\ge 18.0.0$.
- Backend SUT EShop đang chạy tại `http://localhost:3000`.

### Cách 1: Chạy trọn gói End-to-End (Seed Data -> Run Test -> Analyze -> Quality Gate)
```bash
node agent_skills/performance_analyzer/index.js
```

### Cách 2: Phân tích file log JTL có sẵn (Standalone Analysis)
```bash
# Phân tích bài Load Test (Kết quả: PASS)
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl

# Phân tích bài Stress Test (Kết quả: FAIL do suy thoái p95 -> Đưa ra giải pháp SQLite WAL)
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl

# Phân tích bài Spike Test
node agent_skills/performance_analyzer/index.js --jtl test-results/spike_results.jtl
```

### Tùy chỉnh tham số dòng lệnh (CLI Flags):
- `--config <path>`: Chỉ định file cấu hình JSON tùy chọn (mặc định: `perf_config.json`).
- `--jtl <path>`: Đường dẫn file kết quả `.jtl` cần phân tích.
- `--plan <path>`: Đường dẫn file kịch bản `.jmx` cần chạy.
- `--baseline <path>`: Đường dẫn file mốc chuẩn baseline.
- `--sla-p95 <num>`: Ngưỡng SLA tối đa của $p_{95}$ (mặc định: `500` ms).
- `--sla-regression <num>`: Ngưỡng phần trăm suy thoái $\Delta p_{95}$ cho phép (mặc định: `15.0`%).
- `--report <path>`: Đường dẫn file báo cáo Markdown xuất ra.

---

## 📊 4. Ví dụ Kết quả Thực thi trên Console

```
========================================================================
🚀 AGENT SKILL: Performance Testing & Log Analyzer (CI/CD Quality Gate)
👤 Sinh viên: Nguyễn Hiếu Thuận | MSSV: 23127125
========================================================================

-----------------------------------------------------------------------------------------------------------------
SAMPLER NAME                      | COUNT  | TPS    | ERR %  | AVG(ms) | p50(ms) | p90(ms) | p95(ms) | p99(ms) | MAX(ms)
-----------------------------------------------------------------------------------------------------------------
01_Auth_Login                     |    160 |    2.8 |   0.0% |     2.9 |       3 |       4 |       4 |       8 |      34
02_Read_SearchProducts            |    158 |    2.7 |   0.0% |     1.5 |       1 |       2 |       3 |       4 |       7
03_Read_GetMyOrders               |    152 |    2.6 |   0.0% |     2.6 |       2 |       3 |       4 |       8 |       9
04_Transactional_ApplyCoupon      |    146 |    2.5 |   0.0% |     1.8 |       2 |       2 |       3 |       5 |       9
05_Transactional_Checkout         |    139 |    2.4 |   0.0% |     7.6 |       7 |      13 |      13 |      14 |      14
06_Transactional_CancelOrder      |    134 |    2.3 |   0.0% |     7.7 |       7 |      13 |      13 |      14 |      15
-----------------------------------------------------------------------------------------------------------------
TOTAL / OVERALL                   |    889 |   15.4 |   0.0% |     3.9 |       3 |       7 |      12 |      14 |      34
-----------------------------------------------------------------------------------------------------------------

📋 KẾT QUẢ QUALITY GATE:
  ✅ [PASS] Độ trễ Phân vị 95 Tuyệt đối (p95 <= 500 ms) -> Thực tế: 12.00 ms (Ngưỡng: 500 ms)
  ✅ [PASS] Tỷ lệ Lỗi Tổng thể (Error Rate <= 1%) -> Thực tế: 0.00% (Ngưỡng: 1%)
  ✅ [PASS] Độ suy thoái Hiệu năng Δp95 so với Baseline (<= +15%) -> Thực tế: +0.00% (Ngưỡng: +15%)
📄 [EXPORT] Đã xuất báo cáo chi tiết ra: reports/perf_summary_report.md

========================================================================
🟢 KẾT LUẬN: [QUALITY GATE PASSED] - Bản build đạt chuẩn chất lượng hiệu năng!
========================================================================
```
