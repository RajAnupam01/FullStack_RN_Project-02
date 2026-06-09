import prisma from "../lib/prisma.js"

class CommentController {
    static async createComment(req, res) {
        const userId = req.user.userId;
        const { questionId, answerId, content } = req.body;

        if (!content) {
            const error = new Error("Comment content is required.")
            error.statusCode = 400
            throw error
        }
        if (!questionId && !answerId) {
            const error = new Error("Either questionId or answerId is required.")
            error.statusCode = 400
            throw error
        }

        const comment = await prisma.comment.create({
            data: { userId, questionId, answerId, content }
        })


        if (questionId) {
            const question = await prisma.question.findUnique({ where: { id: questionId } })
            if (question && question.userId != userId) {
                await prisma.notification.create({
                    data: {
                        userId: question.userId,
                        actorId: userId,
                        questionId,
                        commentId: comment.id,
                        type: "NEW_COMMENT",
                        message: "Your question received a new comment."
                    }
                })
            }
        }

        if (answerId) {
            const answer = await prisma.answer.findUnique({ where: { id: answerId } })
            if (answer && answer.userId !== userId) {
                await prisma.notification.create({
                    data: {
                        userId: answer.userId,     // recipient
                        actorId: userId,           // actor
                        answerId,
                        commentId: comment.id,
                        type: "NEW_COMMENT",
                        message: "Your answer received a new comment."
                    }
                })
            }
        }




        res.status(201).json({ message: "Comment created successfully", comment })
    }


    static async updateComment(req, res) {
        const userId = req.user.userId;
        const { id } = req.params;
        const { content } = req.body;

        const comment = await prisma.comment.findUnique({ where: { id } })
        if (!comment) {
            const error = new Error("Comment not found.")
            error.statusCode = 404
            throw error
        }
        if (comment.userId != userId) {
            const error = new Error("Not authorized to edit this comment.")
            error.statusCode = 403
            throw error
        }
        const updated = await prisma.comment.update({
            where: { id },
            data: { content }
        })
        res.status(200).json({ message: "Comment updated successfully", comment: updated })
    }

    static async RemoveComment(req, res) {
        const userId = req.user.userId;
        const { id } = req.params;

        const comment = await prisma.comment.findUnique({ where: { id } })
        if (!comment) {
            const error = new Error("Comment not found.")
            error.statusCode = 404
            throw error
        }

        if (comment.userId != userId) {
            const error = new Error("Not authorized to delete this comment.")
            error.statusCode = 403
            throw error
        }
        await prisma.comment.delete({ where: { id } });

        res.status(200).json({ message: "Comment deleted successfully" })
    }

    static async getCommentForQuestion(req, res) {
        const { id } = req.params;

        const comments = await prisma.comment.findMany({
            where: { questionId: id },
            include: { user: { select: { id: true, avatarUrl: true, username: true } } },
            orderBy: { createdAt: "desc" }
        })
        res.status(200).json(comments)
    }

    static async getCommentForAnswer(req, res) {
        const { id } = req.params;

        const comments = await prisma.comment.findMany({
            where: { answerId: id },
            include: { user: { select: { id: true, avatarUrl: true, username: true } } },
            orderBy: { createdAt: "desc" }
        })
        res.status(200).json(comments)
    }


}
export default CommentController;