# ĐOẠN VĂN PHẢN BIỆN AI (AI CRITIQUE)
**Sinh viên thực hiện:** Nguyễn Hiếu Thuận — **MSSV:** 23127125  
**Bài tập:** HW05 - Performance Testing & AI Collaboration  

---

Trong quá trình thực hiện bài tập lớn HW05, việc cộng tác với AI (Gemini 3.7 Flash) mang lại tốc độ sinh mã nhanh chóng nhưng cũng bộc lộ những khiếm khuyết kỹ thuật nghiêm trọng đòi hỏi sự can thiệp và phản biện chặt chẽ từ con người:

1. **AI đã làm sai và thiếu sót ở đâu?**
   - *Ở khâu sinh kịch bản JMeter (Task 1):* AI tạo ra cấu trúc `JSONPostProcessor` sai cú pháp nghiêm trọng khi để thuộc tính `jsonPathExprs` chứa 3 chuỗi ngăn cách bởi dấu chấm phẩy nhưng chỉ khai báo 1 tên biến, dẫn đến ngoại lệ `IllegalArgumentException` làm hủy ngang request `05_Checkout` và kéo theo lỗi đường dẫn ở `06_CancelOrder`. Đồng thời, AI không chủ động kiểm tra việc các tài khoản trong file CSV đã tồn tại trong CSDL hay chưa, gây ra lỗi `401 Unauthorized` hàng loạt khi chạy tải.
   - *Ở khâu phân tích dữ liệu log `.jtl` (Task 2):* AI rơi vào "bẫy số liệu trung bình" (Average Trap), ngộ nhận hệ thống đạt chuẩn SLA khi chỉ nhìn vào `Average Latency = 131 ms`, trong khi thực tế $5\%$ người dùng ($p_{95}$) phải chịu độ trễ lên đến $785\text{ ms} - 1200\text{ ms}$. Ngoài ra, AI còn bịa đặt hàm không tồn tại `db.useConnectionPool()` và đề xuất giải pháp phi thực tế như triển khai Kubernetes cluster cho một ứng dụng Monolith dùng CSDL SQLite đơn file cục bộ.

2. **Tại sao AI không phát hiện ra vấn đề đó?**
   AI hoạt động dựa trên xác suất sinh từ và tổng hợp tri thức phổ quát, dẫn đến việc thiếu ngữ cảnh sâu sắc về kiến trúc nội tại của SUT (tính chất đơn file của SQLite) và thiếu cơ chế tự kiểm chứng tính đúng đắn khi thực thi mã kịch bản (.jmx) trong môi trường runtime thực tế.

3. **Nguyên tắc rút ra khi làm việc với AI:**
   Con người phải luôn giữ vai trò kiểm soát chất lượng (Human-in-the-loop). Mọi kịch bản do AI sinh ra bắt buộc phải qua bước Dry-Run kiểm thử thực tế, và mọi phân tích hiệu năng phải lấy **dữ liệu thô từ file log `.jtl` làm thước đo chân lý duy nhất (Ground Truth)** để đối chứng, tuyệt đối không tin tưởng mù quáng vào các nhận định tổng quát hay giải pháp hạ tầng do AI đề xuất.
