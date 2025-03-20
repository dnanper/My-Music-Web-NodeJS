import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../API";
import "./playlist.css";

export default function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    apiClient.getAllPlaylist(userId).then((data) => {
      setPlaylists(data);
    });
  }, []);

  const handlePlaylistClick = (playlist) => {
    navigate("/player", { state: { id: playlist.id } });
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
