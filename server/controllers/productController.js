const db = require("../config/db");

// Get all products
const getProducts = (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    res.json(results);
  });
};

// Add product
const addProduct = (req, res) => {
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);

  const {
    product_name,
    category,
    buying_price,
    selling_price,
    quantity,
    supplier,
  } = req.body;

  const sql = `
    INSERT INTO products
    (product_name, category, buying_price, selling_price, quantity, supplier)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      product_name,
      category,
      buying_price,
      selling_price,
      quantity,
      supplier,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        message: "Product added successfully",
      });
    }
  );
};

// Delete product
const deleteProduct = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  });
};
// Update product
const updateProduct = (req, res) => {
  const { id } = req.params;

  const {
    product_name,
    category,
    buying_price,
    selling_price,
    quantity,
    supplier,
  } = req.body;

  const sql = `
    UPDATE products
    SET
      product_name = ?,
      category = ?,
      buying_price = ?,
      selling_price = ?,
      quantity = ?,
      supplier = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      product_name,
      category,
      buying_price,
      selling_price,
      quantity,
      supplier,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    }
  );
};

module.exports = {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
};