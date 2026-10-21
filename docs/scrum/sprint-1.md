# Sprint 1 (từ 12/10/2026 đến 18/10/2026)

## 1. Sprint Planning (ngày 12/10/2026, 45 phút, có mặt: .../...)

- **Sprint goal:** Trang "sắp ra mắt" của CLB chạy trên máy chủ Ubuntu của nhóm, mở được từ máy Windows và điện thoại. Mỗi thành viên tự tìm ra nguyên nhân khi "không vào được web".
- **Vai trò tuần này:**
  - PM: @hane
  - Backend: [Điền tên thành viên phụ trách Backend]
  - Frontend: [Điền tên thành viên phụ trách Frontend]
  - Kiểm thử: [Điền tên thành viên phụ trách Kiểm thử]
- **Cam kết:** Hoàn thành toàn bộ mục tiêu F0 và hạ tầng lab mạng (Ước lượng: 14 giờ/người; Thực tế ghi nhận: 16 giờ do phát sinh xử lý các sự cố gỡ lỗi mạng).

| Issue / Nhiệm vụ tuần 1 | Điểm | Người nhận | Trạng thái |
| :--- | :---: | :--- | :---: |
| #01 Cài VM Ubuntu Server 24.04 (Bridged, IP tĩnh 192.168.1.109) | - | [100% thành viên] | Done |
| #02 Cấu hình SSH Key, tắt mật khẩu (PasswordAuthentication no) | - | [100% thành viên] | Done |
| #03 Viết HTML/CSS trang "Sắp ra mắt" (public/index.html, style.css) | - | [Frontend] | Done |
| #04 Cài Nginx, deploy trang web lên VM bằng lệnh scp | - | [100% thành viên] | Done |
| #05 Thử nghiệm bind 127.0.0.1 vs 0.0.0.0, mở Windows Firewall | - | [100% thành viên] | Done |
| #06 Săn lỗi mạng và hoàn thiện docs/debug-log.md (≥ 4 lỗi) | - | [Cả nhóm] | Done |
| #07 Vẽ sơ đồ mạng dự án đưa vào README.md | - | [PM @hane] | Done |

---

## 2. Burndown (tiến độ còn lại cuối mỗi ngày)

| T2 | T3 | T4 | T5 | T6 | T7 | CN |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [ ... ] | [ ... ] | [ ... ] | [ ... ] | [ ... ] | [ ... ] | 0 (Done) |

---

## 3. Sprint Review (ngày 18/10/2026, 30 phút)

- **Đã demo:**
  - 100% thành viên SSH vào VM bằng khoá, đăng nhập mật khẩu đã tắt thành công (`Permission denied (publickey)`).
  - Trang "sắp ra mắt" mở được từ ≥ 2 thiết bị khác nhau (máy tính Windows `http://clb.test` và điện thoại di động).
  - Thử nghiệm và giải thích được sự khác nhau giữa bind `127.0.0.1` vs `0.0.0.0`.
  - Trình bày 5 tình huống lỗi mạng thực tế trong `docs/debug-log.md`.
  - Sơ đồ mạng hệ thống đã hiển thị trong `README.md`.
- **Story đạt DoD:** Đạt 5/5 tiêu chí đầu ra của Sprint 1
- **Story trả về backlog và lý do:** Không có
- **Nhận xét của Product Owner:**
  - [Ghi nhận xét của Giảng viên hoặc Product Owner sau buổi demo vào đây...]

---

## 4. Retrospective

- **Nên giữ:**
  - [Điền những điều nhóm làm tốt cần tiếp tục phát huy...]
- **Nên bỏ:**
  - [Điền những thói quen, cách làm chưa hiệu quả cần loại bỏ...]
- **Nên thử:**
  - [Điền những công cụ, phương pháp mới muốn áp dụng ở sprint sau...]
- **Hành động cải tiến sprint sau (người phụ trách):**
  - [Hành động cụ thể 1] - Phụ trách: [Tên người phụ trách]
  - [Hành động cụ thể 2] - Phụ trách: [Tên người phụ trách]
- **Hành động của sprint trước đã làm chưa:**
  - Sprint 1 là sprint khởi đầu, chưa có hành động từ sprint trước.
