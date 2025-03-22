import React, { useState, useEffect } from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { MdFavorite } from "react-icons/md";
import { FaMusic, FaPlay, FaSignOutAlt } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { IoLibrary } from "react-icons/io5";
// import API from "../../API";

export default function Sidebar({ isPlayerDisabled }) {
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100" // Placeholder khi không có ảnh
  );
  // useEffect(() => {
  //   API.getUser(userId)
  //     .then((data) => {
  //       if (data.profileImage) setProfileImage(data.profileImage);
  //     })
  //     .catch((err) => console.error("Lỗi khi lấy ảnh profile:", err));
  // }, [userId]);
  return (
    <div className="sidebar-container">
      {/* <img src={profileImage} className="profile-img" alt="profile" /> */}
      <div>
        <SidebarButton title="Library" to="/library" icon={<IoLibrary />} />
        <SidebarButton
          title="Favorites"
          to="/favourites"
          icon={<MdFavorite />}
        />
        <SidebarButton title="Upload" to="/upload" icon={<FaUpload />} />
        <SidebarButton title="Playlist" to="/playlist" icon={<FaMusic />} />
        <SidebarButton
          title="Player"
          to={isPlayerDisabled ? "#" : "/player"}
          icon={<FaPlay />}
          className={isPlayerDisabled ? "disabled" : ""}
        />
      </div>
      <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt />} />
    </div>
  );
}
