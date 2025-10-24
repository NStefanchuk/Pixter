import { prisma } from '../../lib/prisma'
import { createPostSchema, updatePostSchema } from './posts.schema'

export const postsService = {
  // GET /posts
  async list() {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
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
      return posts
    } catch (e) {
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  // GET /posts/:id
  async getById(postId: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
          comments: {
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
          },
        },
      })

      if (!post) {
        throw { status: 404, message: 'Post not found' }
      }

      return post
    } catch (e: any) {
      if (e.status) throw e
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  // POST /posts
  async create(authorId: string, rawData: unknown) {
    const parsed = createPostSchema.safeParse(rawData)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      throw { status: 400, message: 'Validation failed', details }
    }

    const { imageUrl, description } = parsed.data

    try {
      const post = await prisma.post.create({
        data: {
          authorId,
          imageUrl,
          description,
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
      return post
    } catch (e) {
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  // PUT /posts/:id
  async update(postId: string, authorId: string, rawData: unknown) {
    const parsed = updatePostSchema.safeParse(rawData)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      throw { status: 400, message: 'Validation failed', details }
    }

    try {
      const existing = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })
      if (!existing) {
        throw { status: 404, message: 'Post not found' }
      }
      if (existing.authorId !== authorId) {
        throw { status: 403, message: 'Forbidden' }
      }

      const post = await prisma.post.update({
        where: { id: postId },
        data: parsed.data,
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

      return post
    } catch (e: any) {
      if (e.status) throw e
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },

  async remove(postId: string, authorId: string) {
    try {
      const existing = await prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true },
      })
      if (!existing) {
        throw { status: 404, message: 'Post not found' }
      }
      if (existing.authorId !== authorId) {
        throw { status: 403, message: 'Forbidden' }
      }

      await prisma.post.delete({
        where: { id: postId },
      })
      return { ok: true }
    } catch (e: any) {
      if (e.status) throw e
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },
}
