const db = require("../../db");
const path = require("path");

module.exports = (req, res) => {
  const { id } = req.params;

  db.query("SELECT file_path FROM songs WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Lỗi truy vấn database" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Bài hát không tồn tại" });
    }

    const filePath = path.resolve(
      __dirname,
      "../../../uploads/songs",
      path.basename(results[0].file_path)
    );

    res.download(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải file:", err);
        return res.status(500).json({ error: "Lỗi khi tải file" });
      }
    });
  });
};
