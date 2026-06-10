import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

class BookMarkController {

    static async createBookMark(req, res) {

        const userId = req.user.userId
        const { questionId } = req.body

        if (!questionId) {
            throw new ApiError(
                "QuestionId is required.",
                400
            )
        }

        const question =
            await prisma.question.findUnique({
                where: { id: questionId }
            })

        if (!question) {
            throw new ApiError(
                "Question not found.",
                404
            )
        }

        const existing =
            await prisma.bookmark.findUnique({
                where: {
                    userId_questionId: {
                        userId,
                        questionId
                    }
                }
            })

        if (existing) {
            throw new ApiError(
                "Question already bookmarked",
                400
            )
        }

        const bookmark =
            await prisma.bookmark.create({
                data: {
                    userId,
                    questionId
                }
            })

        return ApiResponse(
            res,
            201,
            "Question bookmarked successfully",
            bookmark
        )
    }

    static async deleteBookMark(req, res) {

        const userId = req.user.userId
        const { questionId } = req.params

        const existing =
            await prisma.bookmark.findUnique({
                where: {
                    userId_questionId: {
                        userId,
                        questionId
                    }
                }
            })

        if (!existing) {
            throw new ApiError(
                "Bookmark not found",
                404
            )
        }

        await prisma.bookmark.delete({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            }
        })

        return ApiResponse(
            res,
            200,
            "Bookmark removed successfully"
        )
    }

    static async getMyBookMarks(req, res) {

        const userId = req.user.userId

        const bookmarks =
            await prisma.bookmark.findMany({
                where: { userId },
                include: {
                    question: {
                        include: {
                            user: true,
                            questionTags: {
                                include: {
                                    tag: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })

        return ApiResponse(
            res,
            200,
            "Bookmarks fetched successfully",
            bookmarks
        )
    }
}

export default BookMarkController