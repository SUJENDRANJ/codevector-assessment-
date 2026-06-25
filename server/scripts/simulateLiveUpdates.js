require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

async function run() {
  await connectDB();

  console.log("Adding 25 brand-new products...");
  const newProducts = [];
  for (let i = 0; i < 25; i++) {
    const now = new Date();
    newProducts.push({
      product_id: `LIVE-${Date.now()}-${i}`,
      name: "Brand New Live Product",
      category: "Electronics",
      price: 999,
      created_at: now,
      updated_at: now,
    });
  }
  await Product.insertMany(newProducts);

  console.log("Updating 25 random existing products...");
  const randomProducts = await Product.aggregate([{ $sample: { size: 25 } }]);

  for (const p of randomProducts) {
    await Product.updateOne(
      { _id: p._id },
      {
        $set: { price: p.price + 1, updated_at: new Date() },
      },
    );
  }

  console.log("Done. 25 inserted, 25 updated (50 total changes).");
  await mongoose.connection.close();
}

run().catch((err) => {
  console.error("Simulation failed:", err);
  process.exit(1);
});
