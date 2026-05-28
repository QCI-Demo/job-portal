import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

const port = Number(process.env.PORT) || 3000
const corsOrigin = process.env.CORS_ORIGIN

app.use(helmet())
app.use(
  cors(
    corsOrigin
      ? { origin: corsOrigin.split(',').map((o) => o.trim()) }
      : undefined,
  ),
)
app.use(express.json())

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', service: 'job-portal-backend' })
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'job-portal-backend',
      error: error instanceof Error ? error.message : 'database unreachable',
    })
  }
})

app.get('/api/jobs', async (_req, res) => {
  const jobs = await prisma.job.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: {
      id: true,
      title: true,
      location: true,
      employmentType: true,
      status: true,
      publishedAt: true,
    },
  })
  res.json({ data: jobs })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'not_found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'internal_server_error' })
})

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`job-portal-backend listening on port ${port}`)
})

async function shutdown(signal) {
  console.log(`Received ${signal}, shutting down`)
  server.close()
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
