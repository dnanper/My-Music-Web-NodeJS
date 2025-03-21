import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../API";
import "./playlist.css";
import { useMusic } from "../../context";

export default function Playlist({ setSelectPlaylist }) {
  const { setTracks, setCurrentTrack, setCurrentIndex } = useMusic();
  const [playlists, setPlaylists] = useState([]);
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
    navigate("/player");
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
              src={playlist.coverImage || "/default-cover.jpg"}
              alt="Playlist Cover"
            />
            <div className="playlist-info">
              <p className="playlist-title">{playlist.name}</p>
              <p className="playlist-subtitle">
                {playlist.created_at.split("T")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
