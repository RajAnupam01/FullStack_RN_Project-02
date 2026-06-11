import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {buildNotificationQuery} from "../config/queryBuilder.js"

class NotificationController {

  static async getNotifications(req, res) {

    const userId = req.user.userId

    const queryOption = buildNotificationQuery(req.query)

    const notifications =
      await prisma.notification.findMany({
        where: { userId },
        ...queryOption,
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: { id: true, username: true }
          },
          question: {
            select: { id: true, title: true }
          },
          answer: {
            select: { id: true, content: true }
          },
          comment: {
            select: { id: true, content: true }
          }
        }
      })

    return ApiResponse(
      res,
      200,
      "Notifications fetched successfully",
      notifications
    )
  }

  static async readNotification(req, res) {

    const { id } = req.params
    const userId = req.user.userId

    const notification =
      await prisma.notification.findUnique({
        where: { id }
      })

    if (
      !notification ||
      notification.userId !== userId
    ) {
      throw new ApiError(
        "Notification not found",
        404
      )
    }

    const updated =
      await prisma.notification.update({
        where: { id },
        data: { isRead: true }
      })

    return ApiResponse(
      res,
      200,
      "Notification marked as read",
      updated
    )
  }

  static async deleteNotification(req, res) {

    const { id } = req.params
    const userId = req.user.userId

    const notification =
      await prisma.notification.findUnique({
        where: { id }
      })

    if (
      !notification ||
      notification.userId !== userId
    ) {
      throw new ApiError(
        "Notification not found",
        404
      )
    }

    await prisma.notification.delete({
      where: { id }
    })

    return ApiResponse(
      res,
      200,
      "Notification deleted successfully"
    )
  }
}

export default NotificationController