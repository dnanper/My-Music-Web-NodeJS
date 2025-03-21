import axios from "axios";
var API = {
  api: axios.create({ baseURL: "http://localhost:5000/api" }),
  // SONG
  getSong: function (id) {
    return this.api.get(`/song/${id}`).then((response) => response.data);
  },
  getAllSong: function () {
    return this.api.get(`/song/`).then((response) => response.data);
  },
  postSong: function (content) {
    let formData = new FormData();
    formData.append("title", content.title);
    formData.append("artist", content.artist);
    formData.append("file", content.file);
    return this.api
      .post(`/song/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }) // content = {title(text)= , artist(text)= ,file(.mp3)= }
      .then((response) => response.data);
  },
  playSong: function (id) {
    return this.api
      .get(`/song/play/${id}`, { responseType: "blob" }) // Lấy .mp3
      .then((response) => response.data);
  },
  download: function (id) {
    return this.api
      .get(`/song/download/${id}`, { responseType: "" }) // type?
      .then((response) => response.data);
  },
  deleteSong: function (id) {
    return this.api.delete(`/song/${id}`).then((response) => response.data);
  },

  // USER
  // user
  getAllUser: function () {
    return this.api.get(`/user/`).then((response) => response.data);
  },
  getUser: function (id) {
    return this.api.get(`/user/${id}`).then((response) => response.data);
  },
  deleteUser: function (id) {
    return this.api.delete(`/user/${id}`).then((response) => response.data);
  },
  createUser: function (content) {
    let formData = new FormData();
    formData.append("username", content.username);
    formData.append("email", content.email);
    formData.append("password", content.password);
    return this.api
      .post(`/user/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }) // content = {username(text)= , email(text)= ,password(text)= }
      .then((response) => response.data);
  },

  // playlist
  getAllPlaylist: function (id) {
    return this.api
      .get(`/user/${id}/playlist`)
      .then((response) => response.data);
  },
  getPlaylist: function (id, playlistId) {
    return this.api
      .get(`user/${id}/playlist/${playlistId}`)
      .then((response) => response.data);
  },
  playPlaylist: function (id, playlistId) {
    return this.api
      .get(`user/${id}/playlist/${playlistId}/play`)
      .then((response) => response.data);
  },
  createPlaylist: function (id, content) {
    let formData = new FormData();
    formData.append("name", content.name);
    return this.api
      .post(`/user/${id}/playlist`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }) // content = {name(text)= }
      .then((response) => response.data);
  },
  addSong: function (id, playlistId, songId) {
    return this.api
      .post(`/user/${id}/playlist/${playlistId}/${songId}`)
      .then((response) => response.data);
  },
  removeSong: function (id, playlistId, songId) {
    return this.api
      .delete(`/user/${id}/playlist/${playlistId}/${songId}`)
      .then((response) => response.data);
  },
  deletePlaylist: function (id, playlistId) {
    return this.api
      .delete(`/user/${id}/playlist/${playlistId}`)
      .then((response) => response.data);
  },

  // favour
  getFavour: function (id) {
    return this.api.get(`/user/${id}/favour`).then((response) => response.data);
  },
  addFavour: function (id, songId) {
    return this.api
      .post(`/user/${id}/favour/${songId}`)
      .then((response) => response.data);
  },
  removeFavour: function (id, songId) {
    return this.api
      .delete(`/user/${id}/favour/${songId}`)
      .then((response) => response.data);
  },
};

export default API;
