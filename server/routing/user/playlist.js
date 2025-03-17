const db = require("../../db");

module.exports = {
  // Get all playlists of user
  viewAll: async (req, res) => {
    const { id } = req.params;
    try {
      const [playlists] = await db.query(
        "SELECT * FROM playlists WHERE user_id = ?",
        [id]
      );
      res.json(playlists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi lấy danh sách playlist" });
    }
  },

  // Create new playlist
  create: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ error: "Tên playlist không được để trống" });
    }
    try {
      const [result] = await db.query(
        "INSERT INTO playlists (user_id, name) VALUES (?, ?)",
        [id, name]
      );
      res.json({
        message: "Tạo playlist thành công",
        playlistId: result.insertId,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi tạo playlist" });
    }
  },

  // Get songs of playlist
  view: async (req, res) => {
    const { id, playlistId } = req.params;
    try {
      const [songs] = await db.query(
        "SELECT s.* FROM songs s INNER JOIN playlist_songs ps ON s.id = ps.song_id WHERE ps.playlist_id = ? AND ps.user_id = ?",
        [playlistId, id]
      );
      res.json(songs);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Lỗi khi lấy danh sách bài hát trong playlist" });
    }
  },

  // Add song to playlist
  add: async (req, res) => {
    const { id, playlistId, songId } = req.params;
    try {
      await db.query(
        "INSERT INTO playlist_songs (user_id, playlist_id, song_id) VALUES (?, ?, ?)",
        [id, playlistId, songId]
      );
      res.json({ message: "Thêm bài hát vào playlist thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi thêm bài hát vào playlist" });
    }
  },

  // Delete song from playlist
  remove: async (req, res) => {
    const { id, playlistId, songId } = req.params;
    try {
      await db.query(
        "DELETE FROM playlist_songs WHERE user_id = ? AND playlist_id = ? AND song_id = ?",
        [id, playlistId, songId]
      );
      res.json({ message: "Xóa bài hát khỏi playlist thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi xóa bài hát khỏi playlist" });
    }
  },

  // delete playlist
  delete: async (req, res) => {
    const { id, playlistId } = req.params;
    try {
      await db.query("DELETE FROM playlists WHERE id = ? AND user_id = ?", [
        playlistId,
        id,
      ]);
      res.json({ message: "Xóa playlist thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi xóa playlist" });
    }
  },

  // play playlist
  play: async (req, res) => {
    try {
      const { id, playlistId } = req.params;

      const [songs] = await db.query(
        `SELECT s.id, s.title, s.artist, s.file_path 
       FROM playlist_songs ps
       JOIN songs s ON ps.song_id = s.id
       WHERE ps.playlist_id = ? AND ps.user_id = ?`,
        [playlistId, id]
      );

      if (songs.length === 0) {
        return res
          .status(404)
          .json({ message: "Playlist trống hoặc không tồn tại" });
      }

      res.json({ playlistId, userId: id, songs });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server khi lấy danh sách phát" });
    }
  },
};
