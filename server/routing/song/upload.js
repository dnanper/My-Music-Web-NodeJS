const db = require("../../db");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");

const uploadDir = "uploads/songs";

(async () => {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Lỗi khi tạo thư mục upload:", err);
  }
})();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("file");

module.exports = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => (err ? reject(err) : resolve()));
    });
    const { artist, title } = req.body;
    console.log("artist", artist);
    console.log(req.file.originalname);
    console.log("title", title);
    if (!artist || !title || !req.file) {
      return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
    }

    const filePath = "/uploads/songs/" + req.file.originalname;
    const query =
      "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)";

    const [result] = await db.execute(query, [title, artist, filePath]);

    res.status(200).json({
      message: "Upload thành công!",
      songId: result.insertId,
    });
  } catch (err) {
    console.error("Lỗi trong quá trình upload:", err);
    res.status(500).json({ error: "Lỗi khi upload file" });
  }
};
