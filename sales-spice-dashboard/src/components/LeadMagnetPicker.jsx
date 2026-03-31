import { useState } from 'react'
import { T, winBtn } from '../theme'
import { applyOfferDetails } from '../utils/launchBuilder'
import { generateLeadMagnet } from '../utils/generateContent'

// Lead Magnet Picker — shown inside Arena task 2-1 "Create your lead magnet"
// 3 format options with full outlines.
// When offerDetails is present, generates personalised title ideas + customised intro
// for whichever format is selected.

const OPTIONS = [
  {
    id: 'training',
    icon: '🎬',
    name: 'Pre-recorded Private Training',
    tagline: 'A focused video (20–40 min) that teaches a specific win',
    titleTemplates: [
      '{{methodName}}: How {{idealClient}} Can {{transformation}} (Free Private Training)',
      'The Real Reason {{idealClient}} Struggle With {{feltProblem}} — and What to Do Instead',
      'How to {{transformation}} Without [the struggle they expect] — A Free Video Training',
    ],
    generatedIntro: `Your training positions you as the go-to expert for {{idealClient}} — before they've even seen your sales page.

It covers the core insight that powers {{offerName}}: that {{feltProblem}} is actually caused by {{rootCause}}, and that {{methodName}} is the way out.

The training should leave viewers thinking "I need to implement this immediately" — and knowing that {{offerName}} is the fastest way to do that.`,
    outline: [
      {
        heading: 'Hook (2–3 min)',
        content: 'Open with a bold claim or counterintuitive insight. Call out their exact situation and promise a specific result from this training — something they\'ll have by the end, just from watching.',
      },
      {
        heading: 'Your story / positioning (3–5 min)',
        content: 'Briefly share why you\'re the right person to teach this. Not a CV — an arc. Where you were, what you discovered, where you are now. Keep it focused on how it\'s relevant to them.',
      },
      {
        heading: 'The real problem (5 min)',
        content: 'Identify the root cause of their struggle — the thing they haven\'t realised yet. This is your POV, your diagnosis. It should make them nod along thinking "oh, that\'s exactly it."',
      },
      {
        heading: 'The 3-step framework (15–20 min)',
        content: 'Your core teaching. 3 clear steps, strategies, or shifts that move them from stuck to clarity. Each should produce a mini-win — an insight or action they can take immediately. Don\'t hold back the good stuff.',
      },
      {
        heading: 'The results (2 min)',
        content: 'Show what\'s possible. A client story, a result, a before/after. Make it specific and relatable — not aspirational. They should be able to picture themselves getting this result.',
      },
      {
        heading: 'The bridge (2–3 min)',
        content: 'Connect this free training to the full transformation inside your offer. "If you want [result from training], the next step is [offer]. Here\'s what\'s inside and how to join." Make the step feel natural — not jarring.',
      },
    ],
  },
  {
    id: 'playbook',
    icon: '📄',
    name: 'Playbook',
    tagline: 'A tight, actionable PDF guide (8–20 pages) they return to repeatedly',
    titleTemplates: [
      'The {{idealClient}} Playbook: Your Step-by-Step Guide to {{transformation}}',
      'The {{methodName}} Playbook: How to {{transformation}} in {{timeframe}}',
      '{{transformation}}: The Complete Playbook for {{idealClient}}',
    ],
    generatedIntro: `Your playbook becomes a trusted resource {{idealClient}} save, share, and come back to — making it one of the highest-converting lead magnets available.

It walks through the key steps of {{methodName}}: showing readers why {{feltProblem}} happens ({{rootCause}}), and the framework that leads to {{transformation}}.

Keep it under 20 pages. Dense, useful, and actionable — not a brochure.`,
    outline: [
      {
        heading: 'Cover page',
        content: 'Clear title, subtitle that states the specific result ("The step-by-step guide to [transformation] for [ideal client]"), your name and brand.',
      },
      {
        heading: 'Why this matters (1 page)',
        content: 'Name the pain they\'re in. Call out the common approaches that haven\'t worked and why. Establish your POV on the real cause. Make them feel seen before you teach anything.',
      },
      {
        heading: 'The framework overview (1 page)',
        content: 'Show the full method on one page — a visual or numbered list of the 3–5 steps. Give them the map before you walk them through it. This increases perceived value and comprehension.',
      },
      {
        heading: 'Step-by-step breakdown (4–12 pages)',
        content: 'Walk through each step of your framework. For each: what to do → why it works → a worked example or template → a "do this now" action. Keep each step to 1–3 pages max.',
      },
      {
        heading: 'Quick-reference checklist',
        content: 'A one-page summary they can print or screenshot. The top 10–15 actions from the playbook, presented as a checklist. This is the page people share — make it standalone.',
      },
      {
        heading: 'Next steps / offer bridge',
        content: 'Show what\'s possible when they apply this fully. 2–3 sentences max. One CTA with the URL to your waitlist or sales page.',
      },
    ],
  },
  {
    id: 'podcast',
    icon: '🎙️',
    name: 'Private Podcast',
    tagline: 'A 5–7 episode audio series for busy people on the move',
    titleTemplates: [
      'The {{transformation}} Series: A Private Audio Series for {{idealClient}}',
      '{{methodName}} — A 7-Episode Private Podcast by {{yourName}}',
      'How {{idealClient}} Can {{transformation}}: A Private Audio Series',
    ],
    generatedIntro: `A private podcast feels exclusive and personal — and because people listen while walking or driving, your voice becomes familiar before they've even considered buying.

Each episode covers one part of {{methodName}}, moving the listener from "I didn't realise this was causing {{feltProblem}}" to "I can see exactly how to get to {{transformation}}."

Aim for 10–20 minutes per episode. Conversational, not scripted. Think: a smart friend talking them through it.`,
    outline: [
      {
        heading: 'Episode 1: The Wake-Up (10–15 min)',
        content: 'Start with why you created this series and who it\'s for. Name their exact situation and pain. Introduce the counterintuitive truth at the core of your method. End with a cliffhanger that makes episode 2 irresistible.',
      },
      {
        heading: 'Episode 2: The Real Problem (10–15 min)',
        content: 'Go deeper on the root cause. Why the common solutions don\'t work. Your diagnosis of what\'s really going on. Tell a client story that illustrates this — someone who tried the obvious approaches and failed until they understood the real problem.',
      },
      {
        heading: 'Episodes 3–5: The Framework (10–20 min each)',
        content: 'One step per episode. Each episode: introduce the concept → explain why it matters → walk through the method → give a practical example. End each episode with one concrete action the listener can take today.',
      },
      {
        heading: 'Episode 6: The Results (10–15 min)',
        content: 'Share 2–3 client stories or case studies. Focus on transformation — before and after. Be specific about the results. Make the listener feel like this is genuinely achievable for them.',
      },
      {
        heading: 'Episode 7: The Next Step (10–15 min)',
        content: 'Wrap up the series. Recap the key shifts from episodes 1–6. Bridge to your offer — "if you want to go deeper and have someone guide you through this, here\'s what that looks like." Clear, single CTA. Thank them for listening.',
      },
    ],
  },
]

