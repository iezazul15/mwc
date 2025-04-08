const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename =
      file.originalname.replace(ext, "").toLowerCase().split(" ").join("-") +
      "-" +
      Date.now() +
      ext;
    cb(null, filename);
  },
});

function multerMiddleware(fieldName = "thumbnail") {
  const upload = multer({
    storage,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error(
          "ফাইলের ধরন সঠিক নয়। শুধুমাত্র JPG, JPEG, PNG, অথবা WEBP ফাইল অনুমোদিত।"
        );
        error.name = "INVALID_FILE_TYPE";
        return cb(error);
      }
      cb(null, true);
    },
  }).single(fieldName);

  return (req, res, next) => {
    upload(req, res, function (err) {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            req.multerError = "সর্বোচ্চ ৫ এমবি আপলোড করা যাবে";
          } else {
            req.multerError = "ছবি আপলোডে সমস্যা হয়েছে, আবার চেষ্টা করুন";
          }
        } else if (err.name === "INVALID_FILE_TYPE") {
          req.multerError = err.message;
        } else {
          req.multerError =
            "সার্ভারে কোনো একটি ত্রুটি ঘটেছে ছবি আপলোডে, আবার চেষ্টা করুন";
        }
        res.locals.fileError = req.multerError; // set it to local so that I can access it in ejs files
      }
      next();
    });
  };
}

module.exports = multerMiddleware;
