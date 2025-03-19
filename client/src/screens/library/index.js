import React, { useState, useEffect } from "react";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import { FaMusic } from "react-icons/fa";
import "./library.css";

export default function MusicLibrary() {
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.getAllSong()
      .then((data) => {
        console.log("Dữ liệu API trả về:", data);
        setSongs(data);
      })
      .catch((error) => console.error("Lỗi khi lấy danh sách bài hát:", error));
  }, []);

  const playSong = (id) => {
    // navigate("/player", { state: { id: id } });
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

            <p className="playlist-title">{song.title}</p>
            <p className="playlist-subtitle">
              {song.artist || "Unknown Artist"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
