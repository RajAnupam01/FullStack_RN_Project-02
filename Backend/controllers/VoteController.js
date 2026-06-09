import prisma from "../lib/prisma.js"

class VoteController {
  static async voteQuestion(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { voteType } = req.body

    if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      const error = new Error("Invalid vote type.")
      error.statusCode = 400
      throw error
    }

    const question = await prisma.question.findUnique({ where: { id } })
    if (!question) {
      const error = new Error("Question not found.")
      error.statusCode = 404
      throw error
    }

    const existingVote = await prisma.questionVote.findUnique({
      where: { userId_questionId: { userId, questionId: id } }
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.questionVote.delete({
          where: { userId_questionId: { userId, questionId: id } }
        })
        return res.status(200).json({ message: "Vote removed" })
      } else {
        const vote = await prisma.questionVote.update({
          where: { userId_questionId: { userId, questionId: id } },
          data: { voteType }
        })

        if (voteType === "UPVOTE" && question.userId !== userId) {
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

        return res.status(200).json({ message: "Vote updated", vote })
      }
    } else {
      const vote = await prisma.questionVote.create({
        data: { userId, questionId: id, voteType }
      })

      if (voteType === "UPVOTE" && question.userId !== userId) {
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

      return res.status(201).json({ message: "Vote created", vote })
    }
  }

  static async voteAnswer(req, res) {
    const userId = req.user.userId
    const { id } = req.params
    const { voteType } = req.body

    if (!["UPVOTE", "DOWNVOTE"].includes(voteType)) {
      const error = new Error("Invalid vote type.")
      error.statusCode = 400
      throw error
    }

    const answer = await prisma.answer.findUnique({ where: { id } })
    if (!answer) {
      const error = new Error("Answer not found.")
      error.statusCode = 404
      throw error
    }

    const existingVote = await prisma.answerVote.findUnique({
      where: { userId_answerId: { userId, answerId: id } }
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.answerVote.delete({
          where: { userId_answerId: { userId, answerId: id } }
        })
        return res.status(200).json({ message: "Vote removed" })
      } else {
        const vote = await prisma.answerVote.update({
          where: { userId_answerId: { userId, answerId: id } },
          data: { voteType }
        })

        if (voteType === "UPVOTE" && answer.userId !== userId) {
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

        return res.status(200).json({ message: "Vote updated", vote })
      }
    } else {
      const vote = await prisma.answerVote.create({
        data: { userId, answerId: id, voteType }
      })

      if (voteType === "UPVOTE" && answer.userId !== userId) {
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

      return res.status(201).json({ message: "Vote created", vote })
    }
  }
}

export default VoteController
