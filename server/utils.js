/**
 * Định dạng chuỗi ngày giờ sang định dạng tiếng Việt: HH:mm DD/MM/YYYY
 * Căn cứ: Bước 7 Tuần 2 (README.md dòng 271)
 * @param {string|Date} dateInput - Chuỗi ngày giờ (ví dụ: '2026-11-05 07:30:00')
 * @returns {string} Chuỗi định dạng (ví dụ: '07:30 05/11/2026'), trả về '' nếu không hợp lệ
 */
export function formatDateTime(dateInput) {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return '';

    const pad = (n) => String(n).padStart(2, '0');
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    const day = pad(d.getDate());
    const month = pad(d.getMonth() + 1);
    const year = d.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
}


/**
 * Tính số chỗ còn trống của hoạt động
 * Căn cứ: Bước 7 Tuần 2 (README.md dòng 271)
 * @param {number} capacity - Sức chứa tối đa của hoạt động
 * @param {number} registeredCount - Số lượng người đã đăng ký thành công
 * @returns {number} Số chỗ còn trống (không âm)
 */
export function calcRemainingSeats(capacity, registeredCount = 0) {
    const cap = Number(capacity);
    const reg = Number(registeredCount);

    // Nếu sức chứa không hợp lệ hoặc nhỏ hơn/bằng 0
    if (isNaN(cap) || cap <= 0) return 0;

    // Nếu số người đăng ký không hợp lệ hoặc âm thì coi như 0
    const validReg = isNaN(reg) || reg < 0 ? 0 : reg;

    const remaining = cap - validReg;
    return remaining > 0 ? remaining : 0;
}

/**
 * Kiểm tra định dạng email hợp lệ
 * Căn cứ: Bước 7 Tuần 2 (README.md dòng 271)
 * @param {string} email - Địa chỉ email cần kiểm tra
 * @returns {boolean} True nếu email đúng định dạng, ngược lại False
 */
export function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    // Regex kiểm tra định dạng email chuẩn: name@domain.ext
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}
