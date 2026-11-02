import mysql from 'mysql2/promise';

/**
 * Khởi tạo Connection Pool kết nối MariaDB
 * Căn cứ: Mục 8 Tuần 3 (README.md dòng 351)
 */
export const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Hàm kiểm tra kết nối CSDL khi khởi động server
 */
export async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Kết nối CSDL MariaDB thành công (Database: clb)!');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết nối CSDL MariaDB:', error.message);
        return false;
    }
}
