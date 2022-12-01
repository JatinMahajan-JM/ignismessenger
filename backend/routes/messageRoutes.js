const express = require("express");
const {
  sendMessage,
  getAllMessage,
} = require("../controllers/messageController");
const router = express.Router();
const authenticate = require("../middleware/is-auth");

router.post("/", authenticate, sendMessage);
router.get("/:chatId", authenticate, getAllMessage);

module.exports = router;
