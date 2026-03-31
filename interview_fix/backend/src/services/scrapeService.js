import { scrapeNowcoder } from '../scrapers/nowcoderScraper.js'
import { scrapeXiaohongshu } from '../scrapers/xiaohongshuScraper.js'

export async function runLiveScrape({ company, role }) {
  if (process.env.ALLOW_LIVE_SCRAPE !== 'true') {
    return {
      enabled: false,
      results: []
    }
  }

  const [nowcoder, xhs] = await Promise.allSettled([
    scrapeNowcoder({ company, role, cookie: process.env.NOWCODER_COOKIE || '' }),
    scrapeXiaohongshu({ company, role, cookie: process.env.XIAOHONGSHU_COOKIE || '' })
  ])

  return {
    enabled: true,
    results: [
      ...(nowcoder.status === 'fulfilled' ? nowcoder.value : []),
      ...(xhs.status === 'fulfilled' ? xhs.value : [])
    ],
    warnings: [
      ...(nowcoder.status === 'rejected' ? [`Nowcoder scrape failed: ${nowcoder.reason?.message || 'unknown error'}`] : []),
      ...(xhs.status === 'rejected' ? [`Xiaohongshu scrape failed: ${xhs.reason?.message || 'unknown error'}`] : [])
    ]
  }
}
