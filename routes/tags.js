const { Post } = require("../models/post");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  if (req.query.tag) {
    const post = await Post.find({ tags: { $in: req.query.tag } });
    res.send(post);
  } else {
    const tags = await Post.find({}, "tags");

    res.send({ data: tags });
  }
});

module.exports = router;
