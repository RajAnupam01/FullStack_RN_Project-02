import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary
} from "../utils/Cloudinary.js"

class UserController {

  static async getProfile(req, res) {

    const userId = req.user.userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        reputation: true
      }
    })

    if (!user) {
      throw new ApiError("User not found.", 404)
    }

    return ApiResponse(
      res,
      200,
      "Profile fetched successfully",
      user
    )
  }

  static async getProfileById(req, res) {

    const userId = req.params.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        bio: true,
        avatarUrl: true,
        reputation: true
      }
    })

    if (!user) {
      throw new ApiError("User not found.", 404)
    }

    return ApiResponse(
      res,
      200,
      "User profile fetched successfully",
      user
    )
  }

  static async updateProfile(req, res) {

    const userId = req.user.userId
    const { username, bio, email } = req.body

    const existingUser =
      await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarPublicId: true }
      })

    if (!existingUser) {
      throw new ApiError("User not found.", 404)
    }

    const updatedData = {}

    if (username) updatedData.username = username
    if (bio) updatedData.bio = bio
    if (email) updatedData.email = email

    const buffer = req.file?.buffer

    if (buffer) {

      if (existingUser.avatarPublicId) {
        await deleteImageFromCloudinary(
          existingUser.avatarPublicId
        )
      }

      const uploaded =
        await uploadImageToCloudinary(buffer)

      updatedData.avatarUrl = uploaded.url
      updatedData.avatarPublicId =
        uploaded.public_id
    }

    const updatedUser =
      await prisma.user.update({
        where: { id: userId },
        data: updatedData,
        select: {
          id: true,
          username: true,
          email: true,
          bio: true,
          avatarUrl: true,
          reputation: true
        }
      })

    return ApiResponse(
      res,
      200,
      "Profile updated successfully",
      updatedUser
    )
  }

  static async deleteAccount(req, res) {

    const userId = req.user.userId

    const user =
      await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarPublicId: true }
      })

    if (!user) {
      throw new ApiError("User not found.", 404)
    }

    if (user.avatarPublicId) {
      await deleteImageFromCloudinary(
        user.avatarPublicId
      )
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    return ApiResponse(
      res,
      200,
      "Account deleted successfully"
    )
  }

  static async getFollowers(req, res) {

    const userId = req.params.id

    const followers =
      await prisma.follow.findMany({
        where: { followerId: userId },
        include: {
          follower: {
            select: {
              id: true,
              username: true,
              bio: true,
              avatarUrl: true
            }
          }
        }
      })

    return ApiResponse(
      res,
      200,
      "Followers fetched successfully",
      followers.map(f => f.follower)
    )
  }

  static async getFollowings(req, res) {

    const userId = req.params.id

    const followings =
      await prisma.follow.findMany({
        where: { followingId: userId },
        include: {
          following: {
            select: {
              id: true,
              username: true,
              bio: true,
              avatarUrl: true
            }
          }
        }
      })

    return ApiResponse(
      res,
      200,
      "Followings fetched successfully",
      followings.map(f => f.following)
    )
  }
}

export default UserController