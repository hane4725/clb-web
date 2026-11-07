# UHL Active API Documentation

## 1. Giới thiệu

Tài liệu mô tả các API của hệ thống quản lý hoạt động câu lạc bộ UHL Active, phục vụ quá trình kiểm thử bằng Bruno và tích hợp với Frontend.

**Base URL:**

```text
http://localhost:3000
```

## 2. Danh sách API

| STT | Method | Endpoint | Chức năng |
|---|---|---|---|
| 1 | GET | `/api/health` | Kiểm tra trạng thái server |
| 2 | GET | `/api/activities` | Lấy danh sách hoạt động |
| 3 | GET | `/api/activities/:id` | Lấy chi tiết hoạt động |
| 4 | POST | `/api/activities` | Tạo hoạt động |
| 5 | PATCH | `/api/activities/:id` | Cập nhật hoạt động |
| 6 | DELETE | `/api/activities/:id` | Xóa hoạt động |
| 7 | POST | `/api/activities/:id/registrations` | Đăng ký tham gia |
| 8 | DELETE | `/api/activities/:id/registrations/me` | Hủy đăng ký |
| 9 | GET | `/api/activities/:id/registrations` | Lấy danh sách người đăng ký |
| 10 | GET | `/api/registrations/me` | Lấy danh sách hoạt động cá nhân đã đăng ký |

### 2.1. Request Headers

Các request được kiểm thử bằng Bruno với cấu hình No Auth, chưa sử dụng cơ chế xác thực thông qua Authorization.

| Header | Giá trị | Áp dụng |
|---|---|---|
| Content-Type | `application/json` | Request có gửi JSON Body |
| X-User-Id | `1` | Đăng ký, hủy đăng ký và lấy danh sách đăng ký cá nhân |
| Authorization | Không sử dụng | Các request hiện tại |

**Lưu ý:**

- `X-User-Id` được Backend sử dụng để xác định người dùng thực hiện thao tác.
- Nếu không truyền `X-User-Id`, Backend mặc định sử dụng User ID là `1` đối với các chức năng đăng ký, hủy đăng ký và lấy danh sách đăng ký cá nhân.
- `X-User-Id` hiện chỉ phục vụ việc xác định người dùng trong quá trình xử lý API, không thay thế cơ chế xác thực và phân quyền.
- Đối với request GET, DELETE và POST không có Body, không cần khai báo Content-Type nếu không gửi dữ liệu.

### 2.2. Quy ước tham số

- `:id`: ID của hoạt động cần thao tác.
- `page`: Số trang cần lấy.
- `limit`: Số lượng hoạt động trên mỗi trang.
- `q`: Từ khóa tìm kiếm hoạt động.
- `X-User-Id`: ID của người dùng thực hiện thao tác.
- Các trường thời gian sử dụng định dạng ngày giờ ISO 8601.

### 2.3. Các mã HTTP

| HTTP Status | Ý nghĩa | Trường hợp áp dụng |
|---|---|---|
| 200 OK | Request thành công | Lấy dữ liệu, cập nhật, xóa hoặc thao tác thành công nếu API trả mã này |
| 201 Created | Tạo tài nguyên thành công | Tạo hoạt động hoặc đăng ký tham gia thành công |
| 400 Bad Request | Dữ liệu gửi lên không hợp lệ hoặc thiếu trường bắt buộc | Ví dụ: thiếu thông tin khi tạo hoạt động |
| 404 Not Found | Không tìm thấy tài nguyên | Ví dụ: ID hoạt động không tồn tại hoặc người dùng chưa đăng ký |
| 409 Conflict | Dữ liệu bị xung đột | Ví dụ: đăng ký trùng lặp hoặc hoạt động hết chỗ |
| 500 Internal Server Error | Lỗi xử lý phía server | Lỗi phát sinh trong quá trình xử lý request |

**Lưu ý:** Mã HTTP thực tế của từng trường hợp cần được đối chiếu với mã nguồn Backend và kết quả kiểm thử bằng Bruno.

---

## 3. Chi tiết các API

### 3.1. Health Check API

