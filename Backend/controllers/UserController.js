import prisma from "../lib/prisma.js"
import multer, { upload } from "../middlewares/multer.js"
import cloudinary, { deleteImageFromCloudinary, uploadImageToCloudinary } from "../utils/Cloudinary.js"

class UserController {
    static async getProfile(req, res) {
        const userId = req.user.userId
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, bio: true, avatarUrl: true, reputation: true }
        })
        if (!user) {
            const error = new Error("user not found.")
            error.statusCode = 404
            throw error
        }
        return res.status(200).json({ user })
    }

    static async getProfileById(req, res) {
        const userId = req.params.id
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, email: true, bio: true, avatarUrl: true, reputation: true }
        })
        if (!user) {
            const error = new Error("No such user exist.")
            error.statusCode = 404
            throw error
        }
        return res.status(200).json({ user })

    }

    static async updateProfile(req, res) {
        const userId = req.user.userId
        const { username, bio, email } = req.body

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarPublicId: true }
        })

        let updatedData = {}

        if (username) updatedData.username = username
        if (bio) updatedData.bio = bio
        if (email) updatedData.email = email

        const buffer = req.file?.buffer
        if (buffer) {
            if (user?.avatarPublicId) {
                try {
                    await deleteImageFromCloudinary(user.avatarPublicId)
                } catch (err) {
                    const error = new Error("Failed to delete old avatar.")
                    error.statusCode = 500
                    throw error
                }
            }

            const uploaded = await uploadImageToCloudinary(buffer)
            updatedData.avatarUrl = uploaded.url
            updatedData.avatarPublicId = uploaded.public_id
        }

        const updatedUser = await prisma.user.update({
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

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        })
    }


    static async deleteAccount(req, res) {
        const userId = req.user.userId

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { avatarPublicId: true }
        })

        if (user?.avatarPublicId) {
            await deleteImageFromCloudinary(user.avatarPublicId)
        }

        await prisma.user.delete({ where: { id: userId } })

        return res.status(200).json({ message: "Account deleted successfully." })
    }

    static async getFollowers(req, res) {
        const userId = req.params.id
        const followers = await prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                follower: {
                    select: { id: true, username: true, bio: true, avatarUrl: true }
                }
            }
        })
        return res.status(200).json({
            followers: followers.map(f => f.follower)
        })
    }
    static async getFollowings(req, res) {
        const userId = req.params.id
        const followings = await prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                following: {
                    select: { id: true, username: true, bio: true, avatarUrl: true }
                }
            }
        })
        return res.status(200).json({
            followings: followings.map(f => f.following)
        })
    }
}

export default UserController