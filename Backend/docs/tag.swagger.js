/**
 * @swagger
 * tags:
 *   name: Tag
 *   description: Tag management
 */

/**
 * @swagger
 * /api/tag:
 *   post:
 *     tags:
 *       - Tag
 *     summary: Create a new tag
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: javascript
 *     responses:
 *       201:
 *         description: Tag created successfully
 *       200:
 *         description: Tag already exists
 *       400:
 *         description: Tag name is required
 */

/**
 * @swagger
 * /api/tag:
 *   get:
 *     tags:
 *       - Tag
 *     summary: Get all tags
 *     responses:
 *       200:
 *         description: Tags fetched successfully
 */