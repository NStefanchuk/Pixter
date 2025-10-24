import { Request, Response } from 'express'
import { commentsService } from './comments.service'

export const commentsController = {
  async list(req: Request, res: Response) {
    try {
      const comments = await commentsService.list()
      res.json(comments)
    } catch (e: any) {
      console.error(e)
      res
        .status(e.status ?? 500)
        .json({ error: e.message ?? 'Internal server error' })
    }
  },

  async create(req: Request, res: Response) {
    try {
      const authorId = (req as any).userId as string | undefined
      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const newComment = await commentsService.create(authorId, req.body)
      res.status(201).json(newComment)
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
      const authorId = (req as any).userId as string | undefined
      if (!authorId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const { id } = req.params
      const result = await commentsService.remove(id, authorId)
      res.json(result)
    } catch (e: any) {
      console.error(e)
      res
        .status(e.status ?? 500)
        .json({ error: e.message ?? 'Internal server error' })
    }
  },
}
