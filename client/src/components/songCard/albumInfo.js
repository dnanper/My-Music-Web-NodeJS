import React from "react";
import "./albumInfo.css";

export default function AlbumInfo({ song }) {
  return (
    <div className="albumInfo-card">
      <div className="albumName-container">
        <div className="marquee">
          <p>{`${song?.title} - ${song?.artist}`}</p>
        </div>
      </div>
      <div className="album-info">
        <p>{`Genre: ${song?.genre || "Unknown"} | Uploaded by: ${
          song?.uploaded_by || "Unknown"
        }`}</p>
      </div>
      <div className="album-release">
        <p>{`Uploaded at: ${new Date(
          song?.uploaded_at
        ).toLocaleDateString()}`}</p>
      </div>
    </div>
  );
}
