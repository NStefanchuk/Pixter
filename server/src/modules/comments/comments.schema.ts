import { z } from 'zod'

export const createCommentSchema = z.object({
  postId: z.string().cuid('Invalid post id'),
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment is too long'),
})
