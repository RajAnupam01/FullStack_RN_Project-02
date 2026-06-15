/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow and unfollow users
 */

/**
 * @swagger
 * /api/follow/{id}:
 *   post:
 *     tags:
 *       - Follow
 *     summary: Follow a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Followed user successfully
 *       400:
 *         description: Already following user or trying to follow yourself
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/follow/{id}:
 *   delete:
 *     tags:
 *       - Follow
 *     summary: Unfollow a user
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
 *         description: Unfollowed user successfully
 *       400:
 *         description: Not following user or trying to unfollow yourself
 */