const db = require("../../db");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

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
        "500x500"
      );
      // console.log("✅ Link ảnh:", artworkUrl);
      return artworkUrl;
    }
  } catch (err) {
    console.error("Lỗi lấy ảnh từ iTunes:", err);
  }
  return null;
}

module.exports = async (req, res) => {
  try {
    const songId = req.params.id;

    if (!songId) {
      return res.status(400).json({ error: "Thiếu ID bài hát" });
    }

    // Lấy đường dẫn file từ database
    const [results] = await db.execute(
      "SELECT file_path, title, artist FROM songs WHERE id = ?",
      [songId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy bài hát" });
    }

    const filePath = path.resolve(
      __dirname,
      "../../uploads/songs",
      path.basename(results[0].file_path)
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File không tồn tại" });
    }

    // const imageUrl = await getSongImage(song.title, song.artist);

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    // Xử lý tua nhạc (seek)
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return res.status(416).json({ error: "Khoảng byte không hợp lệ" });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "audio/mpeg",
      });

      fileStream.pipe(res);
    } else {
      // Phát nhạc từ đầu
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
        // "Song-Image": imageUrl,
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error("Lỗi khi phát nhạc:", err);
    res.status(500).json({ error: "Lỗi server khi phát bài hát" });
  }
};
