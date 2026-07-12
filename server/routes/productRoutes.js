const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ProductController");
// Get all products
router.get("/", getProducts);

router.post("/", addProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);
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