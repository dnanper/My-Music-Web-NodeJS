const db = require("../../db");
const path = require("path");
const fs = require("fs").promises;

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const [results] = await db.execute(
      "SELECT file_path FROM songs WHERE id = ?",
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Bài hát không tồn tại" });
    }

    const filePath = path.resolve(
      __dirname,
      "../../uploads/songs",
      path.basename(results[0].file_path)
    );

    await fs.access(filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi tải file:", err);
        return res.status(500).json({ error: "Lỗi khi tải file" });
      }
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "File không tồn tại trên server" });
    }
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu" });
  }
};
