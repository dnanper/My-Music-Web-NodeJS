const db = require("../../db");

module.exports = (req, res) => {
  const { id } = req.params;
  if (!id) {
    const query = "SELECT * FROM songs";
    db.query(query, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Lỗi khi lấy danh sách bài hát",
        });
      }
      res.json(results);
    });
  } else {
    const query = "SELECT * FROM songs WHERE id = ?";
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Lỗi khi lấy thông tin bài hát",
        });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy bài hát" });
      }
      res.json(results[0]);
    });
  }
};
