const db = require("../config/db");


// =========================================================
// GET ALL SALES
// =========================================================

const getSales = (req, res) => {

  const sql = `
    SELECT
      sales.*,
      products.product_name
    FROM sales
    JOIN products
      ON sales.product_id = products.id
    ORDER BY sales.id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {

      console.error("Get Sales Error:", err);

      return res.status(500).json({
        message: err.message,
      });

    }

    res.json(results);

  });

};


// =========================================================
// RECORD A SALE
// =========================================================

const addSale = (req, res) => {

  const {
    product_id,
    customer_name,
    quantity
  } = req.body;


  // -------------------------------------------------------
  // Validate input
  // -------------------------------------------------------

  if (!product_id || !quantity) {

    return res.status(400).json({
      message: "Product and quantity are required",
    });

  }


  if (Number(quantity) <= 0) {

    return res.status(400).json({
      message: "Quantity must be greater than zero",
    });

  }


  // -------------------------------------------------------
  // Get product
  // -------------------------------------------------------

  db.query(
    "SELECT * FROM products WHERE id = ?",
    [product_id],
    (err, result) => {

      if (err) {

        console.error("Product Query Error:", err);

        return res.status(500).json({
          message: err.message,
        });

      }


      if (result.length === 0) {

        return res.status(404).json({
          message: "Product not found",
        });

      }


      const product = result[0];

      const saleQuantity = Number(quantity);


      // ---------------------------------------------------
      // Check stock
      // ---------------------------------------------------

      if (Number(product.quantity) < saleQuantity) {

        return res.status(400).json({
          message: "Insufficient stock",
        });

      }


      // ---------------------------------------------------
      // Calculate total
      // ---------------------------------------------------

      const total =
        Number(product.selling_price) *
        saleQuantity;


      // ---------------------------------------------------
      // Insert sale
      // ---------------------------------------------------

      const saleSql = `
        INSERT INTO sales
        (
          product_id,
          customer_name,
          quantity,
          selling_price,
          total_amount
        )
        VALUES (?, ?, ?, ?, ?)
      `;


      db.query(
        saleSql,
        [
          product_id,
          customer_name || "Walk-in Customer",
          saleQuantity,
          product.selling_price,
          total,
        ],
        (err, saleResult) => {

          if (err) {

            console.error(
              "Insert Sale Error:",
              err
            );

            return res.status(500).json({
              message: err.message,
            });

          }


          // ------------------------------------------------
          // Reduce product stock
          // ------------------------------------------------

          const updateSql = `
            UPDATE products
            SET quantity = quantity - ?
            WHERE id = ?
          `;


          db.query(
            updateSql,
            [
              saleQuantity,
              product_id
            ],
            (err) => {

              if (err) {

                console.error(
                  "Stock Update Error:",
                  err
                );

                return res.status(500).json({
                  message: err.message,
                });

              }


              // --------------------------------------------
              // Get new stock quantity
              // --------------------------------------------

              const newQuantity =
                Number(product.quantity) -
                saleQuantity;


              // --------------------------------------------
              // Create sale notification
              // --------------------------------------------

              const saleNotificationSql = `
                INSERT INTO notifications
                (
                  type,
                  title,
                  message
                )
                VALUES (?, ?, ?)
              `;


              const saleMessage =
                `Sale recorded: ${saleQuantity} unit${
                  saleQuantity === 1 ? "" : "s"
                } of ${product.product_name} sold to ${
                  customer_name || "Walk-in Customer"
                } for KSh ${Number(total).toLocaleString()}.`;


              db.query(
                saleNotificationSql,
                [
                  "sale",
                  "New Sale",
                  saleMessage
                ],
                (notificationError) => {

                  if (notificationError) {

                    console.error(
                      "Sale Notification Error:",
                      notificationError
                    );

                  }


                  // ----------------------------------------
                  // LOW STOCK NOTIFICATION
                  // ----------------------------------------

                  if (
                    newQuantity > 0 &&
                    newQuantity <= 5
                  ) {

                    const lowStockMessage =
                      `${product.product_name} is running low. Only ${newQuantity} unit${
                        newQuantity === 1
                          ? ""
                          : "s"
                      } remaining.`;


                    db.query(
                      saleNotificationSql,
                      [
                        "low_stock",
                        "Low Stock Alert",
                        lowStockMessage
                      ],
                      (lowStockError) => {

                        if (lowStockError) {

                          console.error(
                            "Low Stock Notification Error:",
                            lowStockError
                          );

                        }

                      }
                    );

                  }


                  // ----------------------------------------
                  // OUT OF STOCK NOTIFICATION
                  // ----------------------------------------

                  if (newQuantity === 0) {

                    const outOfStockMessage =
                      `${product.product_name} is now out of stock.`;


                    db.query(
                      saleNotificationSql,
                      [
                        "out_of_stock",
                        "Out of Stock",
                        outOfStockMessage
                      ],
                      (outOfStockError) => {

                        if (outOfStockError) {

                          console.error(
                            "Out of Stock Notification Error:",
                            outOfStockError
                          );

                        }

                      }
                    );

                  }


                  // ----------------------------------------
                  // Return success
                  // ----------------------------------------

                  return res.status(201).json({

                    success: true,

                    message:
                      "Sale recorded successfully",

                    sale: {

                      id: saleResult.insertId,

                      product_id,

                      product_name:
                        product.product_name,

                      customer_name:
                        customer_name ||
                        "Walk-in Customer",

                      quantity:
                        saleQuantity,

                      selling_price:
                        product.selling_price,

                      total_amount:
                        total,

                      remaining_stock:
                        newQuantity

                    }

                  });

                }
              );

            }
          );

        }
      );

    }
  );

};


module.exports = {
  getSales,
  addSale,
};