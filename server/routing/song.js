const play = require("./song/play");
const upload = require("./song/upload");
const view = require("./song");
const router = require("express").Router();

router.post("/upload", upload); // POST - http://localhost:5000/api/song/upload
// router.get("/:id", play); // PUT - http://localhost:5000/api/song/id
// router.get("/:id", view); // GET - http://localhost:5000/api/song/id : get song by id
// router.get("/", view); // GET - http://localhost:5000/api/song/ : get all songs

module.exports = router;
