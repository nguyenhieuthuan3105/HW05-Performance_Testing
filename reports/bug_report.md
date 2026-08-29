# Bug Report

**MSSV:** 23127125  
**Họ và tên:** Nguyễn Hiếu Thuận  
**Bài tập:** HW05 - Performance Testing & AI Collaboration  
**Chức năng kiểm thử:** Workflow 2 (Săn voucher, Thanh toán và Hủy đơn hàng)  

---

## Danh sách Lỗi (Bugs & Performance Defects) phát hiện được trên SUT qua Performance Testing

### 1. Bug 1: Lỗi suy thoái hiệu năng nghiêm trọng (Latency Spike) tại API Hủy đơn hàng (`PUT /api/orders/:id/cancel`) dưới tải Stress Test

- **Mô tả:** Khi thực thi kịch bản Stress Testing với 150 Virtual Users đồng thời trong 90 giây, thời gian phản hồi của endpoint `06_Transactional_CancelOrder` bị suy thoái nghiêm trọng: độ trễ phân vị $p_{95}$ vọt lên đến **$1200.60\text{ ms}$** và độ trễ tối đa (Max Latency) đạt **$1617.00\text{ ms}$** (so với mức trung vị $11.00\text{ ms}$ và $p_{95} = 13.00\text{ ms}$ ở bài Load Test). Mức độ trễ này vi phạm nghiêm trọng ngưỡng tiêu chuẩn SLA ($p_{95} \le 500\text{ ms}$) gấp hơn 2.4 lần.
- **Chức năng ảnh hưởng:** `06_Transactional_CancelOrder` (`PUT /api/orders/:id/cancel`)
- **Kịch bản / Dữ liệu phát hiện:** Kịch bản Stress Testing (`test-plans/23127125_Stress_20260828.jmx`), file log `test-results/stress_results.jtl`.
- **GitHub Issue:** [Link Issue #1](https://github.com/nguyenhieuthuan3105/HW05-Performance_Testing/issues/1)

---

### 2. Bug 2: Lỗi tính toán sai giá trị giảm giá và tổng tiền thanh toán tại API Áp dụng mã giảm giá (`POST /api/apply-coupon`)

- **Mô tả:** Khi gửi yêu cầu áp dụng mã giảm giá phần trăm `SAVE10` (giảm 10%) cho đơn hàng có `total_amount = 30,000,000` VNĐ, API trả về `discount_amount` mang giá trị âm (**$-270,000,000$** VNĐ) và `final_amount` bị đội lên thành **$300,000,000$** VNĐ (gấp 10 lần tổng tiền gốc thay vì giảm 10% còn $27,000,000$ VNĐ). Lỗi logic này xuất hiện trực tiếp trong JSON response trả về cho client.
- **Chức năng ảnh hưởng:** `04_Transactional_ApplyCoupon` (`POST /api/apply-coupon`)
- **Kịch bản / Dữ liệu phát hiện:** Kịch bản `23127125_Load_20260828.jmx` (Listener View Results Tree).
- **GitHub Issue:** [Link Issue #2](https://github.com/nguyenhieuthuan3105/HW05-Performance_Testing/issues/2)

---

### 3. Bug 3: Hiện tượng phân phối đuôi độ trễ kéo dài ($p_{99} > 1.15\text{s}$) khi duy trì tải đồng thời cao kéo dài

- **Mô tả:** Trong bài kiểm thử Stress Testing 150 VUs, toàn bộ hệ thống bộc lộ hiện tượng lệch đuôi phân phối độ trễ cực độ: trong khi 50% người dùng ($p_{50}$) chỉ mất **$7.00\text{ ms}$**, thì 10% người dùng ($p_{90}$) phải chờ **$553.00\text{ ms}$**, 5% người dùng ($p_{95}$) chờ **$784.95\text{ ms}$**, và 1% người dùng ($p_{99}$) bị nghẽn tới **$1157.38\text{ ms}$**. Điều này cho thấy hệ thống bị tích tụ hàng đợi tranh chấp tài nguyên khi chịu tải kéo dài liên tục.
- **Chức năng ảnh hưởng:** Toàn bộ chuỗi End-to-End Workflow (Login, Search, Orders, Coupon, Checkout, Cancel).
- **Kịch bản / Dữ liệu phát hiện:** Kịch bản Stress Testing (`test-plans/23127125_Stress_20260828.jmx`), file log `test-results/stress_results.jtl`.
- **GitHub Issue:** [Link Issue #3](https://github.com/nguyenhieuthuan3105/HW05-Performance_Testing/issues/3)
