const express = require("express");

const router = express.Router();

const {
    register,
    verifyEmail,
    login
} = require("../controllers/authController");

// ==========================================
// REGISTER
// ==========================================

router.post(
    "/register",
    register
);

// ==========================================
// VERIFY EMAIL
// ==========================================

router.post(
    "/verify-email",
    verifyEmail
);

// ==========================================
// LOGIN
// ==========================================

router.post(
    "/login",
    login
);

module.exports = router;