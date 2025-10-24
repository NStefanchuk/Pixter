import { Router } from 'express'
import { getMe, loginUser, registerUser } from './users.controller'
import { requireAuth } from '../../lib/requireAuth'

export const usersRouter = Router()

usersRouter.post('/register', registerUser)
usersRouter.post('/login', loginUser)
usersRouter.get('/me', requireAuth, getMe)
