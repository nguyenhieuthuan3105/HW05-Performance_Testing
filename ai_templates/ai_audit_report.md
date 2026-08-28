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
