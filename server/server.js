require("dotenv").config();
const path = require("path");
const express = require("express");
const connectDB = require("./config/db");
const productsRouter = require("./routes/products");

const app = express();

app.use(express.json());

// Serve the simple bonus UI from the "public" folder.
app.use(express.static(path.join(__dirname, "public")));

// All product-related routes live under /api
app.use("/api", productsRouter);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });
