const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Grid = require("gridfs-stream");

require("express-async-errors");
const error = require("./middleware/error");
const users = require("./routes/users");
const posts = require("./routes/posts");
const tags = require("./routes/tags");
const auth = require("./routes/auth");
// const upload = require("./routes/upload");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

if (!config.get("db") && !config.get("jwtKey")) {
  console.log("db connection null or jwtKey");
  return process.exit(1);
}

mongoose
  .connect(config.get("db"))
  .then(console.log("connected to blog db"))
  .catch((err) => console.error("could not connected to mangodb..", err));

const conn = mongoose.connection;

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, config.get("db"));
  gfs.collection("uploads");
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/tags", tags);
app.use("/api/auth", auth);
// app.use("/api/upload", upload);

app.use(error);

// app.get("/", (req, res) => {
//   res.send("hello world");
// });

const port = 4000;

app.listen(port, () => console.log(`listening on port ${port} `));
