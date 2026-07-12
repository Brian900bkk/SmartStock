const db = require("../config/db");

// Get all suppliers
const getSuppliers = (req, res) => {
  const sql = "SELECT * FROM suppliers ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      suppliers: results,
    });
  });
};

// Add supplier
const addSupplier = (req, res) => {
  const { supplier_name, email, phone, address } = req.body;

  const sql = `
    INSERT INTO suppliers
    (supplier_name, email, phone, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [supplier_name, email, phone, address],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Supplier added successfully",
      });
    }
  );
};

// Update supplier
const updateSupplier = (req, res) => {
  const { id } = req.params;
  const { supplier_name, email, phone, address } = req.body;

  const sql = `
    UPDATE suppliers
    SET
      supplier_name=?,
      email=?,
      phone=?,
      address=?
    WHERE id=?
  `;

  db.query(
    sql,
    [supplier_name, email, phone, address, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Supplier updated",
      });
    }
  );
};

// Delete supplier
const deleteSupplier = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM suppliers WHERE id=?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Supplier deleted",
      });
    }
  );
};

module.exports = {
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier,
};