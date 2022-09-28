const validObjectId = require("../middleware/validObjectId");
const validator = require("../middleware/validator");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validate, Post } = require("../models/post");
const { User } = require("../models/user");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const post = await Post.find();
  res.send(post);
});

router.post(
  "/",
  [validator(validate), upload.single("postImage")],
  async (req, res) => {
    const user = await User.findById(req.body.userId);

    if (!user) return res.status(404).send("user is not found in the db");

    const post = new Post({
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,

      user: {
        name: user.name,
        email: user.email,
      },
    });
    if (req.file) {
      post.image = req.file.path;
    }

    const result = await post.save();

    res.send(result);
  }
);

router.put("/:id", [validator(validate), validObjectId], async (req, res) => {
  const user = await User.findById(req.body.userId);

  const post = await Post.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
      user: {
        name: user.name,
        email: user.email,
      },
    },
    { new: true }
  );

  if (!post) return res.status(404).send("user is not found in the db");

  res.send(post);
});

router.delete("/:id", [validObjectId, auth], async (req, res) => {
  const { user } = await Post.findById(req.params.id);

  if (req.user.isAdmin || req.user.email === user.email) {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) return res.status(404).send("user is not found in the db");
    res.send(post);
  } else return res.status(401).send("unauthorised");
});

module.exports = router;
