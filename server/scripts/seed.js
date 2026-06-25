require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const TOTAL_PRODUCTS = 200000;

const CATEGORIES = [
  "Electronics",
  "Books",
  "Clothing",
  "Sports",
  "Home & Kitchen",
  "Toys",
  "Beauty",
  "Groceries",
];

const ADJECTIVES = [
  "Premium",
  "Classic",
  "Compact",
  "Deluxe",
  "Eco",
  "Pro",
  "Smart",
  "Basic",
];
const NOUNS = [
  "Backpack",
  "Headphones",
  "Blender",
  "Sneakers",
  "Lamp",
  "Notebook",
  "Bottle",
  "Chair",
];

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomPrice() {
  return Math.round((Math.random() * 9900 + 100) * 100) / 100;
}

function buildProduct(index) {
  const now = new Date();

  return {
    product_id: `P${index}`,

    name: `${randomItem(ADJECTIVES)} ${randomItem(NOUNS)}`,
    category: randomItem(CATEGORIES),
    price: randomPrice(),

    created_at: now,
    updated_at: now,
  };
}

async function seed() {
  await connectDB();

  console.log("Clearing old products...");
  await Product.deleteMany({});

  console.log(`Inserting Products`);

  const products = [];

  for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
    products.push(buildProduct(i));
  }

  await Product.insertMany(products);

  console.log("200,000 products inserted successfully");

  await mongoose.connection.close();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
