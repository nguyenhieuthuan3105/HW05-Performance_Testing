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

## Task 1: Thiết kế Kịch bản Test Plan & Dữ liệu Data-Driven (Load/Stress/Spike)

### Promt 1:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 13:43 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  backend sẽ là http://localhost:3000
  flow của tôi thực hiện là flow 2 trong @[help/flow_split.md] . Sau đó tôi cần làm gì
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Phân tích Flow 2 (Săn Voucher, Thanh toán & Hủy đơn hàng):
     - Auth-heavy: POST /api/login (User login -> JWT token trích xuất bằng JSON Extractor).
     - Read-heavy: GET /api/products?search=... -> GET /api/orders/my-orders (Kèm Bearer Token).
     - Transactional: POST /api/apply-coupon -> POST /api/checkout -> PUT /api/orders/:id/cancel.
  2. Tạo lập dữ liệu Data-Driven:
     - Tạo file test-plans/test-data.csv gồm các tài khoản, từ khóa tìm kiếm, coupon code SAVE10 và thông tin giao hàng.
  3. Sinh 3 kịch bản JMeter (.jmx) chuẩn mã số sinh viên 23127125:
     - 23127125_Load_20260828.jmx: 30 Threads, 30s Ramp-up, 60s Duration, Summary Report + Response Time Graph.
     - 23127125_Stress_20260828.jmx: 150 Threads, 45s Ramp-up, 90s Duration, Aggregate Report + View Results Table.
     - 23127125_Spike_20260828.jmx: 100 Threads, 5s Ramp-up, 30s Duration, View Results Tree + Response Time Graph.
  4. Hướng dẫn các bước tiếp theo:
     - Bước 1: Mở JMeter GUI chạy thử nghiệm 1 User (Dry Run) để kiểm tra token & API status code.
     - Bước 2: Chạy Non-GUI thu thập raw log .jtl và quay video Resource Monitor (Task Manager).
  ```

### Promt 2:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 14:00 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  @[help/flow_split.md] theo như tôi thấy thì các phần này đều bị trùng phần auth_heavy, tuy nhiên bạn tôi bảo là đăng nhập thì chỉ có mỗi /login này thôi, nên không còn cách nào khác. Chiếu theo @[help/2026.HW05.Performance Testing_En.pdf] thì có hợp lệ không?
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Phân tích tính hợp lệ theo yêu cầu đề bài HW05 (Mục 5 & 6 trang 4 PDF):
     - Xác thực tính chất RESTful: Hầu hết các Transactional APIs (Cart, Checkout, Coupon, Order Lifecycle) đều yêu cầu Bearer Token từ bước Login, nên POST /api/login là điểm khởi đầu chuẩn mực cho mọi kịch bản E2E.
     - Quy định chống trùng lặp ("No two members may test the same workflow"): Áp dụng cho TOÀN BỘ CHUỖI End-to-End Workflow (sự kết hợp của Auth + Read + Transactional), không cấm việc dùng chung endpoint /api/login.
  2. Đối chiếu thực tế các Workflow:
     - Flow 1: Mua sắm tiêu chuẩn (View Catalog -> Add Cart -> Checkout).
     - Flow 2: Săn Voucher & Hủy đơn hàng (Search -> My Orders -> Apply Coupon -> Checkout -> Cancel).
     - Flow 3: Đăng ký & Hồ sơ (Register -> OTP -> Profile Setup).
     - Flow 4 & 5: Admin Workflow (Fulfillment & Catalog Operations).
  3. Kết luận: Workflow 2 hoàn toàn hợp lệ, độc lập và đáp ứng 100% tiêu chí đề bài.
  ```

