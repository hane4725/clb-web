import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const PORT = '8080';
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DEFAULT_USER_ID = '1';

let serverProcess = null;
let createdActivityId = 1;

before(async () => {
    serverProcess = spawn(
        process.execPath,
        ['--env-file=.env', 'server/server.js'],
        {
            env: { ...process.env, PORT },
            stdio: 'ignore',
        }
    );

    for (let i = 0; i < 25; i++) {
        try {
            const res = await fetch(`${BASE_URL}/api/health`);
            if (res.ok) return;
        } catch {
            await new Promise((r) => setTimeout(r, 200));
        }
    }
    throw new Error(`Không thể khởi động server tại ${BASE_URL}`);
});

after(() => {
    if (serverProcess) {
        serverProcess.kill();
    }
});

// =========================================================================
// PHẦN 1: KIỂM THỬ 10 API CHÍNH ĐÚNG THỨ TỰ 1 -> 10 TRONG BẢNG API.MD
// =========================================================================

// 1. GET /api/health
test('API 1: GET /api/health - Kiểm tra trạng thái server', async (t) => {
    const res = await fetch(`${BASE_URL}/api/health`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const data = await res.json();
        assert.deepEqual(data, { status: 'ok', service: 'UHL Active API' });
        t.diagnostic('-> 200 OK: Server hoạt động bình thường');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 1: ${res.status}`);
    }
});

// 2. GET /api/activities
test('API 2: GET /api/activities - Lấy danh sách hoạt động', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities?page=1&limit=10`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const body = await res.json();
        assert.ok(Array.isArray(body.data));
        assert.ok(body.pagination);
        t.diagnostic(`-> 200 OK: Lấy danh sách thành công (total = ${body.pagination.total})`);
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 2: ${res.status}`);
    }
});

// 3. GET /api/activities/:id
test('API 3: GET /api/activities/:id - Lấy chi tiết hoạt động', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/12`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const data = await res.json();
        assert.equal(data.id, 12);
        t.diagnostic('-> 200 OK: Lấy chi tiết hoạt động thành công');
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: ID hoạt động không tồn tại');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 3: ${res.status}`);
    }
});

// 4. POST /api/activities
test('API 4: POST /api/activities - Tạo hoạt động', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Workshop lập trình C++',
            description: 'Buổi thực hành lập trình C++ dành cho thành viên CLB.',
            location: 'Phòng máy PM01',
            start_at: '2026-12-15T08:00:00',
            end_at: '2026-12-15T11:00:00',
            capacity: 30,
        }),
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 201) {
        const data = await res.json();
        assert.ok(data.id);
        assert.equal(data.message, 'Tạo hoạt động thành công');
        createdActivityId = data.id;
        t.diagnostic(`-> 201 Created: Tạo hoạt động thành công (ID = ${data.id})`);
    } else if (res.status === 200) {
        const data = await res.json();
        createdActivityId = data.id;
        t.diagnostic(`-> 200 OK: Tạo hoạt động thành công (ID = ${data.id})`);
    } else if (res.status === 400) {
        t.diagnostic('-> 400 Bad Request: Thiếu trường bắt buộc / dữ liệu không hợp lệ');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 4: ${res.status}`);
    }
});

// 5. PATCH /api/activities/:id
test('API 5: PATCH /api/activities/:id - Cập nhật hoạt động', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/${createdActivityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Workshop lập trình C++ nâng cao',
            description: 'Buổi thực hành lập trình C++ dành cho thành viên CLB UHL Active.',
            location: 'Phòng máy PM02',
            start_at: '2026-12-15T08:00:00',
            end_at: '2026-12-15T11:00:00',
            capacity: 35,
        }),
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const data = await res.json();
        assert.equal(data.message, 'Cập nhật hoạt động thành công');
        t.diagnostic('-> 200 OK: Cập nhật hoạt động thành công');
    } else if (res.status === 400) {
        t.diagnostic('-> 400 Bad Request: Dữ liệu không hợp lệ');
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: ID hoạt động không tồn tại');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 5: ${res.status}`);
    }
});

