/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment management
 */

/**
 * @swagger
 * /api/comment:
 *   post:
 *     tags:
 *       - Comment
 *     summary: Create a comment on a question or answer
 *     description: |
 *       You must provide EITHER questionId OR answerId (not both).
 *       - Use questionId to comment on a question
 *       - Use answerId to comment on an answer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionId:
 *                 type: string
 *               answerId:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - content
 */

/**
 * @swagger
 * /api/comment/{id}:
 *   put:
 *     tags:
 *       - Comment
 *     summary: Update a comment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comment/{id}:
 *   delete:
 *     tags:
 *       - Comment
 *     summary: Delete a comment
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
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comment/questions/{id}/comments:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get comments for a question with pagination and sorting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Question ID

 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number

 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page

 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *           default: latest
 *         description: Sort order

 *     responses:
 *       200:
 *         description: Comments fetched successfully
 */

/**
 * @swagger
 * /api/comment/answers/{id}/comments:
 *   get:
 *     tags:
 *       - Comment
 *     summary: Get comments for an answer with pagination and sorting
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Answer ID

 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number

 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page

 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [latest, oldest]
 *           default: latest
 *         description: Sort order

 *     responses:
 *       200:
 *         description: Comments fetched successfully
 */