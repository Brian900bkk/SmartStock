const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
  deleteProduct,
} = require("../controllers/productController");

// Get all products
router.get("/", getProducts);

// Add a product
router.post(
  "/",
  (req, res, next) => {
    console.log("Calling addProduct...");
    next();
  },
  addProduct
);

// Delete a product
router.delete("/:id", deleteProduct);

module.exports = router;