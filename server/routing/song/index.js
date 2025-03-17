const db = require("../../db");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    let query = "SELECT * FROM songs";
    let params = [];

    if (id) {
      query += " WHERE id = ?";
      params.push(id);
    }

    const [results] = await db.execute(query, params);

    if (id && results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài hát" });
    }

    res.json(id ? results[0] : results);
  } catch (err) {
    console.error("Lỗi khi truy vấn database:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách bài hát" });
  }
};
