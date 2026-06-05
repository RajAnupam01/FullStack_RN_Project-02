import prisma from "../lib/prisma.js"
import vine from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validatations/AuthValidation.js";
import { comparePassword, generateTokens, hashPassword } from "../helper/AuthHelper.js"
import jwt from "jsonwebtoken"


class AuthController {

    static async register(req, res) {

        const body = req.body

        const payload = await vine.validate({
            schema: registerSchema,
            data: body
        })

        const findUser = await prisma.user.findUnique({ where: { email: (await payload).email } })

        if (findUser) {
            const error = new Error("Email already taken, please choose different email")
            error.statusCode= 400
            throw error
        }

        const hashedPassword = await hashPassword(payload.password)

        const user = await prisma.user.create({
            data: {
                username: payload.username,
                email: payload.email,
                passwordHash: hashedPassword
            }
        })

        const { accessToken, refreshToken } = await generateTokens(user.id)

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            },
            accessToken,
            refreshToken
        })

    }

    static async login(req, res) {

        const body = req.body;

        const payload = await vine.validate({
            schema: loginSchema,
            data: body
        })

        const findUser = await prisma.user.findUnique({ where: { email: (await payload).email } })

        if (!findUser) {
            const error = new Error("No User found with this Email")
            error.statusCode = 400
            throw error
        }

        const comparedPassword = await comparePassword(payload.password, findUser.passwordHash)

        if (!comparedPassword) {
            const error = new Error("Invalid credentials")
            error.statusCode = 401
            throw error
        }

        const { accessToken, refreshToken } = await generateTokens(findUser.id)

        return res.status(200).json({
            message: "User logged in Successfully.",
            user: {
                id: findUser.id,
                email: findUser.email,
                username: findUser.username
            },
            accessToken,
            refreshToken
        })

    }


    static async logout(req, res) {
        const userId = req.user.userId

        await prisma.refreshToken.deleteMany({
            where: { userId }
        })
        return res.status(200).json({
            message: "User logged out successfully."
        })
    }


    static async rotateToken(req, res) {
        const {refreshToken} = req.body
        
        if(!refreshToken){
            const error = new Error("Refresh Token Required.")
            error.statusCode=400
            throw error
        }
        
        let decoded
        try {
            decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        } catch (err) {
            const error = new Error("Invalid or Expired Refresh Token")
            error.statusCode=403
            throw error
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where:{token:refreshToken}
        })

        if(!storedToken || storedToken.expiresAt < new Date()){
            const error = new Error("Refresh Token not found or already expired.")
            error.statusCode=403
            throw error
        }
        const userId = decoded.userId

        await prisma.refreshToken.deleteMany({
            where:{token:refreshToken}
        })

        const {accessToken,refreshToken:newRefreshToken} = await generateTokens(userId)

        res.status(200).json({
            message:"Token rotated successfully.",
            accessToken,
            refreshToken:newRefreshToken
        })
    }
}

export default AuthController