const db = require("../../db");
const bcrypt = require("bcrypt");
const multer = require("multer");

const upload = multer();

module.exports = async (req, res) => {
  try {
    upload.none()(req, res, async (err) => {
      if (err) {
        console.error("Lỗi multer:", err);
        return res.status(400).json({ error: "Lỗi khi xử lý FormData" });
      }

      // console.log("Headers:", req.headers);
      // console.log("Received body:", req.body);

      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Vui lòng nhập đầy đủ thông tin" });
      }

      // Hash password
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      await db.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, passwordHash]
      );

      res.status(201).json({ message: "User được tạo thành công" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi tạo user" });
  }
};
