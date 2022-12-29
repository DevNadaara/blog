const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const validator = require("../middleware/validator");
const express = require("express");
const router = express.Router();

router.post("/", validator(validate), async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email or password incorrect");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword)
    return res.status(400).send("email or password incorrect");
  const token = user.generateAuthToken();

  res.send({ data: token });
});

function validate(obj) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(obj);
}

module.exports = router;
