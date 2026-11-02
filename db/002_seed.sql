-- ==============================================================================
-- File: db/002_seed.sql
-- Mục đích: Dữ liệu mẫu ban đầu (≥ 20 users, ≥ 10 activities)
-- Căn cứ: Mục 7 (DoD Tuần 2, dòng 332) & docs/yeu-cau.md
-- Mật khẩu mặc định của mọi tài khoản: 123456 (đã băm bằng bcrypt)
-- Chuỗi băm bcrypt của '123456': $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
-- ==============================================================================

USE `clb`;

-- 1. NẠP TÀI KHOẢN NGƯỜI DÙNG (25 users: 2 ADMIN + 23 MEMBER)
INSERT INTO `users` (`id`, `email`, `full_name`, `password_hash`, `role`, `created_at`) VALUES
-- Quản trị viên (ADMIN)
(1, 'admin@clb.test', 'Vũ Duy Sơn (Giảng viên / Admin)', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', '2026-10-01 08:00:00'),
(2, 'hane@clb.test', 'Nguyễn Đức Hane (PM)', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', '2026-10-01 08:30:00'),

-- Thành viên cốt cán nhóm dự án (MEMBER)
(3, 'duc.be@clb.test', 'Trần Minh Đức (Backend Lead)', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-01 09:00:00'),
(4, 'lan.fe@clb.test', 'Lê Thị Lan (Frontend Lead)', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-01 09:15:00'),
(5, 'baoanh.test@clb.test', 'Phạm Bảo Anh (Tester & Support)', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-01 09:30:00'),

-- 20 Thành viên câu lạc bộ (MEMBER)
(6, 'sinhvien01@clb.test', 'Nguyễn Văn An', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:00:00'),
(7, 'sinhvien02@clb.test', 'Trần Thị Bình', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:05:00'),
(8, 'sinhvien03@clb.test', 'Lê Hoàng Cường', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:10:00'),
(9, 'sinhvien04@clb.test', 'Phạm Thu Dung', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:15:00'),
(10, 'sinhvien05@clb.test', 'Hoàng Minh Đức', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:20:00'),
(11, 'sinhvien06@clb.test', 'Vũ Hải Yến', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:25:00'),
(12, 'sinhvien07@clb.test', 'Đặng Quốc Huy', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:30:00'),
(13, 'sinhvien08@clb.test', 'Bùi Kim Ngân', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:35:00'),
(14, 'sinhvien09@clb.test', 'Đỗ Thành Long', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:40:00'),
(15, 'sinhvien10@clb.test', 'Ngô Phương Mai', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:45:00'),
(16, 'sinhvien11@clb.test', 'Dương Tuấn Kiệt', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:50:00'),
(17, 'sinhvien12@clb.test', 'Lý Ngọc Hân', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 10:55:00'),
(18, 'sinhvien13@clb.test', 'Tạ Minh Khang', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:00:00'),
(19, 'sinhvien14@clb.test', 'Phan Thanh Thảo', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:05:00'),
(20, 'sinhvien15@clb.test', 'Mai Văn Nam', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:10:00'),
(21, 'sinhvien16@clb.test', 'Trịnh Bích Ngọc', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:15:00'),
(22, 'sinhvien17@clb.test', 'Hồ Quang Dũng', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:20:00'),
(23, 'sinhvien18@clb.test', 'Lưu Hồng Ánh', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:25:00'),
(24, 'sinhvien19@clb.test', 'Cao Văn Tiến', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:30:00'),
(25, 'sinhvien20@clb.test', 'Đoàn Mai Linh', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'MEMBER', '2026-10-02 11:35:00');

-- 2. NẠP HOẠT ĐỘNG CLB (12 activities: đủ thể loại, phục vụ test tìm kiếm & hết chỗ)
INSERT INTO `activities` (`id`, `title`, `description`, `location`, `start_at`, `end_at`, `capacity`, `created_by`, `created_at`) VALUES
-- Hoạt động 1: Chứa từ khóa 'Hiến máu' (Dùng test tính năng tìm kiếm F1.2 & UAT-01)
(1, 'Hiến máu tình nguyện - Giọt hồng tri ân 2026', 'Ngày hội hiến máu nhân đạo thường niên của sinh viên toàn trường UHL, mỗi giọt máu cho đi một cuộc đời ở lại.', 'Hội trường Tòa nhà A', '2026-11-05 07:30:00', '2026-11-05 11:30:00', 50, 1, '2026-10-10 08:00:00'),

-- Hoạt động 2: Hội thảo công nghệ
(2, 'Hội thảo: Lập trình Web Fullstack với Node.js thuần', 'Chia sẻ kinh nghiệm xây dựng ứng dụng không dùng framework, hiểu sâu về HTTP protocol và RESTful API.', 'Phòng Lab 402 - Nhà C', '2026-11-08 14:00:00', '2026-11-08 17:00:00', 30, 2, '2026-10-10 09:00:00'),

-- Hoạt động 3: Thể thao
(3, 'Giải bóng đá mini UHL Active Cup 2026', 'Giải bóng đá nam phong trào chào mừng ngày nhà giáo Việt Nam 20/11.', 'Sân bóng cỏ nhân tạo khu Thể Thao', '2026-11-12 08:00:00', '2026-11-15 17:00:00', 20, 1, '2026-10-11 10:00:00'),

-- Hoạt động 4: Tình nguyện xanh
(4, 'Chiến dịch Chủ nhật xanh: Dọn sạch khuôn viên ký túc xá', 'Chung tay bảo vệ môi trường, thu gom rác thải nhựa và trồng cây xanh khu vực khuôn viên trường.', 'Cổng Ký túc xá sinh viên', '2026-11-16 07:00:00', '2026-11-16 10:30:00', 40, 2, '2026-10-12 11:00:00'),

-- Hoạt động 5: Kỹ năng mềm
(5, 'Tập huấn kỹ năng lãnh đạo và quản lý đội nhóm', 'Khóa bồi dưỡng kỹ năng giao tiếp, giải quyết xung đột và quản trị dự án theo phương pháp Scrum cho cán bộ CLB.', 'Phòng Hội thảo 201', '2026-11-20 08:30:00', '2026-11-20 11:30:00', 25, 1, '2026-10-13 14:00:00'),

-- Hoạt động 6: Nghệ thuật gây quỹ
(6, 'Đêm nhạc Acoustic: Giai điệu mùa Đông gây quỹ thiện nguyện', 'Đêm giao lưu âm nhạc sinh viên nhằm quyên góp sách vở và áo ấm cho trẻ em vùng cao.', 'Sân khấu ngoài trời nhà B', '2026-11-25 19:00:00', '2026-11-25 21:30:00', 80, 2, '2026-10-14 15:00:00'),

-- Hoạt động 7: Cuộc thi học thuật
(7, 'Cuộc thi Ý tưởng sáng tạo khởi nghiệp UHL Innovation', 'Sân chơi dành cho các nhóm sinh viên có dự án khởi nghiệp công nghệ thông tin và chuyển đổi số.', 'Hội trường lớn 500 chỗ', '2026-11-28 08:00:00', '2026-11-28 16:30:00', 60, 1, '2026-10-15 09:30:00'),

-- Hoạt động 8: Workshop kỹ thuật
(8, 'Workshop: Quản lý mã nguồn với Git và GitHub Actions', 'Thực hành phân nhánh, mở PR, xử lý conflict và tự động hóa kiểm thử mã nguồn bằng CI/CD.', 'Phòng máy tính PM03', '2026-12-02 13:30:00', '2026-12-02 16:30:00', 35, 2, '2026-10-16 10:00:00'),

-- Hoạt động 9: Giao lưu quốc tế
(9, 'Câu lạc bộ tiếng Anh: Giao lưu cùng sinh viên quốc tế', 'Chủ đề: Văn hóa và phong tục tập quán các nước Đông Nam Á. Trao đổi bằng 100% tiếng Anh.', 'Phòng sinh hoạt CLB', '2026-12-05 18:00:00', '2026-12-05 20:30:00', 45, 1, '2026-10-17 11:00:00'),

-- Hoạt động 10: ĐẶC BIỆT - Dùng test tính năng ĐÃ HẾT CHỖ (Capacity = 2, đăng ký đủ 2 người)
(10, 'Buổi tư vấn chuyên sâu 1-1 cùng chuyên gia hướng nghiệp', 'Chương trình định hướng nghề nghiệp giới hạn số lượng sinh viên tham gia để đảm bảo chất lượng cố vấn.', 'Phòng Tư vấn A105', '2026-12-08 09:00:00', '2026-12-08 11:00:00', 2, 2, '2026-10-18 13:00:00'),

-- Hoạt động 11: Văn hóa thể thao
(11, 'Giải cờ vua - cờ tướng UHL mở rộng', 'Thi đấu giao hữu các môn thể thao trí tuệ giữa các câu lạc bộ trong trường.', 'Nhà đa năng', '2026-12-12 08:00:00', '2026-12-12 17:00:00', 24, 1, '2026-10-19 14:00:00'),

-- Hoạt động 12: Tổng kết
(12, 'Lễ vinh danh thủ lĩnh CLB và Dạ hội chào năm mới 2027', 'Tổng kết hoạt động phong trào sinh viên năm 2026 và trao bằng khen cho các cá nhân xuất sắc.', 'Sảnh chính Tòa nhà A', '2026-12-30 18:30:00', '2026-12-30 22:00:00', 120, 1, '2026-10-20 15:00:00');

-- 3. NẠP DỮ LIỆU ĐĂNG KÝ THAM GIA (registrations)
INSERT INTO `registrations` (`id`, `activity_id`, `user_id`, `created_at`) VALUES
-- Hoạt động 10 đã đầy chỗ (capacity = 2, 2 người đăng ký: user 6 và 7) -> Test F2.2 chặn khi hết chỗ
(1, 10, 6, '2026-10-18 14:00:00'),
(2, 10, 7, '2026-10-18 14:05:00'),

-- Đăng ký cho Hoạt động 1 (Hiến máu)
(3, 1, 3, '2026-10-19 09:00:00'),
(4, 1, 4, '2026-10-19 09:10:00'),
(5, 1, 5, '2026-10-19 09:15:00'),
(6, 1, 6, '2026-10-19 09:20:00'),
(7, 1, 7, '2026-10-19 09:25:00'),
(8, 1, 8, '2026-10-19 09:30:00'),

-- Đăng ký cho Hoạt động 2 (Hội thảo Node.js)
(9, 2, 3, '2026-10-20 10:00:00'),
(10, 2, 4, '2026-10-20 10:05:00'),
(11, 2, 9, '2026-10-20 10:10:00'),
(12, 2, 10, '2026-10-20 10:15:00'),

-- Đăng ký cho Hoạt động 3 (Bóng đá)
(13, 3, 11, '2026-10-21 11:00:00'),
(14, 3, 12, '2026-10-21 11:05:00'),
(15, 3, 13, '2026-10-21 11:10:00');

-- 4. NẠP MINH CHỨNG THAM GIA (evidences)
INSERT INTO `evidences` (`id`, `registration_id`, `file_path`, `status`, `reviewed_by`, `reviewed_at`, `created_at`) VALUES
-- Minh chứng 1: Đã được duyệt (APPROVED)
(1, 3, 'uploads/mc_hienmau_duc_17924001.pdf', 'APPROVED', 1, '2026-10-21 15:30:00', '2026-10-20 14:00:00'),

-- Minh chứng 2: Chờ duyệt (PENDING) -> Dùng test chức năng duyệt minh chứng F5.1 của Admin
(2, 4, 'uploads/mc_hienmau_lan_17924002.jpg', 'PENDING', NULL, NULL, '2026-10-21 16:00:00'),

-- Minh chứng 3: Bị từ chối (REJECTED) do mờ/không đúng mẫu
(3, 5, 'uploads/mc_hienmau_baoanh_17924003.png', 'REJECTED', 2, '2026-10-22 09:00:00', '2026-10-21 17:00:00');