// 6. DELETE /api/activities/:id
test('API 6: DELETE /api/activities/:id - Xóa hoạt động', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/${createdActivityId}`, {
        method: 'DELETE',
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const data = await res.json();
        assert.equal(data.message, 'Xoá hoạt động thành công');
        t.diagnostic('-> 200 OK: Xóa hoạt động thành công');
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: ID hoạt động không tồn tại');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 6: ${res.status}`);
    }
});

// 7. POST /api/activities/:id/registrations (Dùng hoạt động ID = 12 có sẵn từ seed)
test('API 7: POST /api/activities/:id/registrations - Đăng ký tham gia', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/12/registrations`, {
        method: 'POST',
        headers: { 'X-User-Id': DEFAULT_USER_ID },
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 201) {
        const data = await res.json();
        assert.equal(data.message, 'Đăng ký tham gia thành công');
        assert.ok(data.registration_id);
        t.diagnostic(`-> 201 Created: Đăng ký tham gia thành công (registration_id = ${data.registration_id})`);
    } else if (res.status === 400) {
        t.diagnostic('-> 400 Bad Request: Dữ liệu đầu vào không hợp lệ');
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: Hoạt động không tồn tại');
    } else if (res.status === 409) {
        t.diagnostic('-> 409 Conflict: Hoạt động đã hết chỗ hoặc người dùng đã đăng ký');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 7: ${res.status}`);
    }
});

// 8. DELETE /api/activities/:id/registrations/me
test('API 8: DELETE /api/activities/:id/registrations/me - Hủy đăng ký', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/12/registrations/me`, {
        method: 'DELETE',
        headers: { 'X-User-Id': DEFAULT_USER_ID },
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const data = await res.json();
        assert.equal(data.message, 'Huỷ đăng ký thành công');
        t.diagnostic('-> 200 OK: Hủy đăng ký thành công');
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: Người dùng chưa đăng ký hoạt động');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 8: ${res.status}`);
    }
});

// 9. GET /api/activities/:id/registrations
test('API 9: GET /api/activities/:id/registrations - Lấy danh sách người đăng ký', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/12/registrations`);
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const body = await res.json();
        assert.ok(Array.isArray(body.data));
        t.diagnostic(`-> 200 OK: Lấy danh sách người đăng ký thành công (${body.data.length} bản ghi)`);
    } else if (res.status === 404) {
        t.diagnostic('-> 404 Not Found: Hoạt động không tồn tại');
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 9: ${res.status}`);
    }
});

// 10. GET /api/registrations/me
test('API 10: GET /api/registrations/me - Lấy danh sách hoạt động cá nhân đã đăng ký', async (t) => {
    const res = await fetch(`${BASE_URL}/api/registrations/me`, {
        headers: { 'X-User-Id': DEFAULT_USER_ID },
    });
    const contentType = res.headers.get('content-type');
    assert.ok(contentType && contentType.includes('application/json'));

    if (res.status === 200) {
        const body = await res.json();
        assert.ok(Array.isArray(body.data));
        t.diagnostic(`-> 200 OK: Lấy danh sách cá nhân thành công (${body.data.length} hoạt động)`);
    } else {
        assert.fail(`Mã HTTP không hợp lệ cho API 10: ${res.status}`);
    }
});

// =========================================================================
// PHẦN 2: KIỂM THỬ CÁC NHÓM LỖI ĐÃ GHI NHẬN TRONG MỤC 3 & 4.3 API.MD
// =========================================================================

// Nhóm: Thiếu dữ liệu (Mục 3.4 & 4.3)
test('Kiểm thử lỗi [Thiếu dữ liệu]: POST /api/activities thiếu trường bắt buộc -> 400 Bad Request', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, 'Vui lòng điền đầy đủ các trường bắt buộc');
    t.diagnostic(`-> 400 Bad Request: ${data.error}`);
});

