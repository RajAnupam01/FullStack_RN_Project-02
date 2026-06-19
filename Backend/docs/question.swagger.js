/**
 * @swagger
 * tags:
 *   name: Question
 *   description: Question management
 */

/**
 * @swagger
 * /api/question:
 *   post:
 *     tags:
 *       - Question
 *     summary: Create a question
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - tags
 *             properties:
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Question created successfully
 */

/**
 * @swagger
 * /api/question:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get all questions with pagination, search, sorting, and filtering
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Sort by creation date

 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by question title

 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter questions by tag name

 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [answered, unanswered]
 *         description: Filter by answer status

 *     responses:
 *       200:
 *         description: Questions fetched successfully
 */

/**
 * @swagger
 * /api/question/{id}:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get question by ID
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
 *         description: Question fetched successfully
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/slug/{slug}:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get question by slug
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question fetched successfully
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/tag/{tagName}:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get questions by tag
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tagName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 *       404:
 *         description: Tag not found
 */

/**
 * @swagger
 * /api/question/me:
 *   get:
 *     tags:
 *       - Question
 *     summary: Get current user's questions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Questions fetched successfully
 */

/**
 * @swagger
 * /api/question/{id}:
 *   put:
 *     tags:
 *       - Question
 *     summary: Update a question
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/{id}:
 *   delete:
 *     tags:
 *       - Question
 *     summary: Delete a question
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
 *         description: Question deleted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/question/acceptAnswer:
 *   post:
 *     tags:
 *       - Question
 *     summary: Accept an answer for a question
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
 *               - answerId
 *             properties:
 *               questionId:
 *                 type: string
 *               answerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Answer accepted successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 */