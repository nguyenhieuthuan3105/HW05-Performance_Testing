# HƯỚNG DẪN CHI TIẾT & CHECKLIST THỰC HIỆN BÀI TẬP HW05 - PERFORMANCE TESTING
**Môn học:** Kiểm thử phần mềm (Software Testing) - FIT HCMUS  
**Mã bài tập:** HW05-AI | **Hình thức:** Cá nhân | **Thời lượng ước tính:** ~10 giờ  
**SUT (System Under Test):** EShop (`https://github.com/ttbhanh/eshop-sut`)  
**Thang điểm:** 100 điểm | **Cấp độ Bloom-AI:** G9.2 (Apply), G9.3 (Analyse), G9.4 (Collaborate), G9.6 (Disrupt)

---

## MỤC LỤC
1. [Tổng quan & Phân bổ điểm](#1-tổng-quan--phân-bổ-điểm)
2. [Các quy tắc bắt buộc & Anti-AI-Cheat](#2-các-quy-tắc-bắt-buộc--anti-ai-cheat)
3. [Lộ trình 7 bước thực hiện chi tiết (Step-by-Step Guide)](#3-lộ-trình-7-bước-thực-hiện-chi-tiết-step-by-step-guide)
   - [Bước 1: Chuẩn bị môi trường & Chọn Scope Endpoint](#bước-1-chuẩn-bị-môi-trường--chọn-scope-endpoint)
   - [Bước 2: Thiết kế Test Plan với AI & Dữ liệu CSV (Task 1)](#bước-2-thiết-kế-test-plan-với-ai--dữ-liệu-csv-task-1)
   - [Bước 3: Thực thi kiểm thử (Load, Stress, Spike, Endurance) & Thu thập bằng chứng](#bước-3-thực-thi-kiểm-thử-load-stress-spike-endurance--thu-thập-bằng-chứng)
   - [Bước 4: Phân tích log & Săn lỗi AI (Task 2 - Misinterpretation Hunt)](#bước-4-phân-tích-log--săn-lỗi-ai-task-2---misinterpretation-hunt)
   - [Bước 5: Đề xuất Continuous Performance Testing (Task 3 - Disrupt)](#bước-5-đề-xuất-continuous-performance-testing-task-3---disrupt)
   - [Bước 6: Xây dựng Agent Skill & Quay Video Demo](#bước-6-xây-dựng-agent-skill--quay-video-demo)
   - [Bước 7: Viết Báo cáo, AI Audit Report, AI Critique & Git Commit Log](#bước-7-viết-báo-cáo-ai-audit-report-ai-critique--git-commit-log)
4. [Mẫu kịch bản & Gợi ý Prompting AI từng bước](#4-mẫu-kịch-bản--gợi-ý-prompting-ai-từng-bước)
5. [Cấu trúc thư mục nộp bài chuẩn mẫu (.zip)](#5-cấu-trúc-thư-mục-nộp-bài-chuẩn-mẫu-zip)
6. [Checklist kiểm tra sản phẩm trước khi nộp](#6-checklist-kiểm-tra-sản-phẩm-trước-khi-nộp)
7. [Bảng tự đánh giá (Self-Assessment Table)](#7-bảng-tự-đánh-giá-self-assessment-table)

---

## 1. TỔNG QUAN & PHÂN BỔ ĐIỂM

| STT | Hạng mục đánh giá | Điểm tối đa | Nội dung trọng tâm |
|:---:|:---|:---:|:---|
| **1** | **Task 1 — Load testing** | **20đ** | Kịch bản E2E data-driven, tham số thực tế, listener riêng biệt, bằng chứng resource, file `.jtl` & HTML report. |
| **2** | **Task 1 — Stress testing** | **20đ** | Đẩy tải tìm điểm gãy, xử lý account lockout (3 lần login sai), reset dữ liệu, bằng chứng resource, file `.jtl` & HTML report. |
| **3** | **Task 1 — Spike testing** | **20đ** | Tải đột biến tức thời, khả năng phục hồi của SUT, listener riêng biệt, bằng chứng resource, file `.jtl` & HTML report. |
| **4** | **Task 2 — AI analysis + Misinterpretation hunt** | **10đ** | Dùng AI phân tích `.jtl`, chỉ ra điểm AI tính sai/hiểu sai kèm số liệu thực tế đối chiếu từ `.jtl`, đánh giá các đề xuất tối ưu (Feasible vs Hallucinated). |
| **5** | **Task 3 — Continuous Performance Testing proposal** | **10đ** | Mô hình CI/CD tự động trigger test theo commit, phát hiện regression ở p95 latency, có sơ đồ Flowchart và phân tích trade-offs (chi phí, false alarms). |
| **6** | **Agent Skill** | **10đ** | Xây dựng Agent Skill tái sử dụng cho workflow test & log analysis + Video demo chạy skill end-to-end. |
| **Tổng** | | **100đ** | |

---

## 2. CÁC QUY TẮC BẮT BUỘC & ANTI-AI-CHEAT

> [!IMPORTANT]
> **Các ràng buộc chống gian lận AI (Anti-AI-Cheat Constraints):**
> 1. **Tên file kịch bản test (Test Plan):** Bắt buộc phải đặt tên theo đúng cấu trúc:  
>    `{StudentID}_{ScenarioType}_{YYYYMMDD}` (Ví dụ: `21127001_Load_20260824.jmx`, `21127001_Stress_20260824.jmx`, `21127001_Spike_20260824.jmx`).
> 2. **File log gốc `.jtl`:** Phải nộp đầy đủ file raw `.jtl` thực tế sinh ra khi chạy test, **không được chỉ chụp ảnh tóm tắt**.
> 3. **Video Demo (YouTube Unlisted):**
>    - Thời lượng tối thiểu **6 phút** (có thể gộp hoặc chia thành các clip theo kịch bản).
>    - **Phải quay cùng 1 khung hình:** Công cụ test (JMeter/k6) và Resource Monitor (Task Manager / htop / Activity Monitor).
>    - **Bắt buộc có giọng thuyết minh tiếng Việt của chính sinh viên** (không dùng giọng AI đọc).
> 4. **Hardware Report:** Bắt buộc có ảnh chụp `dxdiag` (hoặc `screenfetch`/`neofetch`) và bảng cấu hình phần cứng. **Hostname máy tính phải khớp với các bài tập trước**.
> 5. **Git Commit Log:** Mỗi bước (tạo test plan, phân tích AI, đề xuất CI/CD, v.v.) phải tạo 1 Git commit riêng và xuất log ra file text.
> 6. **Bảo vệ miệng (Oral Defense):** 30% sinh viên được chọn ngẫu nhiên sẽ vấn đáp 5–7 phút vào tuần sau hạn nộp.
> 7. **Không nộp trễ:** Nộp trễ = 0 điểm. Thiếu tài liệu bắt buộc = 0 điểm. Trùng lặp kịch bản trong nhóm/sao chép prompt = 0 điểm cả hai.

---

## 3. LỘ TRÌNH 7 BƯỚC THỰC HIỆN CHI TIẾT (STEP-BY-STEP GUIDE)

### Bước 1: Chuẩn bị môi trường & Chọn Scope Endpoint
1. **Clone và chạy SUT:**
   - Clone repo: `https://github.com/ttbhanh/eshop-sut`.
   - Cài đặt và khởi chạy SUT theo README của repo (ghi lại cổng backend REST API).
2. **Cài đặt công cụ:**
   - **Kiểm thử hiệu năng:** Apache JMeter (hoặc k6 nếu muốn lấy điểm cộng).
   - **Giám sát tài nguyên:** Task Manager (Windows) hoặc htop (Linux/WSL) / Activity Monitor (macOS).
   - **Phần cứng:** Chụp ảnh lệnh `dxdiag` (hoặc `screenfetch`/`fastfetch`) hiển thị rõ Hostname, CPU, RAM.
3. **Xác định kịch bản End-to-End (E2E Workflow) không trùng lặp:**
   Kịch bản phải đi qua **cả 3 nhóm endpoint**:
   - **Auth-heavy:** Đăng nhập (`/api/auth/login` hoặc tương đương), chú ý cơ chế khoá tài khoản khi sai mật khẩu 3 lần (3-fail lockout).
   - **Read-heavy:** Danh sách sản phẩm, tìm kiếm sản phẩm, xem chi tiết sản phẩm (`/api/products`, `/api/products/search`, `/api/products/:id`).
   - **Transactional:** Thêm vào giỏ hàng, áp mã giảm giá, checkout / tạo đơn hàng (`/api/cart`, `/api/checkout`, `/api/orders`).
   *Ví dụ chuỗi E2E:* `Login -> Search Product -> View Detail -> Add to Cart -> Checkout`.

---

### Bước 2: Thiết kế Test Plan với AI & Dữ liệu CSV (Task 1)
1. **Áp dụng AI-First Strategy (Hướng dẫn AI từng bước):**
   - Không dùng 1 prompt chung chung. Hãy chia thành từng prompt:
     - Prompt 1: Yêu cầu AI phân tích API spec và đề xuất cấu trúc Thread Group + logic trích xuất token JWT.
     - Prompt 2: Nhờ AI tính toán và đề xuất các tham số thực tế: **Think-time** (Gaussian Random Timer), **Ramp-up period**, **Number of Threads (VUs)**, **Loop count / Duration** cho từng loại kịch bản (Load vs Stress vs Spike).
     - Prompt 3: Nhờ AI sinh cấu trúc kịch bản JMeter (`.jmx`) hoặc k6 script (`.js`).
2. **Chuẩn bị Dữ liệu Data-Driven (CSV Data Set Config):**
   - Tạo file CSV chứa danh sách tài khoản (username, password), từ khóa tìm kiếm (keyword), mã sản phẩm (product_id), số lượng mua.
   - Tránh việc 100 Virtual Users đều đăng nhập 1 tài khoản duy nhất gây xung đột session hoặc sai lệch nghiệp vụ.
3. **Cấu hình 3 Listener / Report riêng biệt (Không trùng lặp giữa 3 kịch bản):**
   - **Load Test:** ví dụ dùng *Summary Report* + *Response Time Graph*.
   - **Stress Test:** ví dụ dùng *Aggregate Report* + *Transactions per Second (TPS)*.
   - **Spike Test:** ví dụ dùng *View Results Tree* (hoặc Backend Listener / *Active Threads Over Time*).
   *(Lưu ý: Đối với k6, xuất ra các định dạng output khác nhau như JSON summary, CSV metrics, HTML report dashboard).*
4. **Đặt tên file kịch bản chuẩn quy cách:**
   - `<StudentID>_Load_<YYYYMMDD>.jmx`
   - `<StudentID>_Stress_<YYYYMMDD>.jmx`
   - `<StudentID>_Spike_<YYYYMMDD>.jmx`
5. **Human Review (Phản biện kịch bản AI tạo ra):**
   - Ghi lại các điểm AI tạo sai/thiếu (ví dụ: quên Regex/JSON Extractor để lấy Bearer Token, thiếu Timer gây nghẽn cục bộ phi thực tế, assertion quá yếu hoặc không xử lý lỗi 401 khi tài khoản bị khóa).
   - Giải thích nguyên nhân vì sao AI sai (do hạn chế ngữ cảnh prompt, model thiếu kiến thức về API SUT, v.v.).
   - Tự sửa lại file hoàn chỉnh và commit lên Git.

---

### Bước 3: Thực thi kiểm thử (Load, Stress, Spike, Endurance) & Thu thập bằng chứng
1. **Chạy Load Test (Tải thông thường):**
   - Chạy kịch bản Load test.
   - Vừa chạy vừa mở Task Manager / htop để quan sát % CPU, RAM, Disk của tiến trình backend SUT.
   - Chụp ảnh màn hình: **Cùng 1 khung hình chứa cả JMeter/k6 và Resource Monitor**.
   - Xuất file log raw `.jtl` và sinh HTML Report dashboard (`jmeter -g <file.jtl> -o <folder_report>`).
2. **Chạy Stress Test (Tải cực đại tìm điểm gãy):**
   - Tăng tải dần dần đến khi hệ thống bắt đầu xuất hiện lỗi (Error rate > 5%, response time tăng vọt, HTTP 500/503).
   - **Quan trọng:** Nếu kích hoạt cơ chế khóa tài khoản (3-fail lockout), ghi lại cách reset database/tài khoản giữa các lần test.
   - Chụp ảnh bằng chứng resource lúc đạt đỉnh tải. Lưu raw `.jtl` và sinh HTML report.
3. **Chạy Spike Test (Tải đột biến tức thời):**
   - Đẩy tải từ mức bình thường lên đột biến trong thời gian rất ngắn (ví dụ: 10s tăng lên hàng trăm users), sau đó hạ về mức thường.
   - Đánh giá khả năng hồi phục (Recovery) của hệ thống.
   - Chụp ảnh bằng chứng resource, lưu raw `.jtl` và sinh HTML report.
4. **Chạy Endurance / Soak Test (Đo ngưỡng chịu đựng phần cứng):**
   - Chạy tải ổn định liên tục trong **10–15 phút**.
   - Ghi nhận các chỉ số cụ thể: **Maximum Stable RPS (Requests per second)**, **Memory ceiling** (mức trần RAM sử dụng, có bị Memory Leak không), **CPU utilization**.
5. **Ghi nhận lỗi (GitHub Issues):**
   - Nếu phát hiện bug chức năng hoặc sự cố hiệu năng nghiêm trọng (crash server, lỗi logic 500, deadlock database), tạo Issue trên GitHub kèm ảnh chụp màn hình.
6. **Quay Video Demo (Tối thiểu 6 phút):**
   - Quay màn hình hiển thị đồng thời công cụ test và Resource Monitor.
   - Thuyết minh bằng giọng thật (tiếng Việt) giải thích: thông số kịch bản, quá trình chạy tải, sự thay đổi CPU/RAM, kết quả báo cáo và ngưỡng chịu tải.
   - Upload lên YouTube ở chế độ **Unlisted (Không công khai)** và lấy link.

---

### Bước 4: Phân tích log & Săn lỗi AI (Task 2 - Misinterpretation Hunt)
1. **Cung cấp dữ liệu cho AI:**
   - Trích xuất tóm tắt hoặc cung cấp mẫu log `.jtl` / thống kê Summary Report cho AI (ChatGPT, Claude, Gemini).
   - Yêu cầu AI phân tích các chỉ số: Throughput, Average Latency, Median, 90th/95th/99th Percentile, Error Rate và đề xuất ngưỡng giới hạn.
2. **Săn lỗi hiểu sai của AI (Misinterpretation Hunt):**
   - So sánh kỹ lưỡng từng nhận định của AI với số liệu thực tế trong file `.jtl`.
   - Tìm ra ít nhất 2–3 lỗi AI diễn giải sai (Ví dụ: AI nhầm lẫn giữa *Average Response Time* và *p95 Response Time*; AI kết luận hệ thống nghẽn CPU trong khi bottleneck thực tế là connection pool; AI tính sai tỉ lệ throughput hoặc hiểu nhầm mã HTTP 429 / 401 là crash server).
   - **Trích dẫn giá trị chính xác từ file raw `.jtl`** và giải thích tại sao AI suy luận sai.
3. **Đánh giá các đề xuất tối ưu hóa của AI (Feasible vs Hallucinated):**
   - Yêu cầu AI đề xuất 3–5 giải pháp tối ưu hệ thống (ví dụ: Add database index, connection pooling, SQLite WAL mode, Redis caching, pagination).
   - Lập bảng phân loại:
     - **Khả thi (Feasible):** Giải pháp thực tế, áp dụng được ngay vào kiến trúc của SUT (kèm lý do kỹ thuật).
     - **Ảo tưởng / Bất khả thi (Hallucinated / Unfeasible):** Giải pháp viển vông, không phù hợp công nghệ SUT (ví dụ: SUT dùng SQLite đơn giản nhưng AI khuyên cài Kubernetes cluster phân tán, hoặc khuyên sửa các hàm không hề tồn tại trong source code).

---

### Bước 5: Đề xuất Continuous Performance Testing (Task 3 - Disrupt)
1. **Thiết kế mô hình CI/CD Performance Testing:**
   - Mô hình giám sát các Git commit của SUT.
   - Logic ra quyết định: Khi nào trigger smoke perf test (mỗi commit), khi nào trigger full load test (trước khi merge PR hoặc nightly build).
   - Cơ chế tự động phát hiện suy giảm hiệu năng (Performance Regression): Đặt ngưỡng chặn (Quality Gate) nếu **p95 Latency tăng > X%** hoặc Error Rate vượt ngưỡng.
2. **Vẽ sơ đồ luồng (Flowchart / Diagram):**
   - Sử dụng cú pháp Mermaid hoặc sơ đồ hình ảnh trực quan thể hiện: Commit -> Filter trigger -> Run Automated Test -> Extract Metrics -> Check Baseline & p95 Threshold -> Pass/Fail & Alert.
3. **Phân tích Trade-offs (Đánh đổi):**
   - **Chi phí hạ tầng & thời gian (Compute Cost vs Test Duration):** Chạy test nặng tốn tài nguyên CI/CD runners và làm chậm quá trình release.
   - **Cảnh báo giả (False Alarms vs True Regressions):** Tác động của môi trường test biến động (noisy neighbor, tài nguyên máy ảo không ổn định) gây fail giả lập trình viên.

---

### Bước 6: Xây dựng Agent Skill & Quay Video Demo
1. **Xây dựng Agent Skill:**
   - Tạo một Skill/Script tự động hóa quy trình: cấu hình kịch bản test, trigger chạy test, tự động phân tích log `.jtl` và xuất báo cáo tổng kết.
   - Đặt trong thư mục code/skill của bài tập.
2. **Quay Video Demo Skill:**
   - Quay video ngắn minh họa việc dùng Skill từ đầu đến cuối trên một nhóm endpoint.
   - Upload YouTube (Unlisted) và gắn link vào báo cáo & README.

---

### Bước 7: Viết Báo cáo, AI Audit Report, AI Critique & Git Commit Log
1. **Viết Main Report (Báo cáo chính):**
   - Định dạng Markdown (`REPORT.md`) và xuất sang PDF (`REPORT.pdf`).
   - Đầy đủ nội dung: Mô tả Scope, Thiết kế 3 kịch bản, Bảng thông số, Kết quả chạy + Ảnh chụp bằng chứng, Đoạn phân tích Task 2 (kèm bảng đối chiếu), Đề xuất Task 3 (kèm Flowchart).
2. **Viết AI Critique (200–300 từ - Bắt buộc):**
   - Trả lời rõ 3 câu hỏi:
     1. *AI đã làm sai, thiên vị hoặc thiếu sót ở đâu?*
     2. *Tại sao AI không phát hiện ra vấn đề đó?*
     3. *Bạn đã rút ra được nguyên tắc gì khi cộng tác với AI trong bài tập này?*
3. **Viết AI Audit Report (Bắt buộc):**
   - Liệt kê bảng nhật ký toàn bộ các phiên làm việc với AI: Tên công cụ, Ngày giờ, Prompt đã gửi, Output nhận được, Đánh giá/Chỉnh sửa của con người.
4. **Tạo Git Commit Log (`git_commit_log.txt`):**
   - Chạy lệnh xuất log: `git log --pretty=format:"%h - %an, %ar : %s" > git_commit_log.txt`.
5. **Tạo `README.md` tổng hợp:**
   - Chứa bảng tự đánh giá (Self-Assessment Table).
   - Tóm tắt kết quả test: Scenarios đã chạy, Endpoints đã cover, Ngưỡng chịu tải (Endurance threshold), Số lượng bug phát hiện, Link video demo YouTube.

---

## 4. MẪU KỊCH BẢN & GỢI Ý PROMPTING AI TỪNG BƯỚC

### Bảng ma trận kịch bản kiểm thử mẫu (Test Matrix)

| Kịch bản | Mục đích | Số Threads (VUs) | Ramp-up | Think Time | Listener / Report |
|:---|:---|:---:|:---:|:---:|:---|
| **Load Test** | Đo hiệu năng dưới tải bình thường dự kiến | 20 – 50 | 30s | 1 – 3s (Gaussian) | *Summary Report* |
| **Stress Test** | Tìm điểm gãy (Breaking point) & giới hạn lỗi | 100 – 300+ (Tăng dần) | 60s | 0.5 – 1s | *Aggregate Report* |
| **Spike Test** | Đo độ đàn hồi khi tải tăng vọt tức thì | 0 $\to$ 200 (trong 5s) $\to$ 0 | 5s | Rất ngắn / 0s | *View Results Tree* / *Active Threads* |
| **Endurance** | Đo độ ổn định dài hạn & rò rỉ bộ nhớ (15 min) | 30 (Sustained) | 30s | 2s | *Aggregate Report* |

### Chuỗi Prompt mẫu theo phương pháp AI-First (Prompting Chain)

```markdown
### Prompt 1: Thiết kế Kịch bản End-to-End
"Tôi đang thực hiện bài kiểm thử hiệu năng cho ứng dụng thương mại điện tử EShop (REST API backend). 
Tôi cần một luồng kiểm thử End-to-End (E2E) gồm 3 nhóm endpoint:
1. Auth-heavy: Login (lấy JWT token, lưu ý hệ thống có cơ chế khóa tài khoản nếu nhập sai 3 lần).
2. Read-heavy: Tìm kiếm sản phẩm theo từ khóa và xem chi tiết sản phẩm.
3. Transactional: Thêm sản phẩm vào giỏ hàng và thực hiện checkout.
Hãy giúp tôi thiết kế cấu trúc chi tiết của kịch bản JMeter (hoặc k6) và đề xuất các tham số thực tế (Ramp-up, Think time, Thread count) cho 3 bài test: Load, Stress, Spike."

### Prompt 2: Hướng dẫn cấu hình CSV Data-Driven
"Hãy hướng dẫn tôi cách cấu hình CSV Data Set Config trong JMeter để tham số hóa: username, password, keyword tìm kiếm, và product_id tương ứng, đảm bảo mỗi virtual user sử dụng một tập dữ liệu khác nhau."

### Prompt 3: Phân tích file log .jtl và Săn lỗi
"Dưới đây là bảng trích xuất kết quả từ file log test hiệu năng (.jtl) của tôi:
[Dán dữ liệu thống kê: Throughput, Latency avg, min, max, p90, p95, Error %]
1. Hãy phân tích hiệu năng hệ thống và chỉ ra bottleneck.
2. Đề xuất ngưỡng chịu tải (Endurance threshold).
3. Đề xuất 4 giải pháp tối ưu hóa phần mềm/cơ sở dữ liệu để nâng cao throughput."
(Sau khi AI trả lời, sinh viên dùng số liệu thật trong .jtl để soi lỗi diễn giải sai của AI cho Task 2).

### Prompt 4: Thiết kế đề xuất Continuous Performance Testing
"Hãy giúp tôi phác thảo một mô hình Continuous Performance Testing tích hợp trong GitHub Actions CI/CD pipeline cho backend EShop. 
Mô hình cần có:
- Điều kiện kích hoạt test khi có commit mới.
- Tiêu chí đánh giá regression dựa trên p95 latency.
- Các trade-offs về chi phí hạ tầng (compute cost) và tỉ lệ cảnh báo giả (false alarms)."
```

---

## 5. CẤU TRÚC THƯ MỤC NỘP BÀI CHUẨN MẪU (.ZIP)

Tên file zip nộp bài: `<StudentID>_HW05_AI_Performance_<SelfAssessedGrade>.zip`  
*Ví dụ:* `21127001_HW05_AI_Performance_090.zip`

```text
21127001_HW05_AI_Performance_090/
├── README.md                                # Bảng tự đánh giá + Test summary + YouTube links
├── reports/
│   ├── Main_Report.md                       # Báo cáo kỹ thuật chi tiết
│   ├── Main_Report.pdf                      # Bản PDF của báo cáo chính
│   ├── AI_Audit_Report.md                   # Nhật ký chi tiết tương tác AI
│   ├── AI_Audit_Report.pdf                  # Bản PDF của AI Audit Report
│   ├── AI_Critique.md                       # Đoạn văn phản biện AI (200-300 từ)
│   └── git_commit_log.txt                   # Toàn bộ lịch sử commit Git
├── test-plans/
│   ├── 21127001_Load_20260824.jmx           # Kịch bản Load Test
│   ├── 21127001_Stress_20260824.jmx         # Kịch bản Stress Test
│   ├── 21127001_Spike_20260824.jmx          # Kịch bản Spike Test
│   └── test-data.csv                        # File dữ liệu CSV data-driven
├── test-results/
│   ├── load_results.jtl                     # Raw log JTL cho Load test
│   ├── stress_results.jtl                   # Raw log JTL cho Stress test
│   ├── spike_results.jtl                    # Raw log JTL cho Spike test
│   ├── endurance_results.jtl                # Raw log JTL cho Endurance test
│   ├── load_html_report/                    # Thư mục HTML dashboard của Load test
│   ├── stress_html_report/                  # Thư mục HTML dashboard của Stress test
│   └── spike_html_report/                   # Thư mục HTML dashboard của Spike test
├── evidence/
│   ├── hardware_dxdiag.png                  # Ảnh cấu hình dxdiag (rõ Hostname)
│   ├── load_resource_monitor.png            # Ảnh JMeter + Task Manager chạy Load test
│   ├── stress_resource_monitor.png          # Ảnh JMeter + Task Manager chạy Stress test
│   ├── spike_resource_monitor.png           # Ảnh JMeter + Task Manager chạy Spike test
│   └── github_issues/                       # Ảnh chụp các Issue báo lỗi trên GitHub
│       ├── issue_01_crash.png
│       └── issue_02_lockout.png
└── agent-skill/                             # Source code và tài liệu Agent Skill
    ├── skill_performance_analyzer.py
    └── README_SKILL.md
```

---

## 6. CHECKLIST KIỂM TRA SẢN PHẨM TRƯỚC KHI NỘP

Hãy đánh dấu `[x]` vào từng mục để đảm bảo bạn không bị mất điểm oan hoặc bị 0 điểm:

### 1. Kịch bản & Quy cách đặt tên
- [ ] Kịch bản bao phủ đủ **3 nhóm endpoint**: Auth-heavy (xử lý lockout), Read-heavy, Transactional.
- [ ] Cả 3 kịch bản Load, Stress, Spike đều chạy trên **cùng một luồng nghiệp vụ E2E**.
- [ ] Đã sử dụng **dữ liệu CSV (Data-driven)** để nạp user/data động.
- [ ] Đã sử dụng **3 listener/report khác nhau**, không lặp lại giữa các bài test.
- [ ] Tên 3 file test plan tuân thủ đúng chuẩn: `{StudentID}_{ScenarioType}_{YYYYMMDD}`.

### 2. Dữ liệu thực thi & Bằng chứng phần cứng
- [ ] Có đầy đủ 3 file log thô **raw `.jtl`** đính kèm trong thư mục nộp.
- [ ] Có đầy đủ 3 thư mục **HTML Report Dashboard** được sinh ra từ `.jtl`.
- [ ] Có ảnh chụp cấu hình phần cứng (`dxdiag` / `screenfetch`), **Hostname trùng khớp với các bài tập trước**.
- [ ] Có ảnh chụp **cùng khung hình** giữa công cụ test và Resource Monitor (Task Manager / htop) cho từng lần chạy.
- [ ] Đã chạy bài test Endurance (10–15 phút) và ghi nhận số liệu cụ thể (Max stable RPS, Memory ceiling).

### 3. Video Demo
- [ ] Video đăng trên YouTube ở chế độ **Unlisted (Không công khai)**.
- [ ] Thời lượng video đạt tối thiểu **6 phút**.
- [ ] Video hiển thị đồng thời công cụ test và Resource Monitor trong cùng khung hình.
- [ ] Có **giọng thuyết minh tiếng Việt của chính sinh viên** (không dùng AI voice).
- [ ] Đã gắn link video vào `README.md` và `Main_Report.md`.

### 4. Báo cáo & Phản biện AI
- [ ] Đã phân tích task 2: Chỉ ra các điểm **AI hiểu sai/tính sai số liệu** kèm trích dẫn số liệu thật từ `.jtl`.
- [ ] Đã phân loại các đề xuất tối ưu của AI thành **Khả thi (Feasible)** và **Ảo tưởng (Hallucinated)** có giải thích.
- [ ] Task 3 có **Flowchart CI/CD pipeline** phát hiện p95 regression và thảo luận trade-offs.
- [ ] Đã xây dựng **Agent Skill** + link video demo sử dụng skill.
- [ ] Có đoạn văn **AI Critique (200–300 từ)** trả lời đủ 3 câu hỏi trọng tâm.
- [ ] Có phụ lục **AI Audit Report** ghi log đầy đủ các phiên prompt.
- [ ] Có file **`git_commit_log.txt`** thể hiện từng bước làm bài.
- [ ] Có link GitHub repository công khai chứa test plans và data.
- [ ] Đã log bug lên GitHub Issues (kèm ảnh chụp trong thư mục bằng chứng).

### 5. Đóng gói & Nộp bài
- [ ] File `README.md` có đầy đủ bảng tự chấm điểm và báo cáo tóm tắt.
- [ ] Nén toàn bộ theo định dạng: `<StudentID>_HW05_AI_Performance_<SelfAssessedGrade>.zip`.
- [ ] Điểm tự đánh giá là số có 3 chữ số trong khoảng `[000, 100]` (ví dụ: `090`).
- [ ] Nộp file `.zip` lên link nộp bài Moodle đúng hạn.

---

## 7. BẢNG TỰ ĐÁNH GIÁ (SELF-ASSESSMENT TABLE)

*Điền bảng này vào file `README.md` và bài báo cáo của bạn:*

| No. | Criteria | Grade | Self-Assessed Grade | Ghi chú minh chứng |
|:---:|:---|:---:|:---:|:---|
| **1** | Task 1 — Load testing | 20 | ... / 20 | Kịch bản `{StudentID}_Load_{YYYYMMDD}`, CSV data, Summary Report, raw `.jtl`, HTML report, ảnh Task Manager. |
| **2** | Task 1 — Stress testing | 20 | ... / 20 | Kịch bản `{StudentID}_Stress_{YYYYMMDD}`, Aggregate Report, xử lý lockout, tìm breaking point, raw `.jtl`, HTML report. |
| **3** | Task 1 — Spike testing | 20 | ... / 20 | Kịch bản `{StudentID}_Spike_{YYYYMMDD}`, View Results Tree, kiểm tra phục hồi sau spike, raw `.jtl`, HTML report. |
| **4** | Task 2 — AI analysis + misinterpretation hunt | 10 | ... / 10 | Bảng đối chiếu lỗi AI với số liệu `.jtl`, phân loại đề xuất Feasible vs Hallucinated. |
| **5** | Task 3 — Continuous Performance Testing proposal (G9.6) | 10 | ... / 10 | Flowchart CI/CD trigger commit, Quality Gate p95 regression, phân tích Trade-offs (chi phí, false alarms). |
| **6** | Agent Skills | 10 | ... / 10 | Source code Agent Skill tự động hóa workflow + Link YouTube video demo skill. |
| **Tổng** | **Total** | **100** | **... / 100** | |
