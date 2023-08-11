const express = require("express");
const {
  resetPassword,
  register,
  login,
  logout,
  forgotPassword,
} = require("../controllers/auth.controllers");

const router = express.Router();

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Logout
router.get("/logout", logout);

//forgot-password
router.post("/forgot-password", forgotPassword);

//reset-password
router.post("/reset-password", resetPassword);

module.exports = router;

// RESET PASSWORD
