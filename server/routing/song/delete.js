const db = require("../../db");
const fs = require("fs");
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

    // file system
    const filePath = path.resolve(
      __dirname,
      "../../../uploads/songs",
      path.basename(results[0].file_path)
    );
    console.log("Deleting file:", filePath);
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        console.error("Lỗi khi xóa file:", err);
        return res.status(500).json({ error: "Lỗi khi xóa file trên server" });
      }

      // mysql database
      db.query("DELETE FROM songs WHERE id = ?", [id], (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: "Lỗi khi xóa bài hát trong database" });
        }

        res.status(200).json({ message: "Xóa bài hát thành công" });
      });
    });
  });
};
