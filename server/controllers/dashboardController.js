const db = require("../config/db");

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM products) AS totalProducts,

      (SELECT IFNULL(SUM(quantity), 0)
       FROM products) AS totalStock,

      (SELECT IFNULL(SUM(total_amount), 0)
       FROM sales) AS totalSales,

      (SELECT COUNT(*)
       FROM customers) AS totalCustomers
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Dashboard Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to load dashboard statistics.",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      totalProducts: results[0].totalProducts || 0,
      totalStock: results[0].totalStock || 0,
      totalSales: results[0].totalSales || 0,
      totalCustomers: results[0].totalCustomers || 0,
    });
  });
};

module.exports = {
  getDashboardStats,
};