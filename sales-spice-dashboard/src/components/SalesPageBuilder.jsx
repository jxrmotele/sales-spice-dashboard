import { useState } from 'react'
import { T, winBtn } from '../theme'
import { applyOfferDetails } from '../utils/launchBuilder'
import { generateSalesPage } from '../utils/generateContent'

// Sales Page Builder — shown inside task 1-4 (Arena) and 1-2 (Alpha) "Write your sales page"
// 11-section framework with formula guidance + generated "Your Sales Page" view
// when offerDetails is populated.

export const SALES_PAGE_SECTIONS = [
  {
    number: 1,
    name: 'Headline',
    what: 'One line that states the result. Not your programme name, not a question — a bold, specific promise that makes your ideal client feel like this was written for them.',
    formula: '"[Specific transformation] — even if [the objection they\'re worried about]"\n"[Desirable outcome] without [the thing they fear or hate]"\n"How to [transformation] in [timeframe] — starting from [where they are now]"',
    template: `{{headline}}

— or —

{{transformation}} — even if [{{objection}}]`,
  },
  {
    number: 2,
    name: 'Sub-headline',
    what: 'One or two sentences that name the programme, say who it\'s for, and confirm the result. This is the first place readers check after the headline — if they\'re still reading, they recognised themselves.',
    formula: '"[Programme name] is a [delivery format] for [ideal client] who are [their situation] and ready to [transformation]."',
    template: `{{offerName}} is a {{timeframe}} {{deliveryFormat}} for {{idealClient}} who are {{specificSituation}} — and ready to {{transformation}}.`,
  },
  {
    number: 3,
    name: 'The problem',
    what: 'Name what they\'re experiencing right now, in their language. Not the technical cause — the lived experience. Then show them what it\'s costing them. You want them to nod, not wince.',
    formula: 'Symptom → Consequence → The exhausting part → The real cost\nDon\'t catastrophise. Just make them feel seen.',
    template: `You're {{specificSituation}}.

You want to {{transformation}}.

But right now — {{feltProblem}}.

{{agitation}}

You're not short on effort. You're not missing dedication. You've just been missing the right approach.`,
  },
  {
    number: 4,
    name: 'The reframe',
    what: 'This is where you shift their understanding of what\'s really going on. Show them the real cause (your diagnosis) and reframe the problem so your solution becomes the obvious answer.',
    formula: '"Here\'s the real reason [problem] is happening: [root cause]. It\'s not [what they thought]. It\'s [what you know]."\nThen: "That\'s actually good news — because [root cause] is completely fixable."',
    template: `Here's the thing nobody tells you: {{rootCause}}.

That's why everything you've tried before hasn't worked — you've been solving the wrong problem.

{{reframe}}

Once you address the real cause, everything changes.`,
  },
  {
    number: 5,
    name: 'The solution',
    what: 'Introduce your programme and your method. Connect how you work to why it produces the result they want. Don\'t lead with features — lead with the mechanism.',
    formula: '"[Programme name] is [what it is]. It works because [the mechanism] — which means [the result]."',
    template: `Introducing {{offerName}}.

{{offerName}} is a {{timeframe}} {{deliveryFormat}} built around {{methodName}}.

{{mechanism}}

This is how {{idealClient}} go from {{beforeState}} to {{transformation}} — not by working harder, but by finally working on the right things.`,
  },
  {
    number: 6,
    name: "What's inside",
    what: 'List your deliverables clearly and connect each one to the result it creates. Don\'t just list features — show the purpose of each element. Then add the total standalone value before you reveal the price.',
    formula: 'Component → What it is → Why it matters → Result it creates\n(Repeat for each, then add bonuses, then sum the value)',
    template: `Here's everything inside {{offerName}}:

{{deliverables}}

Timeline: {{timeframe}}
Format: {{deliveryFormat}}

BONUS: {{bonusName}}
{{bonusBenefit}}

[Add total value calculation here before showing the investment]`,
  },
  {
    number: 7,
    name: 'Social proof',
    what: 'Show that people like your reader have already got results. Specific beats vague every time. The best proof makes the reader think "that sounds like me — if they did it, maybe I can too."',
    formula: 'Who they were before → What changed → Specific result → Quote (if you have one)',
    template: `{{socialProofPerson}} have used this to {{socialProofResult}}.

"{{testimonial}}"

[Add 1–2 more client stories or results if you have them]`,
  },
  {
    number: 8,
    name: 'Who it\'s for / not for',
    what: 'A short "this is for you if…" section that makes your ideal client feel called in. The "not for" line builds trust — it shows you\'re not just trying to sell to everyone.',
    formula: '"This is for you if [3 specific situations]\nThis is NOT for you if [1–2 honest exclusions]"',
    template: `{{whoFor}}

This is NOT for you if:
{{whoNotFor}}`,
  },
  {
    number: 9,
    name: 'Investment',
    what: 'State the price clearly, anchor it to the value and transformation, and offer payment options if you have them. Frame the cost of NOT doing this — not just the cost of the programme.',
    formula: '"[Programme name] is [price]. [Value anchor sentence]. [Payment plan if applicable.]"',
    template: `{{offerName}} is {{price}}.

{{priceValue}}

Payment plan available: {{paymentPlan}}

[Add checkout link here]`,
  },
  {
    number: 10,
    name: 'Urgency & close',
    what: 'Real urgency only — a genuine deadline, limited spots, or a founding price. Then a warm, direct close that gives permission to the person who is on the edge of yes.',
    formula: '"This is open until [deadline] — after that, [consequence]. If you know you want [result], [direct invitation]."',
    template: `This is open until {{urgencyDate}}.

After that: {{urgencyConsequence}}.

{{close}}

[Your checkout link]`,
  },
  {
    number: 11,
    name: 'CTA + FAQs',
    what: 'One clear call to action, then answer the 4–6 questions people are actually asking. Frame every FAQ answer positively — lead with the reassurance, not the concern.',
    formula: 'CTA: "[Action verb] + [link]"\nFAQ format: Q: [Objection as a genuine question] / A: [Positive, specific answer]',
    template: `{{ctaText}}
{{salesPageUrl}}

━━━━━━━━━━━━━━━━━━━━━━━━
FREQUENTLY ASKED QUESTIONS
━━━━━━━━━━━━━━━━━━━━━━━━

Q: Is {{offerName}} right for me?
A: {{offerName}} is for {{idealClient}} who want to {{transformation}}. If that's you — yes.

Q: Is there a payment plan?
A: Yes — {{paymentPlan}}

Q: When does it start?
A: [Your answer]

Q: What if I can't make all the live sessions?
A: [Your answer]

Q: [Your most common question]
A: [Your answer]`,
  },
]

