const validator = require("../middleware/validator");
const validObjectId = require("../middleware/validObjectId");
const { validate, User } = require("../models/user");
const { Post } = require("../models/post");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.send(user);
});

router.post("/", validator(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("user already registered");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.put(
  "/:id",
  [validator(validate), validObjectId, auth],
  async (req, res) => {
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

    res.send(_.pick(user, ["_id", "name", "email"]));
  }
);

router.delete("/:id", [validObjectId, auth], async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  await Post.findByIdAndRemove({}, { "user.email": user.user.email });
  if (!user) return res.status(404).send("user is not exist in the db");

  res.send(user);
});

module.exports = router;
