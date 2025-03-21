import React from "react";
import AlbumImage from "./albumImage";
import AlbumInfo from "./albumInfo";
import "./songCard.css";

export default function SongCard({ song }) {
  return (
    <div className="songCard-body flex">
      <AlbumImage url={song?.image} />
      <AlbumInfo song={song} />
    </div>
  );
}
