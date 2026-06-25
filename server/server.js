const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server Started");
    });
  })
  .catch((err) => {
    console.log(`Server Failed ${err.message}`);
  });
