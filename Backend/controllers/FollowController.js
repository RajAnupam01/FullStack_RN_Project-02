import prisma from "../lib/prisma";

class FollowController {
  static async followUser(req, res) {
    const currentUserId = req.user.userId
    const targetUserId = req.params.id

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot follow yourself" })
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } })
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } }
    })
    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" })
    }
    await prisma.follow.create({
      data: { followerId: currentUserId, followingId: targetUserId }
    })

    return res.status(201).json({ message: "Followed user successfully" })
  }

  static async unfollowUser(req, res) {
    const currentUserId = req.user.userId
    const targetUserId = req.params.id


    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" })
    }

    const existingFollow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } }
    })
    if (!existingFollow) {
      return res.status(400).json({ message: "You are not following this user" })
    }

    await prisma.follow.delete({
      where: { followerId_followingId: { followerId: currentUserId, followingId: targetUserId } }
    })

    return res.status(200).json({ message: "Unfollowed user successfully" })
  }
}

export default FollowController