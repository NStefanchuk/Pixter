import { Router } from 'express'
import { getMe, loginUser, registerUser } from './users.controller'
import { requireAuth } from '../../lib/requireAuth'

export const users = Router()

users.post('/register', registerUser)
users.post('/login', loginUser)
users.get('/me', requireAuth, getMe)