function fill(template, od) {
  if (!od || Object.keys(od).filter((k) => od[k]).length === 0) return template
  return applyOfferDetails(template, od)
}

function hasData(od) {
  return od && Object.keys(od).some((k) => od[k] && od[k].trim && od[k].trim() !== '')
}

// Load/save AI outlines per type in localStorage
const AI_OUTLINES_KEY = 'salesSpice_leadMagnetOutlines_v1'
function loadAiOutlines() {
  try { return JSON.parse(localStorage.getItem(AI_OUTLINES_KEY)) || {} } catch { return {} }
}
function saveAiOutlines(data) {
  try { localStorage.setItem(AI_OUTLINES_KEY, JSON.stringify(data)) } catch {}
}

export default function LeadMagnetPicker({ selectedType, onSelect, offerDetails }) {
  const [copiedTitle, setCopiedTitle] = useState(null)
  const [aiOutlines, setAiOutlines] = useState(loadAiOutlines)
  const [generating, setGenerating] = useState(null) // type string while generating
  const [genError, setGenError] = useState(null)
  const [copiedOutline, setCopiedOutline] = useState(null)
  const od = offerDetails || {}
  const canGenerate = hasData(od)

  const selected = OPTIONS.find((o) => o.id === selectedType) || null

  function handleCopyTitle(title, idx) {
    navigator.clipboard.writeText(fill(title, od)).catch(() => {})
    setCopiedTitle(idx)
    setTimeout(() => setCopiedTitle(null), 2000)
  }

  async function handleGenerateOutline(typeId) {
    setGenerating(typeId)
    setGenError(null)
    try {
      const result = await generateLeadMagnet(typeId, od)
      const updated = { ...aiOutlines, [typeId]: result }
      setAiOutlines(updated)
      saveAiOutlines(updated)
    } catch (err) {
      setGenError(err.message)
    } finally {
      setGenerating(null)
    }
  }

  function handleCopyOutline(typeId) {
    const text = aiOutlines[typeId]
    if (!text) return
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedOutline(typeId)
    setTimeout(() => setCopiedOutline(null), 2000)
  }

  function handleEditOutline(typeId, value) {
    const updated = { ...aiOutlines, [typeId]: value }
    setAiOutlines(updated)
    saveAiOutlines(updated)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLabel}>✦ Choose your lead magnet format</div>
        <div style={styles.headerSub}>Select a format to expand the full outline</div>
      </div>

      <div style={styles.optionList}>
        {OPTIONS.map((opt) => {
          const isSelected = selectedType === opt.id
          return (
            <div key={opt.id} style={styles.optionWrapper}>
              <button
                style={{
                  ...styles.optionBtn,
                  ...(isSelected ? styles.optionBtnSelected : {}),
                }}
                onClick={() => onSelect(isSelected ? null : opt.id)}
              >
                <span style={styles.optionIcon}>{opt.icon}</span>
                <div style={styles.optionText}>
                  <div style={styles.optionName}>{opt.name}</div>
                  <div style={styles.optionTagline}>{opt.tagline}</div>
                </div>
                <span style={styles.optionArrow}>{isSelected ? '▲' : '▼'}</span>
              </button>

              {isSelected && (
                <div style={styles.outlineWrapper}>
                  {/* Generated titles + intro */}
                  {canGenerate && (
                    <div style={styles.generatedSection}>
                      <div style={styles.generatedHeader}>
                        <span style={styles.generatedLabel}>✦ Title ideas for your lead magnet</span>
                        <span style={styles.generatedNote}>Click any title to copy</span>
                      </div>
                      <div style={styles.titleList}>
                        {opt.titleTemplates.map((tmpl, idx) => (
                          <button
                            key={idx}
                            style={styles.titleBtn}
                            onClick={() => handleCopyTitle(tmpl, idx)}
                          >
                            <span style={styles.titleText}>{fill(tmpl, od)}</span>
                            <span style={styles.copyHint}>
                              {copiedTitle === idx ? '✓ Copied' : 'Copy'}
                            </span>
                          </button>
                        ))}
                      </div>
                      <div style={styles.generatedIntro}>
                        <div style={styles.generatedIntroLabel}>What to put in your {opt.name.toLowerCase()}</div>
                        <p style={styles.generatedIntroText}>{fill(opt.generatedIntro, od)}</p>
                      </div>
                    </div>
                  )}

                  {/* AI full outline generator */}
                  {canGenerate && (
                    <div style={styles.aiSection}>
                      <div style={styles.aiSectionHeader}>
                        <div>
                          <div style={styles.aiSectionLabel}>✦ Full AI-generated outline</div>
                          <div style={styles.aiSectionSub}>
                            {aiOutlines[opt.id]
                              ? 'Edit below and copy when ready'
                              : 'Generate a complete, personalised outline you can copy and launch'}
                          </div>
                        </div>
                        <div style={styles.aiSectionActions}>
                          {aiOutlines[opt.id] && (
                            <button
                              style={styles.copyOutlineBtn}
                              onClick={() => handleCopyOutline(opt.id)}
                            >
                              {copiedOutline === opt.id ? '✓ Copied!' : 'Copy outline'}
                            </button>
                          )}
                          <button
                            style={{
                              ...winBtn(T.pink, T.pinkDark, 'sm'),
                              opacity: generating === opt.id ? 0.7 : 1,
                              cursor: generating === opt.id ? 'wait' : 'pointer',
                            }}
                            onClick={() => handleGenerateOutline(opt.id)}
                            disabled={!!generating}
                          >
                            {generating === opt.id
                              ? '✦ Generating…'
                              : aiOutlines[opt.id]
                              ? '↺ Regenerate'
                              : '✦ Generate outline'}
                          </button>
                        </div>
                      </div>

                      {genError && generating === null && (
                        <div style={styles.genError}>⚠ {genError}</div>
                      )}

                      {generating === opt.id && (
                        <div style={styles.genLoading}>
                          Writing your personalised {opt.name.toLowerCase()} outline…
                        </div>
                      )}

                      {aiOutlines[opt.id] && (
                        <textarea
                          style={styles.aiOutlineArea}
                          value={aiOutlines[opt.id]}
                          onChange={(e) => handleEditOutline(opt.id, e.target.value)}
                          rows={20}
                          spellCheck
                        />
                      )}
                    </div>
                  )}

                  {/* Framework reference outline */}
                  <div style={styles.outlineLabel}>
                    {canGenerate ? 'Framework reference' : `${opt.name} outline`}
                  </div>
                  {opt.outline.map((section, i) => (
                    <div key={i} style={styles.outlineSection}>
                      <div style={styles.outlineSectionHead}>
                        <span style={styles.outlineSectionNum}>{i + 1}</span>
                        <span style={styles.outlineSectionHeading}>{section.heading}</span>
                      </div>
                      <p style={styles.outlineSectionContent}>{section.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
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
    padding: '10px 14px 8px',
    borderBottom: `1px dotted ${T.light}`,
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
  optionList: {
    display: 'flex',
    flexDirection: 'column',
  },
  optionWrapper: {
    borderBottom: `1px solid ${T.light}`,
  },
  optionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: T.body,
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  optionBtnSelected: {
    background: '#fce7f3',
  },
  optionIcon: {
    fontSize: 20,
    flexShrink: 0,
  },
  optionText: {
    flex: 1,
  },
  optionName: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 1,
  },
  optionTagline: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  optionArrow: {
    fontSize: 10,
    color: T.purpleDark,
    flexShrink: 0,
  },
  outlineWrapper: {
    background: T.cardBg,
    padding: '12px 14px 14px',
  },
  generatedSection: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 14,
  },
  generatedHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  generatedLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.blueDark,
  },
  generatedNote: {
    fontFamily: T.body,
    fontSize: 10,
    color: T.muted,
  },
  titleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 10,
  },
  titleBtn: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    background: '#fff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '7px 10px',
    cursor: 'pointer',
    fontFamily: T.body,
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  titleText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.4,
    flex: 1,
  },
  copyHint: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 600,
    color: T.blueDark,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  generatedIntro: {
    marginTop: 6,
  },
  generatedIntroLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.blueDark,
    marginBottom: 4,
  },
  generatedIntroText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  outlineLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
    marginBottom: 8,
  },
  outlineSection: {
    marginBottom: 10,
  },
  outlineSectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 4,
  },
  outlineSectionNum: {
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: T.pink,
    color: '#fff',
    fontFamily: T.body,
    fontSize: 9,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  outlineSectionHeading: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    color: T.indigo,
  },
  outlineSectionContent: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.6,
    paddingLeft: 25,
    margin: 0,
  },
  // AI section
  aiSection: {
    background: '#fdf2f8',
    border: `1.5px solid ${T.pink}`,
    borderRadius: 8,
    padding: '10px 12px',
    marginBottom: 14,
  },
  aiSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  aiSectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.pinkDark,
    marginBottom: 3,
  },
  aiSectionSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  aiSectionActions: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  copyOutlineBtn: {
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
    borderRadius: 8,
    padding: '8px 10px',
    marginBottom: 8,
  },
  genLoading: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    fontStyle: 'italic',
    padding: '12px 0',
    textAlign: 'center',
  },
  aiOutlineArea: {
    width: '100%',
    boxSizing: 'border-box',
    border: `1.5px solid ${T.pink}`,
    borderRadius: 8,
    padding: '12px 14px',
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.7,
    background: '#fff',
    resize: 'vertical',
    outline: 'none',
    minHeight: 300,
    transition: 'border-color 0.15s ease',
  },
}
