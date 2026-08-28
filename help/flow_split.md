
---

### 🔍 1. Bóc tách quyền hạn API thực tế

#### **A. Phân hệ Khách hàng (User APIs - `role: "user"`)**
* **Xác thực & Hồ sơ:**
  * `POST /api/register` (Đăng ký)
  * `POST /api/login` (Đăng nhập - tài khoản user)
  * `POST /api/forgot-password` (Yêu cầu mã OTP)
  * `POST /api/reset-password` (Đặt lại pass bằng OTP)
  * `GET /api/users/me` (Xem profile)
  * `PUT /api/users/me` (Cập nhật địa chỉ `shipping_address`, `phone`)
* **Duyệt hàng & Giỏ hàng:**
  * `GET /api/products` (Lấy danh sách sản phẩm, hỗ trợ `?search=...`)
  * `GET /api/products/:id` (Xem chi tiết sản phẩm)
  * `GET /api/categories` (Xem danh mục hàng)
  * `GET /api/cart` (Xem giỏ hàng)
  * `POST /api/cart` (Thêm vào giỏ)
* **Thanh toán & Xử lý đơn cá nhân:**
  * `POST /api/apply-coupon` (Kiểm tra và áp mã giảm giá)
  * `POST /api/coupon-usage` (Lưu lịch sử dùng coupon)
  * `POST /api/checkout` (Tạo đơn hàng mới)
  * `GET /api/orders/my-orders` (Xem lịch sử đơn của mình)
  * `PUT /api/orders/:id/cancel` (Khách tự hủy đơn hàng của mình)

---

#### **B. Phân hệ Quản trị viên (Admin APIs - `role: "admin"`)**
* **Xác thực Admin:**
  * `POST /api/login` (Đăng nhập tài khoản admin `admin@eshop.com` / `Admin123!`)
* **Quản lý Đơn hàng hệ thống:**
  * `GET /api/admin/orders` (Xem toàn bộ danh sách đơn hàng)
  * `GET /api/orders/:id` (Xem chi tiết 1 đơn hàng)
  * `PUT /api/admin/orders/:id/status` (Chuyển trạng thái đơn: `pending` $\rightarrow$ `confirmed` $\rightarrow$ `shipping` $\rightarrow$ `delivered` $\rightarrow$ `canceled`)
* **Quản lý Người dùng:**
  * `GET /api/admin/users` (Xem danh sách tất cả user)
  * `DELETE /api/admin/users/:id` (Xóa tài khoản người dùng)
* **Quản lý Sản phẩm, Danh mục & Khuyến mãi:**
  * `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
  * `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
  * `POST /api/admin/import-products` (Import danh sách sản phẩm từ JSON/CSV)
  * `GET /api/coupons` (Xem danh sách coupon)
  * `POST /api/admin/coupons` (Tạo mã giảm giá mới)
  * `DELETE /api/admin/coupons/:id` (Xóa mã giảm giá)

---

### 🚀 2. Chia lại 5 Workflow độc lập (3 User Flow + 2 Admin Flow)

Mỗi workflow đều đảm bảo đi đủ 3 nhóm: **Auth-heavy $\rightarrow$ Read-heavy $\rightarrow$ Transactional**, phân vai rõ ràng:

---

#### 👤 [USER] Workflow 1: Mua sắm & Thanh toán Tiêu chuẩn (Standard Customer Flow)
> **Mục đích:** Kiểm thử luồng mua sắm chính của khách hàng từ lúc duyệt catalog đến khi chốt đơn.
* **1. [Auth-heavy]**: `POST /api/login` (User login nhận token).
* **2. [Read-heavy]**: `GET /api/products` (Tải danh sách sản phẩm) $\rightarrow$ `GET /api/products/:id` (Xem chi tiết sản phẩm).
* **3. [Transactional]**: `POST /api/cart` (Thêm vào giỏ) $\rightarrow$ `POST /api/checkout` (Thực hiện thanh toán đơn hàng).

---

#### 🏷️ [USER] Workflow 2: Săn Voucher, Thanh toán & Quản lý Đơn hàng (Coupon Shopper & Order Lifecycle)
> **Mục đích:** Kiểm thử tính năng tìm kiếm, áp voucher khuyến mãi và thao tác với đơn hàng (xem/hủy).
* **1. [Auth-heavy]**: `POST /api/login` (User login).
* **2. [Read-heavy]**: `GET /api/products?search=...` (Tìm kiếm sản phẩm theo tên) $\rightarrow$ `GET /api/orders/my-orders` (Xem lịch sử mua).
* **3. [Transactional]**: `POST /api/apply-coupon` (Áp dụng mã giảm giá) $\rightarrow$ `POST /api/checkout` (Thanh toán đơn) $\rightarrow$ `PUT /api/orders/:id/cancel` (Khách hủy đơn hàng vừa tạo).

