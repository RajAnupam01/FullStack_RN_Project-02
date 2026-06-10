import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

class VoteController {

  static async voteQuestion(req, res) {

    const userId = req.user.userId
    const { id } = req.params
    const { voteType } = req.body

    if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      throw new ApiError("Invalid vote type.", 400)
    }

    const question =
      await prisma.question.findUnique({
        where: { id }
      })

    if (!question) {
      throw new ApiError("Question not found.", 404)
    }

    const existingVote =
      await prisma.questionVote.findUnique({
        where: {
          userId_questionId: {
            userId,
            questionId: id
          }
        }
      })

    // 🟡 TOGGLE VOTE (same vote → remove)
    if (existingVote) {

      if (existingVote.voteType === voteType) {

        await prisma.questionVote.delete({
          where: {
            userId_questionId: {
              userId,
              questionId: id
            }
          }
        })

        return ApiResponse(
          res,
          200,
          "Vote removed"
        )
      }

      const vote =
        await prisma.questionVote.update({
          where: {
            userId_questionId: {
              userId,
              questionId: id
            }
          },
          data: { voteType }
        })

      if (
        voteType === "UPVOTE" &&
        question.userId !== userId
      ) {
        await prisma.notification.create({
          data: {
            userId: question.userId,
            actorId: userId,
            questionId: id,
            type: "QUESTION_UPVOTE",
            message: "Your question received an upvote."
          }
        })
      }

      return ApiResponse(
        res,
        200,
        "Vote updated",
        vote
      )
    }

    // 🟢 NEW VOTE
    const vote =
      await prisma.questionVote.create({
        data: {
          userId,
          questionId: id,
          voteType
        }
      })

    if (
      voteType === "UPVOTE" &&
      question.userId !== userId
    ) {
      await prisma.notification.create({
        data: {
          userId: question.userId,
          actorId: userId,
          questionId: id,
          type: "QUESTION_UPVOTE",
          message: "Your question received an upvote."
        }
      })
    }

    return ApiResponse(
      res,
      201,
      "Vote created",
      vote
    )
  }

  static async voteAnswer(req, res) {

    const userId = req.user.userId
    const { id } = req.params
    const { voteType } = req.body

    if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      throw new ApiError("Invalid vote type.", 400)
    }

    const answer =
      await prisma.answer.findUnique({
        where: { id }
      })

    if (!answer) {
      throw new ApiError("Answer not found.", 404)
    }

    const existingVote =
      await prisma.answerVote.findUnique({
        where: {
          userId_answerId: {
            userId,
            answerId: id
          }
        }
      })

    if (existingVote) {

      if (existingVote.voteType === voteType) {

        await prisma.answerVote.delete({
          where: {
            userId_answerId: {
              userId,
              answerId: id
            }
          }
        })

        return ApiResponse(
          res,
          200,
          "Vote removed"
        )
      }

      const vote =
        await prisma.answerVote.update({
          where: {
            userId_answerId: {
              userId,
              answerId: id
            }
          },
          data: { voteType }
        })

      if (
        voteType === "UPVOTE" &&
        answer.userId !== userId
      ) {
        await prisma.notification.create({
          data: {
            userId: answer.userId,
            actorId: userId,
            answerId: id,
            type: "ANSWER_UPVOTE",
            message: "Your answer received an upvote."
          }
        })
      }

      return ApiResponse(
        res,
        200,
        "Vote updated",
        vote
      )
    }

    const vote =
      await prisma.answerVote.create({
        data: {
          userId,
          answerId: id,
          voteType
        }
      })

    if (
      voteType === "UPVOTE" &&
      answer.userId !== userId
    ) {
      await prisma.notification.create({
        data: {
          userId: answer.userId,
          actorId: userId,
          answerId: id,
          type: "ANSWER_UPVOTE",
          message: "Your answer received an upvote."
        }
      })
    }

    return ApiResponse(
      res,
      201,
      "Vote created",
      vote
    )
  }
}

export default VoteController
