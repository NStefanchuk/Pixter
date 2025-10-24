import { Router } from 'express'
import { commentsController } from './comments.controller'
import { requireAuth } from '../../lib/requireAuth'

export const commentsRouter = Router()


commentsRouter.get('/', commentsController.list)

commentsRouter.post('/', requireAuth, commentsController.create)

commentsRouter.delete('/:id', requireAuth, commentsController.remove)
