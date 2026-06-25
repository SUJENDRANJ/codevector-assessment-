const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.get("/products", async (req, res) => {
  try {
    const { category, cursorUpdatedAt, cursorId, snapshotTime } = req.query;

    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const activeSnapshotTime = snapshotTime
      ? new Date(snapshotTime)
      : new Date();

    const filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    filter.updated_at = {
      $lte: activeSnapshotTime,
    };

    // Cursor pagination
    if (cursorUpdatedAt && cursorId) {
      const cursorDate = new Date(cursorUpdatedAt);

      filter.$and = [
        {
          $or: [
            {
              updated_at: {
                $lt: cursorDate,
              },
            },
            {
              updated_at: cursorDate,
              _id: {
                $lt: cursorId,
              },
            },
          ],
        },
      ];
    }

    const products = await Product.find(filter)
      .sort({
        updated_at: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean();

    const hasMore = products.length > limit;

    // Keep only requested number of products
    const pageOfProducts = products.slice(0, limit);

    let nextCursor = null;

    if (hasMore && pageOfProducts.length > 0) {
      const lastProduct = pageOfProducts[pageOfProducts.length - 1];

      nextCursor = {
        cursorUpdatedAt: lastProduct.updated_at.toISOString(),
        cursorId: lastProduct._id.toString(),
      };
    }

    res.status(200).json({
      products: pageOfProducts,
      nextCursor,
      hasMore,

      snapshotTime: activeSnapshotTime.toISOString(),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
