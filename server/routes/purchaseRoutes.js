const express = require("express");
const router = express.Router();

const {
  getPurchases,
  addPurchase,
  deletePurchase,
} = require("../controllers/purchaseController");

router.get("/", getPurchases);

router.post("/", addPurchase);

router.delete("/:id", deletePurchase);

module.exports = router;