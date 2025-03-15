const db = require("../../db");
const multer = require("multer");
const fs = require("fs");

const uploadDir = "uploads/songs";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage }).single("file");

module.exports = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to upload file" });
    }

    const { artist, title } = req.body;
    if (!artist || !title || !req.file) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const filePath = "/uploads/songs/" + req.file.originalname;
    const query =
      "INSERT INTO songs (title, artist, file_path) VALUES (?, ?, ?)";
    db.query(query, [title, artist, filePath], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to upload file" });
      }
      res
        .status(200)
        .json({ message: "Upload successful", songId: results.insertId });
    });
  });
};
