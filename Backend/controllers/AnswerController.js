import prisma from "../lib/prisma.js"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/Cloudinary.js"

class AnswerController {
  static async createAnswer(req, res) {
    const userId = req.user.userId
    const { questionId, content } = req.body

    if (!questionId || !content) {
      const error = new Error("QuestionId and content are required.")
      error.statusCode = 400
      throw error
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } })
    if (!question) {
      const error = new Error("Question not found.")
      error.statusCode = 404
      throw error
    }

    const payload = { content, questionId, userId }

    const buffer = req.file?.buffer
    if (buffer) {
      const uploaded = await uploadImageToCloudinary(buffer)
      payload.imageUrl = uploaded.url
      payload.imagePublicId = uploaded.public_id
    }

    const answer = await prisma.answer.create({
      data: payload,
      include: { user: true, question: true }
    })

    await prisma.notification.create({
      data:{
        userId:questionId.userId,
        actorId:userId,
        questionId:questionId,
        answerId:answer.id,
        type:"NEW_ANSWER",
        message:"Your question received the answer."
      }
    })

    await prisma.user.update({
      where:{id:userId},
      data:{reputation:{increment:5}}
    })

    res.status(201).json({ message: "Answer created successfully", answer })
  }

  static async getAnswersByQuestion(req, res) {
    const { questionId } = req.params
    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: { user: true, comments: true, votes: true },
      orderBy: { createdAt: "desc" }
    })
    res.status(200).json(answers)
  }

  static async updateAnswer(req, res) {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.userId

    const answer = await prisma.answer.findUnique({ where: { id } })
    if (!answer) {
      const error = new Error("Answer not found.")
      error.statusCode = 404
      throw error
    }
    if (answer.userId !== userId) {
      const error = new Error("Not authorized to edit this answer")
      error.statusCode = 403
      throw error
    }

    const payload = {}
    if (content) payload.content = content

    const buffer = req.file?.buffer
    if (buffer) {
      if (answer.imagePublicId) {
        await deleteImageFromCloudinary(answer.imagePublicId)
      }
      const uploaded = await uploadImageToCloudinary(buffer)
      payload.imageUrl = uploaded.url
      payload.imagePublicId = uploaded.public_id
    }

    const updated = await prisma.answer.update({
      where: { id },
      data: payload,
      include: { user: true }
    })

    res.status(200).json({ message: "Answer updated successfully", updated })
  }

  static async deleteAnswer(req, res) {
    const { id } = req.params
    const userId = req.user.userId

    const answer = await prisma.answer.findUnique({ where: { id } })
    if (!answer) {
      const error = new Error("Answer not found.")
      error.statusCode = 404
      throw error
    }
    if (answer.userId !== userId) {
      const error = new Error("You are not authorized to delete this answer.")
      error.statusCode = 403
      throw error
    }
    if (answer.imagePublicId) {
      await deleteImageFromCloudinary(answer.imagePublicId)
    }

    await prisma.answer.delete({ where: { id } })

    await prisma.user.update({
      where:{id:userId},
      data:{reputation:{decrement:5}}
    })

    res.status(200).json({ message: "Answer deleted successfully" })
  }

  static async getAnswersByMe(req, res) {
    const userId = req.user.userId
    const answers = await prisma.answer.findMany({
      where: { userId },
      include: { question: true, votes: true },
      orderBy: { createdAt: "desc" }
    })

    if (!answers || answers.length === 0) {
      const error = new Error("You have not posted any answers yet")
      error.statusCode = 404
      throw error
    }

    res.status(200).json(answers)
  }
}

export default AnswerController
