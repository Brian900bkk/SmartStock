const express = require("express");
const router = express.Router();

const {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// All routes require login and admin role
router.get("/", verifyToken, adminOnly, getUsers);
router.post("/", verifyToken, adminOnly, addUser);
router.put("/:id", verifyToken, adminOnly, updateUser);
router.delete("/:id", verifyToken, adminOnly, deleteUser);

module.exports = router;