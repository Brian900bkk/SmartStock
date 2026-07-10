const db = require("../config/db");

// Dashboard summary
const getReportSummary = (req, res) => {
  const sql = `
    SELECT
      IFNULL(SUM(total_amount), 0) AS totalRevenue,
      IFNULL(SUM(CASE
        WHEN DATE(sale_date) = CURDATE()
        THEN total_amount
        ELSE 0
      END), 0) AS todaySales,
      IFNULL(SUM(CASE
        WHEN MONTH(sale_date) = MONTH(CURDATE())
         AND YEAR(sale_date) = YEAR(CURDATE())
        THEN total_amount
        ELSE 0
      END), 0) AS monthlySales
    FROM sales
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results[0]);
  });
};

// Filtered sales
const getFilteredSales = (req, res) => {
  const { filter, startDate, endDate } = req.query;

  let sql = `
    SELECT
      sales.*,
      products.product_name
    FROM sales
    JOIN products
      ON sales.product_id = products.id
  `;

  const params = [];

  if (filter === "today") {
    sql += " WHERE DATE(sale_date) = CURDATE()";
  } else if (filter === "week") {
    sql += " WHERE YEARWEEK(sale_date, 1) = YEARWEEK(CURDATE(), 1)";
  } else if (filter === "month") {
    sql +=
      " WHERE MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE())";
  } else if (filter === "custom" && startDate && endDate) {
    sql += " WHERE DATE(sale_date) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  sql += " ORDER BY sale_date DESC";

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};

module.exports = {
  getReportSummary,
  getFilteredSales,
};