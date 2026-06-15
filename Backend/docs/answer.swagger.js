/**
 * @swagger
 * tags:
 *   name: Answer
 *   description: Answer management
 */

/**
 * @swagger
 * /api/answer:
 *   post:
 *     tags:
 *       - Answer
 *     summary: Create an answer
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - content
 *             properties:
 *               questionId:
 *                 type: string
 *               content:
 *                 type: string
 *               answer:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Answer created successfully
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/answer/question/{questionId}:
 *   get:
 *     tags:
 *       - Answer
 *     summary: Get answers for a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Answers fetched successfully
 */

/**
 * @swagger
 * /api/answer/{id}:
 *   put:
 *     tags:
 *       - Answer
 *     summary: Update an answer
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               answer:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Answer updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Answer not found
 */

/**
 * @swagger
 * /api/answer/{id}:
 *   delete:
 *     tags:
 *       - Answer
 *     summary: Delete an answer
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
 *         description: Answer deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Answer not found
 */

/**
 * @swagger
 * /api/answer/me:
 *   get:
 *     tags:
 *       - Answer
 *     summary: Get answers created by current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Answers fetched successfully
 */