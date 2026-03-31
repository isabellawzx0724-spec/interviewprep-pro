import { Router } from 'express'
import { z } from 'zod'
import { retrieveInterviewSignals } from '../services/retrievalService.js'
import { generateInterviewPack } from '../services/aiService.js'
import { runLiveScrape } from '../services/scrapeService.js'
import { readFeedback, writeFeedback } from '../utils/storage.js'

const router = Router()

const interviewSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  jd: z.string().min(1),
  resume: z.string().min(1),
  interviewType: z.string().min(1),
  language: z.enum(['zh', 'en']).default('zh')
})

router.post('/generate', async (req, res) => {
  try {
    const input = interviewSchema.parse(req.body)
    const retrieval = retrieveInterviewSignals(input)
    const scrape = await runLiveScrape(input)
    const result = await generateInterviewPack(input, {
      ...retrieval,
      liveScrape: scrape
    })

    res.json({
      ok: true,
      data: result,
      retrieval,
      scrape
    })
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message })
  }
})

router.get('/insights', async (req, res) => {
  const { company = '', role = '', interviewType = '' } = req.query
  const retrieval = retrieveInterviewSignals({ company, role, interviewType })
  res.json({ ok: true, data: retrieval })
})

router.post('/feedback', async (req, res) => {
  const schema = z.object({
    company: z.string(),
    role: z.string(),
    interviewType: z.string(),
    askedQuestions: z.array(z.string()).default([]),
    style: z.string().default(''),
    difficulty: z.string().default(''),
    notes: z.string().default('')
  })

  const payload = schema.parse(req.body)
  const current = readFeedback()
  const next = [...current, { ...payload, createdAt: new Date().toISOString() }]
  writeFeedback(next)
  res.json({ ok: true, count: next.length })
})

export default router
