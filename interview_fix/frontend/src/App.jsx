import { useEffect, useMemo, useState } from 'react'
import SectionCard from './components/SectionCard'
import { copy } from './lib/i18n'
import { apiUrl } from './lib/api'

const defaultForm = {
  company: 'Tencent',
  role: 'Business Development Intern',
  interviewType: 'professional',
  jd: 'Business Operations, customer relationship support, market research, merchant coordination, offline inspection, material deployment.',
  resume: 'Banking internships, customer analysis, branch performance reporting, due diligence, anti-fraud review, cross-team coordination, stakeholder liaison.',
  language: 'zh'
}

const defaultFeedback = {
  company: 'Tencent',
  role: 'Business Development Intern',
  interviewType: 'professional',
  askedQuestions: '',
  style: '',
  difficulty: '',
  notes: ''
}

export default function App() {
  const [form, setForm] = useState(defaultForm)
  const [insights, setInsights] = useState([])
  const [pack, setPack] = useState(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState(defaultFeedback)
  const [feedbackState, setFeedbackState] = useState('')

  const t = useMemo(() => copy[form.language], [form.language])

  useEffect(() => {
    fetch(apiUrl(`/api/interview/insights?company=${encodeURIComponent(form.company)}&role=${encodeURIComponent(form.role)}&interviewType=${encodeURIComponent(form.interviewType)}`))
      .then((r) => r.json())
      .then((data) => setInsights(data.data?.matches || []))
      .catch(() => setInsights([]))
  }, [form.company, form.role, form.interviewType])

  async function handleGenerate(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/interview/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const json = await res.json()
      setPack(json.data)
    } finally {
      setLoading(false)
    }
  }

  async function handleFeedbackSubmit(e) {
    e.preventDefault()
    setFeedbackState('submitting')
    try {
      await fetch(apiUrl('/api/interview/feedback'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedback,
          askedQuestions: feedback.askedQuestions.split('\n').map((q) => q.trim()).filter(Boolean)
        })
      })
      setFeedbackState('submitted')
      setFeedback(defaultFeedback)
    } catch {
      setFeedbackState('error')
    }
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div>
          <div className="brand">{t.brand}</div>
          <div className="tagline">{t.tagline}</div>
        </div>
        <div className="lang-switch">
          <span>{t.language}</span>
          <button className={form.language === 'zh' ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, language: 'zh' }))}>中文</button>
          <button className={form.language === 'en' ? 'active' : ''} onClick={() => setForm((p) => ({ ...p, language: 'en' }))}>EN</button>
        </div>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">Interview Intelligence Platform</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroDesc}</p>
          <div className="hero-stats">
            <div><strong>6</strong><span>core modules</span></div>
            <div><strong>2</strong><span>bilingual modes</span></div>
            <div><strong>1</strong><span>feedback loop</span></div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-chip">Nowcoder + Xiaohongshu ingest</div>
          <div className="panel-chip">JD → likely questions</div>
          <div className="panel-chip">Resume risk probing</div>
          <div className="panel-chip">One-page cheat sheet</div>
        </div>
      </section>

      <main className="grid-layout">
        <div className="left-column">
          <SectionCard title={t.generate}>
            <form className="form-grid" onSubmit={handleGenerate}>
              <label>
                <span>{t.company}</span>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
              </label>
              <label>
                <span>{t.role}</span>
                <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </label>
              <label>
                <span>{t.interviewType}</span>
                <select value={form.interviewType} onChange={(e) => setForm({ ...form, interviewType: e.target.value })}>
                  <option value="hr">{t.hr}</option>
                  <option value="professional">{t.professional}</option>
                  <option value="oneOnOne">{t.oneOnOne}</option>
                  <option value="group">{t.group}</option>
                  <option value="technical">{t.technical}</option>
                  <option value="manager">{t.manager}</option>
                </select>
              </label>
              <label className="full-span">
                <span>{t.jd}</span>
                <textarea rows="6" value={form.jd} onChange={(e) => setForm({ ...form, jd: e.target.value })} />
              </label>
              <label className="full-span">
                <span>{t.resume}</span>
                <textarea rows="6" value={form.resume} onChange={(e) => setForm({ ...form, resume: e.target.value })} />
              </label>
              <button className="primary-button" disabled={loading}>{loading ? 'Generating…' : t.generate}</button>
            </form>
          </SectionCard>

          <SectionCard title={t.insights} compact>
            <div className="insight-list">
              {insights.length ? insights.map((item, index) => (
                <div className="insight-item" key={`${item.question}-${index}`}>
                  <div className="insight-meta"><span>{item.source}</span><span>{item.style}</span></div>
                  <div>{item.question}</div>
                </div>
              )) : <p className="muted">No direct matches yet. The system will still generate using JD + resume logic.</p>}
            </div>
          </SectionCard>

          <SectionCard title={t.feedbackTitle}>
            <form className="form-grid" onSubmit={handleFeedbackSubmit}>
              <label>
                <span>{t.company}</span>
                <input value={feedback.company} onChange={(e) => setFeedback({ ...feedback, company: e.target.value })} />
              </label>
              <label>
                <span>{t.role}</span>
                <input value={feedback.role} onChange={(e) => setFeedback({ ...feedback, role: e.target.value })} />
              </label>
              <label>
                <span>{t.interviewType}</span>
                <input value={feedback.interviewType} onChange={(e) => setFeedback({ ...feedback, interviewType: e.target.value })} />
              </label>
              <label className="full-span">
                <span>{t.askedQuestions}</span>
                <textarea rows="5" value={feedback.askedQuestions} onChange={(e) => setFeedback({ ...feedback, askedQuestions: e.target.value })} />
              </label>
              <label>
                <span>{t.style}</span>
                <input value={feedback.style} onChange={(e) => setFeedback({ ...feedback, style: e.target.value })} />
              </label>
              <label>
                <span>{t.difficulty}</span>
                <input value={feedback.difficulty} onChange={(e) => setFeedback({ ...feedback, difficulty: e.target.value })} />
              </label>
              <label className="full-span">
                <span>{t.notes}</span>
                <textarea rows="4" value={feedback.notes} onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })} />
              </label>
              <button className="secondary-button">{t.submitFeedback}</button>
              {feedbackState === 'submitted' && <p className="success">Feedback saved.</p>}
            </form>
          </SectionCard>
        </div>

        <div className="right-column">
          <SectionCard title={pack?.marketPositioning?.oneLiner || 'Generated prep pack'}>
            {!pack ? <p className="muted">Generate a prep pack to see the interview system output.</p> : (
              <div className="result-stack">
                <div className="mini-block">
                  <strong>Why this product wins</strong>
                  <ul>{pack.marketPositioning?.whyCompetitive?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.digest}</strong>
                  <ul>{pack.internetDigest?.realQuestions?.map((item, i) => <li key={i}><strong>{item.source}:</strong> {item.question} — {item.reason}</li>)}</ul>
                  <p><strong>Style:</strong> {pack.internetDigest?.interviewStyle}</p>
                  <ul>{pack.internetDigest?.pitfalls?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.jd}</strong>
                  <ul>{pack.jdQuestions?.map((item, i) => <li key={i}><strong>{item.keyword}:</strong> {item.question} <span className="muted-inline">({item.answerFramework})</span></li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.resume}</strong>
                  <ul>{pack.resumeDeepDive?.map((item, i) => <li key={i}><strong>{item.resumePoint}</strong> — {item.followUpQuestion} <span className="muted-inline">Risk: {item.risk}</span></li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.type}</strong>
                  <ul>{pack.typeSpecificBank?.map((item, i) => <li key={i}><strong>{item.bucket}:</strong> {item.question} <span className="muted-inline">({item.answerFramework})</span></li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.culture}</strong>
                  <p><strong>Values:</strong> {(pack.cultureFit?.values || []).join(' / ')}</p>
                  <ul>{pack.cultureFit?.howToShowFit?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                </div>

                <div className="mini-block">
                  <strong>{t.sections.cheat}</strong>
                  <p><strong>Self intro:</strong> {pack.cheatSheet?.selfIntro}</p>
                  <ul>{pack.cheatSheet?.top20?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                  <p><strong>Closing questions:</strong> {(pack.cheatSheet?.closingQuestions || []).join(' / ')}</p>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      </main>
    </div>
  )
}
