import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(200).optional(),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })