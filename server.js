require("dotenv").config();
const { urlencoded } = require("express");
const express = require("express");
const multer = require("multer");
const { upload } = require("./s3service");
const uuid = require("uuid").v4;
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

process.on("uncaughtException", (err) => {
  console.log(err);
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//All Variables
const port = 3003;

//Middleware
// const upload = multer({ dest: "uploads/" });

//storing into memory storage which is RAM.

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] == "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("format not supported."), false);
  }
};

const specialup = multer({
  storage,
  fileFilter,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ok");
});

app.put("/upload", multer().array("ff", 1), async (req, res) => {
  console.log(req.body.email);
  const ele = await upload(req.files, req.body.email);

  res.json({ msg: ele });
  // res.send(JSON.stringify({ url: ele.Location }));
});

app.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.json({ msg: "large" });
    } else if (error.code === "format not supported.") {
      return res.json({ msg: "format" });
    }
  }
});

app.listen(port, () => {
  console.log("successfully run.");
});
