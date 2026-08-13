// const multer = require("multer");
// const path = require("path");

// // Define where and how files are saved
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Make sure this folder exists!
//   },
//   filename: function (req, file, cb) {
//     // Creates a unique name: timestamp + original extension
//     const uniqueSuffix =
//       "Product" + Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(
//       null,
//       file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
//     );
//   },
// });

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/gif"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type, only JPEG, PNG, and GIF allowed!"), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // Changed from fieldSize to fileSize for the actual file
//   },
//   fileFilter: fileFilter,
// });

// module.exports = { upload };

const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

// File Type Validation
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp|pjpeg)$/i;
  const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;

  const mimeMatch = allowedMimeTypes.test(file.mimetype);
  const extMatch = allowedExtensions.test(path.extname(file.originalname));

  if (mimeMatch || extMatch) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP image files are allowed!"
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});

module.exports = { upload };

