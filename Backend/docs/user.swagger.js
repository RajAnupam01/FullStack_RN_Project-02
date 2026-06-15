/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile management
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     tags:
 *       - User
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user profile by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clx123abc456
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/me:
 *   put:
 *     tags:
 *       - User
 *     summary: Update current user's profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/me:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete current user's account
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/followers:
 *   get:
 *     tags:
 *       - User
 *     summary: Get followers of a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clx123abc456
 *     responses:
 *       200:
 *         description: Followers fetched successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/{id}/followings:
 *   get:
 *     tags:
 *       - User
 *     summary: Get users followed by a user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clx123abc456
 *     responses:
 *       200:
 *         description: Followings fetched successfully
 *       404:
 *         description: User not found
 */