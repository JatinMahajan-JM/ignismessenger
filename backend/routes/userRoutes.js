const express = require("express");
const {
  register,
  login,
  getSearchedUsers,
} = require("../controllers/userController");
const authenticate = require("../middleware/is-auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/", authenticate, getSearchedUsers);
// router.post("/", getSearchedUsers);

module.exports = router;
