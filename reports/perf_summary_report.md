# Performance Test Analysis & Quality Gate Summary

**Thời gian thực thi:** 15:30:30 29/8/2026  
**Trạng thái Quality Gate:** 🔴 **FAILED / REGRESSION DETECTED**  

---

## 1. Tổng quan Hiệu năng Toàn hệ thống

| Tổng Samples | Throughput | Tỷ lệ Lỗi | Avg Latency | p50 (Median) | p90 | p95 (Phân vị 95) | p99 | Max Latency |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **10,882** | **121.96 req/s** | **0.00%** | **131.26 ms** | **7 ms** | **553 ms** | **785 ms** | **1159 ms** | **1617 ms** |

## 2. Chi tiết từng Sampler / Endpoint

| Sampler / API Endpoint | Samples | Throughput | Error % | Avg (ms) | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | Max (ms) |
| :---| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `01_Auth_Login` | 1875 | 21.01/s | 0.00% | 110.84 | 4 | 466 | 739 | 969 | 1123 |
| `02_Read_SearchProducts` | 1858 | 20.82/s | 0.00% | 111.27 | 3 | 458 | 726 | 909 | 1043 |
| `03_Read_GetMyOrders` | 1834 | 20.56/s | 0.00% | 119.60 | 5 | 536 | 764 | 933 | 1133 |
| `04_Transactional_ApplyCoupon` | 1796 | 20.13/s | 0.00% | 118.34 | 3 | 541 | 759 | 935 | 1135 |
| `05_Transactional_Checkout` | 1774 | 19.88/s | 0.00% | 131.99 | 8 | 561 | 758 | 955 | 1088 |
| `06_Transactional_CancelOrder` | 1745 | 19.56/s | 0.00% | 199.31 | 11 | 893 | 1202 | 1440 | 1617 |

---

## 3. Tiêu chuẩn Quality Gate & Đối chiếu Baseline

| Tiêu chí Quality Gate | Giá trị Đo được | Ngưỡng Tiêu chuẩn | Trạng thái | Đánh giá Tác động |
| :---| :---: | :---: | :---: | :---|
| **Độ trễ Phân vị 95 Tuyệt đối (p95 <= 500 ms)** | `785.00 ms` | `500 ms` | **❌ FAIL** | Vi phạm SLA hệ thống |
| **Tỷ lệ Lỗi Tổng thể (Error Rate <= 1%)** | `0.00%` | `1%` | **✅ PASS** | Đạt độ tin cậy |
| **Độ suy thoái Hiệu năng Δp95 so với Baseline (<= +15%)** | `+6441.67% (Mốc: 12.00 ms -> Hiện tại: 785.00 ms)` | `+15%` | **❌ FAIL** | PHÁT HIỆN PERFORMANCE REGRESSION |

---

## 4. Chẩn đoán Điểm nghẽn & Đề xuất Tối ưu hóa (AI Suggestions)

### 🔍 [CRITICAL] Nghẽn Khóa Ghi CSDL SQLite (Write Lock Contention)
- **Phát hiện:** Các endpoint Ghi dữ liệu (CancelOrder: p95 = 1202 ms, Checkout: p95 = 758 ms) bị suy thoái độ trễ nặng nề dưới tải đồng thời.
- **Giải pháp tối ưu:** Bật chế độ SQLite WAL (Write-Ahead Logging) trong backend/database.js:
```javascript
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA busy_timeout = 5000;");
```

### 🔍 [HIGH] Thiếu Index trên bảng `orders` (Full Table Scan)
- **Phát hiện:** API GET /api/orders/my-orders có độ trễ p95 = 764 ms do truy vấn quét toàn bộ bảng (Full Table Scan).
- **Giải pháp tối ưu:** Thêm Index cho trường tra cứu user_id:
```javascript
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
```

### 🔍 [MEDIUM] Hiện tượng Lệch Đuôi Phân Phối Độ Trễ (Heavy Tail Latency)
- **Phát hiện:** Median rất nhanh (7 ms) nhưng p99 vọt lên (1159 ms), biểu hiện hiện tượng nghẽn hàng đợi cục bộ.
- **Giải pháp tối ưu:** Áp dụng Connection Pooling hoặc In-memory Caching cho các dữ liệu danh mục tĩnh.
```javascript
const nodeCache = new NodeCache({ stdTTL: 60 });
```

