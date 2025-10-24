import express from 'express'
import dotenv from 'dotenv'

import cors from 'cors'
import { users } from './modules/users/users.routes'
import { postsRouter } from './modules/posts/posts.routes'

dotenv.config()

export const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)

app.use('/users', users)
app.use('/posts', postsRouter)

