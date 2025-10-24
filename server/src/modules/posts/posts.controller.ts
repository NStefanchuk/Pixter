// server/src/modules/posts/posts.controller.ts
import { Request, Response } from 'express'
import { postsService } from './posts.service'

export const postsController = {
  async list(req: Request, res: Response) {
    try {
      const posts = await postsService.list()
      res.json(posts)
    } catch (e: any) {
      console.error(e)
      res
        .status(e.status ?? 500)
        .json({ error: e.message ?? 'Internal server error' })
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const post = await postsService.getById(id)
      res.json(post)
    } catch (e: any) {
      console.error(e)
      res
        .status(e.status ?? 500)
        .json({ error: e.message ?? 'Internal server error' })
    }
  },

  async create(req: Request, res: Response) {
    try {
      // requireAuth должно было положить userId сюда
      const authorId = (req as any).userId as string | undefined
      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const post = await postsService.create(authorId, req.body)
      res.status(201).json(post)
    } catch (e: any) {
      console.error(e)
      res.status(e.status ?? 500).json({
        error: e.message ?? 'Internal server error',
        details: e.details,
      })
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const authorId = (req as any).userId as string | undefined
      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const post = await postsService.update(id, authorId, req.body)
      res.json(post)
    } catch (e: any) {
      console.error(e)
      res.status(e.status ?? 500).json({
        error: e.message ?? 'Internal server error',
        details: e.details,
      })
    }
  },

  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params
      const authorId = (req as any).userId as string | undefined
      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const result = await postsService.remove(id, authorId)
      res.json(result)
    } catch (e: any) {
      console.error(e)
      res
        .status(e.status ?? 500)
        .json({ error: e.message ?? 'Internal server error' })
    }
  },
}
