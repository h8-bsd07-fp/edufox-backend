const router = require("express").Router();
const enrollmentsRoute = require("./enrollmentsRoute");
const courseRoute = require("./courseRoute");
const chapterRoute = require("./chapterRoute");
const categoriesRoute = require("./categoriesRoute");
const transactionRoute = require("./transactionRoute");
const feedbackRoute = require("./feedbackRoute");
const userRoute = require("./userRoute");
const LoginController = require("../controllers/loginController");
const RegisterController = require("../controllers/registerController");

router.post("/register", RegisterController.userRegister);
router.post("/login", LoginController.userLogin);

router.use("/enrollments", enrollmentsRoute);
router.use("/course", courseRoute);
router.use("/chapter", chapterRoute);
router.use("/categories", categoriesRoute);
router.use("/transaction", transactionRoute);
router.use("/feedback", feedbackRoute);
router.use("/user", userRoute);

module.exports = router;
