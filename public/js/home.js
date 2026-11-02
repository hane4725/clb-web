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

  // 4. Xử lý form tìm kiếm
  const searchBtn = document.getElementById('btn-search');
  const searchInput = document.getElementById('search-input');
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      const keyword = searchInput.value.trim();
      if (keyword) {
        alert(`Tính năng tìm kiếm với từ khóa "${keyword}" sẽ được kết nối với API Tuần 3 (Sprint 3: Backend API)!`);
      } else {
        alert('Vui lòng nhập từ khóa tìm kiếm (Ví dụ: "Hiến máu").');
      }
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchBtn.click();
      }
    });
  }
});