function fill(template, od) {
  if (!od || Object.keys(od).filter((k) => od[k]).length === 0) return template
  return applyOfferDetails(template, od)
}

function hasData(od) {
  return od && Object.keys(od).some((k) => od[k] && od[k].trim && od[k].trim() !== '')
}

const AI_PAGE_KEY = 'salesSpice_salesPageAI_v1'
function loadAiPage() {
  try { return localStorage.getItem(AI_PAGE_KEY) || '' } catch { return '' }
}
function saveAiPage(text) {
  try { localStorage.setItem(AI_PAGE_KEY, text) } catch {}
}

export default function SalesPageBuilder({ offerDetails }) {
  const [view, setView] = useState('framework')
  const [expanded, setExpanded] = useState(null)
  const [allOpen, setAllOpen] = useState(false)
  const [copiedSection, setCopiedSection] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [aiPage, setAiPage] = useState(loadAiPage)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState(null)
  const [copiedAi, setCopiedAi] = useState(false)

  const od = offerDetails || {}
  const canGenerate = hasData(od)

  function toggle(num) {
    if (allOpen) {
      setAllOpen(false)
      setExpanded(num)
    } else {
      setExpanded(expanded === num ? null : num)
    }
  }

  function buildFullPage() {
    return SALES_PAGE_SECTIONS.map((s) => {
      const filled = fill(s.template, od)
      return `━━━ ${s.number}. ${s.name.toUpperCase()} ━━━\n\n${filled}`
    }).join('\n\n\n')
  }

  function handleCopySection(template, idx) {
    navigator.clipboard.writeText(fill(template, od)).catch(() => {})
    setCopiedSection(idx)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(buildFullPage()).catch(() => {})
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  async function handleGenerateAi() {
    setGenerating(true)
    setGenError(null)
    try {
      const result = await generateSalesPage(od)
      setAiPage(result)
      saveAiPage(result)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  function handleCopyAi() {
    if (!aiPage) return
    navigator.clipboard.writeText(aiPage).catch(() => {})
    setCopiedAi(true)
    setTimeout(() => setCopiedAi(false), 2000)
  }

  function handleEditAi(e) {
    setAiPage(e.target.value)
    saveAiPage(e.target.value)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerLabel}>✦ Sales Page Builder</div>
          <div style={styles.headerSub}>
            {canGenerate ? 'Personalised for your offer · 11 sections' : '11 sections · click each to expand'}
          </div>
        </div>
        <div style={styles.headerRight}>
          {canGenerate && (
            <div style={styles.viewTabs}>
              <button
                style={{ ...styles.viewTab, ...(view === 'framework' ? styles.viewTabActive : {}) }}
                onClick={() => setView('framework')}
              >
                Framework
              </button>
              <button
                style={{ ...styles.viewTab, ...(view === 'page' ? styles.viewTabActive : {}) }}
                onClick={() => setView('page')}
              >
                Template Fill
              </button>
              <button
                style={{ ...styles.viewTab, ...(view === 'ai' ? { ...styles.viewTabActive, background: T.pink, color: T.indigo } : {}) }}
                onClick={() => setView('ai')}
              >
                ✦ AI Generated
              </button>
            </div>
          )}
          {view === 'framework' && (
            <button style={styles.toggleAllBtn} onClick={() => setAllOpen((v) => !v)}>
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          )}
        </div>
      </div>

      {view === 'framework' && (
        <div style={styles.sections}>
          {SALES_PAGE_SECTIONS.map((s) => {
            const isOpen = allOpen || expanded === s.number
            return (
              <div key={s.number} style={styles.section}>
                <button
                  style={{ ...styles.sectionBtn, ...(isOpen ? styles.sectionBtnOpen : {}) }}
                  onClick={() => toggle(s.number)}
                >
                  <div style={styles.sectionLeft}>
                    <span style={{ ...styles.sectionNum, ...(isOpen ? styles.sectionNumOpen : {}) }}>
                      {s.number}
                    </span>
                    <span style={styles.sectionName}>{s.name}</span>
                  </div>
                  <span style={styles.sectionArrow}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={styles.sectionBody}>
                    <p style={styles.sectionWhat}>{s.what}</p>
                    <div style={styles.formulaBlock}>
                      <div style={styles.formulaLabel}>Formula</div>
                      <pre style={styles.formulaText}>{s.formula}</pre>
                    </div>
                    {canGenerate && (
                      <div style={styles.snippetBlock}>
                        <div style={styles.snippetHeader}>
                          <div style={styles.snippetLabel}>✦ Your copy for this section</div>
                          <button
                            style={styles.snippetCopyBtn}
                            onClick={() => handleCopySection(s.template, s.number)}
                          >
                            {copiedSection === s.number ? '✓ Copied' : 'Copy'}
                          </button>
                        </div>
                        <pre style={styles.snippetText}>{fill(s.template, od)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {view === 'ai' && canGenerate && (
        <div style={styles.aiView}>
          <div style={styles.aiViewHeader}>
            <div>
              <div style={styles.aiViewTitle}>✦ AI-Generated Sales Page</div>
              <div style={styles.aiViewSub}>
                {aiPage
                  ? 'Edit the copy below — it\'s saved automatically'
                  : 'Generate your entire sales page as one block using your messaging'}
              </div>
            </div>
            <div style={styles.aiViewActions}>
              {aiPage && (
                <button style={styles.copyAiBtn} onClick={handleCopyAi}>
                  {copiedAi ? '✓ Copied!' : 'Copy page'}
                </button>
              )}
              <button
                style={{
                  ...winBtn(T.pink, T.pinkDark, 'sm'),
                  opacity: generating ? 0.7 : 1,
                  cursor: generating ? 'wait' : 'pointer',
                }}
                onClick={handleGenerateAi}
                disabled={generating}
              >
                {generating ? '✦ Generating…' : aiPage ? '↺ Regenerate' : '✦ Generate sales page'}
              </button>
            </div>
          </div>

          {genError && (
            <div style={styles.genError}>⚠ {genError}</div>
          )}

          {generating && (
            <div style={styles.genLoading}>Writing your full sales page…</div>
          )}

          {!aiPage && !generating && (
            <div style={styles.aiPlaceholder}>
              <div style={styles.aiPlaceholderIcon}>📄</div>
              <p style={styles.aiPlaceholderText}>
                Click "Generate sales page" to get your complete sales page copy in one block —
                headline, problem, reframe, stack, investment, and FAQs. You can edit it directly below.
              </p>
            </div>
          )}

          {aiPage && (
            <textarea
              style={styles.aiPageArea}
              value={aiPage}
              onChange={handleEditAi}
              rows={30}
              spellCheck
            />
          )}
        </div>
      )}

      {view === 'page' && canGenerate && (
        <div style={styles.pageView}>
          <div style={styles.pageViewHeader}>
            <div>
              <div style={styles.pageViewTitle}>Your {od.offerName || 'Sales Page'} — Template Filled</div>
              <div style={styles.pageViewSub}>11 sections · placeholders replaced with your offer details</div>
            </div>
            <button style={styles.copyAllBtn} onClick={handleCopyAll}>
              {copiedAll ? '✓ Copied!' : 'Copy full page'}
            </button>
          </div>
          <div style={styles.pageDoc}>
            {SALES_PAGE_SECTIONS.map((s) => (
              <div key={s.number} style={styles.pageSection}>
                <div style={styles.pageSectionHeader}>
                  <span style={styles.pageSectionNum}>{s.number}</span>
                  <span style={styles.pageSectionName}>{s.name}</span>
                  <button
                    style={styles.pageSectionCopyBtn}
                    onClick={() => handleCopySection(s.template, s.number)}
                  >
                    {copiedSection === s.number ? '✓' : 'Copy'}
                  </button>
                </div>
                <pre style={styles.pageSectionText}>{fill(s.template, od)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    marginBottom: 16,
    background: T.insetBg,
    border: `1px solid ${T.purple}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px 8px',
    borderBottom: `1px dotted ${T.light}`,
    gap: 8,
    flexWrap: 'wrap',
  },
  headerLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
  },
  headerSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginTop: 4,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  viewTabs: {
    display: 'flex',
    background: T.light,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  viewTab: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.muted,
    background: 'transparent',
    border: 'none',
    borderRadius: 2,
    padding: '3px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  viewTabActive: {
    background: T.purple,
    color: '#fff',
  },
  toggleAllBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.purpleDark,
    background: T.light,
    border: 'none',
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    borderBottom: `1px solid ${T.light}`,
  },
  sectionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: T.body,
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  sectionBtnOpen: {
    background: '#fce7f3',
  },
  sectionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionNum: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: T.light,
    color: T.muted,
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  sectionNumOpen: {
    background: T.pink,
    color: '#fff',
  },
  sectionName: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
  },
  sectionArrow: {
    fontSize: 10,
    color: T.purpleDark,
    flexShrink: 0,
  },
  sectionBody: {
    padding: '12px 14px 14px 48px',
    background: T.cardBg,
  },
  sectionWhat: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.65,
    marginBottom: 10,
  },
  formulaBlock: {
    background: T.insetBg,
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 10,
  },
  formulaLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
    marginBottom: 4,
  },
  formulaText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  snippetBlock: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '8px 12px',
  },
  snippetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  snippetLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.blueDark,
  },
  snippetCopyBtn: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 600,
    color: T.blueDark,
    background: '#fff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '2px 8px',
    cursor: 'pointer',
  },
  snippetText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  // Page view
  pageView: {
    display: 'flex',
    flexDirection: 'column',
  },
  pageViewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderBottom: `1px dotted ${T.light}`,
    gap: 12,
  },
  pageViewTitle: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 2,
  },
  pageViewSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  copyAllBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.purpleDark,
    background: T.light,
    border: 'none',
    borderRadius: 8,
    padding: '5px 14px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  pageDoc: {
    padding: '4px 0 8px',
  },
  pageSection: {
    padding: '12px 14px 10px',
    borderBottom: `1px solid ${T.light}`,
  },
  pageSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  pageSectionNum: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: T.pink,
    color: '#fff',
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pageSectionName: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    color: T.indigo,
    flex: 1,
  },
  pageSectionCopyBtn: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 600,
    color: T.purpleDark,
    background: T.light,
    border: 'none',
    borderRadius: 8,
    padding: '2px 8px',
    cursor: 'pointer',
  },
  pageSectionText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  // AI view
  aiView: {
    display: 'flex',
    flexDirection: 'column',
  },
  aiViewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderBottom: `1px dotted ${T.light}`,
    gap: 12,
    flexWrap: 'wrap',
  },
  aiViewTitle: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 2,
  },
  aiViewSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  aiViewActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  copyAiBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    background: 'transparent',
    border: `1px dotted ${T.pinkDark}`,
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    color: T.pinkDark,
    transition: 'all 0.15s ease',
  },
  genError: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.pinkDark,
    background: '#fce7f3',
    padding: '10px 14px',
  },
  genLoading: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    fontStyle: 'italic',
    padding: '24px',
    textAlign: 'center',
  },
  aiPlaceholder: {
    textAlign: 'center',
    padding: '40px 24px',
  },
  aiPlaceholderIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  aiPlaceholderText: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.6,
    maxWidth: 400,
    margin: '0 auto',
  },
  aiPageArea: {
    width: '100%',
    boxSizing: 'border-box',
    border: 'none',
    borderTop: `1px dotted ${T.light}`,
    padding: '16px 14px',
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.7,
    background: T.cardBg,
    resize: 'vertical',
    outline: 'none',
    minHeight: 400,
  },
}
