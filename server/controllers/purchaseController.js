const db = require("../config/db");

// Get all purchases
const getPurchases = (req, res) => {
  const sql = `
    SELECT
      purchases.*,
      suppliers.supplier_name,
      products.product_name
    FROM purchases
    JOIN suppliers
      ON purchases.supplier_id = suppliers.id
    JOIN products
      ON purchases.product_id = products.id
    ORDER BY purchases.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      purchases: results,
    });
  });
};

// Record purchase
const addPurchase = (req, res) => {
  const {
    supplier_id,
    product_id,
    quantity,
    buying_price,
  } = req.body;

  const total = quantity * buying_price;

  const insertSql = `
    INSERT INTO purchases
    (supplier_id, product_id, quantity, buying_price, total_amount)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertSql,
    [
      supplier_id,
      product_id,
      quantity,
      buying_price,
      total,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      // Increase product stock
      db.query(
        `
        UPDATE products
        SET quantity = quantity + ?
        WHERE id = ?
        `,
        [quantity, product_id],
        (err2) => {
          if (err2) {
            return res.status(500).json({
              success: false,
              message: err2.message,
            });
          }

          res.json({
            success: true,
            message: "Purchase recorded successfully.",
          });
        }
      );
    }
  );
};

// Delete purchase
const deletePurchase = (req, res) => {
  db.query(
    "DELETE FROM purchases WHERE id = ?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Purchase deleted.",
      });
    }
  );
};

module.exports = {
  getPurchases,
  addPurchase,
  deletePurchase,
};