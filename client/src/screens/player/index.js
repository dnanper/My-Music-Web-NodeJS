import React, { useEffect, useState } from "react";
import "./player.css";
import { useLocation } from "react-router-dom";
import API from "../../API";
import SongCard from "../../components/songCard";
import Queue from "../../components/queue";
import AudioPlayer from "../../components/audioPlayer";
import { useMusic } from "../../context";

export default function Player() {
  const location = useLocation();
  const {
    tracks,
    setTracks,
    currentTrack,
    setCurrentTrack,
    currentIndex,
    setCurrentIndex,
  } = useMusic();
  const [relatedSongs, setRelatedSongs] = useState([]);

  useEffect(() => {
    if (tracks.length === 0 && location.state?.id && location.state?.user_id) {
      API.getPlaylist(location.state.user_id, location.state.id)
        .then((res) => {
          if (Array.isArray(res)) {
            setTracks(res);
            setCurrentTrack(res.length > 0 ? res[0] : null);
          } else {
            console.error("Unexpected API response format:", res);
            setTracks([]);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi tải playlist:", error);
          setTracks([]);
        });
    }
  }, [location.state, tracks]);

  useEffect(() => {
    if (tracks.length > 0) {
      setCurrentTrack(tracks[currentIndex]);
      // if (tracks[currentIndex]?.artist) {
      //   API.getAllSong().then((songs) => {
      //     setRelatedSongs(
      //       songs.filter((song) => song.artist === tracks[currentIndex].artist)
      //     );
      //   });
      // }
    }
  }, [currentIndex, tracks]);

  useEffect(() => {
    if (currentTrack?.artist) {
      fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          currentTrack.artist
        )}&entity=song&limit=3`
      )
        .then((res) => res.json())
        .then((data) => {
          setRelatedSongs(
            data.results.map((song) => ({
              id: song.trackId,
              title: song.trackName,
              image: song.artworkUrl100, // Ảnh album
            }))
          );
        })
        .catch((error) =>
          console.error("Lỗi khi tải bài hát từ iTunes:", error)
        );
    }
  }, [currentTrack]);

  return (
    <div className="screen-container flex">
      <div className="left-player-body">
        <AudioPlayer
          currentTrack={currentTrack}
          total={tracks}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
        <div className="related-songs">
          <div className="related-title">Songs by {currentTrack?.artist}</div>
          <ul className="related-list">
            {relatedSongs.map((song) => (
              <li key={song.id} className="related-item">
                <img
                  src={song.image}
                  alt={song.title}
                  className="related-image"
                />
                <span>{song.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="right-player-body">
        {currentTrack ? (
          <SongCard song={currentTrack} />
        ) : (
          <p>No song selected</p>
        )}
        <Queue tracks={tracks} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
}
