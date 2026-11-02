import { pool } from '../db.js';
import { sendJson } from '../router.js';

/**
 * 1. POST /api/activities/:id/registrations - Đăng ký tham gia hoạt động
 * Căn cứ: README dòng 361 & dòng 364
 */
export async function registerActivity(req, res, activityId) {
    try {
        // Đọc User ID từ header X-User-Id theo đúng yêu cầu của Thầy (dòng 364)
        const userId = parseInt(req.headers['x-user-id'] || '1', 10);

        // 1. Kiểm tra hoạt động có tồn tại và còn chỗ không
        const [actRows] = await pool.query(
            `SELECT a.id, a.capacity, COUNT(r.id) as registered_count
       FROM activities a
       LEFT JOIN registrations r ON a.id = r.activity_id
       WHERE a.id = ?
       GROUP BY a.id`,
            [activityId]
        );

        if (actRows.length === 0) {
            return sendJson(res, 404, { error: 'Không tìm thấy hoạt động' });
        }

        const activity = actRows[0];
        if (activity.registered_count >= activity.capacity) {
            return sendJson(res, 409, { error: 'Hoạt động đã hết chỗ' }); // Tiêu chí README
        }

        // 2. Chặn đăng ký trùng (Tiêu chí F2.2)
        const [existing] = await pool.query(
            'SELECT id FROM registrations WHERE activity_id = ? AND user_id = ?',
            [activityId, userId]
        );

        if (existing.length > 0) {
            return sendJson(res, 409, { error: 'Bạn đã đăng ký hoạt động này rồi' });
        }

        // 3. Ghi nhận đăng ký thành công
        const [result] = await pool.query(
            'INSERT INTO registrations (activity_id, user_id) VALUES (?, ?)',
            [activityId, userId]
        );

        sendJson(res, 201, {
            message: 'Đăng ký tham gia thành công',
            registration_id: result.insertId,
        });
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ khi đăng ký: ' + error.message });
    }
}

/**
 * 2. DELETE /api/activities/:id/registrations/me - Huỷ đăng ký của chính mình
 * Căn cứ: README dòng 362
 */
export async function cancelRegistration(req, res, activityId) {
    try {
        const userId = parseInt(req.headers['x-user-id'] || '1', 10);

        const [result] = await pool.query(
            'DELETE FROM registrations WHERE activity_id = ? AND user_id = ?',
            [activityId, userId]
        );

        if (result.affectedRows === 0) {
            return sendJson(res, 404, { error: 'Bạn chưa đăng ký hoạt động này nên không thể huỷ' });
        }

        sendJson(res, 200, { message: 'Huỷ đăng ký thành công' });
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ khi huỷ đăng ký: ' + error.message });
    }
}

/**
 * 3. GET /api/activities/:id/registrations - Danh sách người đã đăng ký
 * Căn cứ: README dòng 363
 */
export async function getRegistrations(req, res, activityId) {
    try {
        const [rows] = await pool.query(
            `SELECT r.id, r.created_at, u.id as user_id, u.full_name, u.email
       FROM registrations r
       JOIN users u ON r.user_id = u.id
       WHERE r.activity_id = ?
       ORDER BY r.created_at ASC`,
            [activityId]
        );

        sendJson(res, 200, { data: rows });
    } catch (error) {
        sendJson(res, 500, { error: 'Lỗi máy chủ khi lấy danh sách: ' + error.message });
    }
}
