const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
// const multer = require("multer");
const routing = require("./routing");
// const upload = multer();
const middleware = require("./routing/middleware");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));

// allow client to be served
app.use(express.static(path.join(__dirname, "../client/public")));

app.use("/api", middleware, routing);

////// HAVE TEST YET
// allow client to be served, if no API route is found
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/public", "index.html"));
});
///////

// allow client request to be parsed
app.use(bodyParser.urlencoded({ extended: true }));

// allow read from form data
// app.use(upload.none());

app.listen(PORT, () => {
  console.log(`Backend is listening on port: ${PORT}`);
});

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log("Uploaded file:", req.file);
//   res.send("File uploaded successfully");
// });
