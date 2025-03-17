const db = require("../../db");
const bcrypt = require("bcrypt");

module.exports = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin" });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await db.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, passwordHash]
    );

    res.status(201).json({ message: "User được tạo thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi tạo user" });
  }
};
