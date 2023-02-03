const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("express-async-errors");

const error = require("./middleware/error");
const users = require("./routes/users");
const posts = require("./routes/posts");
const tags = require("./routes/tags");
const auth = require("./routes/auth");

const app = express();

const corsOptions = {
  exposedHeaders: "x-auth-token",
};
app.use(cors(corsOptions));

mongoose
  .connect(process.env.DB)
  .then(console.log("connected to blog db"))
  .catch((err) => console.error("could not connected to mangodb..", err));

app.use(express.json());

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/tags", tags);
app.use("/api/auth", auth);

app.use(error);

const port = 4000;

app.listen(port, () => console.log(`listening on port ${port} `));
