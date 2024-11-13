const express = require("express");
const {
  getAllUsers,
  giveAccessToUsers,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getAllUsers);
router.patch("/giveAccessUsers", giveAccessToUsers);

module.exports = router;