---

#### 🆕 [USER] Workflow 3: Đăng ký Mới, Quên Mật Khẩu & Cập nhật Hồ sơ (Account Lifecycle & Profile Setup)
> **Mục đích:** Kiểm thử toàn diện chu trình vòng đời tài khoản người dùng và thiết lập địa chỉ nhận hàng.
* **1. [Auth-heavy]**: `POST /api/register` (Tạo tài khoản) $\rightarrow$ `POST /api/forgot-password` & `POST /api/reset-password` (Thực hiện cấp/đổi pass OTP) $\rightarrow$ `POST /api/login` (Đăng nhập lại).
* **2. [Read-heavy]**: `GET /api/categories` (Xem danh mục) $\rightarrow$ `GET /api/users/me` (Lấy thông tin profile).
* **3. [Transactional]**: `PUT /api/users/me` (Cập nhật địa chỉ nhận hàng & số điện thoại) $\rightarrow$ `POST /api/checkout` (Tạo đơn hàng thử nghiệm).

---

#### 📦 [ADMIN] Workflow 4: Quản trị viên Vận hành Đơn hàng & State Machine (Admin Order Fulfillment)
> **Mục đích:** Kiểm thử khả năng chịu tải của DB khi Admin duyệt và chuyển trạng thái hàng loạt đơn hàng đồng thời.
* **1. [Auth-heavy]**: `POST /api/login` (Đăng nhập tài khoản `admin@eshop.com`).
* **2. [Read-heavy]**: `GET /api/admin/orders` (Tải danh sách đơn hàng toàn hệ thống) $\rightarrow$ `GET /api/orders/:id` (Xem chi tiết từng đơn hàng).
* **3. [Transactional]**: `PUT /api/admin/orders/:id/status` (Thực hiện chuyển trạng thái theo State Machine: `pending` $\rightarrow$ `confirmed` $\rightarrow$ `shipping`).

---

#### ⚙️ [ADMIN] Workflow 5: Quản trị viên Nhập hàng & Phát hành Voucher (Admin Catalog & Promo Operations)
> **Mục đích:** Kiểm thử tải của các thao tác ghi danh mục, thêm sản phẩm và quản lý người dùng/khuyến mãi của Admin.
* **1. [Auth-heavy]**: `POST /api/login` (Đăng nhập tài khoản Admin).
* **2. [Read-heavy]**: `GET /api/admin/users` (Xem danh sách tài khoản) $\rightarrow$ `GET /api/coupons` (Xem danh sách mã khuyến mãi).
* **3. [Transactional]**: `POST /api/categories` (Tạo danh mục mới) $\rightarrow$ `POST /api/products` (Tạo sản phẩm mới hoặc `POST /api/admin/import-products`) $\rightarrow$ `POST /api/admin/coupons` (Tạo voucher giảm giá).

---

### 📊 Bảng ma trận tổng hợp đối chiếu

| STT | Vai trò | Tên Workflow | Endpoint Auth-heavy | Endpoint Read-heavy | Endpoint Transactional |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **1** | **User** | Mua sắm & Thanh toán tiêu chuẩn | `POST /api/login` | `GET /api/products`<br>`GET /api/products/:id` | `POST /api/cart`<br>`POST /api/checkout` |
| **2** | **User** | Săn Voucher & Hủy đơn hàng | `POST /api/login` | `GET /api/products?search`<br>`GET /api/orders/my-orders` | `POST /api/apply-coupon`<br>`POST /api/checkout`<br>`PUT /api/orders/:id/cancel` |
| **3** | **User** | Đăng ký, Đổi pass & Cập nhật Profile | `POST /api/register`<br>`POST /api/forgot-password`<br>`POST /api/reset-password`<br>`POST /api/login` | `GET /api/categories`<br>`GET /api/users/me` | `PUT /api/users/me`<br>`POST /api/checkout` |
| **4** | **Admin**| Xử lý đơn hàng & State Machine | `POST /api/login (Admin)` | `GET /api/admin/orders`<br>`GET /api/orders/:id` | `PUT /api/admin/orders/:id/status` |
| **5** | **Admin**| Quản lý Kho, Sản phẩm & Voucher | `POST /api/login (Admin)` | `GET /api/admin/users`<br>`GET /api/coupons` | `POST /api/categories`<br>`POST /api/products`<br>`POST /api/admin/coupons` |

---