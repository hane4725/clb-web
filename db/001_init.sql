-- ==============================================================================
-- File: db/001_init.sql
-- Mục đích: Khởi tạo cấu trúc CSDL Quản lý hoạt động CLB (UHL Active)
-- Căn cứ: Mục 7 (Bước 3 Tuần 2, dòng 263–267) & docs/yeu-cau.md (F1 -> F5)
-- ==============================================================================

-- 1. Tạo Database nếu chưa có và sử dụng database
CREATE DATABASE IF NOT EXISTS `clb`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `clb`;

-- 2. Xóa bảng theo thứ tự quan hệ khóa ngoại (tránh lỗi khóa ngoại khi chạy lại)
DROP TABLE IF EXISTS `evidences`;
DROP TABLE IF EXISTS `registrations`;
DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `users`;

-- 3. Bảng users: Tài khoản người dùng (Phục vụ xác thực & phân quyền ADMIN / MEMBER)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `full_name` VARCHAR(100) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng activities: Hoạt động của Câu lạc bộ (Phục vụ F1.1 Phân trang, F1.2 Tìm kiếm, F3 Quản lý HĐ)
CREATE TABLE `activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `location` VARCHAR(255) NOT NULL,
  `start_at` DATETIME NOT NULL,
  `end_at` DATETIME NOT NULL,
  `capacity` INT NOT NULL,
  `created_by` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Khóa ngoại: Không cho phép xóa user nếu user đó đã tạo hoạt động
  CONSTRAINT `fk_activities_created_by`
    FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  -- Ràng buộc toàn vẹn logic dữ liệu
  CONSTRAINT `chk_activities_capacity` CHECK (`capacity` > 0),
  CONSTRAINT `chk_activities_time` CHECK (`end_at` > `start_at`),
  -- Chỉ mục tối ưu tốc độ sắp xếp và tìm kiếm (F1.1, F1.2)
  INDEX `idx_activities_start_at` (`start_at`),
  INDEX `idx_activities_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng registrations: Thành viên đăng ký tham gia hoạt động (Phục vụ F1.1 đếm số lượng, F2 Đăng ký)
CREATE TABLE `registrations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `activity_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Khóa ngoại
  CONSTRAINT `fk_registrations_activity`
    FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_registrations_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Ràng buộc: Mỗi người chỉ được đăng ký 1 lần cho cùng 1 hoạt động (thỏa mãn tiêu chí F2.2 báo lỗi 409)
  CONSTRAINT `uq_activity_user` UNIQUE (`activity_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng evidences: Minh chứng tham gia hoạt động - ảnh/PDF (Phục vụ F4 Nộp minh chứng, F5 Duyệt & Thống kê)
CREATE TABLE `evidences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `registration_id` INT NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `reviewed_by` INT NULL,
  `reviewed_at` DATETIME NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- Khóa ngoại
  CONSTRAINT `fk_evidences_registration`
    FOREIGN KEY (`registration_id`) REFERENCES `registrations` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_evidences_reviewed_by`
    FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  -- Chỉ mục tối ưu lọc danh sách minh chứng theo trạng thái duyệt (F5.1)
  INDEX `idx_evidences_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;