import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd(), '..')
const feedbackPath = path.join(root, 'feedback-store.json')

export function readFeedback() {
  if (!fs.existsSync(feedbackPath)) return []
  try {
    return JSON.parse(fs.readFileSync(feedbackPath, 'utf-8'))
  } catch {
    return []
  }
}

export function writeFeedback(items) {
  fs.writeFileSync(feedbackPath, JSON.stringify(items, null, 2), 'utf-8')
}
