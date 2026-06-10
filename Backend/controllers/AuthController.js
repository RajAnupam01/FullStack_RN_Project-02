import prisma from "../lib/prisma.js"
import vine from "@vinejs/vine";
import { registerSchema, loginSchema } from "../validatations/AuthValidation.js";
import { comparePassword, generateTokens, hashPassword } from "../helper/AuthHelper.js"
import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


class AuthController {

    static async register(req, res) {

        const body = req.body

        const payload = await vine.validate({
            schema: registerSchema,
            data: body
        })

        const findUser = await prisma.user.findUnique({ where: { email:payload.email } })

        if (findUser) {
            throw new ApiError("Email already taken, please choose different email",400)
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

        return ApiResponse(
            res,
            201,
            "User Registered Successfully",
            {
                user:{
                    id:user.id,
                    username:user.username,
                    email:user.email
                },
                accessToken,
                refreshToken
            }
        )

    }

    static async login(req, res) {

        const body = req.body;

        const payload = await vine.validate({
            schema: loginSchema,
            data: body
        })

        const findUser = await prisma.user.findUnique({ where: { email: payload.email } })

        if (!findUser) {
            throw new ApiError("No User found with this Email",400)
        }

        const comparedPassword = await comparePassword(payload.password, findUser.passwordHash)

        if (!comparedPassword) {
           throw new ApiError("Invalid credentials",401)
        }

        const { accessToken, refreshToken } = await generateTokens(findUser.id)

        return ApiResponse(
            res,
            200,
            "User logged in successfully.",
            {
                user:{
                    id:findUser.id,
                    email:findUser.email,
                    username:findUser.username
                },
                accessToken,
                refreshToken
            }
        )

    }


    static async logout(req, res) {
        const userId = req.user.userId

        await prisma.refreshToken.deleteMany({
            where: { userId }
        })
       
        return ApiResponse(
            res,
            200,
            "User logged out successfully."
        )
    }


    static async rotateToken(req, res) {
        const {refreshToken} = req.body
        
        if(!refreshToken){
           throw new ApiError("Refresh Token Required.",400)
        }
        
        let decoded
        try {
            decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET)
        } catch (err) {
            throw new ApiError("Invalid or Expired Refresh Token",403)
        }

        const storedToken = await prisma.refreshToken.findUnique({
            where:{token:refreshToken}
        })

        if(!storedToken || storedToken.expiresAt < new Date()){
            throw new ApiError("Refresh Token not found or already expired.",403)
        }
        const userId = decoded.userId

        await prisma.refreshToken.deleteMany({
            where:{token:refreshToken}
        })

        const {accessToken,refreshToken:newRefreshToken} = await generateTokens(userId)

        return ApiResponse(
            res,
            200,
            "Token rotated successfully.",
            {
                accessToken,
                refreshToken:newRefreshToken
            }
        )
    }
}

export default AuthController