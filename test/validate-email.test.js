import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidEmail } from '../server/utils.js';

test('isValidEmail - tra ve true voi email hop le', () => {
    assert.equal(isValidEmail('sv01@uhl.edu.vn'), true);
    assert.equal(isValidEmail('admin@gmail.com'), true);
    assert.equal(isValidEmail('  user.test@domain.co  '), true);
});

test('isValidEmail - tra ve false voi email sai dinh dang', () => {
    assert.equal(isValidEmail('khong-co-a-cong'), false);
    assert.equal(isValidEmail('thieu-ten-mien@'), false);
    assert.equal(isValidEmail('@thieu-ten.com'), false);
    assert.equal(isValidEmail('email chua dau cach@domain.com'), false);
});

test('isValidEmail - tra ve false voi gia tri null, rong hoac khong phai chuoi', () => {
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail(null), false);
    assert.equal(isValidEmail(undefined), false);
    assert.equal(isValidEmail(12345), false);
});
