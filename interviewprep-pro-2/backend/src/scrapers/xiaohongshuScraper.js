import { chromium } from 'playwright'
import * as cheerio from 'cheerio'

export async function scrapeXiaohongshu({ company, role, limit = 5, cookie = '' }) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/123 Safari/537.36' })

  if (cookie) {
    await page.context().addCookies(cookie.split(';').filter(Boolean).map((pair) => {
      const [name, ...rest] = pair.trim().split('=')
      return {
        name,
        value: rest.join('='),
        domain: '.xiaohongshu.com',
        path: '/'
      }
    }))
  }

  const keyword = encodeURIComponent(`${company} ${role} 面试 面经`)
  const url = `https://www.xiaohongshu.com/search_result?keyword=${keyword}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const html = await page.content()
  const $ = cheerio.load(html)

  const results = []
  $('a').each((_, el) => {
    const text = $(el).text().trim()
    const href = $(el).attr('href')
    if (text && href && results.length < limit) {
      results.push({ source: 'xiaohongshu', title: text, url: href.startsWith('http') ? href : `https://www.xiaohongshu.com${href}` })
    }
  })

  await browser.close()
  return results
}
