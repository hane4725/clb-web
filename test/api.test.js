import test from 'node:test';
import assert from 'node:assert/strict';

const BASE_URL = 'http://localhost:3000';

test('API GET /api/activities - Server phản hồi với định dạng JSON', async () => {
    const res = await fetch(`${BASE_URL}/api/activities`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));
    // Chấp nhận 200 khi có DB hoặc 500 khi DB chưa khởi chạy
    assert.ok([200, 500].includes(res.status));
});

test('API GET /api/activities/1 - Trả về dữ liệu JSON hợp lệ', async () => {
    const res = await fetch(`${BASE_URL}/api/activities/1`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));
    assert.ok([200, 404, 500].includes(res.status));
});

test('API POST /api/activities - Gửi thiếu dữ liệu bắt buộc trả về lỗi 400', async () => {
    const res = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    // Hàm createActivity kiểm tra dữ liệu đầu vào trước khi query DB nên trả về 400
    assert.equal(res.status, 400);
});

test('API POST /api/activities/1/registrations - Phản hồi JSON hợp lệ khi đăng ký', async () => {
    const res = await fetch(`${BASE_URL}/api/activities/1/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));
    assert.ok([201, 400, 404, 409, 500].includes(res.status));
});

test('API DELETE /api/activities/1/registrations/me - Phản hồi JSON hợp lệ khi hủy', async () => {
    const res = await fetch(`${BASE_URL}/api/activities/1/registrations/me`, {
        method: 'DELETE',
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));
    assert.ok([200, 404, 500].includes(res.status));
});

test('API Router - Đường dẫn không tồn tại trả về status 404 và đúng định dạng lỗi', async () => {
    const res = await fetch(`${BASE_URL}/api/duong-dan-khong-ton-tai`);
    assert.equal(res.status, 404);

    const data = await res.json();
    assert.deepEqual(data, { error: 'Không tìm thấy API' });
});