require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { db } = require("./db/connect");

const app = express();

const quotesRoutes = require("./routes/quotes.routes");
const authRoutes = require("./routes/auth.routes");

//Connecting DB
db();

app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(quotesRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running on PORT : ${PORT}`);
});

// Adding a Quote
// Reading all quotes

// Quotes -> Schema -> Model
// Users -> Schema -> Model
