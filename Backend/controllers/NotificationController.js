import prisma from "../lib/prisma.js"

class NotificationController {
    static async getNotifications(req, res) {
        const userId = req.user.userId;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: {
                actor: { select: { id: true, username: true } },
                question: { select: { id: true, title: true } },
                answer: { select: { id: true, content: true } },
                comment: { select: { id: true, comment: true } }
            }
        })
        res.status(200).json({ notifications })
    }

    static async readNotification(req, res) {
        const { id } = req.params;
        const userId = req.user.userId;

        const notification = await prisma.notification.findUnique({ where: { id } })
        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ message: "Notification not found" })
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        })

        res.status(200).json({ message: "Notification marked as read", notification: updated })
    }
    static async deleteNotification(req, res) {
        const userId = req.user.userId
        const { id } = req.params

        const notification = await prisma.notification.findUnique({ where: { id } })
        if (!notification || notification.userId !== userId) {
            return res.status(404).json({ message: "Notification not found" })
        }

        await prisma.notification.delete({ where: { id } })

        res.status(200).json({ message: "Notification deleted" })
    }

}

export default NotificationController;