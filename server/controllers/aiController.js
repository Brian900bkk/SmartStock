const db = require("../config/db");

const askAI = (req, res) => {
  console.log("========== AI REQUEST ==========");
  console.log("Request Body:", req.body);

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      reply: "Please ask a question.",
    });
  }

  const question = message.toLowerCase().trim();

  console.log("Question:", question);

  // Today's sales
  if (question.includes("today") && question.includes("sale")) {
    const sql = `
      SELECT IFNULL(SUM(total_amount), 0) AS total
      FROM sales
      WHERE DATE(sale_date) = CURDATE()
    `;

    return db.query(sql, (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        return res.status(500).json({
          reply: err.message,
        });
      }

      console.log("Today's Sales Result:", result);

      return res.json({
        reply: `Today's sales are KSh ${Number(result[0].total).toLocaleString()}.`,
      });
    });
  }

  // Total Products
  if (question.includes("product")) {
    return db.query(
      "SELECT COUNT(*) AS total FROM products",
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({
            reply: err.message,
          });
        }

        console.log("Products Result:", result);

        return res.json({
          reply: `There are ${result[0].total} products in inventory.`,
        });
      }
    );
  }

  // Customers
  if (question.includes("customer")) {
    return db.query(
      "SELECT COUNT(*) AS total FROM customers",
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({
            reply: err.message,
          });
        }

        console.log("Customers Result:", result);

        return res.json({
          reply: `You have ${result[0].total} customers.`,
        });
      }
    );
  }

  // Low Stock
  if (question.includes("low stock") || question.includes("reorder")) {
    return db.query(
      "SELECT COUNT(*) AS total FROM products WHERE quantity < 10",
      (err, result) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({
            reply: err.message,
          });
        }

        console.log("Low Stock Result:", result);

        return res.json({
          reply: `${result[0].total} products are running low in stock.`,
        });
      }
    );
  }

  console.log("Default AI Response");

  return res.json({
    reply:
      "",
  });
};

module.exports = {
  askAI,
};