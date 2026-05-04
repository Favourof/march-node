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
const storage = multer.memoryStorage();

// 1. File Type Validation
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true); // Accept
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG allowed!"), false); // Reject
  }
};

const upload = multer({
  storage,
  //   5mb file size
  limits: { fieldSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = { upload };
