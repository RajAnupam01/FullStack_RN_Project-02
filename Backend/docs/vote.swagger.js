/**
 * @swagger
 * tags:
 *   name: Vote
 *   description: Vote on questions and answers
 */

/**
 * @swagger
 * /api/votes/questions/{id}/vote:
 *   post:
 *     tags:
 *       - Vote
 *     summary: Vote on a question
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
 *             required:
 *               - voteType
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum:
 *                   - UPVOTE
 *                   - DOWNVOTE
 *                 example: UPVOTE
 *     responses:
 *       200:
 *         description: Vote updated or removed
 *       201:
 *         description: Vote created
 *       400:
 *         description: Invalid vote type
 *       404:
 *         description: Question not found
 */

/**
 * @swagger
 * /api/votes/answers/{id}/vote:
 *   post:
 *     tags:
 *       - Vote
 *     summary: Vote on an answer
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
 *             required:
 *               - voteType
 *             properties:
 *               voteType:
 *                 type: string
 *                 enum:
 *                   - UPVOTE
 *                   - DOWNVOTE
 *                 example: UPVOTE
 *     responses:
 *       200:
 *         description: Vote updated or removed
 *       201:
 *         description: Vote created
 *       400:
 *         description: Invalid vote type
 *       404:
 *         description: Answer not found
 */