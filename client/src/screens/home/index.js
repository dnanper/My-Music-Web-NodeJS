import { MusicProvider } from "../../context";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "../auth/login";
import Library from "../library";
import Player from "../player";
import Playlist from "../playlist";
import Favorites from "../favourites";
import Upload from "../upload";
import Sidebar from "../../components/sidebar";
import GlobalPlayer from "../../components/globalplayer";
import "./home.css";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState(false);
  const [currentGlobalSongId, setCurrentGlobalSongId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("authenticatedUser");
    if (storedUser) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (username, password) => {
    const isValidUser = checkUserInDatabase(username, password);
    if (isValidUser) {
      localStorage.setItem("authenticatedUser", JSON.stringify({ username }));
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return !isAuthenticated ? (
    <Login onLogin={handleLogin} errorMessage={loginError} />
  ) : (
    <MusicProvider>
      <Router>
        <HomeContent
          selectedPlaylist={selectedPlaylist}
          setSelectedPlaylist={setSelectedPlaylist}
          currentGlobalSongId={currentGlobalSongId}
          setCurrentGlobalSongId={setCurrentGlobalSongId}
        />
      </Router>
    </MusicProvider>
  );
}

function HomeContent({
  selectedPlaylist,
  setSelectedPlaylist,
  currentGlobalSongId,
  setCurrentGlobalSongId,
}) {
  const location = useLocation();

  // Xử lý khi thoát Player thì load lại bài
  useEffect(() => {
    if (location.pathname !== "/player" && currentGlobalSongId) {
      setTimeout(() => {
        setCurrentGlobalSongId((prevSongId) => prevSongId);
      }, 100);
    }
  }, [location.pathname]);

  return (
    <div className="main-body">
      <Sidebar isPlayerDisabled={!selectedPlaylist} />
      <Routes>
        <Route
          path="/"
          element={<Library onGlobalSongClick={setCurrentGlobalSongId} />}
        />
        <Route
          path="/library"
          element={<Library onGlobalSongClick={setCurrentGlobalSongId} />}
        />
        <Route
          path="/favourites"
          element={<Favorites onGlobalSongClick={setCurrentGlobalSongId} />}
        />
        <Route path="/upload" element={<Upload />} />
        <Route
          path="/playlist"
          element={<Playlist setSelectPlaylist={setSelectedPlaylist} />}
        />
        <Route path="/player" element={<Player />} />
      </Routes>
      {currentGlobalSongId && (
        <GlobalPlayerWrapper songId={currentGlobalSongId} />
      )}
    </div>
  );
}

function GlobalPlayerWrapper({ songId }) {
  const location = useLocation();
  return location.pathname !== "/player" ? (
    <GlobalPlayer songId={songId} />
  ) : null;
}

function checkUserInDatabase(username, password) {
  const users = [
    { username: "admin", password: "123456" },
    { username: "user", password: "password" },
  ];
  return users.some(
    (user) => user.username === username && user.password === password
  );
}
