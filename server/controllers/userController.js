const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Get all users
const getUsers = (req, res) => {
  db.query(
    `SELECT
      id,
      full_name,
      email,
      phone,
      role,
      status,
      created_at
     FROM users
     ORDER BY id DESC`,
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

// Add user
const addUser = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    password,
    role,
    status,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (full_name, email, phone, password, role, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        full_name,
        email,
        phone,
        hashedPassword,
        role,
        status,
      ],
      (err) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(201).json({
          message: "User added successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;

  const {
    full_name,
    email,
    phone,
    role,
    status,
  } = req.body;

  const sql = `
    UPDATE users
    SET
      full_name = ?,
      email = ?,
      phone = ?,
      role = ?,
      status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      full_name,
      email,
      phone,
      role,
      status,
      id,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User updated successfully",
      });
    }
  );
};

// Delete user
const deleteUser = (req, res) => {
  db.query(
    "DELETE FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: err.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "User deleted successfully",
      });
    }
  );
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
};