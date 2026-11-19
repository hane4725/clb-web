/**
 * UHL ACTIVE - Shared API Client (Tuần 4 - Bước 2)
 * Căn cứ: README.md dòng 425 & Issue #27 [FE-02]
 * 
 * Mục tiêu: Cung cấp hàm api() dùng chung bọc fetch, tự parse JSON,
 * tự đính kèm header thích hợp và tự ném Error kèm thông báo khi status >= 400.
 */

/**
 * Hàm gọi API máy chủ dùng chung
 * 
 * @param {string} method - Phương thức HTTP ('GET', 'POST', 'PATCH', 'DELETE', ...)
 * @param {string} path - Đường dẫn API endpoint (ví dụ: '/api/activities', '/api/health')
 * @param {any} [body=null] - Dữ liệu payload gửi lên máy chủ (Object, Array, string, null)
 * @param {RequestInit} [options={}] - Tuỳ chọn bổ sung cho fetch (headers, signal, ...)
 * @returns {Promise<any>} - Dữ liệu JSON đã parse từ phản hồi máy chủ
 * @throws {Error} - Ném Error kèm thông báo lỗi từ backend khi HTTP status >= 400
 */
export async function api(method, path, body = null, options = {}) {
  const headers = {
    'Accept': 'application/json',
    ...(options.headers || {}),
  };

  let requestBody = undefined;

  // Tự động xử lý body và Content-Type: application/json
  if (body !== null && body !== undefined) {
    if (typeof FormData !== 'undefined' && body instanceof FormData) {
      // Để trình duyệt tự thiết lập Content-Type kèm boundary khi gửi FormData
      requestBody = body;
    } else if (typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
      requestBody = JSON.stringify(body);
    } else {
      requestBody = String(body);
    }
  }

  // Tự động đính kèm Token nếu đã đăng nhập (lưu trong localStorage)
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Header định danh người dùng tạm thời cho Tuần 3 & 4 (trước khi có JWT Tuần 5)
  const devUserId = typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null;
  if (!headers['Authorization'] && !headers['X-User-Id']) {
    headers['X-User-Id'] = devUserId || '1';
  }

  const res = await fetch(path, {
    method: method.toUpperCase(),
    headers,
    body: requestBody,
    ...options,
  });

  // Tự động phân tích phản hồi dựa trên Content-Type
  const contentType = res.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await res.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  // Tự động ném Error khi HTTP status >= 400
  if (!res.ok || res.status >= 400) {
    const errorMsg = (data && (data.error || data.message))
      ? (data.error || data.message)
      : `Lỗi yêu cầu máy chủ: HTTP ${res.status}`;

    const error = new Error(errorMsg);
    error.status = res.status;
    error.data = data;
    error.response = res;
    throw error;
  }

  return data;
}

export default api;
