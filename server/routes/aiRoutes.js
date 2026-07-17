const express = require("express");
const router = express.Router();

const { askAI } = require("../controllers/aiController");

// Temporarily remove verifyToken
router.post("/", askAI);

module.exports = router;