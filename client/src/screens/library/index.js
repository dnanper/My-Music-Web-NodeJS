import React, { useState, useEffect } from "react";
import API from "../../API";
import { useNavigate } from "react-router-dom";
import {
  FaMusic,
  FaHeart,
  FaRegHeart,
  FaDownload,
  FaPlus,
} from "react-icons/fa";
import "./library.css";

export default function MusicLibrary({ onGlobalSongClick }) {
  const [songs, setSongs] = useState([]);
  const [favourites, setFavourites] = useState(new Set());
  const [playlists, setPlaylists] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const navigate = useNavigate();
  const userId = 1;

  // Fetch danh sách bài hát
  useEffect(() => {
    API.getAllSong()
      .then((data) => setSongs(data))
      .catch((error) => console.error("Lỗi khi lấy danh sách bài hát:", error));
  }, []);

  // Fetch danh sách bài hát yêu thích
  useEffect(() => {
    API.getFavour(userId)
      .then((data) => setFavourites(new Set(data.map((song) => song.id))))
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách bài hát yêu thích:", error)
      );
  }, []);

  // Fetch danh sách playlist
  useEffect(() => {
    API.getAllPlaylist(userId)
      .then((data) => setPlaylists(data))
      .catch((error) =>
        console.error("Lỗi khi lấy danh sách playlist:", error)
      );
  }, []);

  const playSong = (id) => {
    console.log("Chọn bài hát:", id);
    onGlobalSongClick(id);
  };

  const downloadSong = (songId, title) => {
    API.download(songId, title);
  };

  // Toggle bài hát yêu thích
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

  // Thêm bài hát vào playlist
  const addToPlaylist = (playlistId) => {
    if (selectedSong) {
      API.addSong(userId, playlistId, selectedSong)
        .then(() => {
          alert("Bài hát đã được thêm vào playlist!");
          setSelectedSong(null);
        })
        .catch((error) => {
          // console.error("Lỗi khi thêm vào playlist:", error)
          alert("Hiện đã tồn tại bài hát trong playlist!");
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
                e.stopPropagation();
                toggleFavourite(song.id);
              }}
            >
              {favourites.has(song.id) ? (
                <FaHeart className="fav-icon active" />
              ) : (
                <FaRegHeart className="fav-icon" />
              )}
            </button>

            {/* Nút Download */}
            <button
              className="download-button"
              onClick={(e) => {
                e.stopPropagation();
                downloadSong(song.id, song.title);
              }}
            >
              <FaDownload className="download-icon" />
            </button>

            {/* Nút Thêm vào Playlist */}
            <button
              className="add-to-playlist-button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSong(song.id);
              }}
            >
              <FaPlus className="playlist-icon" />
            </button>
          </div>
        ))}
      </div>

      {/* Modal chọn playlist */}
      {selectedSong && (
        <div className="modal-overlay" onClick={() => setSelectedSong(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Chọn Playlist</h2>
            <ul className="playlist-list">
              {playlists.length > 0 ? (
                playlists.map((playlist) => (
                  <li
                    className="playlist-item"
                    key={playlist.id}
                    onClick={() => addToPlaylist(playlist.id)}
                  >
                    {playlist.name}
                  </li>
                ))
              ) : (
                <li>Không có playlist nào</li>
              )}
            </ul>
            <button
              className="close-button"
              onClick={() => setSelectedSong(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
