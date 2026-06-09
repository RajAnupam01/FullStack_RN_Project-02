import express from "express"
import NotificationController from "../controllers/NotificationController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.get("/", AuthMiddleware, AsyncHandler(NotificationController.getNotifications))
router.put("/:id/read", AuthMiddleware, AsyncHandler(NotificationController.markAsRead))
router.delete("/:id", AuthMiddleware, AsyncHandler(NotificationController.deleteNotification))

export default router