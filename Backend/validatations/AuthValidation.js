import vine from "@vinejs/vine"

export const registerSchema = vine.object({
  username: vine.string().minLength(5).maxLength(20),
  email: vine.string().email(),
  password: vine.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,12}$/)
})


export const loginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(1)
})
