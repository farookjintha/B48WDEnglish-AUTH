const Quotes = require("../models/quotes.model");

exports.getAllQuotes = (req, res) => {
  try {
    Quotes.find()
      .then((data) => {
        return res.status(200).send({
          message: "Quotes have been retrieved successfully",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          message: "Error while retrieving Quotes data.",
          error: error,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.addQuote = (req, res) => {
  try {
    const payload = req.body;

    const newQuote = new Quotes(payload);

    newQuote
      .save()
      .then((data) => {
        res.status(201).send({
          message: "Quote has been added successfully",
          data: data,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          message: "Error while adding a new quote.",
          error: error,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};
