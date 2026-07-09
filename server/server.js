const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
console.log("Registering product routes...");
app.use("/api/products", productRoutes);
console.log("Product routes imported successfully");
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to SmartStock API");
});

const PORT = process.env.PORT || 5000;
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working" });
  });
  app.post("/test-post", (req, res) => {
    res.json({
      message: "POST is working!"
    });
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});