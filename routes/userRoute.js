const router = require("express").Router();
// const uploadMulter = require("../helpers/multer");
const UserController = require("../controllers/userController");
const authentication = require("../middleware/authentication");
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

router.patch(
  "/",
  authentication,
  uploadMulter.single("image"),
  UserController.changePictProfile
);

module.exports = router;
