import React from "react";
import "./queue.css";

export default function Queue({ tracks, setCurrentIndex }) {
  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="upNext">Songs List</p>
        <div className="queue-list">
          {tracks?.map((track, index) => (
            <div
              key={index + "key"}
              className="queue-item flex"
              onClick={() => setCurrentIndex(index)}
            >
              <p className="track-name">{track?.title}</p>
              <p className="track-artist">{track?.artist || "Unknown"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