**Description:** Kiểm tra trạng thái hoạt động của server UHL Active API.

- **Method:** `GET`
- **Endpoint:** `/api/health`
- **Header:** Không yêu cầu.
- **Request Parameters:** Không có.
- **Request Body:** Không có.

**Success Response:**

```json
{
  "status": "ok",
  "service": "UHL Active API"
}
```

**HTTP Status:** Mã thành công thực tế cần đối chiếu trên Bruno.

### 3.2. Get Activities API

**Description:** Lấy danh sách các hoạt động của câu lạc bộ. Hỗ trợ phân trang và tìm kiếm theo từ khóa.

- **Method:** `GET`
- **Endpoint:** `/api/activities`
- **Header:** Không yêu cầu.

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| page | number | Số trang cần lấy |
| limit | number | Số lượng hoạt động trên mỗi trang |
| q | string | Từ khóa tìm kiếm hoạt động |

**Ví dụ Request:**

```text
GET /api/activities?page=1&limit=10
```

**Request Body:** Không có.

**Success Response:**

```json
{
  "data": [
    {
      "id": 12,
      "title": "Lễ vinh danh thủ lĩnh CLB và Dạ hội chào năm mới 2027",
      "description": "Tổng kết hoạt động phong trào sinh viên năm 2026 và trao bằng khen cho các cá nhân xuất sắc.",
      "location": "Sảnh chính Tòa nhà A",
      "start_at": "2026-12-30T11:30:00.000Z",
      "end_at": "2026-12-30T15:00:00.000Z",
      "capacity": 120,
      "created_by": 1,
      "created_at": "2026-10-20T08:00:00.000Z",
      "registered_count": 0,
      "remaining_seats": 120
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 12,
    "totalPages": 2
  }
}
```

**HTTP Status:** Cần xác nhận mã thành công và các mã lỗi thực tế bằng Bruno.

### 3.3. Get Activity Detail API

**Description:** Lấy thông tin chi tiết của một hoạt động theo ID.

- **Method:** `GET`
- **Endpoint:** `/api/activities/:id`
- **Header:** Không yêu cầu.

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần xem |

**Ví dụ Request:**

```text
GET /api/activities/12
```

**Request Body:** Không có.

**Success Response:**

```json
{
  "id": 12,
  "title": "Lễ vinh danh thủ lĩnh CLB và Dạ hội chào năm mới 2027",
  "description": "Tổng kết hoạt động phong trào sinh viên năm 2026 và trao bằng khen cho các cá nhân xuất sắc.",
  "location": "Sảnh chính Tòa nhà A",
  "start_at": "2026-12-30T11:30:00.000Z",
  "end_at": "2026-12-30T15:00:00.000Z",
  "capacity": 120,
  "created_by": 1,
  "created_at": "2026-10-20T08:00:00.000Z",
  "registered_count": 0,
  "remaining_seats": 120
}
```

**HTTP Status:** Cần xác nhận mã thành công và mã lỗi khi ID không tồn tại.

### 3.4. Create Activity API

**Description:** Tạo một hoạt động mới cho câu lạc bộ UHL Active.

- **Method:** `POST`
- **Endpoint:** `/api/activities`
- **Header:** `Content-Type: application/json`
- **Request Parameters:** Không có.

**Request Body:**

| Parameter | Type | Description |
|---|---|---|
| title | string | Tên hoạt động |
| description | string | Mô tả hoạt động |
| location | string | Địa điểm tổ chức |
| start_at | string | Thời gian bắt đầu |
| end_at | string | Thời gian kết thúc |
| capacity | number | Số lượng người tham gia tối đa |

**Ví dụ Request Body:**

```json
{
  "title": "Workshop lập trình C++",
  "description": "Buổi thực hành lập trình C++ dành cho thành viên CLB.",
  "location": "Phòng máy PM01",
  "start_at": "2026-12-15T08:00:00",
  "end_at": "2026-12-15T11:00:00",
  "capacity": 30
}
```

**Success Response:**

```json
{
  "id": 13,
  "message": "Tạo hoạt động thành công"
}
```

**Error Response đã ghi nhận:**

