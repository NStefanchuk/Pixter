import { Router } from 'express'
import { postsController } from './posts.controller'
import { requireAuth } from '../../lib/requireAuth'

export const postsRouter = Router()

// public
postsRouter.get('/', postsController.list)
postsRouter.get('/:id', postsController.getById)

// private
postsRouter.post('/', requireAuth, postsController.create)
postsRouter.put('/:id', requireAuth, postsController.update)
postsRouter.delete('/:id', requireAuth, postsController.remove)
