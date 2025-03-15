const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "root",
  database: "musicdb",
  port: 3307,
  waitForConnections: true,
  connectionLimit: 10, // Số kết nối tối đa
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error("Không thể kết nối MySQL:", err);
  } else {
    console.log("Kết nối MySQL thành công!");
    connection.release(); // Giải phóng kết nối sau khi kiểm tra
  }
});

module.exports = pool;
