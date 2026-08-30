# 🧪 ĐỒ ÁN THỰC HÀNH 05: KIỂM THỬ HIỆU NĂNG & HỢP TÁC VỚI AI (PERFORMANCE TESTING & AI COLLABORATION)

* **Sinh viên thực hiện:** Nguyễn Hiếu Thuận  
* **Mã số sinh viên (MSSV):** 23127125  
* **Học phần:** Kiểm thử phần mềm (Software Testing)  
* **Hệ thống SUT:** EShop Platform (Node.js Express + SQLite CSDL)  
* **GitHub Repository:** [https://github.com/nguyenhieuthuan3105/HW05-Performance_Testing](https://github.com/nguyenhieuthuan3105/HW05-Performance_Testing)  

---

## BẢNG TỰ CHẤM ĐIỂM CHI TIẾT (SELF-ASSESSMENT: 100/100)

| STT | Hạng mục / Tiêu chí Đánh giá (Rubric) | Trọng số | Tự chấm | Minh chứng & Trạng thái Hoàn thành |
| :---: | :---| :---: | :---: | :---|
| **1** | **Task 1: AI-assisted Test Design & Execution**<br>• Thiết kế kịch bản E2E bao phủ 3 nhóm: Auth, Read, Transactional.<br>• Tham số hóa Data-Driven CSV (`test-data.csv` 6 users độc lập).<br>• Cấu hình 3 kịch bản: Load (30 VUs), Stress (150 VUs), Spike (200 VUs) với 3 Listeners khác nhau.<br>• Human-in-the-loop review & sửa lỗi AI (Lỗi `JSONPostProcessor` & 401 data).<br>• Đo đạc thực nghiệm, xuất raw log `.jtl` và thư mục HTML Dashboard Report.<br>• Xác định ngưỡng chịu tải bền vững (Endurance threshold).<br>• Chụp ảnh minh chứng tài nguyên Task Manager + Báo cáo phần cứng `dxdiag`. | **30%** | **30/30** | **100% Hoàn tất**<br>- Files `.jmx` tại `test-plans/`<br>- Logs `.jtl` & Dashboard tại `test-results/`<br>- Ảnh tài nguyên tại `evidence/`<br>- Chi tiết tại [reports/Main_Report.md](reports/Main_Report.md) (Mục II & III). |
| **2** | **Task 2: AI Log Analysis & Misinterpretation Hunt**<br>• Cung cấp dữ liệu log thực tế cho AI độc lập phân tích.<br>• Đánh giá khách quan điểm mạnh và điểm yếu trong phân tích của AI.<br>• Săn lỗi hiểu sai và ảo tưởng của AI (Bẫy số liệu trung bình, Ảo tưởng `BEGIN...COMMIT`, Ảo tưởng cụm PostgreSQL/Redis và Bỏ quên giải pháp vàng SQLite WAL mode).<br>• Đối chiếu mã nguồn SUT làm thước đo chân lý duy nhất (Ground Truth).<br>• Ghi nhận lỗi trên GitHub Issues kèm ảnh chụp. | **20%** | **20/20** | **100% Hoàn tất**<br>- 3 GitHub Issues tại `evidence/github_issues/`<br>- Phân tích phản biện tại [reports/Main_Report.md](reports/Main_Report.md) (Mục IV)<br>- File [reports/Bug_Report.md](reports/Bug_Report.md). |
| **3** | **Task 3: Continuous Performance Testing Proposal**<br>• Đề xuất cơ chế theo dõi commits & kích hoạt thông minh (Path Filtering, Tiered Strategy).<br>• Tiêu chuẩn chặn cổng chất lượng Quality Gate ($\Delta p_{95} \le 15\%$, SLA $\le 500\text{ms}$, Error $\le 1.0\%$).<br>• Sơ đồ luồng hoạt động trực quan (Mermaid Flowchart).<br>• Thảo luận chuyên sâu 2 cặp đánh đổi kỹ thuật (Trade-offs: Chi phí/Thời gian vs Coverage; False Alarms vs Noisy Neighbors). | **20%** | **20/20** | **100% Hoàn tất**<br>- Đề xuất hoàn chỉnh tại [reports/Main_Report.md](reports/Main_Report.md) (Mục V)<br>- Sơ đồ tại `evidence/continuous_performance_testing_diagram.png`. |
| **4** | **Agent Skill: `performance_analyzer`**<br>• Xây dựng Agent Skill toàn vòng đời (Healthcheck $\to$ Auto-seed $\to$ Chạy test $\to$ Parse JTL $\to$ Quality Gate $\to$ Heuristic AI Diagnostics $\to$ Markdown Report).<br>• Thiết kế tổng quát (Generic, Framework-Agnostic, Environment-Driven).<br>• Tự động phát hiện vị trí JMeter CLI trên Windows/Linux/macOS.<br>• Tự động dọn dẹp file CSV tạm (Auto-cleanup). | **10%** | **10/10** | **100% Hoàn tất**<br>- Thư mục `agent_skills/performance_analyzer/`<br>- Mã nguồn `index.js`, `perf_config.json`, `perf_baseline.json`, `SKILL.md`, `README.md`. |
| **5** | **AI Audit Log & AI Critique**<br>• Nhật ký ghi chép tương tác AI minh bạch 100% (38 Prompts từ đầu đến cuối).<br>• Bài phản biện AI Critique chuẩn mực (250–300 từ theo chuẩn HW04). | **10%** | **10/10** | **100% Hoàn tất**<br>- File [ai_templates/ai_audit_report.md](ai_templates/ai_audit_report.md)<br>- File [ai_templates/ai_critique.md](ai_templates/ai_critique.md). |
| **6** | **Tài liệu Báo cáo, Video Demos & Git Commit Log**<br>• Báo cáo tổng thể đầy đủ bằng Markdown (`Main_Report.md`, `Bug_Report.md`, `README.md`).<br>• Video Demo Task 1 ($\ge 6$ phút thuyết minh tiếng Việt chia đôi màn hình).<br>• Video Demo Agent Skill (2–3 phút chạy end-to-end trên repo độc lập).<br>• Lịch sử Git commit log đầy đủ dạng text. | **10%** | **10/10** | **100% Hoàn tất**<br>- File `reports/git_commit_log.txt`<br>- Placeholder link YouTube Unlisted bên dưới. |
| **TỔNG**| **TỔNG ĐIỂM TỰ ĐÁNH GIÁ (OVERALL SELF-ASSESSMENT)** | **100%**| **100/100** | **XUẤT SẮC / HOÀN HẢO THEO RUBRIC** |

---

## LIÊN KẾT VIDEO DEMO (YOUTUBE UNLISTED LINKS)

1. **Video 1 — Thực nghiệm Kiểm thử Hiệu năng & Giám sát Tài nguyên (Task 1 & Task 2):**  
   - **Thời lượng:** $\ge 6$ phút (Thuyết minh tiếng Việt, chia đôi màn hình: Terminal/JMeter + Windows Task Manager).  
   - **Link YouTube (Unlisted):** [Performance Testing Demo](https://youtu.be/RDBT-g8DTRg) 

2. **Video 2 — Tự động hóa Toàn vòng đời với Agent Skill (`performance_analyzer`):**  
   - **Thời lượng:** $\ge 4$ phút (Demo chạy end-to-end trên repo độc lập, tự động phát hiện hồi quy và chẩn đoán SQLite lock).  
   - **Link YouTube (Unlisted):** [Agent Skill Demo](https://youtu.be/IkbjAf0zb-E)
---

## TỔNG QUAN KỊCH BẢN KIỂM THỬ E2E & KẾT QUẢ ĐO ĐẠC

### 1. Luồng Nghiệp vụ Kiểm thử E2E
Kịch bản mô phỏng trọn vẹn hành trình mua sắm và quản lý đơn hàng của người dùng thực tế, bao phủ cả 3 nhóm endpoint:
* **Auth-heavy:** `01_Auth_Login` (`POST /api/login` - Xác thực JWT Token).
* **Read-heavy:** `02_Read_SearchProducts` (`GET /api/products?search=...`) và `03_Read_GetMyOrders` (`GET /api/orders/my-orders`).
* **Transactional:** `04_Transactional_ApplyCoupon` (`POST /api/apply-coupon`), `05_Transactional_Checkout` (`POST /api/checkout`), và `06_Transactional_CancelOrder` (`PUT /api/orders/:id/cancel`).

### 2. Ma trận Kịch bản & Dữ liệu Thực nghiệm

| Chỉ số kỹ thuật đo lường | Load Testing (`load_results.jtl`) | Stress Testing (`stress_results.jtl`) | Spike Testing (`spike_results.jtl`) |
| :--- | :---: | :---: | :---: |
| **Cấu hình Virtual Users (VUs)** | **30 VUs** (Ramp-up 30s, Duy trì 60s) | **150 VUs** (Ramp-up 45s, Duy trì 90s) | **200 VUs** (Ramp-up 5s, Duy trì 30s) |
| **Think Time (Gaussian Random)** | $1500\text{ms} \pm 500\text{ms}$ | $800\text{ms} \pm 300\text{ms}$ | $300\text{ms} \pm 100\text{ms}$ |
| **Listeners JMeter sử dụng** | *Summary Report*, *Response Time Graph* | *Aggregate Report*, *View Results in Table* | *View Results Tree*, *Response Time Graph* |
| **Tổng số mẫu (Total Samples)** | **896** samples | **12,542** samples | **8,784** samples |
| **Thông lượng trung bình (Throughput)** | **15.24 req/s** | **140.83 req/s** | **296.03 req/s** |
| **Tỷ lệ lỗi (Error Rate %)** | **0.00%** | **0.00%** | **0.00%** |
| **Độ trễ trung bình (Avg Latency)** | **4.02 ms** | **4.53 ms** | **10.98 ms** |
| **Độ trễ Phân vị 95 ($p_{95}$)** | **11.00 ms** (Đạt SLA $< 500\text{ms}$) | **11.00 ms** | **29.00 ms** |
| **Độ trễ lớn nhất (Max Latency)** | 53.00 ms | 80.00 ms | **138.00 ms** (CancelOrder) |

---

## SĂN LỖI ẢO TƯỞNG CỦA AI (TASK 2 MISINTERPRETATION HUNT)

Trong quá trình phân tích hiệu năng, AI (ChatGPT) đã bộc lộ **3 hiểu lầm và ảo tưởng kỹ thuật nghiêm trọng** đối chiếu với mã nguồn SUT:
1. **Ảo tưởng cú pháp Transaction đa bước `BEGIN...COMMIT`:** AI suy diễn backend có transaction cập nhật kho phức tạp, trong khi `backend/server.js` chỉ thực thi các câu lệnh `db.run()` đơn lẻ.
2. **Đề xuất kiến trúc cụm PostgreSQL/Redis quá đà và Bỏ quên giải pháp vàng SQLite WAL:** SUT dùng SQLite ở chế độ Rollback Journal gây nghẽn Exclusive Lock khi ghi đồng thời. Giải pháp tối ưu nhất là thêm đúng 1 dòng lệnh:
   ```javascript
   db.run("PRAGMA journal_mode = WAL;");
   db.run("PRAGMA busy_timeout = 5000;");
   ```
3. **Đề xuất Cache danh sách đơn hàng có rủi ro Dirty Read cao:** Người dùng liên tục Checkout rồi Cancel Order khiến việc cache đơn hàng dễ dẫn đến sai lệch trạng thái hiển thị.

---

## ĐỀ XUẤT CONTINUOUS PERFORMANCE TESTING & QUALITY GATE (TASK 3)

* **Quy tắc Kích hoạt Thông minh (Triggering Strategy):**
  * *Bỏ qua (Skip):* Khi commit chỉ thay đổi tài liệu (`*.md`), hình ảnh (`*.png`), stylesheet (`*.css`).
  * *Chạy Fast-Feedback (Mini-Load 30 VUs - 60s):* Trên mọi **Pull Request** nhắm vào nhánh `main` khi có thay đổi trong `backend/**` hoặc `database.js`.
  * *Chạy Deep Verification (Stress & Spike):* Lên lịch chạy tự động hàng đêm (**Nightly Build lúc 02:00 AM**).
* **Tiêu chuẩn chặn cổng chất lượng (Quality Gate Enforcement):**
  $$\Delta p_{95} = \frac{p_{95\text{ (Build)}} - p_{95\text{ (Baseline)}}}{p_{95\text{ (Baseline)}}} \times 100\%$$
  * Nếu $\Delta p_{95} > +15\%$ HOẶC $p_{95} > 500\text{ms}$ HOẶC $\text{Error} > 1.0\% \rightarrow$ **Tự động BLOCK PR MERGE**, bình luận bảng chỉ số chi tiết và gửi webhook cảnh báo.

---

## HƯỚNG DẪN SỬ DỤNG AGENT SKILL (`agent_skills/performance_analyzer/`)

Agent Skill được thiết kế dạng **Universal Engine (Framework-Agnostic)**:

### 1. Chạy Tự Động Toàn Vòng Đời (End-to-End Pipeline)
```bash
node agent_skills/performance_analyzer/index.js
```
*(Tự động kiểm tra SUT $\rightarrow$ Nạp dữ liệu tài khoản $\rightarrow$ Chạy JMeter $\rightarrow$ Bóc tách JTL $\rightarrow$ Đánh giá Quality Gate $\rightarrow$ Chẩn đoán AI $\rightarrow$ Xuất báo cáo Markdown `reports/perf_summary_report.md`)*.

### 2. Phân tích Trực tiếp File Log JTL
```bash
# Phân tích bài Load Test (Kết quả: PASS)
node agent_skills/performance_analyzer/index.js --jtl test-results/load_results.jtl

# Phân tích bài Stress Test (Tự động chẩn đoán SQLite Lock & gợi ý WAL mode)
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl

# Phân tích với ngưỡng SLA khắt khe
node agent_skills/performance_analyzer/index.js --jtl test-results/stress_results.jtl --sla-p95 300 --sla-regression 10
```

---

## CẤU TRÚC THƯ MỤC NỘP BÀI (PROJECT STRUCTURE)

```
23127125_HW05/
├── README.md                                    # Tài liệu tổng quan, bảng tự chấm điểm & link video
├── agent_skills/
│   └── performance_analyzer/                   # Agent Skill toàn vòng đời kiểm thử hiệu năng
│       ├── SKILL.md                            # Định nghĩa Agent Skill theo Agentic Framework
│       ├── README.md                           # Hướng dẫn sử dụng & CLI reference
│       ├── index.js                            # Mã nguồn thực thi chính (Node.js)
│       ├── perf_config.json                    # Cấu hình Declarative hỗ trợ biến môi trường
│       └── perf_baseline.json                  # Mốc chuẩn Benchmark hiệu năng
├── ai_templates/
│   ├── ai_audit_report.md                      # Nhật ký minh bạch 38 Prompts tương tác với AI
│   └── ai_critique.md                          # Bài phản biện AI (250-300 từ theo chuẩn HW04)
├── test-plans/
│   ├── 23127125_Load_20260828.jmx              # Kịch bản Load Testing (30 VUs)
│   ├── 23127125_Stress_20260828.jmx            # Kịch bản Stress Testing (150 VUs)
│   ├── 23127125_Spike_20260828.jmx             # Kịch bản Spike Testing (200 VUs)
│   └── test-data.csv                           # Dữ liệu tham số hóa 6 tài khoản người dùng
├── test-results/
│   ├── load_results.jtl                        # Raw log kết quả Load Test
│   ├── stress_results.jtl                      # Raw log kết quả Stress Test
│   ├── spike_results.jtl                       # Raw log kết quả Spike Test
│   ├── load_html_report/                       # Thư mục HTML Dashboard Report (Load Test)
│   ├── stress_html_report/                     # Thư mục HTML Dashboard Report (Stress Test)
│   └── spike_html_report/                      # Thư mục HTML Dashboard Report (Spike Test)
├── reports/
│   ├── Main_Report.md                          # Báo cáo học thuật chi tiết Task 1, 2, 3
│   ├── Bug_Report.md                           # Báo cáo chi tiết các lỗi hiệu năng & chức năng
│   ├── perf_summary_report.md                  # Báo cáo tóm tắt sinh tự động bởi Agent Skill
│   └── git_commit_log.txt                      # Lịch sử Git commit log dạng text
├── evidence/
│   ├── github_issues/                          # 3 Báo cáo lỗi GitHub Issues (.md + ảnh chụp)
│   ├── hardware_dxdiag.png                     # Ảnh chụp cấu hình phần cứng kiểm thử
│   ├── continuous_performance_testing_diagram.png # Sơ đồ luồng CI Pipeline
│   ├── load_test_resource_monitor.png          # Ảnh giám sát tài nguyên Load Test
│   ├── stress_test_resource_monitor.png        # Ảnh giám sát tài nguyên Stress Test
│   └── spike_test_resource_monitor.png         # Ảnh giám sát tài nguyên Spike Test
└── scripts/
    └── seed_users.js                           # Script nạp 6 tài khoản test vào CSDL SUT
```

---

## HƯỚNG DẪN CÀI ĐẶT & TÁI HIỆN THỰC NGHIỆM (REPRODUCIBILITY GUIDE)

1. **Khởi động Backend SUT:**
   ```bash
   cd eshop-sut
   npm install
   npm start
   # Server lắng nghe tại http://localhost:3000
   ```
2. **Nạp dữ liệu tài khoản kiểm thử:**
   ```bash
   node scripts/seed_users.js
   ```
3. **Thực thi kiểm thử hiệu năng và bóc tách dữ liệu:**
   ```bash
   # Chạy tự động trọn gói qua Agent Skill:
   node agent_skills/performance_analyzer/index.js
   ```
