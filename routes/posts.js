const validObjectId = require("../middleware/validObjectId");
const validator = require("../middleware/validator");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { validate } = require("../models/post");
const express = require("express");

const router = express.Router();

const {
  posts,
  create,
  remove,
  update,
  getMe,
  getOne,
} = require("../controllers/postController");

router.get("/", posts);
router.get("/me", auth, getMe);
router.get("/:id", getOne);

router.post("/", [upload.single("cover"), validator(validate), auth], create);

router.put("/:id", [validator(validate), validObjectId, auth], update);

router.delete("/:id", [validObjectId, auth], remove);

module.exports = router;
