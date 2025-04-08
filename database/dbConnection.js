// importing mongoose
const mongoose = require("mongoose");

// importing dotenv
const dotenv = require("dotenv");
dotenv.config();

// database connection
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected");
  } catch (e) {
    console.log("Error connecting to database", e);
  }
};

module.exports = dbConnection;
