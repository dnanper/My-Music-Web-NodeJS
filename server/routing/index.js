const router = require("express").Router();
const song = require("./song");
const user = require("./user");

router.use("/song", song); //http://localhost:5000/api/song
router.use("/user", user); //http://localhost:5000/api/user
module.exports = router;
