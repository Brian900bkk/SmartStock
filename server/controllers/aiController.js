const db = require("../config/db");

const askAI = (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      reply: "Please ask a question.",
    });
  }

  const question = message.toLowerCase().trim();

  // ==========================
  // PRODUCTS
  // ==========================

  if (
    question.includes("how many products") ||
    question.includes("total products") ||
    question.includes("number of products") ||
    question.includes("inventory count")
  ) {
    return db.query(
      "SELECT COUNT(*) AS total FROM products",
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        return res.json({
          reply: `You currently have ${result[0].total} products in your inventory.`,
        });
      }
    );
  }

  if (
    question.includes("show products") ||
    question.includes("list products")
  ) {
    return db.query(
      "SELECT product_name FROM products LIMIT 10",
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        if (result.length === 0) {
          return res.json({
            reply: "No products found.",
          });
        }

        const products = result
          .map((p) => p.product_name)
          .join(", ");

        return res.json({
          reply: `Products: ${products}`,
        });
      }
    );
  }

  if (
    question.includes("low stock") ||
    question.includes("restock") ||
    question.includes("running out")
  ) {
    return db.query(
      "SELECT product_name, quantity FROM products WHERE quantity < 10",
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        if (result.length === 0) {
          return res.json({
            reply: "No products are currently low in stock.",
          });
        }

        const items = result
          .map((p) => `${p.product_name} (${p.quantity})`)
          .join(", ");

        return res.json({
          reply: `Low stock products: ${items}`,
        });
      }
    );
  }

  // ==========================
  // CUSTOMERS
  // ==========================

  if (
    question.includes("how many customers") ||
    question.includes("total customers")
  ) {
    return db.query(
      "SELECT COUNT(*) AS total FROM customers",
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        return res.json({
          reply: `You have ${result[0].total} customers.`,
        });
      }
    );
  }

  // ==========================
  // SALES
  // ==========================

  if (
    question.includes("today sales") ||
    question.includes("sales today") ||
    question.includes("today revenue")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total
       FROM sales
       WHERE DATE(sale_date)=CURDATE()`,
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        return res.json({
          reply: `Today's sales are KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }

  if (
    question.includes("this month") &&
    question.includes("sales")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total
       FROM sales
       WHERE MONTH(sale_date)=MONTH(CURDATE())
       AND YEAR(sale_date)=YEAR(CURDATE())`,
      (err, result) => {
        if (err)
          return res.status(500).json({ reply: err.message });

        return res.json({
          reply: `This month's sales are KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }

  // ==========================
  // FRIENDLY RESPONSES
  // ==========================

  if (
    question === "hi" ||
    question === "hello" ||
    question === "hey"
  ) {
    return res.json({
      reply:
        "Hello! 👋 I'm SmartStock AI. I can answer questions about products, customers, sales, suppliers and inventory.",
    });
  }

  if (
    question.includes("thank") ||
    question === "thanks"
  ) {
    return res.json({
      reply: "You're welcome! 😊",
    });
  }

  // ==========================
  // DEFAULT
  // ==========================

  return res.json({
    reply:
      "I didn't understand that question. Try asking about products, sales, customers, suppliers, inventory or reports.",
  });
};

module.exports = {
  askAI,
};