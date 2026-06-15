/**
 * @swagger
 * tags:
 *   name: Bookmark
 *   description: Bookmark management
 */

/**
 * @swagger
 * /api/bookmark:
 *   post:
 *     tags:
 *       - Bookmark
 *     summary: Bookmark a question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *             properties:
 *               questionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Question bookmarked successfully
 *       400:
 *         description: Question already bookmarked
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/bookmark/{id}:
 *   delete:
 *     tags:
 *       - Bookmark
 *     summary: Remove a bookmark
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
 *         description: Bookmark removed successfully
 *       404:
 *         description: Bookmark not found
 */

/**
 * @swagger
 * /api/bookmark/me:
 *   get:
 *     tags:
 *       - Bookmark
 *     summary: Get current user's bookmarks
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarks fetched successfully
 */