const { User } = require("../models/user");
const _ = require("lodash");

const { Post } = require("../models/post");
const bcrypt = require("bcrypt");

const cloudinary = require("../middleware/cloudinary");

exports.me = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  res.send({ data: user });
};
exports.create = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  const profile = req.file;

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const upload = await cloudinary.uploader.upload(req.file.path, {
    folder: "profiles",
  });
  user.profile = {
    publicId: upload.public_id,
    url: upload.secure_url,
  };
  // if (profile) {
  // }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send({ data: _.pick(user, ["_id", "name", "email", "profile"]) });
};

exports.update = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    { new: true }
  );

  if (!user) return res.status(404).send("user is not exist in the db");

  res.send({ data: _.pick(user, ["_id", "name", "email"]) });
};

exports.remove = async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) return res.status(404).send("user is not exist in the db");

  await Post.deleteMany({ "user.email": user.email });

  await cloudinary.uploader.destroy(user.profile.publicId, {
    folder: "profiles",
  });
  res.send({ data: user });
};

exports.updateProfile = async (req, res) => {
  let user = await User.findById(req.params.id);

  if (!user) return res.status(404).send("invalid user ID");

  if (user.profile.publicId) {
    await cloudinary.uploader.destroy(user.profile.publicId, {
      folder: "profiles",
    });
  }

  const upload = await cloudinary.uploader.upload(req.file.path, {
    folder: "profiles",
  });

  user = user.set({
    profile: {
      publicId: upload.public_id,
      url: upload.secure_url,
    },
  });

  res.send({ data: user });
};
