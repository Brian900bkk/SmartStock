const db = require("../config/db");

// =========================================================
// GET NOTIFICATIONS
// =========================================================

const getNotifications = (req, res) => {
  const sql = `
    SELECT
      id,
      type,
      title,
      message,
      is_read,
      created_at
    FROM notifications
    ORDER BY id DESC
    LIMIT 50
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Get Notifications Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to load notifications",
      });
    }

    res.status(200).json({
      success: true,
      notifications: results,
    });
  });
};


// =========================================================
// MARK NOTIFICATION AS READ
// =========================================================

const markAsRead = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Mark Notification Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to mark notification as read",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  });
};


// =========================================================
// MARK ALL AS READ
// =========================================================

const markAllAsRead = (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE is_read = 0
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("Mark All Notifications Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to mark notifications as read",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  });
};


// =========================================================
// DELETE NOTIFICATION
// =========================================================

const deleteNotification = (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM notifications
    WHERE id = ?
  `;

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Delete Notification Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to delete notification",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  });
};


// =========================================================
// DELETE ALL NOTIFICATIONS
// =========================================================

const deleteAllNotifications = (req, res) => {
  const sql = `
    DELETE FROM notifications
  `;

  db.query(sql, (err) => {
    if (err) {
      console.error("Delete All Notifications Error:", err);

      return res.status(500).json({
        success: false,
        message: "Failed to clear notifications",
      });
    }

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  });
};


module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};