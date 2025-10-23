import { Router } from 'express'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

export const users = Router()

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6).max(100),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(200).optional(),
})

users.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body)
  if (!parsed.success) {
    return res
      .status(400)
      .json({ error: 'Validation failed', details: parsed.error.flatten() })
  }

  const { email, username, password, avatarUrl, bio } = parsed.data

  try {
    const passwordHash = await bcrypt.hash(password, 12)
    const emailNorm = email.trim().toLowerCase()

    const user = await prisma.user.create({
      data: { email: emailNorm, username, passwordHash, avatarUrl, bio },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
      },
    })

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    })

    return res.status(201).json({ user, token })
  } catch (e: any) {
    // P2002 — нарушение уникальности email/username
    if (e.code === 'P2002') {
      return res.status(409).json({ error: 'Email or username already in use' })
    }
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

users.post('/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  try {
    const parsed = loginSchema.safeParse(req.body)
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: 'Validation failed', details: parsed.error.flatten() })
    }
    const { email, password } = parsed.data
    const emailNorm = email.trim().toLowerCase()

    const userRecord = await prisma.user.findUnique({
      where: { email: emailNorm },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        bio: true,
        createdAt: true,
        passwordHash: true,
      },
    })

    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(
      password,
      userRecord.passwordHash
    )
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const { passwordHash, ...publicUser } = userRecord

    const token = jwt.sign(
      { sub: publicUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    return res.status(200).json({ user: publicUser, token })
  } catch (e: any) {
    console.error(e)
    return res.status(500).json({ error: 'Internal server error' })
  }
})
