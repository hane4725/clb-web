import test, { describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { api } from '../public/js/api.js';
import {
  formatDateTime,
  formatDate,
  buildQueryString,
  parseQueryParams,
  validateActivityForm,
  formatRemainingSeats,
} from '../public/js/ui.js';

// =============================================================================
// PHẦN 1: KIỂM THỬ CÁC HÀM THUẦN TRONG PUBLIC/JS/UI.JS (README DÒNG 431 & 450)
// =============================================================================

describe('Kiểm thử các hàm tiện ích thuần trong public/js/ui.js', () => {
  // Test 1: formatDateTime
  test('formatDateTime - Định dạng đúng chuỗi ISO sang HH:mm DD/MM/YYYY', () => {
    const input = '2026-11-20T08:30:00';
    const result = formatDateTime(input);
    assert.equal(result, '08:30 20/11/2026');
  });

  test('formatDateTime - Trả về chuỗi rỗng khi truyền đầu vào rỗng hoặc không hợp lệ', () => {
    assert.equal(formatDateTime(''), '');
    assert.equal(formatDateTime(null), '');
    assert.equal(formatDateTime(undefined), '');
    assert.equal(formatDateTime('invalid-date'), '');
  });

  // Test 2: formatDate
  test('formatDate - Định dạng đúng chuỗi ngày sang DD/MM/YYYY', () => {
    const input = '2026-11-20';
    const result = formatDate(input);
    assert.equal(result, '20/11/2026');
    assert.equal(formatDate(''), '');
    assert.equal(formatDate('sai-ngay'), '');
  });

  // Test 3: buildQueryString
  test('buildQueryString - Tạo query string chuẩn và tự động loại bỏ giá trị rỗng/null', () => {
    const params = {
      q: 'hiến máu',
      page: 2,
      category: 'volunteer',
      empty: '',
      skipped: null,
      notSet: undefined,
    };
    const qs = buildQueryString(params);
    assert.ok(qs.startsWith('?'));
    assert.ok(qs.includes('q=hi%E1%BA%BFn+m%C3%A1u'));
    assert.ok(qs.includes('page=2'));
    assert.ok(qs.includes('category=volunteer'));
    assert.ok(!qs.includes('empty'));
    assert.ok(!qs.includes('skipped'));
  });

  test('buildQueryString - Trả về chuỗi rỗng khi không có tham số hoặc đối tượng rỗng', () => {
    assert.equal(buildQueryString({}), '');
    assert.equal(buildQueryString(null), '');
  });

  // Test 4: parseQueryParams
  test('parseQueryParams - Trích xuất đúng tham số từ query string URL', () => {
    const search = '?q=clb&page=3&status=open';
    const parsed = parseQueryParams(search);
    assert.deepEqual(parsed, {
      q: 'clb',
      page: '3',
      status: 'open',
    });
    assert.deepEqual(parseQueryParams(''), {});
  });

  // Test 5: validateActivityForm
  test('validateActivityForm - Báo lỗi khi tiêu đề ngắn hơn 5 ký tự', () => {
    const res = validateActivityForm({
      title: 'abc',
      start_time: '2026-11-20T08:00:00',
      end_time: '2026-11-20T10:00:00',
      capacity: 50,
    });
    assert.equal(res.valid, false);
    assert.ok(res.errors.title);
  });

  test('validateActivityForm - Báo lỗi khi thời gian kết thúc trước thời gian bắt đầu', () => {
    const res = validateActivityForm({
      title: 'Ngày hội Hiến máu tình nguyện',
      start_time: '2026-11-20T10:00:00',
      end_time: '2026-11-20T08:00:00',
      capacity: 50,
    });
    assert.equal(res.valid, false);
    assert.ok(res.errors.end_time);
  });

  test('validateActivityForm - Báo lỗi khi capacity <= 0 hoặc không phải số nguyên', () => {
    const res1 = validateActivityForm({
      title: 'Ngày hội Sinh viên Nghiên cứu khoa học',
      start_time: '2026-11-20T08:00:00',
      end_time: '2026-11-20T10:00:00',
      capacity: 0,
    });
    assert.equal(res1.valid, false);
    assert.ok(res1.errors.capacity);

    const res2 = validateActivityForm({
      title: 'Ngày hội Sinh viên Nghiên cứu khoa học',
      start_time: '2026-11-20T08:00:00',
      end_time: '2026-11-20T10:00:00',
      capacity: 'không-phải-số',
    });
    assert.equal(res2.valid, false);
  });

  test('validateActivityForm - Hợp lệ khi dữ liệu đầy đủ và đúng định dạng', () => {
    const res = validateActivityForm({
      title: 'Giải Bóng đá Nam Sinh viên UHL 2026',
      start_time: '2026-11-20T08:00:00',
      end_time: '2026-11-20T17:00:00',
      capacity: 100,
    });
    assert.equal(res.valid, true);
    assert.deepEqual(res.errors, {});
  });

  // Test 6: formatRemainingSeats
  test('formatRemainingSeats - Định dạng chính xác trạng thái còn chỗ và hết chỗ', () => {
    assert.equal(formatRemainingSeats(50, 20), 'Còn 30 / 50 chỗ');
    assert.equal(formatRemainingSeats(50, 50), 'Đã hết chỗ');
    assert.equal(formatRemainingSeats(50, 60), 'Đã hết chỗ');
  });
});

// =============================================================================
// PHẦN 2: KIỂM THỬ HÀM API TRONG PUBLIC/JS/API.JS (README DÒNG 425 & TIÊU CHÍ ISSUE #27)
// =============================================================================

describe('Kiểm thử hàm gọi API public/js/api.js', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  test('api() - Gọi GET thành công và tự động parse JSON', async () => {
    const mockData = { message: 'Node.js Web Server phản hồi 200 OK', status: 'healthy' };

    globalThis.fetch = async (url, options) => {
      assert.equal(options.method, 'GET');
      assert.equal(options.headers['Accept'], 'application/json');
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      };
    };

    const result = await api('GET', '/api/health');
    assert.deepEqual(result, mockData);
  });

  test('api() - Tự động đính kèm Content-Type: application/json và stringify body cho POST', async () => {
    const payload = { title: 'Tập huấn kỹ năng lãnh đạo', capacity: 40 };

    globalThis.fetch = async (url, options) => {
      assert.equal(options.method, 'POST');
      assert.equal(options.headers['Content-Type'], 'application/json');
      assert.equal(options.body, JSON.stringify(payload));
      return {
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ id: 99, ...payload }),
      };
    };

    const res = await api('POST', '/api/activities', payload);
    assert.equal(res.id, 99);
    assert.equal(res.title, 'Tập huấn kỹ năng lãnh đạo');
  });

  test('api() - Tự ném Error kèm thông báo lỗi từ backend khi HTTP status >= 400', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 409,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Hoạt động này đã hết chỗ' }),
    });

    await assert.rejects(
      async () => {
        await api('POST', '/api/activities/1/registrations');
      },
      (err) => {
        assert.equal(err.message, 'Hoạt động này đã hết chỗ');
        assert.equal(err.status, 409);
        assert.deepEqual(err.data, { error: 'Hoạt động này đã hết chỗ' });
        return true;
      }
    );
  });

  test('api() - Tự ném Error khi gặp mã lỗi 404 Not Found', async () => {
    globalThis.fetch = async () => ({
      ok: false,
      status: 404,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ error: 'Không tìm thấy hoạt động' }),
    });

    await assert.rejects(
      async () => {
        await api('GET', '/api/activities/9999');
      },
      (err) => {
        assert.equal(err.message, 'Không tìm thấy hoạt động');
        assert.equal(err.status, 404);
        return true;
      }
    );
  });
});
