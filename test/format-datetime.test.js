import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatDateTime } from '../server/utils.js';

// Test case 1: Kiểm tra định dạng ngày giờ hợp lệ
test('formatDateTime - Định dạng chuỗi ngày giờ hợp lệ sang HH:mm DD/MM/YYYY', () => {
    const input = '2026-11-05T07:30:00';
    const result = formatDateTime(input);
    assert.equal(result, '07:30 05/11/2026');
});

// Test case 2: Kiểm tra xử lý khi truyền giá trị sai hoặc rỗng
test('formatDateTime - Trả về chuỗi rỗng khi đầu vào không hợp lệ', () => {
    assert.equal(formatDateTime(''), '');
    assert.equal(formatDateTime(null), '');
    assert.equal(formatDateTime('chuoi-ngay-sai'), '');
});
