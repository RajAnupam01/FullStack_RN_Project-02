import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {buildCommentQuery} from "../config/queryBuilder.js"

class CommentController {
    static async createComment(req, res) {
        const userId = req.user.userId;
        const { questionId, answerId, content } = req.body;

        if (!content?.trim()) {
            throw new ApiError("Comment content is required.", 400)
        }
        if (!questionId && !answerId) {
            throw new ApiError("Either questionId or answerId is required.", 400)
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

        return ApiResponse(res, 201, "Comment created successfully.", comment)
    }


    static async updateComment(req, res) {
        const userId = req.user.userId;
        const { id } = req.params;
        const { content } = req.body;

        const comment = await prisma.comment.findUnique({ where: { id } })
        if (!comment) {
            throw new ApiError(
                "Comment not found.",
                404
            )
        }
        if (comment.userId !== userId) {
            throw new ApiError("Not authorized to edit this comment.", 403)
        }

        const updated = await prisma.comment.update({
            where: { id },
            data: { content }
        })

        return ApiResponse(
            res,
            200,
            "Comment updated successfully",
            updated
        )
    }

    static async RemoveComment(req, res) {
        const userId = req.user.userId;
        const { id } = req.params;

        const comment = await prisma.comment.findUnique({ where: { id } })
        if (!comment) {
            throw new ApiError(
                "Comment not found.",
                404
            )
        }

        if (comment.userId !== userId) {
            throw new ApiError(
                "Not authorized to delete this comment.",
                403
            )
        }
        await prisma.comment.delete({ where: { id } });

        return ApiResponse(
            res,
            200,
            "Comment deleted successfully."
        )
    }

    static async getCommentForQuestion(req, res) {
        const { id } = req.params;

        const queryOptions = buildCommentQuery(req.query);


        const comments = await prisma.comment.findMany({
            where: { questionId: id },
            ...queryOptions,
            include: { user: { select: { id: true, avatarUrl: true, username: true } } },
        })
        return ApiResponse(
            res,
            200,
            "Comments fetched successfully.",
            comments
        )
    }

    static async getCommentForAnswer(req, res) {
        const { id } = req.params;

        const queryOptions = buildCommentQuery(req.query);


        const comments = await prisma.comment.findMany({
            where: { answerId: id },
            ...queryOptions,
            include: { user: { select: { id: true, avatarUrl: true, username: true } } },
        })
        
        return ApiResponse(
            res,
            200,
            "Comments fetched successfully.",
            comments
        )
    }


}
export default CommentController;