const express = require("express");
const { register, login, logout } = require("../controllers/auth.controllers");

const router = express.Router();

//Register
router.post("/register", register);

//Login
router.post("/login", login);

//Logout
router.get("/logout", logout);

module.exports = router;
