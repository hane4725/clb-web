import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

// Đọc cấu hình từ biến môi trường
const host = process.env.DB_HOST || '127.0.0.1';
const port = process.env.DB_PORT || '3306';
const user = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';

// Tìm đường dẫn thực thi của MariaDB / MySQL
const candidatePaths = [
  'mariadb',
  'mysql',
  'E:\\APP_LAPTRINH\\MariaDB_11.4\\bin\\mariadb.exe',
  'C:\\Program Files\\MariaDB 11.4\\bin\\mariadb.exe',
  'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
];

let dbCli = 'mariadb';
for (const p of candidatePaths) {
  if (p === 'mariadb' || p === 'mysql') continue;
  if (existsSync(p)) {
    dbCli = `"${p}"`;
    break;
  }
}

const file001 = path.resolve('db/001_init.sql');
const file002 = path.resolve('db/002_seed.sql');

console.log('🔄 Đang tiến hành reset Cơ sở dữ liệu UHL Active...');
console.log(`📍 Kết nối tới: ${user}@${host}:${port}`);

const passFlag = password ? `-p"${password}"` : '';
const cmdBase = `${dbCli} -h ${host} -P ${port} -u ${user} ${passFlag}`;

try {
  console.log('1️⃣ Đang chạy db/001_init.sql (Khởi tạo CSDL và 4 bảng)...');
  execSync(`${cmdBase} < "${file001}"`, { stdio: 'inherit', shell: true });

  console.log('2️⃣ Đang chạy db/002_seed.sql (Nạp dữ liệu mẫu ban đầu)...');
  execSync(`${cmdBase} < "${file002}"`, { stdio: 'inherit', shell: true });

  console.log('✅ Reset CSDL thành công! Hệ thống đã có đủ 4 bảng, 25 users và 12 activities.');
} catch (error) {
  console.error('❌ Lỗi khi thực thi reset CSDL:', error.message);
  console.log('👉 Mẹo: Hãy kiểm tra mật khẩu DB_PASSWORD trong file .env hoặc chạy trực tiếp bằng HeidiSQL.');
  process.exit(1);
}