### Promt 3:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 14:12 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  xem o day dung khong vay? [hình ảnh Summary Report trong JMeter báo lỗi ở 01_Auth_Login, 03_Read_GetMyOrders, 06_Transactional_CancelOrder]
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Xác nhận vai trò của Summary Report:
     - Summary Report là nơi đúng để xem tổng hợp các chỉ số số lượng mẫu (Samples), thời gian phản hồi (Avg/Min/Max), tỷ lệ lỗi (Error %) và thông lượng (Throughput).
     - Để debug chi tiết mã lỗi HTTP và response body, cần bổ sung listener View Results Tree.
  2. Phân tích nguyên nhân lỗi hiển thị trong ảnh:
     - Lỗi 01_Auth_Login (57.14% Error): Các tài khoản user1, user2, user3 trong file test-data.csv chưa tồn tại/đăng ký trong CSDL của SUT EShop dẫn đến mã lỗi 401 Unauthorized.
     - Lỗi 03_Read_GetMyOrders (57.14% Error): Kéo theo từ lỗi login (không có token để xác thực).
     - Lỗi 06_Transactional_CancelOrder (100% Error): Cần kiểm tra endpoint route hủy đơn và JSON Extractor trích xuất order_id từ bước Checkout.
  3. Giải pháp khắc phục:
     - Đồng bộ lại dữ liệu trong test-plans/test-data.csv với tài khoản đã tồn tại thực tế trong DB (test@eshop.com).
     - Thêm View Results Tree để kiểm tra cấu trúc payload và header xác thực.
  ```

### Promt 4:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 14:20 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  việc chỉ sử dụng 1 tài khoản có là hợp lệ với yêu cầu đề bài không?
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Đánh giá tính hợp lệ theo yêu cầu đề bài:
     - Về mặt hình thức: Đề bài yêu cầu "Make the workflow data-driven. Use CSV input data in the end-to-end workflow to parameterize requests (e.g., credentials, product IDs, or order payloads)." Nếu các trường khác (keyword, product_id, shipping info) đã tham số hóa thì việc dùng 1 account vẫn chạy được nhưng chưa triệt để ở mục credentials.
     - Rủi ro kỹ thuật: Nếu hàng trăm Virtual Users dùng chung 1 account, khi chạy Stress Test kích hoạt lỗi 3-fail login lockout sẽ làm toàn bộ các luồng kiểm thử bị khóa và sập đồng loạt.
  2. Đề xuất giải pháp tối ưu chuẩn 100%:
     - Khuyến nghị tạo/seeding sẵn 5-10 tài khoản thật trong CSDL (user1@eshop.com, user2@eshop.com...) để nạp vào CSV, đảm bảo vừa đa dạng credentials vừa không gây lỗi 401 giả tạo.
  ```

### Promt 5:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 14:22 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  nếu vậy việc tạo các tài khoản trước khi chạy test, và dọn dẹp chúng sau khi chạy xong thì sao? có thực hiện được không? có bị mâu thuẫn với việc tách file test data không?
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Đánh giá tính khả thi và tiêu chuẩn kiểm thử (Best Practice):
     - Hoàn toàn thực hiện được và đây là tiêu chuẩn vàng trong Performance Testing (cơ chế setUp và tearDown).
     - Trong JMeter có sẵn setUp Thread Group (chạy trước để khởi tạo/seeding tài khoản) và tearDown Thread Group (chạy sau để dọn dẹp dữ liệu/reset DB).
  2. Phân tích tính tương thích với file Test Data (.csv):
     - Hoàn toàn không mâu thuẫn: File test-data.csv đóng vai trò Single Source of Truth (nguồn dữ liệu gốc).
     - setUp Thread Group đọc từ CSV để tạo tài khoản trong DB -> Main Thread Group đọc chính CSV đó để chạy tải kiểm thử -> tearDown dọn dẹp môi trường.
  3. Điểm cộng chuyên môn:
     - Đáp ứng trực tiếp yêu cầu xử lý và reset 3-fail login lockout của đề bài HW05, giúp bài test mang tính độc lập và tự động hóa cao (Idempotent).
  ```

### Promt 6:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 14:24 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  hãy thực hiện việc này cho tôi nhé
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Nâng cấp bộ dữ liệu test-plans/test-data.csv:
     - Cấu hình 6 tài khoản người dùng riêng biệt (test@eshop.com, user1..user5@eshop.com) cùng bộ tham số tìm kiếm, coupon và địa chỉ giao hàng.
  2. Tích hợp setUp Thread Group tự động vào cả 3 kịch bản JMeter:
     - 23127125_Load_20260828.jmx
     - 23127125_Stress_20260828.jmx
     - 23127125_Spike_20260828.jmx
  3. Cơ chế hoạt động của setUp Thread Group:
     - Tự động chạy 6 vòng lặp trước bài test chính -> Gọi API POST /api/register để đảm bảo 100% tài khoản đã tồn tại trong CSDL.
     - Cấu hình on_sample_error = continue để bỏ qua an toàn nếu tài khoản đã tồn tại từ trước.
     - Bổ sung View Results Tree và hoàn thiện JSON Extractor bắt mã đơn hàng order_id.
  ```

