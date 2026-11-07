import {
    getActivities,
    getActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
} from './routes/activities.js';
import {
    registerActivity,
    cancelRegistration,
    getRegistrations,
    getMyRegistrations
} from './routes/registrations.js';

/**
 * 1. Đọc body JSON từ request, giới hạn kích thước 100 KB (README dòng 353)
 */
export async function readJson(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        const MAX_SIZE = 100 * 1024; // 100 KB

        req.on('data', (chunk) => {
            body += chunk;
            if (body.length > MAX_SIZE) {
                const err = new Error('Payload too large (vượt quá 100 KB)');
                err.status = 413;
                reject(err);
            }
        });

        req.on('end', () => {
            if (!body.trim()) return resolve({});
            try {
                const parsed = JSON.parse(body);
                resolve(parsed);
            } catch {
                const err = new Error('Dữ liệu JSON không hợp lệ');
                err.status = 400;
                reject(err);
            }
        });

        req.on('error', (err) => reject(err));
    });
}

/**
 * 2. Gửi phản hồi JSON đúng Header và HTTP status (README dòng 354)
 */
export function sendJson(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    });
    res.end(JSON.stringify(data));
}

/**
 * 3. Bảng định tuyến (Gợi ý của Thầy dòng 374-379)
 */
const routes = [
    // Cụm API Hoạt động (Activities)
    { method: 'GET', pattern: /^\/api\/activities$/, handler: (req, res, { url }) => getActivities(req, res, url) },
    { method: 'GET', pattern: /^\/api\/activities\/(\d+)$/, handler: (req, res, { params }) => getActivityById(req, res, params[0]) },
    { method: 'POST', pattern: /^\/api\/activities$/, handler: (req, res) => createActivity(req, res) },
    { method: 'PATCH', pattern: /^\/api\/activities\/(\d+)$/, handler: (req, res, { params }) => updateActivity(req, res, params[0]) },
    { method: 'DELETE', pattern: /^\/api\/activities\/(\d+)$/, handler: (req, res, { params }) => deleteActivity(req, res, params[0]) },
    // Cụm API Đăng ký (Registrations - README dòng 361-363)
    { method: 'POST', pattern: /^\/api\/activities\/(\d+)\/registrations$/, handler: (req, res, { params }) => registerActivity(req, res, params[0]) },
    { method: 'DELETE', pattern: /^\/api\/activities\/(\d+)\/registrations\/me$/, handler: (req, res, { params }) => cancelRegistration(req, res, params[0]) },
    { method: 'GET', pattern: /^\/api\/activities\/(\d+)\/registrations$/, handler: (req, res, { params }) => getRegistrations(req, res, params[0]) },
    { method: 'GET', pattern: /^\/api\/registrations\/me$/, handler: (req, res) => getMyRegistrations(req, res) },
];

/**
 * 4. Hàm điều phối API trung tâm (Gợi ý của Thầy dòng 381-388)
 */
export async function handleApi(req, res, url) {
    try {
        for (const r of routes) {
            const match = url.pathname.match(r.pattern);
            if (req.method === r.method && match) {
                return await r.handler(req, res, { url, params: match.slice(1) });
            }
        }
        // Không khớp API nào -> Báo 404
        sendJson(res, 404, { error: 'Không tìm thấy API' });
    } catch (error) {
        // Lỗi chưa bắt được -> Trả về 500 và ghi log, không làm sập server (README dòng 355)
        console.error('❌ Lỗi xử lý API:', error);
        sendJson(res, error.status || 500, { error: error.message || 'Lỗi máy chủ nội bộ' });
    }
}
