/**
 * UHL ACTIVE - Shared UI Utilities (Tuần 4 - Bước 3)
 * Căn cứ: README.md dòng 426, 431, 433, 448, 450, 451 & Issue #27 [FE-02]
 * 
 * Quy tắc an toàn bắt buộc (DoD dòng 451):
 * Mọi hàm render giao diện CHỈ dùng createElement, textContent, replaceChildren.
 * Tuyệt đối KHÔNG dùng innerHTML nhận dữ liệu người dùng nhằm triệt tiêu nguy cơ XSS.
 */

// =============================================================================
// PHẦN 1: CÁC HÀM XỬ LÝ TRẠNG THÁI GIAO DIỆN CHÍNH (LOADING, ERROR, EMPTY, SUCCESS, PAGINATION)
// =============================================================================

/**
 * Hiển thị trạng thái đang tải (Loading spinner)
 * 
 * @param {HTMLElement} container - Phần tử DOM chứa
 * @param {string} [message='Đang tải dữ liệu...'] - Nội dung thông báo đang tải
 */
export function showLoading(container, message = 'Đang tải dữ liệu...') {
  if (!container) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'empty-state';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  wrapper.appendChild(spinner);

  if (message) {
    const textEl = document.createElement('p');
    textEl.textContent = message;
    textEl.style.marginTop = '12px';
    textEl.style.color = 'var(--slate-500)';
    wrapper.appendChild(textEl);
  }

  container.replaceChildren(wrapper);
}

/**
 * Hiển thị trạng thái lỗi (Alert đỏ kèm thông báo lỗi từ backend)
 * 
 * @param {HTMLElement} container - Phần tử DOM chứa
 * @param {string} [message='Đã có lỗi xảy ra. Vui lòng thử lại!'] - Thông báo lỗi
 */
export function showError(container, message = 'Đã có lỗi xảy ra. Vui lòng thử lại!') {
  if (!container) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-danger';
  alert.setAttribute('role', 'alert');

  const icon = document.createElement('span');
  icon.textContent = '❌ ';
  alert.appendChild(icon);

  const text = document.createElement('span');
  text.textContent = message;
  alert.appendChild(text);

  container.replaceChildren(alert);
}

/**
 * Hiển thị trạng thái không có dữ liệu (Empty state)
 * 
 * @param {HTMLElement} container - Phần tử DOM chứa
 * @param {string} [message='Không tìm thấy dữ liệu phù hợp.'] - Thông báo trống
 */
export function showEmpty(container, message = 'Không tìm thấy dữ liệu phù hợp.') {
  if (!container) return;

  const empty = document.createElement('div');
  empty.className = 'empty-state';

  const icon = document.createElement('div');
  icon.style.fontSize = '36px';
  icon.style.marginBottom = '12px';
  icon.textContent = '🔍';
  empty.appendChild(icon);

  const text = document.createElement('p');
  text.textContent = message;
  empty.appendChild(text);

  container.replaceChildren(empty);
}

/**
 * Hiển thị thông báo thành công (Alert xanh)
 * 
 * @param {HTMLElement} container - Phần tử DOM chứa
 * @param {string} [message='Thao tác thành công!'] - Thông báo thành công
 */
export function showSuccess(container, message = 'Thao tác thành công!') {
  if (!container) return;

  const alert = document.createElement('div');
  alert.className = 'alert alert-success';
  alert.setAttribute('role', 'status');

  const icon = document.createElement('span');
  icon.textContent = '✅ ';
  alert.appendChild(icon);

  const text = document.createElement('span');
  text.textContent = message;
  alert.appendChild(text);

  container.replaceChildren(alert);
}

/**
 * Hiển thị Toast thông báo nổi góc màn hình (Tự động biến mất sau thời gian hẹn)
 * 
 * @param {string} message - Nội dung thông báo
 * @param {'success'|'danger'|'warning'|'info'} [type='success'] - Phân loại thông báo
 * @param {number} [duration=3000] - Thời gian hiển thị (mili giây)
 */
export function showToast(message, type = 'success', duration = 3000) {
  if (typeof document === 'undefined') return;

  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    toastContainer.style.maxWidth = '360px';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `alert alert-${type}`;
  toast.style.boxShadow = 'var(--shadow-lg)';
  toast.style.margin = '0';
  toast.style.animation = 'fadeIn 0.25s ease-out';

  const iconSpan = document.createElement('span');
  iconSpan.textContent = type === 'success' ? '✅ ' : type === 'danger' ? '❌ ' : 'ℹ️ ';
  toast.appendChild(iconSpan);

  const textSpan = document.createElement('span');
  textSpan.textContent = message;
  toast.appendChild(textSpan);

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
    if (toastContainer.children.length === 0) {
      toastContainer.remove();
    }
  }, duration);
}

/**
 * Vẽ thanh điều hướng phân trang (Pagination)
 * 
 * @param {HTMLElement} container - Phần tử DOM chứa phân trang
 * @param {Object} options - Tham số phân trang
 * @param {number} options.currentPage - Trang hiện tại (1-based)
 * @param {number} options.totalPages - Tổng số trang
 * @param {Function} options.onPageChange - Hàm callback khi chuyển trang: (page: number) => void
 */