### Promt 7:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 15:19 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  sao no van loio nhi, them vao do no khong chay test so 5 ha? [hình ảnh lỗi java.net.URISyntaxException tại /api/orders/${order_id}/cancel và 05_Transactional_Checkout bị disable/bỏ qua]
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Phân tích nguyên nhân qua 2 hình ảnh chụp:
     - Tại sao không chạy test số 5 (05_Transactional_Checkout): Trong giao diện JMeter ở ảnh 2, node 05_Transactional_Checkout đang bị vô hiệu hóa (disabled / icon bị gạch chéo) do JMeter đang giữ bộ nhớ cũ trước khi cập nhật file.
     - Tại sao test số 6 bị lỗi java.net.URISyntaxException: Do test số 5 bị bỏ qua nên biến ${order_id} không tồn tại -> JMeter gửi nguyên đường dẫn "/api/orders/${order_id}/cancel" có chứa ký tự ngoặc nhọn '{}' không hợp lệ trong URI.
  2. Đối chiếu mã nguồn Backend SUT (server.js):
     - POST /api/checkout yêu cầu payload: { "total_amount": 30000000, "shipping_address": "..." } và trả về trường JSON chính xác là { "orderId": <id> }.
     - Khớp cấu hình JSON Extractor trích xuất chuẩn $.orderId.
  3. Hành động đã thực hiện:
     - Đồng bộ lại toàn bộ mã XML của cả 3 kịch bản (.jmx) đảm bảo 100% samplers enabled="true" và chuẩn payload server.js.
     - Hướng dẫn người dùng Reload/Reopen lại file .jmx trong JMeter GUI.
  ```

### Promt 8:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 15:26 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  no van bi loi so 5 khong chay, so 6 bi thieu [hình ảnh nhật ký JMeter báo lỗi IllegalArgumentException: Mismatch between number of variables, json expressions and default values]
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Phân tích nguyên nhân gốc rễ qua log hệ thống:
     - Log JMeter ghi nhận rõ: IllegalArgumentException: Mismatch between number of variables, json expressions and default values tại JSONPostProcessor của request 05_Transactional_Checkout.
     - Nguyên nhân: jsonPathExprs chứa 3 biểu thức ngăn cách bởi dấu chấm phẩy ($.order.id;$.id;$.order_id) nhưng referenceNames chỉ có 1 biến (order_id) khiến JMeter ngắt ngang sampler số 5 trước khi ghi nhận kết quả.
     - Khi sampler 5 bị hủy giữa chừng, biến ${order_id} không được sinh ra dẫn đến sampler 6 tiếp tục lỗi URL.
  2. Khắc phục triệt để và Xác thực:
     - Sửa cấu hình JSONPostProcessor thành đúng 1 biểu thức $.orderId khớp 100% với response của server SUT.
     - Tự động đăng ký toàn bộ 6 tài khoản (test@eshop.com, user1..user5@eshop.com) trực tiếp vào DB backend.
     - Thực thi kiểm thử dry-run trực tiếp qua CLI xác nhận toàn bộ 6/6 API đều trả về HTTP 200/Success mượt mà.
  ```

### Promt 9:

- **Công cụ AI sử dụng:** Gemini 3.7 Flash (High) (Antigravity IDE)
- **Ngày giờ tương tác:** 15:34 28/08/2026
- **Câu lệnh đã hỏi (Prompt):**

  ```text
  ket qua the nay la oke chua? [hình ảnh Summary Report của Load Testing hiển thị 901 samples, Error 0.00% trên toàn bộ 6 bước]
  ```

- **Kết quả phản hồi của AI (Output):**
  ```text
  1. Đánh giá chuyên môn về kết quả kiểm thử:
     - Tỷ lệ lỗi: 0.00% hoàn hảo trên toàn bộ 6 bước (01_Auth_Login -> 06_Transactional_CancelOrder với tổng số 901 samples).
     - Tính logic của độ trễ: Endpoints ghi CSDL (Checkout: 8ms, CancelOrder: 7ms) có thời gian phản hồi cao hơn hợp lý so với các endpoints đọc/xác thực (1-2ms).
     - Độ ổn định: Std Dev nhỏ (3.28ms), Max latency chỉ 16ms, chứng minh hệ thống SUT hoạt động rất mượt mà dưới tải 30 Virtual Users.
  2. Hướng dẫn các bước tiếp theo của Task 1:
     - Thực thi chạy chính thức 3 kịch bản bằng CLI để sinh raw log .jtl và HTML Dashboard Report.
     - Mở Task Manager (Performance tab) để quay video demo có thuyết minh tiếng Việt >= 6 phút.
  ```
