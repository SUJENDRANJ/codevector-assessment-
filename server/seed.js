require("dotenv").config();
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// 2. Connect to MongoDB
connectDB()
  .then(() => {
    console.log("Seeding Started...");
  })
  .catch((err) => {
    console.log(`Server Failed ${err.message}`);
  });
// 3. Create a simple Product schema
const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// 4. Create Product model
const Product = mongoose.model("Product", productSchema);

// 5. Categories we want to use
const categories = ["Electronics", "Books", "Clothing", "Sports"];

// 6. Function to generate products
async function seedProducts() {
  try {
    console.log("Generating products...");

    // Array that will hold all 200,000 products
    const products = [];

    // Generate 200,000 product objects
    for (let i = 1; i <= 200000; i++) {
      products.push({
        name: `Product ${i}`,

        // Rotate categories
        category: categories[i % categories.length],

        // Random price between 100 and 10,000
        price: Math.floor(Math.random() * 9901) + 100,
      });
    }

    console.log("Products generated.");

    // Optional: remove existing products first
    await Product.deleteMany({});
    console.log("Old products removed.");

    // Insert all products at once
    await Product.insertMany(products);

    console.log("200,000 products inserted successfully.");

    // Close database connection
    await mongoose.connection.close();

    console.log("Database connection closed.");
  } catch (error) {
    console.error("Seeding failed:", error);

    await mongoose.connection.close();
  }
}

// 7. Run the seed function
seedProducts();
