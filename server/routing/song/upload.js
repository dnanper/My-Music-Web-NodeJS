const db = require("../../db");
const multer = require("multer");
const fs = require("fs").promises;
const path = require("path");
const mm = require("music-metadata");

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
    if (!req.file) {
      return res.status(400).json({ error: "Thiếu file" });
    }

    // let { artist, title } = req.body;
    // const filePath = "/uploads/songs/" + req.file.originalname;

    let { artist, title } = req.body;
    const filePath = path.join(uploadDir, req.file.originalname);
    const filedbPath = "/uploads/songs/" + req.file.originalname;
    const query =
      "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)";
    try {
      const metadata = await mm.parseFile(filePath);
      console.log(metadata);
      if (!title) {
        title = metadata.common.title || "Unknown Title";
      }
      if (!artist) {
        artist =
          metadata.common.artist ||
          metadata.common.albumartist ||
          "Unknown Artist";
      }
    } catch (metaErr) {
      console.error("Lỗi khi đọc metadata:", metaErr);
      title = title || "Unknown Title";
      artist = artist || "Unknown Artist";
    }
    const [result] = await db.execute(query, [title, artist, filedbPath]);

    res.status(200).json({
      message: "Upload thành công!",
      songId: result.insertId,
    });
  } catch (err) {
    console.error("Lỗi trong quá trình upload:", err);
    res.status(500).json({ error: "Lỗi khi upload file" });
  }
};
