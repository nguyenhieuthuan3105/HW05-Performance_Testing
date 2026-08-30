# Performance Test Analysis & Quality Gate Summary

**Thời gian thực thi:** 19:48:15 30/8/2026  
**Trạng thái Quality Gate:** **PASSED**  

---

## 1. Tổng quan Hiệu năng Toàn hệ thống

| Tổng Samples | Throughput | Tỷ lệ Lỗi | Avg Latency | p50 (Median) | p90 | p95 (Phân vị 95) | p99 | Max Latency |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **896** | **15.24 req/s** | **0.00%** | **4.02 ms** | **3 ms** | **7 ms** | **11 ms** | **14 ms** | **53 ms** |

## 2. Chi tiết từng Sampler / Endpoint

| Sampler / API Endpoint | Samples | Throughput | Error % | Avg (ms) | p50 (ms) | p90 (ms) | p95 (ms) | p99 (ms) | Max (ms) |
| :---| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `01_Auth_Login` | 161 | 2.74/s | 0.00% | 3.47 | 3 | 5 | 6 | 13 | 53 |
| `02_Read_SearchProducts` | 158 | 2.69/s | 0.00% | 1.64 | 2 | 2 | 3 | 4 | 6 |
| `03_Read_GetMyOrders` | 151 | 2.57/s | 0.00% | 2.57 | 2 | 4 | 4 | 5 | 8 |
| `04_Transactional_ApplyCoupon` | 146 | 2.48/s | 0.00% | 1.92 | 2 | 3 | 3 | 5 | 5 |
| `05_Transactional_Checkout` | 143 | 2.43/s | 0.00% | 7.77 | 7 | 13 | 13 | 15 | 15 |
| `06_Transactional_CancelOrder` | 137 | 2.33/s | 0.00% | 7.34 | 6 | 12 | 13 | 14 | 14 |

---

## 3. Tiêu chuẩn Quality Gate & Đối chiếu Baseline

| Tiêu chí Quality Gate | Giá trị Đo được | Ngưỡng Tiêu chuẩn | Trạng thái | Đánh giá Tác động |
| :---| :---: | :---: | :---: | :---|
| **Độ trễ Phân vị 95 Tuyệt đối (p95 <= 500 ms)** | `11.00 ms` | `500 ms` | **PASS** | Đạt SLA cam kết |
| **Tỷ lệ Lỗi Tổng thể (Error Rate <= 1%)** | `0.00%` | `1%` | **PASS** | Đạt độ tin cậy |
| **Độ suy thoái Hiệu năng Δp95 so với Baseline (<= +15%)** | `+0.00% (Mốc: 11.00 ms -> Hiện tại: 11.00 ms)` | `+15%` | **PASS** | Hiệu năng ổn định |
