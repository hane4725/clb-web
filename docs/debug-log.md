# Báo cáo Nhật ký Săn lỗi Mạng (Debug Log - Tuần 1)

> **Dự án:** Website Quản lý Hoạt động CLB  
> **Người thực hiện:** Nhóm phát triển (PM & Dev Team)  
> **Phương pháp áp dụng:** Quy trình Debug mạng 5 bước chuẩn của đề cương:
> 1. Máy có thông mạng không? (`ping`)
> 2. Tên miền ra đúng IP không? (`nslookup`, xem file `hosts`)
> 3. Dịch vụ có nghe đúng cổng, đúng địa chỉ không? (`ss -tlnp` trên Linux, `netstat -ano` trên Windows)
> 4. Tường lửa có chặn không? (`sudo ufw status`, Windows Firewall)
> 5. Ứng dụng trả về gì? (`curl -v`, tab Network trong DevTools, log `journalctl -u nginx`, `tail -f`)

---

## Tình huống 1: Dịch vụ Nginx bị dừng (Service Inactive / Down)

### 1. Hiện tượng
- Người dùng từ máy tính Windows truy cập vào `http://192.168.1.109` qua trình duyệt Chrome/Edge bị báo lỗi ngay lập tức: **`ERR_CONNECTION_REFUSED`** (Kết nối bị từ chối).
- Không thể tải được trang "Sắp ra mắt" của CLB.

### 2. Các lệnh đã dùng để debug
- **Bước 1 (Kiểm tra thông mạng):**  
  Trên Windows PowerShell: `ping 192.168.1.109`  
  ➔ *Kết quả:* Vẫn phản hồi bình thường (`Reply from 192.168.1.109, time < 1ms`). Chứng tỏ đường truyền mạng vật lý và máy ảo Ubuntu vẫn đang hoạt động tốt.
- **Bước 3 (Kiểm tra cổng lắng nghe):**  
  Trên terminal Ubuntu: `sudo ss -tlnp | grep 80`  
  ➔ *Kết quả:* Không in ra bất kỳ kết quả nào (không có tiến trình nào đang lắng nghe tại cổng 80).
- **Bước 5 (Kiểm tra trạng thái dịch vụ):**  
  Trên terminal Ubuntu: `sudo systemctl status nginx`  
  ➔ *Kết quả:* Báo trạng thái `Active: inactive (dead)` kèm log thông báo `Stopped nginx.service`.

### 3. Nguyên nhân
- Dịch vụ Web Server Nginx trên máy ảo Ubuntu đã bị dừng (`sudo systemctl stop nginx`), dẫn đến cổng 80 bị đóng, hệ điều hành gửi cờ từ chối gói tin kết nối HTTP từ trình duyệt.

### 4. Cách sửa
- Trên terminal Ubuntu, khởi động lại dịch vụ Nginx:
  ```bash
  sudo systemctl start nginx
  ```
- Kiểm tra lại bằng lệnh `sudo ss -tlnp | grep 80` thấy xuất hiện tiến trình Nginx ở trạng thái `LISTEN`.
- Mở lại trình duyệt trên Windows tải lại trang ➔ Trang web hiển thị thành công mã `200 OK`.

---

## Tình huống 2: Cổng Nginx bị đổi từ 80 sang cổng 8080 (Port Mismatch)

### 1. Hiện tượng
- Mở trình duyệt gõ địa chỉ mặc định `http://192.168.1.109` thì bị từ chối kết nối (`ERR_CONNECTION_REFUSED`).
- Trong khi đó, dịch vụ SSH cổng 22 (`ssh hane@192.168.1.109`) vẫn kết nối quản trị bình thường.

