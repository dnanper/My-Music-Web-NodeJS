const db = require("../../db");
const axios = require("axios");
const path = require("path");

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

    for (let song of results) {
      if (!song.image) {
        const imageUrl = await getSongImage(song.title, song.artist);
        song.image = imageUrl || null;
      }
    }

    res.json(id ? results[0] : results);
  } catch (err) {
    console.error("Lỗi khi truy vấn database:", err);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách bài hát" });
  }
};
