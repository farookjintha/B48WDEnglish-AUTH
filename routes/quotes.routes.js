const express = require("express");
const { getAllQuotes, addQuote } = require("../controllers/quotes.controllers");
const { isAuth } = require("../utils/authentication");

const router = express.Router();

router.get("/quotes", isAuth, getAllQuotes);

router.post("/quotes", isAuth, addQuote);

module.exports = router;
