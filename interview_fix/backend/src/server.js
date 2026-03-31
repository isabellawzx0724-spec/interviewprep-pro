import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import interviewRoutes from './routes/interviewRoutes.js'

const app = express()

const allowedOrigin = process.env.ALLOWED_ORIGIN || '*'
app.use(cors({ origin: allowedOrigin === '*' ? true : allowedOrigin }))
app.use(express.json({ limit: '1mb' }))

app.get('/', (_, res) => {
  res.json({ ok: true, product: 'Interview Navigator API' })
})

app.get('/api/health', (_, res) => {
  res.json({ ok: true, product: 'Interview Navigator API' })
})

app.use('/api/interview', interviewRoutes)

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`Interview Navigator API running on http://localhost:${port}`)
})
