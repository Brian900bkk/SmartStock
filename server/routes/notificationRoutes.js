const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController");


router.get("/", getNotifications);

router.put("/read-all", markAllAsRead);

router.put("/:id/read", markAsRead);

router.delete("/all", deleteAllNotifications);

router.delete("/:id", deleteNotification);


module.exports = router;