import React, { useState, useEffect } from "react";
import API from "../../API";
import { FaMusic, FaHeart, FaRegHeart } from "react-icons/fa";
import "./favour.css";

export default function Favorites() {
  const [songs, setSongs] = useState([]);
  const [favourites, setFavourites] = useState(new Set());
  const userId = 1;

  useEffect(() => {
    API.getAllSong()
      .then((data) => {
        setSongs(data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách bài hát:", error));

    API.getFavour(userId)
      .then((data) => {
        setFavourites(new Set(data.map((song) => song.id)));
      })
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách yêu thích:", error)
      );
  }, []);

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
        setFavourites((prev) => new Set([...prev, songId]));
      });
    }
  };

  const favouriteSongs = songs.filter((song) => favourites.has(song.id));

  return (
    <div className="screen-container">
      <div className="favour-body">
        {favouriteSongs.length === 0 ? (
          <p>Không có bài hát yêu thích nào.</p>
        ) : (
          favouriteSongs.map((song) => (
            <div className="playlist-card" key={song.id}>
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

              <button
                className="favourite-button-f"
                onClick={() => toggleFavourite(song.id)}
              >
                {favourites.has(song.id) ? (
                  <FaHeart className="liked-icon active" />
                ) : (
                  <FaRegHeart className="unliked-icon" />
                )}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
