import prisma from "../lib/prisma.js"

class AnswerController {
    static async createAnswer(req, res) {
        const userId = req.user.userId
        const { questionId, content } = req.body;

        if (!questionId || content) {
            const error = new Error("QuestionId and content is required.")
            error.statusCode = 400
            throw error
        }
        const question = await prisma.question.findUnique({ where: { id: questionId } })
        if (!question) {
            const error = new Error("Question not found.")
            error.statusCode = 404
            throw error
        }
        const answer = await prisma.answer.create({
            data: { content, questionId, userId },
            include: { user: true, question: true }
        })
        res.status(201).json({ message: "Answer created successfully", answer })
    }

    static async getAnswersByQuestion(req,res){
        const {questionId} = req.params
        if(!questionId){
            
        }
    }



}

export default AnswerController