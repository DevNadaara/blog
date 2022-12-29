const validator = require("../middleware/validator");
const validObjectId = require("../middleware/validObjectId");
const { validate } = require("../models/user");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  create,
  update,
  remove,
  me,
  updateProfile,
} = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.get("/me", auth, me);

router.post("/", [upload.single("profile")], create);

router.put(
  "/:id",
  [upload.single("profile"), validator(validate), validObjectId, auth],
  update
);

router.put("/profile/:id", [upload.single("profile"), auth], updateProfile);

router.delete("/:id", [validObjectId, auth], remove);

module.exports = router;
