import React from "react";
import API from "../../API";
import { FaTrash } from "react-icons/fa";
import "./queue.css";

export default function Queue({ tracks, setCurrentIndex, removeTrack }) {
  return (
    <div className="queue-container flex">
      <div className="queue flex">
        <p className="upNext">Songs List</p>
        <div className="queue-list">
          {tracks?.map((track, index) => (
            <div key={track.id} className="queue-item flex">
              <p className="track-name" onClick={() => setCurrentIndex(index)}>
                {track?.title}
              </p>
              <p className="track-artist">{track?.artist || "Unknown"}</p>
              {/* Nút Xóa */}
              <button
                className="remove-track-button"
                onClick={() => removeTrack(track.id)}
              >
                <FaTrash size={16} className="remove-track-icon" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
