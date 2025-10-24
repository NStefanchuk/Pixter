import { Router } from 'express'
import { loginUser, registerUser } from './users.controller'

export const users = Router()

users.post('/register', registerUser)
users.post('/login', loginUser)
