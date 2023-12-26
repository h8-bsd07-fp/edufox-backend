const multer = require("multer");

const fileStoreage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});
const uploadMulter = multer({ storage: fileStoreage });

module.exports = uploadMulter;
