import React, { useRef, useEffect, useState } from "react";
import API from "../../API"; // Đảm bảo API đúng
import "./globalplayer.css"; // Import file CSS
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from "react-icons/fa";

export default function GlobalAudioPlayer({ songId }) {
  const [audioSrc, setAudioSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Khi chọn bài hát mới, tải file nhạc
  useEffect(() => {
    if (!songId) return;
    API.playSong(songId)
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);
      })
      .catch((err) => console.error("Lỗi lấy file nhạc:", err));

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [songId]);

  // Khi có nguồn nhạc mới, load và phát
  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch((e) => console.error("Play error:", e));
      setIsPlaying(true);
    }
  }, [audioSrc]);

  // Cập nhật thanh tiến trình
  useEffect(() => {
    if (!audioRef.current) return;

    const updateProgress = () => {
      if (!audioRef.current) return;
      const percentage =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percentage);
    };

    audioRef.current.addEventListener("timeupdate", updateProgress);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, [audioSrc]);

  // Phát / Dừng nhạc
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Điều chỉnh âm lượng
  const changeVolume = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Xử lý tua bài hát khi click vào thanh tiến trình
  const seekSong = (e) => {
    if (!audioRef.current) return;

    const rect = e.target.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percent = 1 - clickY / rect.height; // Tính phần trăm theo chiều dọc
    audioRef.current.currentTime = percent * audioRef.current.duration;
    setProgress(percent * 100);
  };

  return (
    <div className="global-audio-player">
      <button onClick={togglePlayPause} className="control-button">
        {isPlaying ? <FaPause size={24} /> : <FaPlay size={24} />}
      </button>
      <div className="progress-container" onClick={seekSong}>
        <div className="progress" style={{ height: `${progress}%` }}></div>
      </div>
      <div className="volume-slider-container">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={changeVolume}
          className="volume-slider"
        />
      </div>
      <audio ref={audioRef} src={audioSrc} loop />
    </div>
  );
}
