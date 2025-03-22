const db = require("../../db");
const multer = require("multer");
const axios = require("axios");
const path = require("path");

const upload = multer();

async function getSongImage(title, artist) {
  const searchUrl = "https://itunes.apple.com/search";
  const searchTerm = `${title} ${artist}`.split(" ").join("+");
  const requestUrl = `${searchUrl}?term=${searchTerm}&media=music&limit=1`;

  // console.log("🔎 URL tìm kiếm ảnh:", requestUrl);
  try {
    const response = await axios.get(requestUrl, {
      timeout: 5000,
    });
    // console.log(response.data.results.length);
    if (response.data.results.length > 0) {
      const artworkUrl = response.data.results[0].artworkUrl100.replace(
        "100x100",
        "300x300"
      );
      // console.log("✅ Link ảnh:", artworkUrl);
      return artworkUrl;
    }
  } catch (err) {
    console.error("Lỗi lấy ảnh từ iTunes:", err);
  }
  return null;
}

module.exports = {
  // Get all playlists of user
  viewAll: async (req, res) => {
    const { id } = req.params;
    try {
      const [playlists] = await db.query(
        "SELECT * FROM playlists WHERE user_id = ?",
        [id]
      );
      for (let i = 0; i < playlists.length; i++) {
        // console.log("playlist", playlists[i]);
        const playlistId = playlists[i].id;
        const [songs] = await db.query(
          "SELECT s.* FROM songs s INNER JOIN playlist_songs ps ON s.id = ps.song_id WHERE ps.playlist_id = ? ORDER BY ps.id LIMIT 1",
          [playlistId]
        );

        if (songs.length > 0) {
          const song = songs[0];
          const imageUrl = await getSongImage(song.title, song.artist);
          playlists[i].coverImage = imageUrl || null;
        } else {
          playlists[i].coverImage = null;
        }
      }

      res.json(playlists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi khi lấy danh sách playlist" });
    }
  },

  // Create new playlist: Read from FORM DATA -> use multer
  // Or, can read from json, but now i'm using multer as default, so must use form data
  create: async (req, res) => {
    try {
      upload.none()(req, res, async (err) => {
        if (err) {
          console.error("Lỗi multer:", err);
          return res.status(400).json({ error: "Lỗi khi xử lý FormData" });
        }

        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
          return res
            .status(400)
            .json({ error: "Tên playlist không được để trống" });
        }

        const [result] = await db.query(
          "INSERT INTO playlists (user_id, name) VALUES (?, ?)",
          [id, name]
        );

        res.status(201).json({
          message: "Tạo playlist thành công",
          playlistId: result.insertId,
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Lỗi server khi tạo playlist" });
    }
  },

  // Get songs of playlist
  view: async (req, res) => {
    const { id, playlistId } = req.params;
    console.log("Request received for user:", id, "playlist:", playlistId);
    try {
      const [songs] = await db.query(
        "SELECT s.* FROM songs s INNER JOIN playlist_songs ps ON s.id = ps.song_id WHERE ps.playlist_id = ? AND ps.user_id = ?",
        [playlistId, id]
      );
      for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        const imageUrl = await getSongImage(song.title, song.artist);
        songs[i].image = imageUrl || "/default-cover.jpg";
      }
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
      const [playlist] = await db.query(
        "SELECT id FROM playlists WHERE id = ? AND user_id = ?",
        [playlistId, id]
      );

      if (playlist.length === 0) {
        return res
          .status(403)
          .json({ error: "Bạn không có quyền truy cập playlist này" });
      }

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
