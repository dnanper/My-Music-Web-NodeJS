const db = require("../../db");

module.exports = {
  view: async (req, res) => {
    try {
      const { id } = req.params;
      const [songs] = await db.query(
        `SELECT s.id, s.title, s.artist, s.file_path 
         FROM favorites f
         JOIN songs s ON f.song_id = s.id
         WHERE f.user_id = ?`,
        [id]
      );
      res.json(songs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server" });
    }
  },

  add: async (req, res) => {
    try {
      const { id, songId } = req.params;
      await db.query("INSERT INTO favorites (user_id, song_id) VALUES (?, ?)", [
        id,
        songId,
      ]);
      res
        .status(201)
        .json({ message: "Thêm vào danh sách yêu thích thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi thêm vào danh sách yêu thích" });
    }
  },

  remove: async (req, res) => {
    try {
      const { id, songId } = req.params;
      await db.query(
        "DELETE FROM favorites WHERE user_id = ? AND song_id = ?",
        [id, songId]
      );
      res.json({ message: "Xóa khỏi danh sách yêu thích thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi xóa khỏi danh sách yêu thích" });
    }
  },
};
