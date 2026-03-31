import { chromium } from 'playwright'
import * as cheerio from 'cheerio'

export async function scrapeNowcoder({ company, role, limit = 5, cookie = '' }) {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  if (cookie) {
    await page.context().addCookies(cookie.split(';').filter(Boolean).map((pair) => {
      const [name, ...rest] = pair.trim().split('=')
      return {
        name,
        value: rest.join('='),
        domain: '.nowcoder.com',
        path: '/'
      }
    }))
  }

  const keyword = encodeURIComponent(`${company} ${role} 面经`)
  const url = `https://www.nowcoder.com/search?query=${keyword}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  const html = await page.content()
  const $ = cheerio.load(html)

  const results = []
  $('a').each((_, el) => {
    const text = $(el).text().trim()
    const href = $(el).attr('href')
    if (text && href && /面经|面试|interview/i.test(text) && results.length < limit) {
      results.push({ source: 'nowcoder', title: text, url: href.startsWith('http') ? href : `https://www.nowcoder.com${href}` })
    }
  })

  await browser.close()
  return results
}
