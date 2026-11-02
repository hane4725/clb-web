import test from 'node:test';
import assert from 'node:assert/strict';
import { calcRemainingSeats } from '../server/utils.js';

test('calcRemainingSeats - tinh dung so cho con lai khi chua het cho', () => {
    // Sức chứa 50, đã đăng ký 20 -> còn 30 chỗ
    assert.equal(calcRemainingSeats(50, 20), 30);
    assert.equal(calcRemainingSeats(100, 0), 100);
});

test('calcRemainingSeats - tra ve 0 khi da het cho hoac dang ky vuot qua', () => {
    // Đã đủ chỗ (50/50)
    assert.equal(calcRemainingSeats(50, 50), 0);
    // Đăng ký vượt quá sức chứa (55/50) -> không để số âm
    assert.equal(calcRemainingSeats(50, 55), 0);
});

test('calcRemainingSeats - tra ve 0 khi dau vao khong hop le', () => {
    assert.equal(calcRemainingSeats(-10, 5), 0);
    assert.equal(calcRemainingSeats(null, 5), 0);
    assert.equal(calcRemainingSeats('abc', 5), 0);
});
