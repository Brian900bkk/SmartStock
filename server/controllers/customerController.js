const db = require("../config/db");

// Get all customers
const getCustomers = (req, res) => {
  db.query(
    "SELECT * FROM customers ORDER BY id DESC",
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json(results);
    }
  );
};

// Add customer
const addCustomer = (req, res) => {
  const {
    full_name,
    phone,
    email,
    address,
  } = req.body;

  const sql = `
    INSERT INTO customers
    (full_name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [full_name, phone, email, address],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.status(201).json({
        message: "Customer added successfully",
      });
    }
  );
};

// Delete customer
const deleteCustomer = (req, res) => {
  db.query(
    "DELETE FROM customers WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      res.json({
        message: "Customer deleted",
      });
    }
  );
};

module.exports = {
  getCustomers,
  addCustomer,
  deleteCustomer,
};