### 2. Các lệnh đã dùng để debug
- **Bước 1 (Thông mạng):** `ping 192.168.1.109` ➔ Thông mạng bình thường.
- **Bước 5 (Kiểm tra dịch vụ):** `sudo systemctl status nginx` ➔ Nginx vẫn báo màu xanh `Active: active (running)`.
- **Bước 3 (Kiểm tra cổng dịch vụ):**  
  Trên terminal Ubuntu: `sudo ss -tlnp`  
  ➔ *Kết quả:* Phát hiện tiến trình `nginx` (PID 2858, 2859, 2860) không lắng nghe ở cổng `:80` mà đang mở ở cổng **`:8080`** (`0.0.0.0:8080` và `[::]:8080`).
- **Thử nghiệm đối chứng:**  
  Mở trình duyệt Windows gõ tường minh số cổng: `http://192.168.1.109:8080` ➔ Website lại hiển thị bình thường.

### 3. Nguyên nhân
- File cấu hình site mặc định của Nginx (`/etc/nginx/sites-available/default`) bị sửa nhầm chỉ thị `listen 80` thành `listen 8080`. Trong khi đó, trình duyệt khi gõ `http://...` mặc định luôn tìm đến cổng 80, gây ra hiện tượng lệch cổng (Port Mismatch).

### 4. Cách sửa
- Mở file cấu hình trên Ubuntu:
  ```bash
  sudo nano /etc/nginx/sites-available/default
  ```
- Sửa lại 2 dòng `listen 8080` thành:
  ```text
  listen 80 default_server;
  listen [::]:80 default_server;
  ```
- Lưu file và khởi động lại Nginx:
  ```bash
  sudo systemctl restart nginx
  ```
- Truy cập lại `http://192.168.1.109` không cần gõ `:8080` ➔ Kết nối thành công.

---

## Tình huống 3: Tường lửa Ubuntu (UFW) chặn cổng 80 (Firewall Drop)

### 1. Hiện tượng
- Người dùng vào `http://192.168.1.109`, trình duyệt **xoay tròn chờ đợi rất lâu (20–30 giây)** và sau đó báo lỗi: **`ERR_CONNECTION_TIMED_OUT`** (Hết thời gian chờ kết nối).
- Hiện tượng này khác hoàn toàn với Tình huống 1 và 2 (bị từ chối ngay lập tức).

### 2. Các lệnh đã dùng để debug
- **Bước 1 (Thông mạng):** `ping 192.168.1.109` ➔ Vẫn nhận gói tin ICMP bình thường.
- **Bước 3 (Kiểm tra cổng):** `sudo ss -tlnp | grep 80` ➔ Nginx vẫn đang `LISTEN` bình thường trên `0.0.0.0:80`.
- **Bước 4 (Kiểm tra tường lửa):**  
  Trên terminal Ubuntu gõ: `sudo ufw status`  
  ➔ *Kết quả:* Tường lửa UFW đang hoạt động (`Status: active`) và có dòng luật chặn:
  ```text
  80/tcp                     DENY        Anywhere
  ```
- **Bước 5 (Kiểm tra phản hồi gói tin):**  
  Trên Windows PowerShell: `curl -v http://192.168.1.109` ➔ Bị treo vô hạn vì gói tin TCP SYN bị tường lửa âm thầm vứt bỏ (Drop packet).

### 3. Nguyên nhân
- Tường lửa `ufw` trên Ubuntu được cấu hình một luật chặn toàn bộ lưu lượng TCP đi vào cổng 80 (`DENY 80/tcp`), dù Nginx vẫn đang mở cổng.

### 4. Cách sửa
- Trên terminal Ubuntu, xóa luật chặn và cho phép lưu lượng qua cổng 80:
  ```bash
  sudo ufw delete deny 80/tcp
  sudo ufw allow 80/tcp
  sudo ufw reload
  ```
- Kiểm tra lại: `sudo ufw status` thấy dòng `80/tcp ALLOW Anywhere`.
- Tải lại trang web từ Windows ➔ Trang web phản hồi ngay lập tức trong vài mili-giây.

---

## Tình huống 4: Nginx chỉ lắng nghe trên Localhost 127.0.0.1 (Loopback Binding)

