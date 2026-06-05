import vine from "@vinejs/vine"

export const updateProfileSchema = vine.object({
  username: vine.string().minLength(5).maxLength(20).optional(),
  email: vine.string().email().optional(),
  bio: vine.string().maxLength(200).optional(),
  avatarUrl: vine.string().url().optional(),
  role: vine.enum(['USER', 'ADMIN']).optional(),
  password: vine.string().minLength(8).maxLength(32).optional()
})
