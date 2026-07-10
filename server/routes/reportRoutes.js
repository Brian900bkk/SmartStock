const express = require("express");
const router = express.Router();

const {
  getReportSummary,
  getFilteredSales,
} = require("../controllers/reportController");

router.get("/", getReportSummary);
router.get("/sales", getFilteredSales);

module.exports = router;