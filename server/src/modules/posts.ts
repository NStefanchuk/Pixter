import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export const users = Router()

