import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

class FollowController {

  static async followUser(req, res) {

    const currentUserId = req.user.userId
    const targetUserId = req.params.id

    if (currentUserId === targetUserId) {
      throw new ApiError(
        "You cannot follow yourself",
        400
      )
    }

    const targetUser =
      await prisma.user.findUnique({
        where: { id: targetUserId }
      })

    if (!targetUser) {
      throw new ApiError(
        "Target user not found",
        404
      )
    }

    const existingFollow =
      await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      })

    if (existingFollow) {
      throw new ApiError(
        "Already following this user",
        400
      )
    }

    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId
      }
    })

    await prisma.notification.create({
      data: {
        userId: targetUserId,
        actorId: currentUserId,
        type: "NEW_FOLLOWER",
        message: "You have a new follower."
      }
    })

    return ApiResponse(
      res,
      201,
      "Followed user successfully"
    )
  }

  static async unfollowUser(req, res) {

    const currentUserId = req.user.userId
    const targetUserId = req.params.id

    if (currentUserId === targetUserId) {
      throw new ApiError(
        "You cannot unfollow yourself",
        400
      )
    }

    const existingFollow =
      await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId
          }
        }
      })

    if (!existingFollow) {
      throw new ApiError(
        "You are not following this user",
        400
      )
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId
        }
      }
    })

    return ApiResponse(
      res,
      200,
      "Unfollowed user successfully"
    )
  }
}

export default FollowController