```json
{
  "error": "Vui lòng điền đầy đủ các trường bắt buộc"
}
```

Response lỗi trên được ghi nhận khi gửi request thiếu Body. Mã HTTP cần xác nhận trực tiếp trên Bruno.

### 3.5. Update Activity API

**Description:** Cập nhật thông tin của một hoạt động đã tồn tại.

- **Method:** `PATCH`
- **Endpoint:** `/api/activities/:id`
- **Header:** `Content-Type: application/json`

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần cập nhật |

**Request Body:**

| Parameter | Type | Description |
|---|---|---|
| title | string | Tên hoạt động |
| description | string | Mô tả hoạt động |
| location | string | Địa điểm tổ chức |
| start_at | string | Thời gian bắt đầu |
| end_at | string | Thời gian kết thúc |
| capacity | number | Số lượng người tham gia tối đa |

**Ví dụ Request Body:**

```json
{
  "title": "Workshop lập trình C++ nâng cao",
  "description": "Buổi thực hành lập trình C++ dành cho thành viên CLB UHL Active.",
  "location": "Phòng máy PM02",
  "start_at": "2026-12-15T08:00:00",
  "end_at": "2026-12-15T11:00:00",
  "capacity": 35
}
```

**Success Response:**

```json
{
  "message": "Cập nhật hoạt động thành công"
}
```

**HTTP Status:** Cần xác nhận mã thành công và mã lỗi khi ID không tồn tại hoặc dữ liệu không hợp lệ.

### 3.6. Delete Activity API

**Description:** Xóa một hoạt động đã tồn tại trong hệ thống.

- **Method:** `DELETE`
- **Endpoint:** `/api/activities/:id`
- **Header:** Không yêu cầu.

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần xóa |

**Request Body:** Không có.

**Success Response:**

```json
{
  "message": "Xoá hoạt động thành công"
}
```

**HTTP Status:** Cần xác nhận mã thành công và mã lỗi khi ID không tồn tại.

### 3.7. Register Activity API

**Description:** Đăng ký tham gia một hoạt động của câu lạc bộ UHL Active.

- **Method:** `POST`
- **Endpoint:** `/api/activities/:id/registrations`
- **Header:**
  - `X-User-Id: 1`
- **Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần đăng ký |

**Request Body:** Không có.

**Success Response (201 Created):**

```json
{
  "message": "Đăng ký tham gia thành công",
  "registration_id": 17
}
```

**Các trường hợp lỗi theo mã nguồn Backend:**

- Hoạt động không tồn tại: `404 Not Found`.
- Hoạt động đã hết chỗ: `409 Conflict`.
- Người dùng đã đăng ký hoạt động: `409 Conflict`.
- Lỗi máy chủ: `500 Internal Server Error`.

### 3.8. Cancel Registration API

**Description:** Hủy đăng ký tham gia một hoạt động của người dùng hiện tại.

- **Method:** `DELETE`
- **Endpoint:** `/api/activities/:id/registrations/me`
- **Header:**
  - `X-User-Id: 1`

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần hủy đăng ký |

**Request Body:** Không có.

**Success Response (200 OK):**

```json
{
  "message": "Huỷ đăng ký thành công"
}
```

**Các trường hợp lỗi theo mã nguồn Backend:**

- Người dùng chưa đăng ký hoạt động: `404 Not Found`.
- Lỗi máy chủ: `500 Internal Server Error`.

### 3.9. Get Activity Registrations API

**Description:** Lấy danh sách thành viên đã đăng ký tham gia một hoạt động.

- **Method:** `GET`
- **Endpoint:** `/api/activities/:id/registrations`
- **Header:** Không yêu cầu.

**Request Parameters:**

| Parameter | Type | Description |
|---|---|---|
| id | number | ID của hoạt động cần xem danh sách đăng ký |

**Ví dụ Request:**

```text
GET /api/activities/12/registrations
```

