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
