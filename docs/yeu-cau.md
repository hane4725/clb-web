# Tài liệu Yêu cầu phần mềm & User Stories (Backlog F1–F5)

> **Căn cứ:** Mục 1 (Backlog), Mục 7 (Bước 2 Tuần 2) & Phụ lục A của `README.md`  
> **Dự án:** Website Quản lý hoạt động CLB (UHL Active)  
> **Phiên bản:** Sprint 2 (Khởi tạo kế hoạch & Backlog)

---

## Danh sách 10 User Stories chuẩn Agile Scrum

### 1. [F1.1] Xem danh sách hoạt động và phân trang
* **User story:** Là Thành viên hoặc Khách, tôi muốn xem danh sách các hoạt động của CLB theo từng trang (ví dụ 6–10 hoạt động/trang), để dễ dàng nắm bắt thông tin các sự kiện sắp diễn ra mà không bị tải chậm trang.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gọi `GET /api/activities?page=1&limit=6` trả về mã HTTP `200 OK` kèm mảng `data` và metadata phân trang (`page`, `limit`, `total`, `totalPages`).
  - [ ] Mỗi hoạt động hiển thị đủ: tiêu đề (`title`), địa điểm (`location`), thời gian bắt đầu (`start_at`), số chỗ tối đa (`capacity`), số lượng đã đăng ký (`registeredCount`).
  - [ ] Nếu trang yêu cầu vượt quá tổng số trang → API trả về mảng rỗng `[]` (không báo lỗi 500).
  - [ ] Giao diện có thanh phân trang (nút Trang trước, Trang sau, số trang hiện tại).
* **Ước lượng:** 3 điểm (Story Points)
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện)
* **Người nhận:** Backend: Đức, Frontend: Lan, Bảo Anh
* **Phụ thuộc:** Bảng `activities`, bảng `registrations`

---

### 2. [F1.2] Tìm kiếm hoạt động theo từ khóa
* **User story:** Là Thành viên, tôi muốn tìm kiếm hoạt động bằng cách nhập từ khóa tên sự kiện vào ô tìm kiếm, để nhanh chóng tìm thấy sự kiện mình quan tâm.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gọi `GET /api/activities?q=hiến+máu` trả về danh sách hoạt động có tên chứa từ khóa tìm kiếm (tìm kiếm tương đối `LIKE %q%`).
  - [ ] Tìm kiếm không phân biệt chữ hoa, chữ thường và có hỗ trợ tiếng Việt có dấu/không dấu cơ bản.
  - [ ] Nếu không có hoạt động nào khớp từ khóa → Giao diện hiển thị thông báo "Không tìm thấy hoạt động phù hợp".
  - [ ] Từ khóa tìm kiếm và số trang được lưu đồng bộ trên URL (`?q=...&page=...`) để người dùng F5 hoặc chia sẻ link không bị mất kết quả.
* **Ước lượng:** 2 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `activities`

---

### 3. [F2.1] Xem trang chi tiết hoạt động
* **User story:** Là Thành viên, tôi muốn bấm vào một hoạt động để xem thông tin chi tiết đầy đủ, để biết nội dung sự kiện, địa điểm, thời gian và số chỗ còn lại trước khi quyết định đăng ký.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gọi `GET /api/activities/:id` với ID hợp lệ → Trả về `200 OK` kèm toàn bộ thông tin: mô tả chi tiết (`description`), người tạo (`created_by`), thời gian bắt đầu/kết thúc, số chỗ còn trống (`remainingSeats = capacity - registeredCount`).
  - [ ] Gọi `GET /api/activities/9999` (ID không tồn tại) → Trả về `404 Not Found` kèm JSON `{ error: 'Không tìm thấy hoạt động' }`.
  - [ ] Giao diện `activity.html?id=...` hiển thị xử lý đủ 3 trạng thái: Đang tải (Loading), Lỗi (Error 404), Hiển thị dữ liệu.
* **Ước lượng:** 2 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `activities`, `users`

---

### 4. [F2.2] Đăng ký tham gia hoạt động
* **User story:** Là Thành viên, tôi muốn nhấn nút đăng ký tham gia một hoạt động còn chỗ, để được ghi nhận vào danh sách tham gia chính thức của sự kiện.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Bấm nút "Đăng ký" tại trang chi tiết:
    - Gửi `POST /api/activities/:id/registrations`.
    - Trả về mã HTTP `201 Created`.
    - Giao diện lập tức đổi nút thành "Hủy đăng ký", số chỗ còn lại giảm đi 1.
  - [ ] Nếu đăng ký lần 2 cùng một hoạt động → Trả về `409 Conflict` kèm thông báo "Bạn đã đăng ký hoạt động này rồi".
  - [ ] Nếu hoạt động đã hết chỗ (`registeredCount >= capacity`) → Nút đăng ký bị vô hiệu hóa (disabled), nếu cố gọi API trả về `409 Conflict` kèm thông báo "Hoạt động đã hết chỗ".
