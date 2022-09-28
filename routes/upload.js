const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();
const validObjectId = require("../middleware/validObjectId");
const { Post } = require("../models/post");

router.post("/", upload.single("postImage"), (req, res) => {
  res.send("file uploaded");
});

module.exports = router;
