import { prisma } from '../../lib/prisma'
import { createCommentSchema } from './comments.schema'

export const commentsService = {
  // GET /comments
  async list() {
    try {
      const comments = await prisma.comment.findMany({
        orderBy: { createdAt: 'asc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      })
      return comments
    } catch (e) {
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  // POST /comments
  async create(authorId: string, rawData: unknown) {
    const parsed = createCommentSchema.safeParse(rawData)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      throw { status: 400, message: 'Validation failed', details }
    }

    const { postId, content } = parsed.data

    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { id: true },
      })
      if (!post) {
        throw { status: 404, message: 'Post not found' }
      }

      const newComment = await prisma.comment.create({
        data: {
          postId,
          authorId,
          content,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      })

      await prisma.post.update({
        where: { id: postId },
        data: {
          commentCount: { increment: 1 },
        },
      })

      return newComment
    } catch (e: any) {
      if (e.status) throw e
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  async remove(commentId: string, authorId: string) {
    try {
      const existing = await prisma.comment.findUnique({
        where: { id: commentId },
        select: { authorId: true, postId: true },
      })

      if (!existing) {
        throw { status: 404, message: 'Comment not found' }
      }
      if (existing.authorId !== authorId) {
        throw { status: 403, message: 'Forbidden' }
      }

      await prisma.comment.delete({
        where: { id: commentId },
      })

      await prisma.post.update({
        where: { id: existing.postId },
        data: {
          commentCount: { decrement: 1 },
        },
      })

      return { ok: true }
    } catch (e: any) {
      if (e.status) throw e
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },
}