* **Ước lượng:** 3 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `registrations`, `activities`

---

### 5. [F2.3] Hủy đăng ký tham gia hoạt động
* **User story:** Là Thành viên đã đăng ký, tôi muốn có thể hủy đăng ký nếu có việc bận đột xuất, để nhường lại chỗ trống cho thành viên khác.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gọi `DELETE /api/activities/:id/registrations/me` khi đã đăng ký trước đó:
    - Trả về mã HTTP `200 OK` (hoặc `204 No Content`).
    - Bản ghi trong bảng `registrations` bị xóa (hoặc chuyển trạng thái).
    - Nút trên giao diện đổi lại thành nút "Đăng ký", số chỗ còn trống tăng thêm 1.
  - [ ] Nếu người dùng chưa từng đăng ký mà gọi lệnh hủy → Trả về `404 Not Found` hoặc `400 Bad Request`.
* **Ước lượng:** 2 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `registrations`

---

### 6. [F3.1] Quản trị viên tạo mới hoạt động
* **User story:** Là Quản trị viên CLB (Admin), tôi muốn tạo một hoạt động mới với đầy đủ thông tin, để công bố sự kiện cho các thành viên đăng ký tham gia.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gửi `POST /api/activities` kèm JSON body (`title`, `description`, `location`, `start_at`, `end_at`, `capacity`):
    - Dữ liệu hợp lệ → Trả về `201 Created` kèm thông tin hoạt động vừa tạo có ID mới.
  - [ ] Kiểm tra tính hợp lệ dữ liệu đầu vào (Validation):
    - Thiếu các trường bắt buộc (`title`, `start_at`, `end_at`, `capacity`) → Trả về `400 Bad Request` kèm chi tiết lỗi.
    - Thời gian kết thúc `end_at` trước thời gian bắt đầu `start_at` → Báo lỗi `400`.
    - Số lượng `capacity` không phải số nguyên dương $\ge 1$ → Báo lỗi `400`.
  - [ ] Bảo mật: Nếu người dùng không có vai trò `ADMIN` gọi endpoint này → Trả về `403 Forbidden`.
* **Ước lượng:** 5 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện `admin-edit.html`), Sprint 5 (Phân quyền)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `activities`, bảng `users`

---

### 7. [F3.2] Quản trị viên cập nhật và xóa hoạt động
* **User story:** Là Quản trị viên CLB, tôi muốn chỉnh sửa thông tin hoạt động (đổi giờ, đổi phòng) hoặc xóa một hoạt động đã bị hủy, để thông tin trên website luôn chính xác.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gọi `PATCH /api/activities/:id` với dữ liệu mới → Trả về `200 OK` kèm bản ghi đã cập nhật.
  - [ ] Gọi `DELETE /api/activities/:id`:
    - Hiện hộp thoại xác nhận ("Bạn có chắc chắn muốn xóa hoạt động này?").
    - Xóa thành công → Trả về `200 OK` (hoặc `204`), đồng thời xóa hoặc cascade các đăng ký liên quan.
  - [ ] Chỉ tài khoản vai trò `ADMIN` mới có quyền sửa/xóa; `MEMBER` gọi vào trả về `403 Forbidden`.
* **Ước lượng:** 3 điểm
* **Sprint thực hiện:** Sprint 3 (Backend API), Sprint 4 (Giao diện `admin.html`)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `activities`, `registrations`

---

### 8. [F4.1] Đăng nhập và cấp phát token JWT
* **User story:** Là Người dùng (Thành viên hoặc Quản trị viên), tôi muốn đăng nhập bằng Email và Mật khẩu, để hệ thống nhận diện danh tính và cho phép tôi sử dụng các quyền tương ứng.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Gửi `POST /api/auth/login` với body `{ email, password }`:
    - Thông tin đúng → Trả về `200 OK` kèm JSON `{ token, user: { id, email, full_name, role } }`.
    - Token là JWT được ký bằng secret key, mã hóa an toàn.
  - [ ] Sai email hoặc sai mật khẩu → Trả về `401 Unauthorized` kèm thông báo "Email hoặc mật khẩu không chính xác".
  - [ ] Mật khẩu trong cơ sở dữ liệu phải được băm an toàn bằng `bcryptjs` (không bao giờ lưu mật khẩu dạng plain text).
  - [ ] Đăng nhập thành công → Frontend lưu token vào `localStorage`, chuyển hướng về trang chủ hoặc trang admin tương ứng với vai trò.
