const router = require("express").Router();
const song = require("./song");
const user = require("./user");
const playlist = require("./playlist");
const favour = require("./favour");

router.use("/song", song); //http://localhost:5000/api/song
// router.use("/user", user); //http://localhost:5000/api/user
// router.use("/playlist", playlist); //http://localhost:5000/api/playlist
// router.use("/favour", favour); //http://localhost:5000/api/favour

module.exports = router;
