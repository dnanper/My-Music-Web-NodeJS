const mysql = require("mysql2/promise");

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

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Kết nối MySQL thành công!");
    connection.release();
  } catch (err) {
    console.error("Không thể kết nối MySQL:", err);
  }
})();

module.exports = pool;
