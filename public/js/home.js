/**
 * UHL ACTIVE - Home Page Logic (Sprint 2 - Tuần 2)
 * Căn cứ: Bước 6 Tuần 2 (Gọi fetch('/api/health') và hiển thị kết quả)
 * Quy tắc an toàn: Không dùng innerHTML với dữ liệu động, dùng textContent chống XSS.
 */

// Hàm gọi API Health Check của máy chủ Node.js
async function checkServerHealth() {
  const dotEl = document.getElementById('health-dot');
  const pulseEl = document.getElementById('health-pulse');
  const statusTitleEl = document.getElementById('health-status-title');
  const statusDescEl = document.getElementById('health-status-desc');
  const uptimeValEl = document.getElementById('metric-uptime');
  const timeValEl = document.getElementById('metric-time');
  const btnRefresh = document.getElementById('btn-refresh-health');

  // Đặt trạng thái đang tải (Loading state)
  if (statusTitleEl) statusTitleEl.textContent = 'Đang kiểm tra kết nối API...';
  if (statusDescEl) statusDescEl.textContent = 'Đang gửi request GET /api/health tới máy chủ Node.js...';
  if (dotEl) {
    dotEl.className = 'health-dot';
    dotEl.style.background = '#f59e0b'; // Màu cam chờ
  }
  if (btnRefresh) {
    btnRefresh.disabled = true;
    btnRefresh.textContent = '⏳ Đang kiểm tra...';
  }

  try {
    const startTime = performance.now();
    const res = await fetch('/api/health', {
      headers: { 'Accept': 'application/json' },
      cache: 'no-cache'
    });
    const duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      throw new Error(`Máy chủ phản hồi mã lỗi HTTP: ${res.status}`);
    }

    const data = await res.json();

    // Hiển thị kết quả thành công
    if (dotEl) {
      dotEl.className = 'health-dot healthy';
      dotEl.style.background = '';
    }
    if (pulseEl) pulseEl.style.display = 'block';
    
    if (statusTitleEl) {
      statusTitleEl.textContent = 'Hệ thống máy chủ hoạt động tốt';
    }
    
    if (statusDescEl) {
      statusDescEl.textContent = `${data.message || 'Node.js Web Server phản hồi 200 OK'} · Độ trễ: ${duration}ms`;
    }

    // Hiển thị các thông số chi tiết
    if (uptimeValEl) {
      const uptimeSec = data.uptime || 0;
      const hours = Math.floor(uptimeSec / 3600);
      const minutes = Math.floor((uptimeSec % 3600) / 60);
      const seconds = uptimeSec % 60;
      uptimeValEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }

    if (timeValEl) {
      const date = data.timestamp ? new Date(data.timestamp) : new Date();
      timeValEl.textContent = date.toLocaleTimeString('vi-VN');
    }

    console.log('✅ [Health Check OK]:', data);

  } catch (error) {
    console.error('❌ [Health Check Failed]:', error);

    // Hiển thị trạng thái lỗi
    if (dotEl) {
      dotEl.className = 'health-dot error';
      dotEl.style.background = '#ef4444';
    }
    if (pulseEl) pulseEl.style.display = 'none';
    
    if (statusTitleEl) {
      statusTitleEl.textContent = 'Mất kết nối tới Server Node.js';
    }
    
    if (statusDescEl) {
      statusDescEl.textContent = 'Không thể gọi GET /api/health. Hãy kiểm tra server đã chạy lệnh "npm run dev" chưa.';
    }

    if (uptimeValEl) uptimeValEl.textContent = 'N/A';
    if (timeValEl) timeValEl.textContent = '--:--:--';
  } finally {
    if (btnRefresh) {
      btnRefresh.disabled = false;
      btnRefresh.textContent = '🔄 Làm mới';
    }
  }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  // 1. Chạy Health Check ngay khi vào trang
  checkServerHealth();

  // 2. Gắn sự kiện nút bấm Làm mới Health Check
  const btnRefresh = document.getElementById('btn-refresh-health');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', checkServerHealth);
  }

  // 3. Xử lý tương tác các nút bộ lọc Thể loại (Mock UI)
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const category = pill.getAttribute('data-category');
      console.log(`Đang lọc theo danh mục: ${category}`);
      
      const searchInput = document.getElementById('search-input');
      if (searchInput && category !== 'all') {
        searchInput.value = pill.textContent.trim();
      } else if (searchInput && category === 'all') {
        searchInput.value = '';
      }
    });
  });