* **Ước lượng:** 3 điểm
* **Sprint thực hiện:** Sprint 5 (Xác thực & Phân quyền)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `users`

---

### 9. [F4.2] Phân quyền truy cập theo vai trò (ADMIN vs MEMBER)
* **User story:** Là Hệ thống, tôi muốn kiểm tra quyền của người dùng trên mỗi request, để ngăn chặn thành viên thông thường truy cập hoặc can thiệp vào các chức năng quản trị.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Mọi request gọi API yêu cầu bảo mật phải gửi kèm header `Authorization: Bearer <token>`.
  - [ ] Không gửi token hoặc token hết hạn/không hợp lệ → Trả về `401 Unauthorized`.
  - [ ] Thành viên (`MEMBER`) cố gắng truy cập trang `admin.html` hoặc gọi các API tạo/sửa/xóa/duyệt → Trả về `403 Forbidden` và tự động redirect về trang chủ.
  - [ ] Giao diện tự động ẩn các nút dành riêng cho Quản trị viên (nút Sửa, Xóa, Duyệt minh chứng) khi người dùng đăng nhập với vai trò `MEMBER`.
* **Ước lượng:** 3 điểm
* **Sprint thực hiện:** Sprint 5 (Xác thực & Phân quyền)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `users`, ma trận phân quyền `docs/phan-quyen.md`

---

### 10. [F5.1] Nộp và quản lý minh chứng tham gia hoạt động
* **User story:** Là Thành viên đã tham gia hoạt động, tôi muốn tải lên tệp ảnh hoặc PDF làm minh chứng hoàn thành, để Quản trị viên xem xét và duyệt điểm hoạt động cho tôi.
* **Tiêu chí chấp nhận (Acceptance Criteria):**
  - [ ] Thành viên đã đăng ký hoạt động có thể upload file minh chứng tại trang chi tiết:
    - Chỉ chấp nhận định dạng ảnh (`.jpg`, `.jpeg`, `.png`) hoặc `.pdf`.
    - Kích thước tệp $\le 5\text{ MB}$. Vượt quá dung lượng → Báo lỗi `400 Bad Request`.
  - [ ] Tệp được đổi tên an toàn và lưu vào thư mục `uploads/` trên máy chủ, đường dẫn lưu vào bảng `evidences` với trạng thái ban đầu là `PENDING`.
  - [ ] Thành viên có thể xem lại trạng thái minh chứng của mình: `PENDING` (Chờ duyệt), `APPROVED` (Đã duyệt), `REJECTED` (Bị từ chối).
  - [ ] Quản trị viên có trang riêng `evidences.html` để xem danh sách minh chứng chờ duyệt, bấm nút "Duyệt" (chuyển sang `APPROVED`) hoặc "Từ chối" (chuyển sang `REJECTED`).
* **Ước lượng:** 5 điểm
* **Sprint thực hiện:** Sprint 5 (Upload & Xét duyệt minh chứng)
* **Người nhận:** Backend & Frontend
* **Phụ thuộc:** Bảng `evidences`, `registrations`, thư viện `formidable`

---

## Bảng tổng hợp Story Points & Phân bổ Sprint

| Mã Story | Tên User Story | Vai trò | Điểm (SP) | Sprint | Phụ thuộc DB |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **F1.1** | Xem danh sách hoạt động và phân trang | Member/Guest | 3 | Sprint 3, 4 | `activities`, `registrations` |
| **F1.2** | Tìm kiếm hoạt động theo từ khóa | Member/Guest | 2 | Sprint 3, 4 | `activities` |
| **F2.1** | Xem trang chi tiết hoạt động | Member | 2 | Sprint 3, 4 | `activities` |
| **F2.2** | Đăng ký tham gia hoạt động | Member | 3 | Sprint 3, 4 | `registrations`, `activities` |
| **F2.3** | Hủy đăng ký tham gia hoạt động | Member | 2 | Sprint 3, 4 | `registrations` |
| **F3.1** | Quản trị viên tạo mới hoạt động | Admin | 5 | Sprint 3, 4, 5 | `activities`, `users` |
| **F3.2** | Quản trị viên sửa và xóa hoạt động | Admin | 3 | Sprint 3, 4 | `activities` |
| **F4.1** | Đăng nhập và cấp phát token JWT | All | 3 | Sprint 5 | `users` |
| **F4.2** | Phân quyền truy cập theo vai trò | All | 3 | Sprint 5 | `users` |
| **F5.1** | Nộp và duyệt minh chứng (ảnh/PDF) | Member & Admin | 5 | Sprint 5 | `evidences`, `registrations` |
| **TỔNG** | **10 User Stories** | | **31 điểm** | | |

---

