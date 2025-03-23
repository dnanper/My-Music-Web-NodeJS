import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import API from "../../API";
import "./playlist.css";
import { useMusic } from "../../context";

export default function Playlist({ setSelectPlaylist }) {
  const { setTracks, setCurrentTrack, setCurrentIndex } = useMusic();
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    API.getAllPlaylist(userId).then((data) => {
      setPlaylists(data);
    });
  }, []);

  const handlePlaylistClick = (playlist) => {
    API.getPlaylist(playlist.user_id, playlist.id)
      .then((res) => {
        if (Array.isArray(res)) {
          setTracks(res);
          setCurrentTrack(res.length > 0 ? res[0] : null);
          setCurrentIndex(0);
        }
      })
      .catch((error) => console.error("Lỗi tải playlist:", error));
    setSelectPlaylist(true);
    navigate("/player", {
      state: { playlistId: playlist.id, userId: playlist.user_id },
    });
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;

    // API.createPlaylist(userId, { name: newPlaylistName })
    //   .then((newPlaylist) => {
    //     setPlaylists([...playlists, newPlaylist]);
    //     return API.getAllPlaylist(userId);
    //   })
    //   .then((updatedPlaylists) => {
    //     setNewPlaylistName("");
    //     setShowModal(false);
    //   })
    API.createPlaylist(userId, { name: newPlaylistName })
      .then(() => API.getAllPlaylist(userId)) // Fetch lại danh sách từ API
      .then((updatedPlaylists) => {
        setPlaylists(updatedPlaylists); // Cập nhật lại danh sách từ server
        setNewPlaylistName("");
        setShowModal(false);
      })
      .catch((error) => console.error("Lỗi tạo playlist:", error));
  };

  const deletePlaylist = (playlistId) => {
    API.deletePlaylist(userId, playlistId)
      .then(() => {
        setPlaylists(
          playlists.filter((playlist) => playlist.id !== playlistId)
        );
      })
      .catch((error) => console.error("Lỗi xóa playlist:", error));
  };

  return (
    <div className="screen-container">
      <div className="playlist-container">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="playlist-card"
            onClick={() => handlePlaylistClick(playlist)}
          >
            <img
              className="playlist-image"
              src={playlist.coverImage || "/default_image.png"}
              alt="Playlist Cover"
            />
            <div className="playlist-info">
              <p className="playlist-title">{playlist.name}</p>
              <p className="playlist-subtitle">
                {playlist.created_at
                  ? playlist.created_at.split("T")[0]
                  : "Today"}
              </p>
            </div>
            <button
              className="delete-playlist-button"
              onClick={(e) => {
                e.stopPropagation();
                deletePlaylist(playlist.id);
              }}
            >
              <FaTrash className="delete-playlist-icon" />
            </button>
          </div>
        ))}
      </div>
      {/* <div className="playlist-header"> */}{" "}
      <button
        className="add-playlist-button"
        onClick={() => setShowModal(true)}
      >
        + Add
      </button>
      {/* </div> */}
      {/* Modal tạo Playlist */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Tạo Playlist Mới</h2>
            <input
              type="text"
              className="playlist-input"
              placeholder="Nhập tên playlist"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
            />
            <div className="modal-buttons">
              <button className="create-button" onClick={handleCreatePlaylist}>
                Tạo
              </button>
              <button
                className="close-button"
                onClick={() => setShowModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
