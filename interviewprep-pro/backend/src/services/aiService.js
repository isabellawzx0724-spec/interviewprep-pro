import OpenAI from 'openai'
import { buildInterviewPrompt } from './promptBuilder.js'

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

function fallbackResponse(input, retrieval) {
  const baseQuestions = retrieval.matches.map((m) => ({
    question: m.question,
    source: m.source,
    reason: m.notes
  }))

  return {
    marketPositioning: {
      oneLiner: `针对 ${input.company} ${input.role} 的 ${input.interviewType}，这是一个以“真实面经 + JD拆解 + 简历追问”为核心的高命中准备包。`,
      whyCompetitive: [
        '不是泛化问答，而是结合岗位关键词和你的简历内容做深挖。',
        '可持续接收用户反馈，逐步形成公司-岗位-面试类型数据库。',
        '支持中英双语输出，适合中文求职场景但兼容英文表达准备。'
      ]
    },
    internetDigest: {
      realQuestions: baseQuestions,
      highFrequencyThemes: ['动机匹配', '项目细节追问', '业务理解', '数据与结果证明'],
      interviewStyle: '偏实战、重经历、会追问数据和个人贡献。',
      pitfalls: ['答案过空', '无法量化成果', '只讲团队不讲个人 ownership', '对公司业务理解太表面']
    },
    jdQuestions: [
      { keyword: 'stakeholder management', question: '你如何协调多方资源推动结果？', answerFramework: '场景-目标-阻力-协调动作-结果' },
      { keyword: 'analysis', question: '你如何定义并评估一个项目是否成功？', answerFramework: '目标指标-过程指标-复盘结论' },
      { keyword: 'communication', question: '你怎样向非专业方解释复杂问题？', answerFramework: '先结论-再结构化拆解-最后行动建议' }
    ],
    resumeDeepDive: [
      { resumePoint: '项目经历中的数据结果', risk: '数据真实性和贡献归属容易被追问', followUpQuestion: '这个结果是你直接推动的吗？你具体做了什么？', strongAnswer: '明确个人动作、合作对象、量化结果与复盘。' },
      { resumePoint: '跨团队协作经历', risk: '容易只讲沟通，不讲推进机制', followUpQuestion: '当对方不配合时你怎么推进？', strongAnswer: '讲阻力识别、利益对齐和跟进节奏。' }
    ],
    typeSpecificBank: [
      { bucket: input.interviewType, question: `为什么是 ${input.company} 的 ${input.role}？`, answerFramework: '公司吸引点-岗位匹配点-个人长期路径' },
      { bucket: input.interviewType, question: '讲一个最能代表你能力的经历。', answerFramework: '背景-任务-行动-结果-可迁移能力' }
    ],
    cultureFit: {
      values: ['结果导向', '沟通清晰', '业务敏感度', '执行与复盘'],
      howToShowFit: ['回答里多用业务结果与用户价值', '强调 owner 意识', '呈现结构化思考'],
      avoid: ['背八股', '空泛夸公司', '过度模板化']
    },
    cheatSheet: {
      top20: [
        '为什么选择我们？', '自我介绍', '你最大的项目挑战是什么？', '为什么适合这个岗位？', '如果结果不达预期怎么办？'
      ],
      selfIntro: '用 60–90 秒说明背景、最相关经历、核心优势，以及为什么匹配当前岗位。',
      mustUsePhrases: ['我当时的核心职责是…', '这个结果主要由我负责推动…', '如果重新来一次，我会优先…'],
      closingQuestions: ['这个岗位前 3 个月最重要的目标是什么？', '团队会如何定义这个岗位的成功？']
    }
  }
}

export async function generateInterviewPack(input, retrieval) {
  if (!client) {
    return fallbackResponse(input, retrieval)
  }

  const prompt = buildInterviewPrompt(input, retrieval)

  const response = await client.responses.create({
    model: 'gpt-5.4-mini',
    input: prompt,
    text: {
      format: {
        type: 'json_schema',
        name: 'interview_pack',
        schema: {
          type: 'object',
          additionalProperties: true
        }
      }
    }
  })

  const raw = response.output_text || '{}'
  return JSON.parse(raw)
}
