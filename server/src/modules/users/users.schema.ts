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

export const userPublicSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  avatarUrl: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  createdAt: z.date(),
  postsCount: z.number(),
  followersCount: z.number(),
  followingCount: z.number(),
})
