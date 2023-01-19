const multer = require("multer");

const upload = multer({
  storage: multer.diskStorage({}),
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