**Request Body:** Không có.

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": 17,
      "created_at": "2026-11-05T04:22:36.000Z",
      "user_id": 1,
      "full_name": "Vũ Duy Sơn (Giảng viên / Admin)",
      "email": "admin@clb.test"
    }
  ]
}
```

**HTTP Status:** Cần xác nhận mã lỗi thực tế bằng Bruno.

### 3.10. Get My Registrations API

**Description:** Lấy danh sách các hoạt động mà người dùng hiện tại đã đăng ký tham gia.

- **Method:** `GET`
- **Endpoint:** `/api/registrations/me`
- **Header:**
  - `X-User-Id: 1` (mặc định là `1` nếu không truyền).
- **Request Parameters:** Không có.
- **Request Body:** Không có.

**Ví dụ Request:**

```text
GET /api/registrations/me
```

**Success Response (200 OK):**

```json
{
  "data": [
    {
      "id": 12,
      "title": "Lễ vinh danh thủ lĩnh CLB",
      "registration_id": 17,
      "registered_at": "2026-11-05T04:22:36.000Z"
    }
  ]
}
```

**Giải thích dữ liệu trả về:**

- `id`: ID của hoạt động.
- `title`: Tên hoạt động.
- `registration_id`: ID của bản ghi đăng ký.
- `registered_at`: Thời gian người dùng đăng ký hoạt động.

Ngoài các trường minh họa trên, mỗi phần tử còn có các trường khác của bảng `activities` do truy vấn sử dụng `SELECT a.*`.

**Error Response (500 Internal Server Error):**

```json
{
  "error": "Lỗi máy chủ khi lấy danh sách đăng ký cá nhân: ..."
}
```

**Lưu ý:** Dữ liệu thực tế phụ thuộc vào cơ sở dữ liệu và các trường hiện có trong bảng `activities`.

---

## 4. Hướng dẫn kiểm thử bằng Bruno

### 4.1. Cấu hình môi trường

| Variable | Value |
|---|---|
| baseUrl | `http://localhost:3000` |

Các request sử dụng URL dạng:

```text
{{baseUrl}}/api/health
```

### 4.2. Quy trình kiểm thử

1. Khởi động Backend bằng lệnh `npm run dev`.
2. Mở collection UHL Active trong Bruno.
3. Kiểm tra biến môi trường `baseUrl`.
4. Chọn request cần kiểm thử.
5. Kiểm tra Header và Request Body nếu có.
6. Nhấn Send.
7. Kiểm tra Status Code và Response Body.
8. Ghi nhận kết quả kiểm thử thực tế.

### 4.3. Các nhóm trường hợp kiểm thử

| Nhóm | Nội dung |
|---|---|
| Thành công | Lấy danh sách, xem chi tiết, tạo, cập nhật, xóa, đăng ký, hủy đăng ký và lấy danh sách hoạt động cá nhân |
| Thiếu dữ liệu | Tạo hoạt động khi thiếu trường bắt buộc |
| Dữ liệu không hợp lệ | ID hoặc dữ liệu đầu vào sai |
| Không tìm thấy | Truy cập hoạt động không tồn tại |
| Trùng lặp | Đăng ký nhiều lần cùng một hoạt động |
| Hết chỗ | Đăng ký hoạt động đã đủ số lượng người tham gia |
| Chưa đăng ký | Hủy đăng ký khi người dùng chưa đăng ký hoạt động |
| Lỗi server | Kiểm tra trường hợp server phát sinh lỗi |

---

## 5. Ghi chú

- Các API trong tài liệu được sử dụng để kiểm thử bằng Bruno.
- Base URL trong môi trường phát triển là `http://localhost:3000`.
- Các giá trị ID trong ví dụ là dữ liệu minh họa hoặc dữ liệu được sử dụng trong quá trình kiểm thử.
- Response thành công và lỗi cần được đối chiếu với kết quả thực tế từ Backend.
- Các mã HTTP chưa được xác minh cần được kiểm thử bổ sung trước khi xem là kết quả nghiệm thu.
- Header `X-User-Id` được sử dụng trong các chức năng đăng ký, hủy đăng ký và lấy danh sách đăng ký cá nhân.
- Tài liệu được sử dụng làm căn cứ tham khảo khi Frontend tích hợp API trong Tuần 4.
