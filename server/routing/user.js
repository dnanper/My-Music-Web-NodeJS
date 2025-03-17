const view = require("./user/index");
const favour = require("./user/favour");
const playlist = require("./user/playlist");
const del = require("./user/delete");
const add = require("./user/add");
const router = require("express").Router();

router.get("/", view); // GET - http://localhost:5000/api/user/ : get all users
router.get("/:id", view); // GET - http://localhost:5000/api/user/id : get user by id
router.delete("/:id", del); // DELETE - http://localhost:5000/api/user/id : delete user
router.post("/", add); // POST - http://localhost:5000/api/user : create new user

router.get("/:id/favour", favour.view); // GET - http://localhost:5000/api/user/id/favour : get user favourite songs
router.post("/:id/favour/:songId", favour.add); // POST - http://localhost:5000/api/user/id/favourites : add song to favourites
router.delete("/:id/favour/:songId", favour.remove); // DEL - http://localhost:5000/api/user/id/favour/songId : remove from favourites

router.get("/:id/playlist", playlist.viewAll); // GET - http://localhost:5000/api/user/id/playlists : get user playlists
router.post("/:id/playlist", playlist.create); // POST - http://localhost:5000/api/user/id/playlists : create new playlist
router.delete("/:id/playlist/:playlistId", playlist.delete); // DEL - http://localhost:5000/api/user/id/playlists/playlistId : delete a playlist
router.get("/:id/playlist/playlistId", playlist.view); // GET - http://localhost:5000/api/user/id/playlists/playlistId : get playlist by id
router.post("/:id/playlist/:playlistId/:songId", playlist.add); // POST - http://localhost:5000/api/user/id/playlists/playlistId/songId : add song to playlist
router.delete("/:id/playlist/:playlistId/:songId", playlist.remove); // DEL - http://localhost:5000/api/user/id/playlists/playlistId/songId : remove song from playlist
router.get("/:id/playlist/:playlistId/play", playlist.play); // GET - http://localhost:5000/api/user/id/playlists/playlistId/play : play playlist

module.exports = router;
