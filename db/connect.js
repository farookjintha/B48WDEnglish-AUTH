const mongoose = require("mongoose");

exports.db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Db is connected...");
  } catch (error) {
    console.log("Error while connecting DB: ", error);
  }
};
