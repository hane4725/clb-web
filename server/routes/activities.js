import { pool } from '../db.js';
import { readJson, sendJson } from '../router.js';

/**
 * 1. GET /api/activities - Danh sách hoạt động (tìm kiếm và phân trang)
 * Căn cứ: README dòng 357
 */
export async function getActivities(req, res, url) {
    try {
        const q = url.searchParams.get('q') || '';
        const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
        const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') || '10', 10)));
        const offset = (page - 1) * limit;

        const searchTerm = `%${q.trim()}%`;

        // Đếm tổng số bản ghi khớp tìm kiếm
        const [countRows] = await pool.query(
            'SELECT COUNT(*) as total FROM activities WHERE title LIKE ?',
            [searchTerm]
        );
        const total = countRows[0].total;

        // Lấy danh sách hoạt động kèm số lượng đã đăng ký
        const [rows] = await pool.query(
            `SELECT a.*, 
              COUNT(r.id) as registered_count,
              GREATEST(0, a.capacity - COUNT(r.id)) as remaining_seats
       FROM activities a
       LEFT JOIN registrations r ON a.id = r.activity_id
       WHERE a.title LIKE ?
       GROUP BY a.id
       ORDER BY a.start_at DESC
       LIMIT ? OFFSET ?`,
            [searchTerm, limit, offset]
        );

        sendJson(res, 200, {
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ khi lấy danh sách: ' + error.message });
    }
}

/**
 * 2. GET /api/activities/:id - Chi tiết một hoạt động
 * Căn cứ: README dòng 358
 */
export async function getActivityById(req, res, id) {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, 
              COUNT(r.id) as registered_count,
              GREATEST(0, a.capacity - COUNT(r.id)) as remaining_seats
       FROM activities a
       LEFT JOIN registrations r ON a.id = r.activity_id
       WHERE a.id = ?
       GROUP BY a.id`,
            [id]
        );

        if (rows.length === 0) {
            return sendJson(res, 404, { error: 'Không tìm thấy hoạt động' });
        }

        sendJson(res, 200, rows[0]);
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ: ' + error.message });
    }
}

/**
 * 3. POST /api/activities - Tạo hoạt động mới
 * Căn cứ: README dòng 359
 */
export async function createActivity(req, res) {
    try {
        const body = await readJson(req);
        const { title, description, location, start_at, end_at, capacity, created_by } = body;

        // Kiểm tra dữ liệu bắt buộc
        if (!title || !location || !start_at || !end_at || !capacity) {
            return sendJson(res, 400, { error: 'Vui lòng điền đầy đủ các trường bắt buộc' });
        }

        const [result] = await pool.query(
            `INSERT INTO activities (title, description, location, start_at, end_at, capacity, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [title, description || '', location, start_at, end_at, Number(capacity), created_by || 1]
        );

        sendJson(res, 201, {
            id: result.insertId,
            message: 'Tạo hoạt động thành công',
        });
    } catch (error) {
        const status = error.status || 500;
        sendJson(res, status, { error: error.message });
    }
}

/**
 * 4. PATCH /api/activities/:id - Chỉnh sửa hoạt động
 * Căn cứ: README dòng 359
 */
export async function updateActivity(req, res, id) {
    try {
        const body = await readJson(req);

        const [existing] = await pool.query('SELECT id FROM activities WHERE id = ?', [id]);
        if (existing.length === 0) {
            return sendJson(res, 404, { error: 'Không tìm thấy hoạt động để cập nhật' });
        }

        const updates = [];
        const values = [];

        const allowedFields = ['title', 'description', 'location', 'start_at', 'end_at', 'capacity'];
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates.push(`\`${field}\` = ?`);
                values.push(field === 'capacity' ? Number(body[field]) : body[field]);
            }
        }

        if (updates.length === 0) {
            return sendJson(res, 400, { error: 'Không có thông tin nào được gửi để cập nhật' });
        }

        values.push(id);
        await pool.query(`UPDATE activities SET ${updates.join(', ')} WHERE id = ?`, values);

        sendJson(res, 200, { message: 'Cập nhật hoạt động thành công' });
    } catch (error) {
        const status = error.status || 500;
        sendJson(res, status, { error: error.message });
    }
}

/**
 * 5. DELETE /api/activities/:id - Xoá hoạt động
 * Căn cứ: README dòng 359
 */
export async function deleteActivity(req, res, id) {
    try {
        const [result] = await pool.query('DELETE FROM activities WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return sendJson(res, 404, { error: 'Không tìm thấy hoạt động để xoá' });
        }

        sendJson(res, 200, { message: 'Xoá hoạt động thành công' });
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ khi xoá: ' + error.message });
    }
}
