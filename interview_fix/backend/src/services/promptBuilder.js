export function buildInterviewPrompt(input, retrieval) {
  const { company, role, jd, resume, interviewType, language = 'zh' } = input

  return `
You are an elite interview preparation strategist for candidates interviewing at Chinese and international companies.
Return JSON only.
Language: ${language}.

Candidate context:
- Company: ${company}
- Role: ${role}
- Interview type: ${interviewType}
- JD:\n${jd}
- Resume highlights:\n${resume}

External interview signals:
${JSON.stringify(retrieval, null, 2)}

Required output schema:
{
  "marketPositioning": {"oneLiner": string, "whyCompetitive": string[]},
  "internetDigest": {
    "realQuestions": [{"question": string, "source": string, "reason": string}],
    "highFrequencyThemes": string[],
    "interviewStyle": string,
    "pitfalls": string[]
  },
  "jdQuestions": [{"keyword": string, "question": string, "answerFramework": string}],
  "resumeDeepDive": [{"resumePoint": string, "risk": string, "followUpQuestion": string, "strongAnswer": string}],
  "typeSpecificBank": [{"bucket": string, "question": string, "answerFramework": string}],
  "cultureFit": {"values": string[], "howToShowFit": string[], "avoid": string[]},
  "cheatSheet": {
    "top20": string[],
    "selfIntro": string,
    "mustUsePhrases": string[],
    "closingQuestions": string[]
  }
}

Constraints:
- Highly practical. No fluff.
- If evidence is weak, infer carefully but remain realistic.
- Prioritize questions that are likely to be asked for this company-role-type combination.
- Use concise, polished, interview-ready wording.
`
}
