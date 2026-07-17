const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// Anyone who is logged in can view products
router.get("/", verifyToken, getProducts);

// Only admins can add products
router.post("/", verifyToken, adminOnly, addProduct);

// Only admins can update products
router.put("/:id", verifyToken, adminOnly, updateProduct);

// Only admins can delete products
router.delete("/:id", verifyToken, adminOnly, deleteProduct);

module.exports = router;