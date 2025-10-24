import express from 'express'
import dotenv from 'dotenv'

import cors from 'cors'
import { usersRouter } from './modules/users/users.routes'
import { postsRouter } from './modules/posts/posts.routes'
import { commentsRouter } from './modules/comments/comments.routes'

dotenv.config()

export const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)

app.use('/users', usersRouter)
app.use('/posts', postsRouter)
app.use('/comments', commentsRouter)
