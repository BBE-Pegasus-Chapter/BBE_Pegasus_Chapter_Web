// 1. Kích hoạt đọc file .env bí mật (Phải để trên cùng)
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ==========================================
// 🛡️ TẦNG BẢO MẬT (MIDDLEWARE)
// ==========================================

// Bật khiên Helmet che giấu thông tin công nghệ
app.use(helmet()); 
app.use(cors());

// Bộ giới hạn: Chống Spam / Chống DDoS F5 liên tục
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn tối đa 100 lần truy cập cho mỗi IP trong 15 phút
  message: { error: "Bạn truy cập quá nhanh, vui lòng thử lại sau 15 phút!" },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Áp dụng bộ giới hạn này cho tất cả các đường link có chữ /api/
app.use('/api/', apiLimiter);


// ==========================================
// 🗄️ KẾT NỐI DATABASE (BẢO MẬT THÔNG TIN)
// ==========================================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Thêm cái này để bảo vệ dữ liệu truyền qua lại không bị nghe lén (SSL)
  ssl: { rejectUnauthorized: false } 
});


// ==========================================
// 🚀 API ENDPOINTS
// ==========================================
app.get('/api/leaderboard', (req, res) => {
  const sql = 'SELECT * FROM Dashboard ORDER BY Gains DESC';
  
  db.query(sql, (err, results) => {
    // ⚠️ XỬ LÝ LỖI CHUYÊN NGHIỆP: Không dùng "throw err" để tránh sập Server
    if (err) {
      console.error("Lỗi Database: ", err.message); // In lỗi ra màn hình cho mình xem
      return res.status(500).json({ error: "Lỗi hệ thống! Không thể lấy dữ liệu." }); // Báo lỗi lịch sự cho người dùng
    }
    
    // Map dữ liệu nếu không có lỗi
    const rankedData = results.map((user, index) => ({
      rank: index + 1,
      name: user.Hovaten,
      invited: user.Moikhach,
      gains: user.Gains,
      My_Post: user.My_Post,
      kpi: user.KPI 
    }));

    res.json(rankedData);
  });
});

// ==========================================
// 🟢 CHẠY SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server ĐÃ ĐƯỢC BẢO MẬT đang chạy tại http://localhost:${PORT}`);
});