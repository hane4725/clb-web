import test from 'node:test';
import assert from 'node:assert/strict';
import { formatStatus } from '../server/utils.js';

test('formatStatus - chuyen doi dung trang thai minh chung sang tieng Viet', () => {
    assert.equal(formatStatus('PENDING'), 'Chờ duyệt');
    assert.equal(formatStatus('APPROVED'), 'Đã duyệt');
    assert.equal(formatStatus('REJECTED'), 'Từ chối');
});

test('formatStatus - khong phan biet chu hoa chu thuong va khoang trang', () => {
    assert.equal(formatStatus('pending'), 'Chờ duyệt');
    assert.equal(formatStatus('  Approved  '), 'Đã duyệt');
    assert.equal(formatStatus('upcoming'), 'Sắp diễn ra');
});

test('formatStatus - tra ve "Không xác định" khi truyen ma la hoac khong hop le', () => {
    assert.equal(formatStatus('UNKNOWN_STATUS'), 'Không xác định');
    assert.equal(formatStatus(''), 'Không xác định');
    assert.equal(formatStatus(null), 'Không xác định');
    assert.equal(formatStatus(undefined), 'Không xác định');
});
