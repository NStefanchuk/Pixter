import express from 'express';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';
dotenv.config();


export const app = express();
app.use(express.json());

// health-check
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/health/db', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, db: true });
  } catch (e) {
    res.status(500).json({ ok: false, db: false, error: (e as Error).message });
  }
});