import React, { useState, useEffect } from "react";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaHeart, FaRegHeart } from "react-icons/fa"; // Import icon trái tim
import "./library.css";

export default function MusicLibrary() {
  const [songs, setSongs] = useState([]);
  const [favourites, setFavourites] = useState(new Set());
  const navigate = useNavigate();
  const userId = 1; // Tạm thời đặt userId cố định - yêu cầu của Lab không quan trọng user

  // Lấy danh sách bài hát
  useEffect(() => {
    API.getAllSong()
      .then((data) => {
        setSongs(data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách bài hát:", error));
  }, []);

  // Lấy danh sách bài hát yêu thích của user
  useEffect(() => {
    API.getFavour(userId)
      .then((data) => {
        setFavourites(new Set(data.map((song) => song.id))); // Chuyển danh sách thành Set để tìm kiếm nhanh
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách bài hát yêu thích:", error)
      );
  }, []);

  const playSong = (id) => {
    // navigate("/player", { state: { id: id } });
  };

  // Xử lý thêm/xóa bài hát khỏi danh sách yêu thích
  const toggleFavourite = (songId) => {
    if (favourites.has(songId)) {
      API.removeFavour(userId, songId).then(() => {
        setFavourites((prev) => {
          const updated = new Set(prev);
          updated.delete(songId);
          return updated;
        });
      });
    } else {
      API.addFavour(userId, songId).then(() => {
        setFavourites((prev) => new Set(prev).add(songId));
      });
    }
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {songs.map((song) => (
          <div
            className="playlist-card"
            key={song.id}
            onClick={() => playSong(song.id)}
          >
            {song.image ? (
              <img
                src={song.image}
                className="playlist-image"
                alt="Album Art"
              />
            ) : (
              <div className="song-placeholder">
                <FaMusic className="song-icon" />
              </div>
            )}

            <div className="song-info">
              <p className="playlist-title">{song.title}</p>
              <p className="playlist-subtitle">
                {song.artist || "Unknown Artist"}
              </p>
            </div>

            {/* Nút Yêu thích */}
            <button
              className="favourite-button"
              onClick={(e) => {
                e.stopPropagation(); // Ngăn chặn event onClick của playSong
                toggleFavourite(song.id);
              }}
            >
              {favourites.has(song.id) ? (
                <FaHeart className="fav-icon active" />
              ) : (
                <FaRegHeart className="fav-icon" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
