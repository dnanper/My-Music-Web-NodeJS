import React, { useState, useRef, useEffect } from "react";
import "./audioPlayer.css";
import Controls from "./controls";
import ProgressCircle from "./progressCircle";
import WaveAnimation from "./waveAnimation";
import API from "../../API";

export default function AudioPlayer({
  currentTrack,
  currentIndex,
  setCurrentIndex,
  total,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackProgress, setTrackProgress] = useState(0);
  const [audioSrc, setAudioSrc] = useState(null);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());
  const intervalRef = useRef();

  useEffect(() => {
    if (currentTrack) {
      API.playSong(currentTrack.id)
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          setAudioSrc(url);
        })
        .catch((err) => console.error("Lỗi lấy file nhạc:", err));
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioSrc) {
      audioRef.current.pause();
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      setTrackProgress(0);

      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });

      if (isPlaying) {
        audioRef.current.play();
        startTimer();
      }
    }
  }, [audioSrc]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const startTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        handleNext();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      clearInterval(intervalRef.current);
      if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < total.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : total.length - 1
    );
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // const addZero = (n) => (n > 9 ? "" + n : "0" + n);
  // const { dur_tion } = audioRef.current;
  // const currentPercentage = dur_tion ? (trackProgress / dur_tion) * 100 : 0;
  const artists = currentTrack?.artist || "Unknown";

  return (
    <div className="player-body flex">
      <div className="player-left-body">
        <ProgressCircle
          percentage={duration ? (trackProgress / duration) * 100 : 0}
          isPlaying={true}
          image={currentTrack?.image}
          size={300}
          color="#C96850"
          onSeek={(newPercentage) => {
            const newTime = (newPercentage / 100) * duration;
            audioRef.current.currentTime = newTime;
            setTrackProgress(newTime);
          }}
        />
      </div>
      <div className="player-right-body flex">
        <p className="song-title">{currentTrack?.title}</p>
        <p className="song-artist">{currentTrack?.artist || "Unknown"}</p>
        <div className="player-right-bottom flex">
          <div className="song-duration flex">
            {/* <p className="duration">0:{addZero(Math.round(trackProgress))}</p> */}
            <p className="duration">{formatTime(trackProgress)}</p>
            <WaveAnimation isPlaying={isPlaying} />
            <p className="duration">{formatTime(duration)}</p>
          </div>
          <Controls
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            handleNext={handleNext}
            handlePrev={handlePrev}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