export function renderPagination(container, { currentPage = 1, totalPages = 1, onPageChange }) {
  if (!container) return;

  container.replaceChildren();

  // Không hiển thị hoặc hiển thị trống nếu chỉ có <= 1 trang
  if (totalPages <= 1) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.className = 'pagination-wrapper';
  container.setAttribute('aria-label', 'Phân trang hoạt động');

  // Nút Quay lại trang trước ("«")
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'page-btn';
  prevBtn.textContent = '«';
  prevBtn.setAttribute('aria-label', 'Trang trước');

  if (currentPage <= 1) {
    prevBtn.disabled = true;
  } else {
    prevBtn.addEventListener('click', () => {
      if (typeof onPageChange === 'function') {
        onPageChange(currentPage - 1);
      }
    });
  }
  container.appendChild(prevBtn);

  // Các nút số trang (1 .. totalPages)
  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement('button');
    pageBtn.type = 'button';
    pageBtn.className = 'page-btn';
    pageBtn.textContent = String(p);

    if (p === currentPage) {
      pageBtn.classList.add('active');
      pageBtn.setAttribute('aria-current', 'page');
    } else {
      pageBtn.addEventListener('click', () => {
        if (typeof onPageChange === 'function') {
          onPageChange(p);
        }
      });
    }

    container.appendChild(pageBtn);
  }

  // Nút Chuyển trang tiếp theo ("»")
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'page-btn';
  nextBtn.textContent = '»';
  nextBtn.setAttribute('aria-label', 'Trang tiếp theo');

  if (currentPage >= totalPages) {
    nextBtn.disabled = true;
  } else {
    nextBtn.addEventListener('click', () => {
      if (typeof onPageChange === 'function') {
        onPageChange(currentPage + 1);
      }
    });
  }
  container.appendChild(nextBtn);
}

// =============================================================================
// PHẦN 2: CÁC HÀM THUẦN TIỆN ÍCH DÙNG CHUNG (PURE FUNCTIONS CHO KIỂM THỬ DÒNG 431)
// =============================================================================

/**
 * Định dạng chuỗi ISO ngày giờ sang định dạng thân thiện tiếng Việt: HH:mm DD/MM/YYYY
 * 
 * @param {string|Date} input - Chuỗi ngày giờ (ví dụ: '2026-11-05T07:30:00')
 * @returns {string} - Chuỗi định dạng (ví dụ: '07:30 05/11/2026') hoặc '' nếu không hợp lệ
 */
export function formatDateTime(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${hours}:${minutes} ${day}/${month}/${year}`;
}

/**
 * Định dạng chuỗi ISO ngày sang định dạng DD/MM/YYYY
 * 
 * @param {string|Date} input - Chuỗi ngày (ví dụ: '2026-11-05')
 * @returns {string} - Chuỗi định dạng '05/11/2026' hoặc '' nếu không hợp lệ
 */
export function formatDate(input) {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Tạo query string từ đối tượng tham số (loại bỏ giá trị rỗng/null/undefined)
 * 
 * @param {Record<string, any>} params - Đối tượng tham số (ví dụ: { page: 2, q: 'hiến máu', category: '' })
 * @returns {string} - Chuỗi URL query (ví dụ: '?page=2&q=hi%E1%BA%BFn+m%C3%A1u')
 */
export function buildQueryString(params = {}) {
  if (!params || typeof params !== 'object') return '';

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Phân tích query string từ URL thành đối tượng key-value
 * 
 * @param {string} [searchStr] - Chuỗi query (mặc định lấy window.location.search)
 * @returns {Record<string, string>}
 */
export function parseQueryParams(searchStr) {
  const query = searchStr !== undefined 
    ? searchStr 
    : (typeof window !== 'undefined' ? window.location.search : '');

  const params = {};
  if (!query) return params;

  const urlParams = new URLSearchParams(query);
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}

/**
 * Kiểm tra tính hợp lệ dữ liệu biểu mẫu tạo/sửa hoạt động CLB (HTML5 + JS validation)
 * 
 * @param {Object} data - Dữ liệu biểu mẫu
 * @param {string} data.title - Tiêu đề hoạt động
 * @param {string} data.start_time - Thời gian bắt đầu
 * @param {string} data.end_time - Thời gian kết thúc
 * @param {number|string} data.capacity - Số lượng chỗ tối đa
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateActivityForm(data = {}) {
  const errors = {};

  if (!data.title || String(data.title).trim().length < 5) {
    errors.title = 'Tiêu đề hoạt động phải có ít nhất 5 ký tự.';
  }

  if (!data.start_time) {
    errors.start_time = 'Vui lòng chọn thời gian bắt đầu.';
  }

  if (!data.end_time) {
    errors.end_time = 'Vui lòng chọn thời gian kết thúc.';
  } else if (data.start_time && new Date(data.end_time) <= new Date(data.start_time)) {
    errors.end_time = 'Thời gian kết thúc phải diễn ra sau thời gian bắt đầu.';
  }

  const cap = Number(data.capacity);
  if (!data.capacity || Number.isNaN(cap) || cap < 1 || !Number.isInteger(cap)) {
    errors.capacity = 'Số lượng chỗ phải là số nguyên dương lớn hơn 0.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Định dạng văn bản hiển thị số chỗ còn lại của hoạt động
 * 
 * @param {number} capacity - Sức chứa tối đa
 * @param {number} registeredCount - Số lượng đã đăng ký
 * @returns {string} - Ví dụ: "Còn 15 / 50 chỗ" hoặc "Đã hết chỗ"
 */
export function formatRemainingSeats(capacity, registeredCount = 0) {
  const cap = Number(capacity) || 0;
  const reg = Number(registeredCount) || 0;
  const remaining = Math.max(0, cap - reg);

  if (remaining <= 0) {
    return 'Đã hết chỗ';
  }
  return `Còn ${remaining} / ${cap} chỗ`;
}