## 3. Bản đồ ánh xạ CSDL từ User Stories (Database Mapping)

> **Căn cứ kết hợp:** Gợi ý cấu trúc CSDL của thầy tại Bước 3 (README.md dòng 263–267) kết hợp với các tiêu chí chấp nhận của 10 User Stories trên:

### Bảng 1: `activities` (Hoạt động CLB)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa nghiệp vụ | Xuất phát từ User Story |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Mã định danh duy nhất của hoạt động | [F2.1] lấy theo ID, [F3.2] sửa/xóa theo ID |
| `title` | VARCHAR(255) | NOT NULL | Tên sự kiện / hoạt động | [F1.1] hiển thị danh sách, [F1.2] tìm kiếm, [F3.1] tạo mới |
| `description` | TEXT | NULL | Mô tả chi tiết hoạt động | [F2.1] xem chi tiết, [F3.1] tạo mới |
| `location` | VARCHAR(255) | NOT NULL | Địa điểm tổ chức (Phòng máy, sân bóng...) | [F1.1] hiển thị danh sách, [F3.1] tạo mới |
| `start_at` | DATETIME | NOT NULL | Thời gian bắt đầu | [F1.1] hiển thị lịch sự kiện, [F3.1] kiểm tra validation |
| `end_at` | DATETIME | NOT NULL | Thời gian kết thúc | [F3.1] kiểm tra `end_at > start_at` |
| `capacity` | INT | NOT NULL | Số lượng chỗ tối đa cho phép đăng ký | [F1.1] hiển thị số chỗ, [F2.2] kiểm tra khi hết chỗ |
| `created_by` | INT | FOREIGN KEY → `users(id)` | ID của Admin tạo ra sự kiện này | [F3.1] ghi nhận ai tạo để quản lý |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Ngày giờ tạo bản ghi | Ghi nhận thời gian tạo trên hệ thống |

### Bảng 2: `registrations` (Đăng ký tham gia)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa nghiệp vụ | Xuất phát từ User Story |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Mã đăng ký | Định danh bản ghi |
| `activity_id` | INT | FOREIGN KEY → `activities(id)` | Hoạt động được đăng ký | [F2.2] đăng ký, [F2.3] hủy |
| `user_id` | INT | FOREIGN KEY → `users(id)` | Người đăng ký | [F2.2] ghi nhận thành viên tham gia |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Ngày giờ đăng ký | Ghi nhận thời gian đăng ký |
| *(Ràng buộc)* | | **UNIQUE(`activity_id`, `user_id`)** | **Chặn 1 người đăng ký 2 lần** | **[F2.2] Tiêu chí trả về mã lỗi 409 Conflict** |

### Bảng 3: `users` (Tài khoản người dùng)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa nghiệp vụ | Xuất phát từ User Story |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Mã người dùng | Định danh người dùng |
| `email` | VARCHAR(191) | UNIQUE, NOT NULL | Email đăng nhập | [F4.1] Đăng nhập bằng email |
| `full_name` | VARCHAR(100) | NOT NULL | Họ và tên | Hiển thị tên trên giao diện |
| `password_hash`| VARCHAR(255) | NOT NULL | Mật khẩu đã băm (Bcrypt) | [F4.1] Xác thực mật khẩu an toàn |
| `role` | ENUM('ADMIN', 'MEMBER') | DEFAULT 'MEMBER' | Vai trò người dùng | [F4.2] Phân quyền chức năng |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Ngày tạo tài khoản | Ghi nhận hệ thống |

### Bảng 4: `evidences` (Minh chứng tham gia)
| Tên cột | Kiểu dữ liệu | Ràng buộc | Ý nghĩa nghiệp vụ | Xuất phát từ User Story |
| :--- | :--- | :--- | :--- | :--- |
| `id` | INT | PRIMARY KEY, AUTO_INCREMENT | Mã minh chứng | Định danh |
| `registration_id`| INT | FOREIGN KEY → `registrations(id)`| Liên kết tới đăng ký tham gia | [F5.1] Nộp minh chứng cho hoạt động đã tham gia |
| `file_path` | VARCHAR(255) | NOT NULL | Đường dẫn file lưu trên server (`uploads/...`)| [F5.1] Lưu file ảnh hoặc PDF |
| `status` | ENUM('PENDING', 'APPROVED', 'REJECTED') | DEFAULT 'PENDING' | Trạng thái xét duyệt | [F5.1] Chờ duyệt / Đã duyệt / Từ chối |
| `reviewed_by` | INT | NULL, FOREIGN KEY → `users(id)` | Admin nào đã duyệt | [F5.1] Người xét duyệt |
| `reviewed_at` | DATETIME | NULL | Thời gian duyệt | [F5.1] Ghi nhận thời điểm duyệt |

