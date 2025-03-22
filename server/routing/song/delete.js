const db = require("../../db");
const fs = require("fs").promises;
const path = require("path");

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }
    const [results] = await db.query(
      "SELECT file_path FROM songs WHERE id = ?",
      [id]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ error: "Bài hát không tồn tại" });
    }

    const filePath = path.resolve(
      __dirname,
      "../../uploads/songs",
      path.basename(results[0].file_path)
    );

    // delete in file system
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.warn(
          "Cảnh báo: File không tồn tại trên hệ thống, chỉ xóa trong database"
        );
      } else {
        console.error("Lỗi khi xóa file:", err);
        return res
          .status(500)
          .json({ error: "Không thể xóa file trên server" });
      }
    }

    const [deleteResult] = await db.query("DELETE FROM songs WHERE id = ?", [
      id,
    ]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài hát để xóa" });
    }

    res.status(200).json({ message: "Xóa bài hát thành công" });
  } catch (err) {
    console.error("Lỗi server:", err);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu" });
  }
};