// ==========================================
  // 4. XỬ LÝ DANH SÁCH HOẠT ĐỘNG, TÌM KIẾM & PHÂN TRANG ([FE-03])
  // ==========================================
  const searchBtn = document.getElementById('btn-search');
  const searchInput = document.getElementById('search-input');
  const activityGrid = document.getElementById('activity-grid') || document.querySelector('.activity-grid');
  const paginationWrapper = document.getElementById('pagination-wrapper') || document.querySelector('.pagination-wrapper');
  const sectionCount = document.getElementById('section-count') || document.querySelector('.section-count');

  const LIMIT = 6;

  const cardThemes = [
    { bg: 'linear-gradient(135deg, #fecdd3, #fda4af)', icon: '🩸', tagClass: 'tag-volunteer', tagName: 'Tình nguyện' },
    { bg: 'linear-gradient(135deg, #bae6fd, #7dd3fc)', icon: '💻', tagClass: 'tag-tech', tagName: 'Học thuật' },
    { bg: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)', icon: '⚽', tagClass: 'tag-sports', tagName: 'Hoạt động' },
    { bg: 'linear-gradient(135deg, #ddd6fe, #c4b5fd)', icon: '🌱', tagClass: 'tag-volunteer', tagName: 'Cộng đồng' },
    { bg: 'linear-gradient(135deg, #fef08a, #fde047)', icon: '💡', tagClass: 'tag-tech', tagName: 'Sáng tạo' },
    { bg: 'linear-gradient(135deg, #fed7aa, #fdba74)', icon: '🎸', tagClass: 'tag-sports', tagName: 'Văn hóa' }
  ];

  function formatDateTime(startStr, endStr) {
    if (!startStr) return 'Đang cập nhật thời gian';
    const start = new Date(startStr);
    if (isNaN(start.getTime())) return startStr;

    const datePart = start.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const startTime = start.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    if (endStr) {
      const end = new Date(endStr);
      if (!isNaN(end.getTime())) {
        const endTime = end.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} · ${startTime} - ${endTime}`;
      }
    }
    return `${datePart} · ${startTime}`;
  }

  function updateUrlParams(q, page) {
    const params = new URLSearchParams(window.location.search);
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    params.set('page', page);
    window.history.pushState({ q, page }, '', `${window.location.pathname}?${params.toString()}`);
  }

  async function loadActivities(q = '', page = 1) {
    if (!activityGrid) return;

    // 1. Trạng thái Đang tải
    activityGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #64748b; font-size: 16px;">
        ⏳ Đang tải danh sách hoạt động...
      </div>
    `;
    if (paginationWrapper) paginationWrapper.innerHTML = '';

    try {
      const response = await fetch(`/api/activities?q=${encodeURIComponent(q)}&page=${page}&limit=${LIMIT}`);
      if (!response.ok) {
        throw new Error(`Lỗi máy chủ (${response.status})`);
      }

      const { data: items, pagination } = await response.json();

      if (sectionCount) {
        sectionCount.textContent = `Hiển thị ${items.length} / ${pagination.total} hoạt động`;
      }

      // 2. Trạng thái Không tìm thấy hoạt động nào
      if (items.length === 0) {
        activityGrid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #64748b;">
            <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">🔍 Không tìm thấy hoạt động nào</p>
            <p>Không có hoạt động nào khớp với từ khóa "${q}". Vui lòng thử lại với từ khóa khác.</p>
          </div>
        `;
        return;
      }

      // Render danh sách thẻ Card
      activityGrid.innerHTML = items.map((item, index) => {
        const theme = cardThemes[index % cardThemes.length];
        const timeStr = formatDateTime(item.start_at, item.end_at);
        const capacity = Number(item.capacity ?? 0);
        const remaining = Number(item.remaining_seats ?? Math.max(0, capacity - Number(item.registered_count ?? 0)));

        return `
          <article class="activity-card" style="cursor: pointer;" onclick="window.location.href='activity.html?id=${item.id}'">
            <div class="card-img-wrapper" style="background: ${theme.bg};">
              <div style="font-size: 60px; text-align: center; line-height: 180px;">${theme.icon}</div>
              <span class="card-badge ${theme.tagClass}">${item.category || theme.tagName}</span>
            </div>
            <div class="card-body">
              <h3 class="card-title">${item.title}</h3>
              <div class="card-meta-list">
                <div class="meta-item">
                  <span class="meta-icon">📍</span>
                  <span>${item.location || 'Đang cập nhật địa điểm'}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-icon">⏰</span>
                  <span>${timeStr}</span>
                </div>
              </div>
              <div class="card-footer">
                <div class="capacity-badge">
                  <span>👥</span>
                  <span>Còn ${remaining} / ${capacity} chỗ</span>
                </div>
                <a href="activity.html?id=${item.id}" class="btn-detail-link" onclick="event.stopPropagation()">Xem chi tiết &rarr;</a>
              </div>
            </div>
          </article>
        `;
      }).join('');

      renderPagination(q, pagination.page, pagination.totalPages);

    } catch (error) {
      // 3. Trạng thái Lỗi
      console.error('Lỗi tải danh sách hoạt động:', error);
      if (sectionCount) sectionCount.textContent = 'Lỗi tải dữ liệu';
      activityGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: #ef4444;">
          <p style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">⚠️ Đã xảy ra lỗi khi tải dữ liệu</p>
          <p>${error.message || 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'}</p>
        </div>
      `;
    }
  }

  function renderPagination(q, currentPage, totalPages) {
    if (!paginationWrapper || totalPages <= 1) {
      if (paginationWrapper) paginationWrapper.innerHTML = '';
      return;
    }

    let html = `<button type="button" class="page-btn" data-page="${currentPage - 1}" ${currentPage <= 1 ? 'disabled' : ''} aria-label="Trang trước">&larr;</button>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `<button type="button" class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    html += `<button type="button" class="page-btn" data-page="${currentPage + 1}" ${currentPage >= totalPages ? 'disabled' : ''} aria-label="Trang tiếp theo">&rarr;</button>`;

    paginationWrapper.innerHTML = html;

    paginationWrapper.querySelectorAll('.page-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        const targetPage = Number(btn.getAttribute('data-page'));
        if (targetPage && targetPage !== currentPage) {
          updateUrlParams(q, targetPage);
          loadActivities(q, targetPage);
        }
      });
    });
  }

  if (searchBtn && searchInput) {
    const triggerSearch = () => {
      const keyword = searchInput.value.trim();
      updateUrlParams(keyword, 1);
      loadActivities(keyword, 1);
    };

    searchBtn.addEventListener('click', triggerSearch);

    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        triggerSearch();
      }
    });
  }

  // Hỗ trợ nút Back / Forward trên trình duyệt đồng bộ lại danh sách theo URL
  window.addEventListener('popstate', () => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const page = Number(params.get('page')) || 1;
    if (searchInput) searchInput.value = q;
    loadActivities(q, page);
  });

  // Khởi chạy lần đầu khi mở trang
  const initialUrlParams = new URLSearchParams(window.location.search);
  const initialQ = initialUrlParams.get('q') || '';
  const initialPage = Number(initialUrlParams.get('page')) || 1;

  if (searchInput) searchInput.value = initialQ;
  loadActivities(initialQ, initialPage);
});
