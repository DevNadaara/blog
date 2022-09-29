const path = require("node:path");
const multer = require("multer");
// const crypto = require("node:crypto");
// const config = require("config");
// const { GridFsStorage } = require("muslter-gridfs-storage");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, "blog" + Date.now() + ext);
  },
});

// const storage = new GridFsStorage({
//   url: config.get("db"),
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });
// const upload = multer({ storage });

const upload = multer({
  storage: storage,
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
