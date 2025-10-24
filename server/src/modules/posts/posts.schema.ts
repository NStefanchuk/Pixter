import { z } from 'zod'

export const createPostSchema = z.object({
  imageUrl: z.string().url('Invalid image URL'),
  description: z.string().trim().optional(),
})

export const updatePostSchema = z.object({
  imageUrl: z.string().url('Invalid image URL').optional(),
  description: z.string().trim().optional(),
})
