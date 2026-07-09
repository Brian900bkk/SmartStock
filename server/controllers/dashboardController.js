const db = require("../config/db");

const getDashboardStats = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM products) AS totalProducts,
      (SELECT SUM(quantity) FROM products) AS totalStock
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

module.exports = {
  getDashboardStats,
};