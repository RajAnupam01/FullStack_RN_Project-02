import prisma from "../lib/prisma.js"

class BookMarkController {
    static async createBookMark(req, res) {
        const userId = req.userId
        const { questionId } = req.body;

        if (!questionId) {
            const error = new Error("QuestionId is required.")
            error.statusCode = 400
            throw error
        }

        const question = await prisma.question.findUnique({ where: { id: questionId } })
        if (!question) {
            const error = new Error("Question not found.")
            error.statusCode = 404
            throw error
        }
        const existing = await prisma.bookmark.findUnique({
            where: { userId_questionId: { userId, questionId } }
        })

        if (existing) {
            return res.status(400).json({ message: "Already bookmarked" })
        }

        const bookmark = await prisma.bookmark.create({
            data: { userId, questionId }
        })

        res.status(201).json({ message: "Question bookmarked successfully", bookmark })

    }
    static async deleteBookMark(req, res) {
        const userId = req.user.userId;
        const { questionId } = req.params;

        const existing = await prisma.findUnique({
            where: { userId_questionId: { userId, questionId } }
        })
        if (!existing) {
            return res.status(404).json({ message: "Bookmark not found" })
        }
        await prisma.bookmark.delete({
            where: { userId_questionId: { userId, questionId } }
        })
        return res.status(200).json({ message: "Bookmark removed successfully" })
    }

    static async getMyBookMarks(req, res) {
        
        const userId = req.user.userId;
        const bookmarks = await prisma.bookmark.findMany({
            where: { userId },
            include: {
                question: {
                    include: {
                        user: true,
                        questionTags: { include: { tag: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        })
        if (!bookmarks || bookmarks.length === 0) {
            return res.status(404).json({ message: "No bookmarks found" })
        }

        res.status(200).json(bookmarks)
    }
}
export default BookMarkController