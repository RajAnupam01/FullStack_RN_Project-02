import prisma from "../lib/prisma.js"
import slugify from "slugify"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { buildQuestionQuery } from "../config/queryBuilder.js"

class QuestionController {

  static async createQuestion(req, res) {
    const { title, tags } = req.body
    const userId = req.user.userId

    if (!title) {
      throw new ApiError("Title is required.", 400)
    }

    const slug = slugify(title, { lower: true, strict: true })

    const normalizedTags = tags.map(t =>
      t.trim().toLowerCase()
    )

    const existingTags = await prisma.tag.findMany({
      where: {
        name: { in: normalizedTags }
      }
    })

    if (existingTags.length !== normalizedTags.length) {
      throw new ApiError(
        "One or more tags do not exist",
        400
      )
    }

    const question = await prisma.question.create({
      data: {
        title,
        slug,
        userId,
        questionTags: {
          create: existingTags.map(tag => ({
            tagId: tag.id
          }))
        }
      },
      include: {
        questionTags: {
          include: { tag: true }
        },
        user: true
      }
    })

    return ApiResponse(
      res,
      201,
      "Question created successfully",
      question
    )
  }

  static async getQuestions(req, res) {

    const queryOptions = buildQuestionQuery(req.query);

    const questions = await prisma.question.findMany({
      ...queryOptions,
      include: {
        user: true,
        questionTags: {
          include: { tag: true }
        },
        comments: true,
        answers: true
      }
    })

    return ApiResponse(
      res,
      200,
      "Questions fetched successfully",
      questions
    )
  }

  static async getQuestionsById(req, res) {
    const { id } = req.params

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        user: true,
        questionTags: {
          include: { tag: true }
        },
        comments: true,
        answers: true
      }
    })

    if (!question) {
      throw new ApiError(
        "Question not found.",
        404
      )
    }

    return ApiResponse(
      res,
      200,
      "Question fetched successfully",
      question
    )
  }

  static async getQuestionBySlug(req, res) {
    const { slug } = req.params

    const question = await prisma.question.findUnique({
      where: { slug },
      include: {
        user: true,
        questionTags: {
          include: { tag: true }
        },
        answers: true
      }
    })

    if (!question) {
      throw new ApiError(
        "Question not found.",
        404
      )
    }

    return ApiResponse(
      res,
      200,
      "Question fetched successfully",
      question
    )
  }

  static async getQustionByTag(req, res) {

    const { tagName } = req.params

    const normalized = tagName.trim().toLowerCase()

    const tag = await prisma.tag.findUnique({
      where: { name: normalized }
    })

    if (!tag) {
      throw new ApiError(
        "Tag not found",
        404
      )
    }

    const questions = await prisma.question.findMany({
      where: {
        questionTags: {
          some: { tagId: tag.id }
        }
      },
      include: {
        user: true,
        questionTags: {
          include: { tag: true }
        },
        answers: true
      }
    })

    return ApiResponse(
      res,
      200,
      "Questions fetched successfully",
      questions
    )
  }

  static async updateQuestion(req, res) {

    const userId = req.user.userId
    const { id } = req.params
    const { title, tags } = req.body

    const Existquestion = await prisma.question.findUnique({
      where: { id }
    })

    if (!Existquestion) {
      throw new ApiError("Question not found.", 404)
    }

    if (Existquestion.userId !== userId) {
      throw new ApiError(
        "You are not authorized to update this question",
        403
      )
    }

    const data = {}

    if (title) {
      data.title = title
      data.slug = slugify(title, {
        lower: true,
        strict: true
      })
    }

    if (tags && tags.length > 0) {

      const normalizedTags = tags.map(t =>
        t.trim().toLowerCase()
      )

      const existingTags =
        await prisma.tag.findMany({
          where: {
            name: { in: normalizedTags }
          }
        })

      if (
        existingTags.length !==
        normalizedTags.length
      ) {
        throw new ApiError(
          "One or more tags do not exist",
          400
        )
      }

      data.questionTags = {
        deleteMany: {},
        create: existingTags.map(tag => ({
          tagId: tag.id
        }))
      }
    }

    const question = await prisma.question.update({
      where: { id },
      data,
      include: {
        questionTags: {
          include: { tag: true }
        }
      }
    })

    return ApiResponse(
      res,
      200,
      "Question updated successfully",
      question
    )
  }

  static async deleteQuestion(req, res) {
    const { id } = req.params
    const userId = req.user.userId

    const question = await prisma.question.findUnique({
      where: { id }
    })

    if (!question) {
      throw new ApiError("Question not found.", 404)
    }

    if (question.userId !== userId) {
      throw new ApiError(
        "You are not authorized to delete this question.",
        403
      )
    }

    await prisma.question.delete({
      where: { id }
    })

    return ApiResponse(
      res,
      200,
      "Question deleted successfully"
    )
  }

  static async getQuestionsByMe(req, res) {

    const userId = req.user.userId

    const questions =
      await prisma.question.findMany({
        where: { userId },
        include: {
          questionTags: {
            include: { tag: true }
          },
          answers: true,
          bookmarks: true,
          votes: true
        },
        orderBy: {
          createdAt: "desc"
        }
      })

    return ApiResponse(
      res,
      200,
      "Your questions fetched successfully",
      questions
    )
  }

  static async acceptAnswer(req, res) {

    const {
      questionId,
      answerId
    } = req.body

    const userId = req.user.userId

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

    if (question.acceptedAnswerId) {
      throw new ApiError(
        "An answer has already been accepted.",
        400
      )
    }

    if (question.userId !== userId) {
      throw new ApiError(
        "You are not authorized to accept this answer",
        403
      )
    }

    const answer =
      await prisma.answer.findUnique({
        where: { id: answerId }
      })

    if (
      !answer ||
      answer.questionId !== questionId
    ) {
      throw new ApiError(
        "Answer does not belong to this question.",
        400
      )
    }

    const updatedQuestion =
      await prisma.question.update({
        where: { id: questionId },
        data: {
          acceptedAnswerId: answerId
        },
        include: {
          acceptedAnswer: true
        }
      })

    await prisma.user.update({
      where: { id: answer.userId },
      data: {
        reputation: {
          increment: 15
        }
      }
    })

    await prisma.user.update({
      where: { id: userId },
      data: {
        reputation: {
          increment: 3
        }
      }
    })

    await prisma.notification.create({
      data: {
        userId: answer.userId,
        actorId: userId,
        questionId,
        answerId,
        type: "ANSWER_ACCEPTED",
        message: "Your answer was accepted."
      }
    })

    return ApiResponse(
      res,
      200,
      "Answer accepted successfully",
      updatedQuestion
    )
  }
}

export default QuestionController