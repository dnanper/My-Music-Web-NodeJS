import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../auth/login";
import Library from "../library";
import Player from "../player";
import Playlist from "../playlist";
import Favorites from "../favourites";
import Sidebar from "../../components/sidebar";
import "./home.css";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");

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
    <Router>
      <div className="main-body">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/library" element={<Library />} />
          <Route path="/player" element={<Player />} />
          <Route path="/favourites" element={<Favorites />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
      </div>
    </Router>
  );
}

// Giả sử hàm kiểm tra user trong database local (cần thay thế bằng truy vấn thực tế)
function checkUserInDatabase(username, password) {
  const users = [
    { username: "admin", password: "123456" },
    { username: "user", password: "password" },
  ];
  return users.some(
    (user) => user.username === username && user.password === password
  );
}
