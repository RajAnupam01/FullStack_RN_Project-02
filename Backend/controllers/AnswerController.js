import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {buildAnswerQuery} from "../config/queryBuilder.js"
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/Cloudinary.js"
import NotificationService from "../services/NotificationService.js"
import ReputationService from "../services/ReputationService.js"

class AnswerController {
  static async createAnswer(req, res) {
    const userId = req.user.userId
    const { questionId, content } = req.body

    if (!questionId || !content) {
      throw new ApiError("QuestionId and content are required.", 400)
    }

    const question = await prisma.question.findUnique({ where: { id: questionId } })

    if (!question) {
      throw new ApiError("Question not found", 404)
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
      data: {
        userId: question.userId,
        actorId: userId,
        questionId: questionId.id,
        answerId: answer.id,
        type: "NEW_ANSWER",
        message: "Your question received the answer."
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { increment: 5 } }
    })

    return ApiResponse(res, 201, "Answer Created Successfully", answer)
  }

  static async getAnswersByQuestion(req, res) {
    const { questionId } = req.params;

    const queryOptions = buildAnswerQuery(req.query);


    const answers = await prisma.answer.findMany({
      where: { questionId },
      ...queryOptions,
      include: { user: true, comments: true, votes: true },
    })
    
    return ApiResponse(res, 200, "Answers fetched successfully,", answers)
  }

  static async updateAnswer(req, res) {
    const { id } = req.params
    const { content } = req.body
    const userId = req.user.userId

    const answer = await prisma.answer.findUnique({ where: { id } })
    if (!answer) {
      throw new ApiError("Answer not found.", 404)
    }
    if (answer.userId !== userId) {
      throw new ApiError("Not authorized to edit this answer", 403)
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

    return ApiResponse(res, 200, "Answer updated successfuly,", updated)

  }

  static async deleteAnswer(req, res) {
    const { id } = req.params
    const userId = req.user.userId

    const answer = await prisma.answer.findUnique({ where: { id } })
    if (!answer) {
      throw new ApiError("Answer not found.", 404)
    }
    if (answer.userId !== userId) {
      throw new ApiError("You are not authorized to delete this answer.", 403)
    }
    if (answer.imagePublicId) {
      await deleteImageFromCloudinary(answer.imagePublicId)
    }

    await prisma.answer.delete({ where: { id } })

    await prisma.user.update({
      where: { id: userId },
      data: { reputation: { decrement: 5 } }
    })

    return ApiResponse(res, 200, "Answer deleted successfully.")
  }

  static async getAnswersByMe(req, res) {
    const userId = req.user.userId
    const answers = await prisma.answer.findMany({
      where: { userId },
      include: { question: true, votes: true },
      orderBy: { createdAt: "desc" }
    })

    return ApiResponse(res, 200, "Answers fetched successfully.", answers)
  }
}

export default AnswerController
