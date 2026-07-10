const db = require("../config/db");

// Get report summary
const getReportSummary = (req, res) => {
  const sql = `
    SELECT
      IFNULL(SUM(total_amount),0) AS totalRevenue,
      IFNULL(SUM(CASE
        WHEN DATE(sale_date)=CURDATE()
        THEN total_amount ELSE 0 END),0) AS todaySales,
      IFNULL(SUM(CASE
        WHEN MONTH(sale_date)=MONTH(CURDATE())
        AND YEAR(sale_date)=YEAR(CURDATE())
        THEN total_amount ELSE 0 END),0) AS monthlySales
    FROM sales
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(result[0]);
  });
};

module.exports = {
  getReportSummary,
};