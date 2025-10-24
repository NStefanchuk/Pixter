import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { loginSchema, registerSchema } from './users.schema'

const JWT_SECRET = process.env.JWT_SECRET as string

export const usersService = {
  async register(rawData: unknown) {
    const parsed = registerSchema.safeParse(rawData)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      throw { status: 400, message: 'Validation failed', details }
    }

    const { email, username, password, avatarUrl, bio } = parsed.data
    const emailNorm = email.trim().toLowerCase()

    try {
      const passwordHash = await bcrypt.hash(password, 12)

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

      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })

      return { user, token }
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw { status: 409, message: 'Email or username already in use' }
      }
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },
  async login(rawData: unknown) {
    const parsed = loginSchema.safeParse(rawData)
    if (!parsed.success) {
      const details = parsed.error.flatten()
      throw { status: 400, message: 'Validation failed', details }
    }
    const { email, password } = parsed.data
    const emailNorm = email.trim().toLowerCase()
    try {
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
        throw { status: 401, message: 'Invalid user' }
      }

      const passwordMatches = await bcrypt.compare(
        password,
        userRecord.passwordHash
      )
      if (!passwordMatches) {
        throw { status: 401, message: 'Invalid credentials' }
      }

      const { passwordHash, ...publicUser } = userRecord

      const token = jwt.sign(
        { sub: publicUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      )
      return { publicUser, token }
    } catch (e: any) {
      console.error(e)
      throw { status: 500, message: 'Internal server error' }
    }
  },
}
