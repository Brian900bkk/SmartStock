const db = require("../config/db");

// Get all sales
const getSales = (req, res) => {
  const sql = `
    SELECT
      sales.*,
      products.product_name
    FROM sales
    JOIN products
      ON sales.product_id = products.id
    ORDER BY sales.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    res.json(results);
  });
};

// Record a sale
const addSale = (req, res) => {
  const { product_id, customer_name, quantity } = req.body;

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [product_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const product = result[0];

      if (product.quantity < quantity) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      const total = product.selling_price * quantity;

      db.query(
        `INSERT INTO sales
        (product_id, customer_name, quantity, selling_price, total_amount)
        VALUES (?, ?, ?, ?, ?)`,
        [
          product_id,
          customer_name,
          quantity,
          product.selling_price,
          total,
        ],
        (err) => {
          if (err) {
            return res.status(500).json({
              message: err.message,
            });
          }

          db.query(
            "UPDATE products SET quantity = quantity - ? WHERE id = ?",
            [quantity, product_id],
            (err) => {
              if (err) {
                return res.status(500).json({
                  message: err.message,
                });
              }

              res.status(201).json({
                message: "Sale recorded successfully",
              });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getSales,
  addSale,
};