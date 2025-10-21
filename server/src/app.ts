import express from 'express'
import dotenv from 'dotenv'
import { users } from './modules/users'
import cors from 'cors'

dotenv.config()

export const app = express()
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
)

app.use('/users', users)
