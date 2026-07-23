
const db = require("../config/db");
const { askGemini } = require("../services/geminiService");

const askAI = async (req, res) => {
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
        "Hello!  I'm SmartStock AI. I can answer questions about products, customers, sales, suppliers and inventory.",
    });
  }

  if (
    question.includes("thank") ||
    question === "thanks"
  ) {
    return res.json({
      reply: "You're welcome! ",
    });
  }
  if (
    question.includes("how many products") ||
    question.includes("total products") ||
    question.includes("number of products") ||
    question.includes("inventory count")
  ) {
    return db.query(
      "SELECT COUNT(*) AS total FROM products",
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `You currently have ${result[0].total} products in your inventory.`,
        });
      }
    );
  }
  if (
    question.includes("show products") ||
    question.includes("list products") ||
    question.includes("display products")
  ) {
    return db.query(
      "SELECT product_name FROM products ORDER BY product_name",
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "There are no products available.",
          });
        }
  
        const products = result.map(p => p.product_name).join(", ");
  
        return res.json({
          reply: `Available products: ${products}`,
        });
      }
    );
  }
  if (
    question.includes("highest stock") ||
    question.includes("most stock")
  ) {
    return db.query(
      `SELECT product_name, quantity
       FROM products
       ORDER BY quantity DESC
       LIMIT 1`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No products found.",
          });
        }
  
        return res.json({
          reply: `${result[0].product_name} has the highest stock with ${result[0].quantity} units.`,
        });
      }
    );
  }
  if (
    question.includes("lowest stock") ||
    question.includes("least stock")
  ) {
    return db.query(
      `SELECT product_name, quantity
       FROM products
       ORDER BY quantity ASC
       LIMIT 1`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No products found.",
          });
        }
  
        return res.json({
          reply: `${result[0].product_name} has the lowest stock with ${result[0].quantity} units.`,
        });
      }
    );
  }if (
  question.includes("low stock") ||
  question.includes("restock") ||
  question.includes("running out")
) {
  return db.query(
    `SELECT product_name, quantity
     FROM products
     WHERE quantity < 10`,
    (err, result) => {
      if (err) {
        return res.status(500).json({
          reply: err.message,
        });
      }

      if (result.length === 0) {
        return res.json({
          reply: "All products have sufficient stock.",
        });
      }

      const items = result
        .map(p => `${p.product_name} (${p.quantity})`)
        .join(", ");

      return res.json({
        reply: `Products that need restocking: ${items}`,
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
      `SELECT product_name, quantity
       FROM products
       WHERE quantity < 10`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "All products have sufficient stock.",
          });
        }
  
        const items = result
          .map(p => `${p.product_name} (${p.quantity})`)
          .join(", ");
  
        return res.json({
          reply: `Products that need restocking: ${items}`,
        });
      }
    );
  }
  if (
    question.includes("out of stock") ||
    question.includes("no stock")
  ) {
    return db.query(
      `SELECT product_name
       FROM products
       WHERE quantity = 0`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "There are no out-of-stock products.",
          });
        }
  
        const products = result
          .map(p => p.product_name)
          .join(", ");
  
        return res.json({
          reply: `Out of stock products: ${products}`,
        });
      }
    );
  }
  if (
    question.includes("inventory value") ||
    question.includes("stock value") ||
    question.includes("total inventory")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(quantity * buying_price),0) AS total
       FROM products`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `The total inventory value is KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }
  if (
    question.includes("how many customers") ||
    question.includes("total customers") ||
    question.includes("customer count")
  ) {
    return db.query(
      "SELECT COUNT(*) AS total FROM customers",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        return res.json({
          reply: `You currently have ${result[0].total} customers.`,
        });
      }
    );
  }
  if (
    question.includes("show customers") ||
    question.includes("list customers") ||
    question.includes("display customers")
  ) {
    return db.query(
      "SELECT full_name FROM customers ORDER BY full_name",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No customers found.",
          });
        }
  
        const customers = result
          .map(c => c.full_name)
          .join(", ");
  
        return res.json({
          reply: `Customers: ${customers}`,
        });
      }
    );
  }
  if (
    question.includes("latest customer") ||
    question.includes("newest customer") ||
    question.includes("last customer")
  ) {
    return db.query(
      "SELECT full_name FROM customers ORDER BY id DESC LIMIT 1",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No customers available.",
          });
        }
  
        return res.json({
          reply: `Your newest customer is ${result[0].full_name}.`,
        });
      }
    );
  }
  if (
    question.includes("customer emails") ||
    question.includes("show emails")
  ) {
    return db.query(
      "SELECT full_name,email FROM customers",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No customer emails available.",
          });
        }
  
        const emails = result
          .map(c => `${c.full_name}: ${c.email}`)
          .join(", ");
  
        return res.json({
          reply: emails,
        });
      }
    );
  }
  if (
    question.includes("customer phones") ||
    question.includes("customer numbers") ||
    question.includes("phone numbers")
  ) {
    return db.query(
      "SELECT full_name,phone FROM customers",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No customer phone numbers found.",
          });
        }
  
        const phones = result
          .map(c => `${c.full_name}: ${c.phone}`)
          .join(", ");
  
        return res.json({
          reply: phones,
        });
      }
    );
  }
  if (
    question.includes("customer addresses") ||
    question.includes("show addresses")
  ) {
    return db.query(
      "SELECT full_name,address FROM customers",
      (err, result) => {
        if (err) {
          return res.status(500).json({ reply: err.message });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No addresses available.",
          });
        }
  
        const addresses = result
          .map(c => `${c.full_name}: ${c.address}`)
          .join(", ");
  
        return res.json({
          reply: addresses,
        });
      }
    );
  }
  if (
    question.includes("today purchases") ||
    question.includes("purchases today") ||
    question.includes("today purchase")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total
       FROM purchases
       WHERE DATE(purchase_date)=CURDATE()`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `Today's purchases total KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }
  if (
    question.includes("this month purchases") ||
    question.includes("monthly purchases")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total
       FROM purchases
       WHERE MONTH(purchase_date)=MONTH(CURDATE())
       AND YEAR(purchase_date)=YEAR(CURDATE())`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `This month's purchases total KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }
  if (
    question.includes("how many purchases") ||
    question.includes("purchase count") ||
    question.includes("total purchases")
  ) {
    return db.query(
      "SELECT COUNT(*) AS total FROM purchases",
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `There are ${result[0].total} purchase records.`,
        });
      }
    );
  }
  if (
    question.includes("latest purchase") ||
    question.includes("last purchase")
  ) {
    return db.query(
      `SELECT p.product_name, pu.quantity
       FROM purchases pu
       JOIN products p ON pu.product_id = p.id
       ORDER BY pu.id DESC
       LIMIT 1`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No purchases found.",
          });
        }
  
        return res.json({
          reply: `Latest purchase: ${result[0].product_name} (${result[0].quantity} units).`,
        });
      }
    );
  }
  if (
    question.includes("most purchased product") ||
    question.includes("top purchased product")
  ) {
    return db.query(
      `SELECT p.product_name,
              SUM(pu.quantity) AS total
       FROM purchases pu
       JOIN products p ON pu.product_id = p.id
       GROUP BY pu.product_id
       ORDER BY total DESC
       LIMIT 1`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        if (result.length === 0) {
          return res.json({
            reply: "No purchase data available.",
          });
        }
  
        return res.json({
          reply: `${result[0].product_name} is the most purchased product with ${result[0].total} units purchased.`,
        });
      }
    );
  }
  if (
    question.includes("purchase value") ||
    question.includes("total purchase value")
  ) {
    return db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS total
       FROM purchases`,
      (err, result) => {
        if (err) {
          return res.status(500).json({
            reply: err.message,
          });
        }
  
        return res.json({
          reply: `The total purchase value is KSh ${Number(result[0].total).toLocaleString()}.`,
        });
      }
    );
  }
  // ==========================
  // DEFAULT
  // ==========================

  // DEFAULT - Ask Gemini
// DEFAULT - Ask Gemini
try {
  const reply = await askGemini(message);

  return res.json({
    reply,
  });
} catch (error) {
  console.error(error);

  return res.status(500).json({
    reply: "Sorry, I couldn't process your request.",
  });
}
};

module.exports = {
  askAI,
};