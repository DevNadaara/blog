const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    summary: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
      minlength: 10,
    },
    tags: {
      type: Array,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: (props) => `${props.value} must be at least on tag`,
      },
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cover: {
      publicId: {
        type: String,
        default: "",
      },
      url: {
        type: String,
        default: "",
      },
    },
    likes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

const validate = (obj) => {
  const schema = Joi.object({
    title: Joi.string().min(5).required(),
    body: Joi.string().min(5).required(),
    summary: Joi.string().min(5).required(),
    tags: Joi.string().required(),
    likes: Joi.array().items(Joi.string()),
    cover: Joi.string(),
  });

  return schema.validate(obj);
};

module.exports.validate = validate;
module.exports.Post = Post;
