import prisma from "../lib/prisma.js"
import slugify from "slugify"

class QuestionController {
    static async createQuestion(req, res) {
        const { title, tags } = req.body
        const userId = req.user.userId

        if (!title) {
            const error = new Error("Title is required.")
            error.StatusCode = 400
            throw error
        }
        const slug = slugify(title, { lower: true, strict: true })

        const normalizedTags = tags.map(t => t.trim().toLowerCase())
        const existingTags = await prisma.tag.findMany({
            where: { name: { in: normalizedTags } }
        })

        if (existingTags.length !== normalizedTags.length) {
            const err = new Error("One or more tags do not exist")
            err.statusCode = 400
            throw err
        }
        const question = await prisma.question.create({
            data: {
                title,
                slug,
                userId,
                questionTags: {
                    create: existingTags.map(tag => ({ tagId: tag.id }))
                }
            },
            include: {
                questionTags: { include: { tag: true } },
                user: true
            }
        })

        res.status(201).json({ message: "Question created successfully", question })
    }

    static async getQuestions(req, res) {
        const questions = await prisma.question.findMany({
            include: {
                user: true,
                questionTags: { include: { tag: true } },
                comments: true,
                answers: true
            }
        })
    }

    static async getQuestionsbyId(req, res) {
        const { id } = req.params
        const question = await prisma.question.findUnique({
            where: { id },
            include: {
                user: true,
                questionTags: { include: { tag: true } },
                comments: true,
                answers: true,
            }
        })
        if (!question) {
            const error = new Error("Question not found.")
            error.statusCode = 404
            throw error
        }
        return res.status(200).json(question)
    }

    static async getQuestionBySlug(req, res) {
        const { slug } = req.params
        const question = await prisma.question.findUnique({
            where: { slug },
            include: {
                user: true,
                questionTags: { include: { tag: true } },
                answers: true
            }
        })
        if (!question) {
            const error = new Error("Question not found.")
            error.statusCode = 404
            throw error
        }
        res.status(200).json({ question })
    }


    static async getQustionByTag(req, res) {
        const { tagName } = req.params
        const normalized = tagName.trim().toLowerCase()

        const tag = await prisma.tag.findUnique({ where: { name: normalized } })

        if (!tag) {
            const err = new Error("Tag not found")
            err.statusCode = 404
            throw err
        }
        const questions = await prisma.question.findMany({
            where: {
                questionTags: { some: { tagId: tag.id } }
            },
            include: {
                user: true,
                questionTags: { include: { tag: true } },
                answers: true
            }
        })

        res.status(200).json(questions)
    }


    static async updateQuestion(req, res) {
        const { id } = req.params
        const { title, tags } = req.body

        const data = {}
        if (title) {
            data.title = title
            data.slug = slugify(title, { lower: true, strict: true })
        }

        if (tags && tags.length > 0) {
            const normalizedTags = tags.map(t => t.trim().toLowerCase())
            const existingTags = await prisma.tag.findMany({
                where: { name: { in: normalizedTags } }
            })
            if (existingTags.length !== normalizedTags.length) {
                const err = new Error("One or more tags do not exist")
                err.statusCode = 400
                throw err
            }
            data.questionTags = {
                deleteMany: {}, // remove old links
                create: existingTags.map(tag => ({ tagId: tag.id }))
            }
        }

        const question = await prisma.question.update({
            where: { id },
            data,
            include: { questionTags: { include: { tag: true } } }
        })

        res.status(200).json({ message: "Question updated successfully", question })
    }


    static async deleteQuestion(req, res) {
        const { id } = req.params
        await prisma.question.delete({ where: { id } })
        res.status(200).json({ message: "Question deleted successfully" })
    }

    static async getQuestionsByMe(req, res) {
        const userId = req.user.id   // comes from auth middleware

        const questions = await prisma.question.findMany({
            where: { userId },
            include: {
                questionTags: { include: { tag: true } },
                answers: true,
                bookmarks: true,
                votes: true
            },
            orderBy: { createdAt: "desc" }
        })

        if (!questions || questions.length === 0) {
            return res.status(404).json({ message: "You have not posted any questions yet" })
        }

        res.status(200).json(questions)
    }


}

export default QuestionController