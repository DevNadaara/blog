const { User } = require("../models/user");
const { Post } = require("../models/post");

const cloudinary = require("../middleware/cloudinary");

exports.me = async (req, res) => {
  const posts = await Post.find({ email: req.user.email });

  res.send({ data: posts });
};

exports.posts = async (req, res) => {
  const post = await Post.find();
  res.send({ data: post });
};
exports.create = async (req, res) => {
  const user = await User.find({ email: req.user.email });

  if (!user) return res.status(404).send("user is not found in the db");

  const cover = req.file;
  if (!cover) return res.status(400).send("add image");

  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags,
    user: {
      name: user.name,
      email: user.email,
    },
  });

  if (cover) {
    const upload = await cloudinary.uploader.upload(req.file.path, {
      folder: "covers",
    });
    user.cover = {
      publicId: upload.public_id,
      url: upload.secure_url,
    };
  }

  const result = await post.save();

  res.send({ data: result });
};

exports.update = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    { _id: req.params.id },
    {
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tags,
    },
    { new: true }
  );

  if (!post) return res.status(404).send("post is not found in the db");

  res.send({ data: post });
};

exports.remove = async (req, res) => {
  const { user } = await Post.findById(req.params.id);

  if (req.user.role === "admin" || req.user.email === user.email) {
    const post = await Post.findByIdAndRemove(req.params.id);
    if (!post) return res.status(404).send("user is not found in the db");

    res.send({ data: post });
  } else return res.status(401).send("unauthorised");
};
