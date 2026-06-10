import prisma from "../lib/prisma.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"

class TagController {

  static async createTags(req, res) {

    const { name } = req.body

    if (!name) {
      throw new ApiError(
        "Tag Name is required.",
        400
      )
    }

    const normalized = name
      .toLowerCase()
      .trim()

    const existingTag =
      await prisma.tag.findUnique({
        where: { name: normalized }
      })

    if (existingTag) {
      return ApiResponse(
        res,
        200,
        "Tag already exists",
        existingTag
      )
    }

    const tag = await prisma.tag.create({
      data: { name: normalized }
    })

    return ApiResponse(
      res,
      201,
      "Tag created successfully",
      tag
    )
  }

  static async getTags(req, res) {

    const tags = await prisma.tag.findMany()

    return ApiResponse(
      res,
      200,
      "Tags fetched successfully",
      tags
    )
  }
}

export default TagController