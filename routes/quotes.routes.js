const express = require("express");
const { getAllQuotes, addQuote } = require("../controllers/quotes.controllers");
const { isAuth } = require("../utils/authentication");
const {
  isPrivilegedUser,
  isAdmin,
  notNormalUser,
} = require("../utils/authorization");

const router = express.Router();

router.get("/quotes", isAuth, getAllQuotes);

router.post("/quotes", isAuth, notNormalUser, addQuote);

module.exports = router;
