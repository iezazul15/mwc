// Importing necessary packages
const express = require("express");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Database connection
const dbConnection = require("./database/dbConnection");

// Import middleware
const setMiddleware = require("./middlewares/middlewares");

// ❗ Error middleware
const { error, errorRoute } = require("./middlewares/error");

// Create an express app
const app = express();

// Set the port number for the application
const PORT = process.env.PORT || 3000;

// Import router
const setRouter = require("./routes/routes");

// Set middlewares
setMiddleware(app);

// Set view engine (EJS)
app.set("view engine", "ejs");
app.set("views", "views");

// Configure routes
setRouter(app);

// error middleware (as per rule: have to call the function at the very end)
app.use(error);
app.use(errorRoute);

// Start the application
app.listen(PORT, () => {
  // Connect to the database and start server
  dbConnection();
  console.log(`Server is running on port ${PORT}`);
});
