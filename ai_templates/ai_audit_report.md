# AI Audit Report & AI Critique - Individual Deliverable

---

## I. AI AUDIT LOG (NHẬT KÝ SỬ DỤNG AI)

Mỗi phiên tương tác với AI hỗ trợ thực hiện bài tập lớn được ghi lại đầy đủ dưới đây theo thứ tự thời gian.

## Thiết lập môi trường và Xây dựng Agent Skill

### Promt 1:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 09:28 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  trước khi bắt đầu, tôi muốn bạn tạo 1 agent_skill đảm bảo sẽ luôn tự viết audit log sau mỗi câu promt tôi gọi, đồng thời tự đánh giá và rút gọn câu trả lời của ai để điền vào mục output của từng câu hỏi. Skill này sẽ tự động tìm đến file ai_templates/ai_audit_report.md, sau đó thêm mới liên tục các câu promt, theo đúng cấu trúc tham khảo từ @[ai_audit_report.md] (từ hw04). Hãy hoàn thiện skill này trong @[agent_skills/automation_audit_logs.md] nhé
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Hoàn thiện tài liệu Agent Skill:
     - Tạo file agent_skills/automation_audit_logs.md với đầy đủ quy chuẩn tự động hóa nhật ký AI Audit Log.
     - Quy định cấu trúc schema chuẩn (Công cụ AI, Ngày giờ, Prompt, Output rút gọn có cấu trúc).
     - Định nghĩa phân mục rõ ràng theo các Task của HW05 (Môi trường & Skill, Task 1 Load/Stress/Spike, Task 2 AI Analysis & Săn lỗi, Task 3 CI/CD, Tổng hợp Báo cáo).
  2. Khởi tạo và ghi log tự động:
     - Khởi tạo cấu trúc file ai_templates/ai_audit_report.md chuẩn theo mẫu HW04.
     - Đã ghi nhận ngay phiên tương tác đầu tiên (Promt 1) vào Section "Thiết lập môi trường và Xây dựng Agent Skill".
  3. Cơ chế hoạt động tiếp theo:
     - Agent sẽ tự động duy trì việc ghi log liên tục sau mỗi câu prompt của người dùng trong suốt quá trình thực hiện bài tập.
  ```

### Promt 2:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 10:21 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  việc đầu tiên tôi cần làm là setup những gì? tôi đã có web eshop sut chuẩn bị sẵn (đã làm cho cách hw trước). Về công cụ thì tôi sẽ chọn JMeter, tải ở đâu, ngoài ra còn cần gì khác không?
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Hướng dẫn thiết lập môi trường & công cụ JMeter:
     - Kiểm tra Java: Máy đã có sẵn OpenJDK 21.0.8 LTS (tương thích 100%).
     - Tải JMeter: Hướng dẫn tải bản Binaries apache-jmeter-5.6.3.zip từ trang chủ Apache, giải nén và chạy bin/jmeter.bat.
     - Plugin mở rộng: Khuyến nghị cài jmeter-plugins-manager-1.10.jar để lấy các Listener TPS, Active Threads phục vụ báo cáo.
  2. Các công cụ và bằng chứng bắt buộc khác:
     - Bằng chứng phần cứng (dxdiag): Chụp rõ Hostname, CPU, RAM lưu vào evidence/hardware_dxdiag.png.
     - Resource Monitoring: Chuẩn bị Task Manager (Performance tab) để chụp ảnh cùng khung hình với JMeter.
     - Video recording: Chuẩn bị OBS/Game Bar để quay video demo có thuyết minh giọng thật >= 6 phút.
     - Chuẩn bị SUT: Backend EShop và cơ chế reset DB khi gặp lỗi 3-fail lockout.
  3. Khởi tạo cấu trúc thư mục làm việc chuẩn: test-plans/, test-results/, evidence/, reports/.
  ```

### Promt 3:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 10:34 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  đúng giao diện chưa nhỉ, tôi mở bằng [hình ảnh giao diện JMeter 5.6.3 và file ApacheJMeter.jar]
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Xác nhận giao diện:
     - Giao diện người dùng mở lên hoàn toàn chính xác là Apache JMeter 5.6.3 GUI (màn hình Test Plan).
  2. Đánh giá & Khuyến nghị cách khởi chạy:
     - Người dùng mở trực tiếp qua file ApacheJMeter.jar (14 KB).
     - Khuyến nghị: Khi thiết kế kịch bản hoặc chạy thử, nên ưu tiên mở bằng file bin/jmeter.bat để JMeter tự động nhận diện đúng cấu hình bộ nhớ JVM (Heap size) và các plugins trong lib/ext/.
     - Khi chạy test chính thức để lấy dữ liệu raw .jtl, nên chạy qua chế độ Non-GUI (CLI) để tối ưu hiệu năng và không bị nghẽn tài nguyên do render giao diện đồ họa.
  ```
