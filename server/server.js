import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Thư mục chứa tài nguyên tĩnh công khai
const PUBLIC_DIR = path.resolve('public');

// Bảng ánh xạ định dạng MIME Type cho các file tĩnh
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || 'localhost:3000';
  const url = new URL(req.url, `http://${host}`);

  // API 1: Kiểm tra tình trạng sức khỏe hệ thống (Health Check)
  if (req.method === 'GET' && url.pathname === '/api/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
    });
    return res.end(
      JSON.stringify({
        status: 'ok',
        message: 'UHL Active Web Server đang hoạt động tốt',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        uptime: Math.floor(process.uptime()),
        service: 'CLB Web - Sprint 2',
      })
    );
  }

  // Phục vụ file tĩnh trong thư mục public/ (chống tấn công Path Traversal)
  const reqPath = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
  const file = path.join(PUBLIC_DIR, reqPath);

  // Bảo vệ an ninh: Cấm truy cập ngược ra ngoài thư mục public/
  if (!file.startsWith(PUBLIC_DIR + path.sep) && file !== path.join(PUBLIC_DIR, 'index.html')) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden - Không được phép truy cập');
  }

  try {
    const data = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': TYPES[ext] ?? 'application/octet-stream' });
    res.end(data);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html lang="vi">
      <head><meta charset="utf-8"><title>404 Not Found</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>404 - Không tìm thấy trang</h2>
        <p>Tài nguyên bạn yêu cầu không tồn tại trên máy chủ.</p>
        <a href="/" style="color: #0284c7;">Về trang chủ UHL Active</a>
      </body>
      </html>
    `);
  }
});

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`🚀 UHL Active Server đang chạy tại: http://localhost:${PORT}`);
});
