const mongoose = require("mongoose");
const uri = process.env.MONGO_URI;

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (err) {
    throw new Error("MongoDB Falied " + err.message);
  }
}

module.exports = connectDB;
