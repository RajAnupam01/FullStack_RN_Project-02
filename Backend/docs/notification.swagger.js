/**
 * @swagger
 * tags:
 *   name: Notification
 *   description: User notifications
 */

/**
 * @swagger
 * /api/notification:
 *   get:
 *     tags:
 *       - Notification
 *     summary: Get current user's notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 */

/**
 * @swagger
 * /api/notification/{id}/read:
 *   put:
 *     tags:
 *       - Notification
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */

/**
 * @swagger
 * /api/notification/{id}:
 *   delete:
 *     tags:
 *       - Notification
 *     summary: Delete a notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */