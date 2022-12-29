const path = require("node:path");
const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    )
      cb(null, true);
    else {
      cb(null, false);
    }
  },
});

module.exports = upload;
