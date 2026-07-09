const express = require("express");
const router = express.Router();

const {
  getProducts,
  addProduct,
} = require("../controllers/productController");
const {
  getProducts,
  addProduct,
  deleteProduct,
} = require("../controllers/productController");
router.delete("/:id", deleteProduct);
router.get("/", getProducts);

router.post("/", (req, res, next) => {
  console.log("Calling addProduct...");
  next();
}, addProduct);

module.exports = router;