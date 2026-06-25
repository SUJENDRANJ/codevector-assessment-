const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  created_at: {
    type: Date,
    required: true,
  },

  updated_at: {
    type: Date,
    required: true,
  },
});

// Fast newest-first pagination
productSchema.index({
  updated_at: -1,
  _id: -1,
});

// Fast category filtering + newest-first pagination
productSchema.index({
  category: 1,
  updated_at: -1,
  _id: -1,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
