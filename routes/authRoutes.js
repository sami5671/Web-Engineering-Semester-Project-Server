const express = require("express");
const {
  registerUser,
  loginUser,
  generateToken,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/jwt", generateToken);

module.exports = router;
