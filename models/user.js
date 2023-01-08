const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 5,
      maxlength: 20,
      required: true,
    },
    email: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true,
    },
    profile: {
      publicId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "reader"],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin,
    },
    process.env.JWTKEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const validate = (obj) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(obj);
};

module.exports.validate = validate;
module.exports.User = User;