// Nhóm: Không tìm thấy khi đăng ký (Mục 3.7 & 4.3)
test('Kiểm thử lỗi [Không tìm thấy]: POST /api/activities/999999/registrations -> 404 Not Found', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/999999/registrations`, {
        method: 'POST',
        headers: { 'X-User-Id': DEFAULT_USER_ID },
    });
    assert.equal(res.status, 404);
    t.diagnostic('-> 404 Not Found: Hoạt động không tồn tại');
});

// Nhóm: Trùng lặp & Hết chỗ (Mục 3.7 & 4.3)
test('Kiểm thử lỗi [Trùng lặp & Hết chỗ]: POST /api/activities/:id/registrations -> 409 Conflict', async (t) => {
    const createRes = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Hoạt động test 1 chỗ',
            description: 'Kiểm thử trùng lặp và hết chỗ',
            location: 'PM01',
            start_at: '2026-12-20T08:00:00',
            end_at: '2026-12-20T10:00:00',
            capacity: 1,
        }),
    });
    const { id: tempId } = await createRes.json();

    // User 1 đăng ký lần 1 (Thành công - 201)
    const firstRes = await fetch(`${BASE_URL}/api/activities/${tempId}/registrations`, {
        method: 'POST',
        headers: { 'X-User-Id': '1' },
    });
    assert.equal(firstRes.status, 201);

    // 1. User 1 đăng ký lại lần 2 -> 409 Trùng lặp
    const dupRes = await fetch(`${BASE_URL}/api/activities/${tempId}/registrations`, {
        method: 'POST',
        headers: { 'X-User-Id': '1' },
    });
    assert.equal(dupRes.status, 409);
    t.diagnostic('-> 409 Conflict: Người dùng đã đăng ký hoạt động (Trùng lặp)');

    // 2. User 2 đăng ký khi capacity = 1 đã đầy -> 409 Hết chỗ
    const fullRes = await fetch(`${BASE_URL}/api/activities/${tempId}/registrations`, {
        method: 'POST',
        headers: { 'X-User-Id': '2' },
    });
    assert.equal(fullRes.status, 409);
    t.diagnostic('-> 409 Conflict: Hoạt động đã hết chỗ');
});

// Nhóm: Chưa đăng ký mà bấm hủy (Mục 3.8 & 4.3)
test('Kiểm thử lỗi [Chưa đăng ký]: DELETE /api/activities/999999/registrations/me -> 404 Not Found', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities/999999/registrations/me`, {
        method: 'DELETE',
        headers: { 'X-User-Id': DEFAULT_USER_ID },
    });
    assert.equal(res.status, 404);
    t.diagnostic('-> 404 Not Found: Người dùng chưa đăng ký hoạt động');
});

// Nhóm: Đường dẫn API không tồn tại
test('Kiểm thử lỗi [Sai đường dẫn]: Router trả về 404 Not Found', async (t) => {
    const res = await fetch(`${BASE_URL}/api/duong-dan-khong-ton-tai`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.deepEqual(data, { error: 'Không tìm thấy API' });
    t.diagnostic('-> 404 Not Found: Không tìm thấy API');
});

// Nhóm: JSON sai cú pháp (Căn cứ: README dòng 353 & 405)
test('Kiểm thử lỗi [JSON hỏng]: POST /api/activities với body sai cú pháp -> 400 Bad Request', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"title": "JSON bi thieu dau ngoac"', // Chuỗi JSON bị hỏng cố ý
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, 'Dữ liệu JSON không hợp lệ');
    t.diagnostic('-> 400 Bad Request: Gửi JSON hỏng không làm sập server');
});

// Nhóm: Sai kiểu dữ liệu capacity (Căn cứ: README dòng 365 & 405)
test('Kiểm thử lỗi [Sai kiểu dữ liệu]: POST /api/activities với capacity không hợp lệ -> 400 Bad Request', async (t) => {
    const res = await fetch(`${BASE_URL}/api/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: 'Hoạt động test capacity',
            description: 'Kiểm thử dữ liệu sai kiểu',
            location: 'Hội trường A',
            start_at: '2026-12-25T08:00:00',
            end_at: '2026-12-25T11:00:00',
            capacity: 'abc', // Truyền chữ thay vì số nguyên
        }),
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.error, 'Sức chứa (capacity) phải là số nguyên dương lớn hơn 0');
    t.diagnostic('-> 400 Bad Request: Dữ liệu capacity sai kiểu trả về 400 đúng chuẩn');
});