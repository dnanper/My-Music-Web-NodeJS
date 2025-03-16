const play = require("./song/play");
const upload = require("./song/upload");
const view = require("./song/index");
const del = require("./song/delete");
const download = require("./song/download");
const router = require("express").Router();

router.post("/upload", upload); // POST - http://localhost:5000/api/song/upload
// router.put("/:id", play); // PUT - http://localhost:5000/api/song/id
router.get("/:id", view); // GET - http://localhost:5000/api/song/id : get song by id
router.get("/", view); // GET - http://localhost:5000/api/song/ : get all songs
router.get("/download/:id", download); // GET - http://localhost:5000/api/song/download/id : download song by id
router.delete("/:id", del); // DELETE - http://localhost:5000/api/song/id : delete song by id

module.exports = router;
