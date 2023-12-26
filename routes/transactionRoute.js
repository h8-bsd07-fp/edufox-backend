const router = require("express").Router();
const authentication = require("../middleware/authentication");
const TransactionController = require("../controllers/transactionController");

router.post("/", authentication, TransactionController.generateTokenMidtrants);
router.patch("/", authentication, TransactionController.makeUserPremium);

module.exports = router;
