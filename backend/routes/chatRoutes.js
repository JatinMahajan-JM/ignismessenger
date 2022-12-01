const express = require("express");
const {
  getChat,
  fetchChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");
const router = express.Router();
const authenticate = require("../middleware/is-auth");

router.get("/", authenticate, fetchChats);
router.post("/", authenticate, getChat);
router.post("/group", authenticate, createGroup);
router.put("/rename", authenticate, renameGroup);
router.put("/rmvFromGroup", authenticate, removeFromGroup);
router.put("/addToGroup", authenticate, addToGroup);

module.exports = router;
