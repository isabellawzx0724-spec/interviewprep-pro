import { mockInterviewCorpus } from '../data/mockInterviews.js'
import { readFeedback } from '../utils/storage.js'

function normalize(value = '') {
  return value.toLowerCase().trim()
}

export function retrieveInterviewSignals({ company, role, interviewType }) {
  const companyKey = normalize(company)
  const roleKey = normalize(role)
  const typeKey = normalize(interviewType)

  const matches = mockInterviewCorpus.filter((item) => {
    return (
      (!companyKey || normalize(item.company).includes(companyKey)) &&
      (!roleKey || normalize(item.role).includes(roleKey)) &&
      (!typeKey || normalize(item.interviewType).includes(typeKey))
    )
  })

  const feedback = readFeedback().filter((item) => {
    return (
      (!companyKey || normalize(item.company).includes(companyKey)) &&
      (!roleKey || normalize(item.role).includes(roleKey))
    )
  })

  return {
    matches: matches.slice(0, 8),
    feedback: feedback.slice(-8)
  }
}