### 1. Hiện tượng
- Đứng trên máy tính Windows thật hoặc điện thoại gõ `http://192.168.1.109` (hoặc `http://clb.test`) thì bị từ chối kết nối (`ERR_CONNECTION_REFUSED`).
- Nhưng khi đứng bên trong máy ảo Ubuntu chạy lệnh kiểm tra nội bộ `curl -I http://localhost` thì máy ảo vẫn trả về mã `HTTP/1.1 200 OK` bình thường.

### 2. Các lệnh đã dùng để debug
- **Bước 1 (Thông mạng):** `ping 192.168.1.109` ➔ Thông suốt.
- **Bước 4 (Tường lửa):** `sudo ufw status` ➔ Cổng 80 đã ALLOW, không bị chặn.
- **Bước 3 (Kiểm tra địa chỉ IP lắng nghe):**  
  Trên terminal Ubuntu: `sudo ss -tlnp | grep 80`  
  ➔ *Kết quả:* Cột Local Address hiển thị:
  ```text
  127.0.0.1:80
  ```
  *(Thay vì `0.0.0.0:80` như thông thường).*

### 3. Nguyên nhân
- File cấu hình Nginx thiết lập `listen 127.0.0.1:80 default_server;` và tắt IPv6 (`#listen [::]:80`).
- Giao thức mạng quy định card ảo Loopback `127.0.0.1` chỉ tiếp nhận gói tin nội bộ từ chính máy ảo Ubuntu sinh ra. Mọi gói tin từ máy Windows gửi vào card mạng vật lý `192.168.1.109` đều bị hệ điều hành từ chối ở tầng mạng.

### 4. Cách sửa
- Mở file cấu hình Nginx:
  ```bash
  sudo nano /etc/nginx/sites-available/default
  ```
- Sửa chỉ thị `listen 127.0.0.1:80 default_server;` thành `listen 80 default_server;` (tương đương `0.0.0.0:80`).
- Bỏ dấu `#` ở dòng IPv6: `listen [::]:80 default_server;`.
- Khởi động lại dịch vụ:
  ```bash
  sudo systemctl restart nginx
  ```
- Kiểm tra lại bằng `sudo ss -tlnp | grep 80` thấy Local Address chuyển thành `0.0.0.0:80` và `[::]:80`.
- Mở lại trang web từ trình duyệt máy Windows ➔ Website truy cập thành công!

---

## Tình huống bổ sung (Bonus): Lỗi cấu hình file hosts trên máy Windows

### 1. Hiện tượng
- Gõ địa chỉ IP `http://192.168.1.109` thì vào được trang web, nhưng gõ tên miền `http://clb.test` thì trình duyệt báo lỗi và lệnh `ping clb.test` báo `Ping request could not find host clb.test`.

### 2. Các lệnh đã dùng để debug
- **Bước 2 (Kiểm tra phân giải tên miền):**  
  Trên Windows Command Prompt: `ping clb.test` hoặc `nslookup clb.test` ➔ Báo không thể phân giải tên miền.
- Kiểm tra file danh bạ cục bộ tại: `C:\Windows\System32\drivers\etc\hosts`.

### 3. Nguyên nhân
- Dòng cấu hình ánh xạ IP trong file `hosts` bị dính dấu thăng `#` ở đầu dòng (`# 192.168.1.109 clb.test`), khiến Windows coi đây là dòng chú thích (comment) và bỏ qua, không dịch `clb.test` ra IP máy ảo.

### 4. Cách sửa
- Mở Notepad bằng quyền Administrator, mở file `C:\Windows\System32\drivers\etc\hosts`.
- Xóa dấu `#` ở đầu dòng, để lại:
  ```text
  192.168.1.109    clb.test
  ```
- Lưu lại file (`Ctrl + S`).
- Mở lại CMD gõ `ping clb.test` ➔ Phản hồi thành công từ `192.168.1.109`. Mở trình duyệt gõ `http://clb.test` truy cập web mượt mà.
