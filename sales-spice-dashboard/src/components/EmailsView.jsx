import { useState } from 'react'
import { applyOfferDetails, applyOfferDetailsToTemplate } from '../utils/launchBuilder'
import GenerateButton from './GenerateButton'
import { generateTaskContent } from '../utils/generateContent'
import { T, winCard, phaseColor } from '../theme'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function isOverdue(dateStr) {
  return new Date(dateStr) < new Date()
}

export default function EmailsView({ phases, tasks, offerDetails, client, onUpdateTask }) {
  const [expandedId, setExpandedId] = useState(null)
  const [contentTab, setContentTab] = useState({}) // taskId → 'email' | 'social'
  const [copiedId, setCopiedId] = useState(null)
  const [copiedAll, setCopiedAll] = useState(false)
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [generatingAll, setGeneratingAll] = useState(false)
  const [generateAllProgress, setGenerateAllProgress] = useState(null) // { done, total }

  const od = offerDetails || {}

  function fill(text) {
    if (!text) return ''
    return Object.keys(od).length > 0 ? applyOfferDetails(text, od) : text
  }

  function getTab(taskId) {
    return contentTab[taskId] || 'email'
  }

  function setTab(taskId, tab) {
    setContentTab((prev) => ({ ...prev, [taskId]: tab }))
  }

  const emailTasks = []
  phases.forEach((phase) => {
    phase.tasks.forEach((phaseTask) => {
      if (!phaseTask.contentTemplate?.email) return
      const live = tasks.find((t) => t.id === phaseTask.id)
      const task = live ? { ...phaseTask, ...live } : phaseTask
      emailTasks.push({ task, phase })
    })
  })
  emailTasks.sort((a, b) => new Date(a.task.dueDate) - new Date(b.task.dueDate))

  const phaseOptions = [
    { key: 'all', label: 'All Emails' },
    ...Array.from(new Set(emailTasks.map((e) => e.phase.id))).map((id) => {
      const ph = emailTasks.find((e) => e.phase.id === id).phase
      return { key: String(id), label: `Phase ${id}: ${ph.name}` }
    }),
  ]

  const filtered =
    phaseFilter === 'all'
      ? emailTasks
      : emailTasks.filter((e) => String(e.phase.id) === phaseFilter)

  function handleCopyEmail(task) {
    const content = task.generatedContent || applyOfferDetailsToTemplate(task.contentTemplate, od)
    const text = `Subject: ${content.email.subject}\n\n${content.email.body}`
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(task.id + '-email')
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleCopySocial(task) {
    const content = task.generatedContent || applyOfferDetailsToTemplate(task.contentTemplate, od)
    const text = content.social?.copy || ''
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(task.id + '-social')
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleCopyAll() {
    const text = filtered
      .map(({ task }) => {
        const content = task.generatedContent || applyOfferDetailsToTemplate(task.contentTemplate, od)
        return `━━━ ${fill(task.name)} — ${formatDate(task.dueDate)} ━━━\nSubject: ${content.email.subject}\n\n${content.email.body}`
      })
      .join('\n\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  async function handleGenerateAll() {
    if (!onUpdateTask) return
    const toGenerate = filtered.filter(({ task }) => !task.generatedContent)
    if (toGenerate.length === 0) return
    setGeneratingAll(true)
    setGenerateAllProgress({ done: 0, total: toGenerate.length })
    for (let i = 0; i < toGenerate.length; i++) {
      const { task, phase } = toGenerate[i]
      try {
        const generated = await generateTaskContent({ phase, task, offerDetails: od })
        onUpdateTask(task.id, { generatedContent: generated })
      } catch (err) {
        console.error('Generate failed for', task.id, err)
      }
      setGenerateAllProgress({ done: i + 1, total: toGenerate.length })
    }
    setGeneratingAll(false)
    setGenerateAllProgress(null)
  }

  const ungeneratedCount = filtered.filter(({ task }) => !task.generatedContent).length

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Email Sequence</h2>
            <p style={styles.pageSubtitle}>
              {emailTasks.length} email{emailTasks.length !== 1 ? 's' : ''} across your launch — in order
            </p>
          </div>
          <div style={styles.headerActions}>
            {onUpdateTask && ungeneratedCount > 0 && (
              <button
                style={{
                  ...styles.generateAllBtn,
                  opacity: generatingAll ? 0.7 : 1,
                  cursor: generatingAll ? 'not-allowed' : 'pointer',
                }}
                onClick={handleGenerateAll}
                disabled={generatingAll}
              >
                {generatingAll
                  ? `✦ Generating ${generateAllProgress?.done + 1 || 1}/${generateAllProgress?.total}…`
                  : `✦ Generate all ${ungeneratedCount}`}
              </button>
            )}
            <button style={styles.copyAllBtn} onClick={handleCopyAll}>
              {copiedAll ? '✓ Copied!' : `Copy all ${filtered.length} emails`}
            </button>
          </div>
        </div>

        {/* Phase filter pills */}
        <div style={styles.filters}>
          {phaseOptions.map((opt) => {
            const isActive = phaseFilter === opt.key
            const phaseId = opt.key !== 'all' ? parseInt(opt.key) : null
            const pc = phaseId ? phaseColor(phaseId) : null
            return (
              <button
                key={opt.key}
                style={{
                  ...styles.filterPill,
                  ...(isActive ? {
                    background: pc ? pc.color : T.indigo,
                    borderColor: pc ? pc.dark : T.purpleDark,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                    color: T.indigo,
                  } : {}),
                }}
                onClick={() => setPhaseFilter(opt.key)}
              >
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Email list */}
        <div style={styles.list}>
          {filtered.map(({ task, phase }, i) => {
            const content = applyOfferDetailsToTemplate(task.contentTemplate, od)
            const displayContent = task.generatedContent || content
            const hasSocial = !!displayContent.social?.copy
            const isOpen = expandedId === task.id
            const overdue = isOverdue(task.dueDate)
            const isDone = task.status === 'complete'
            const pc = phaseColor(phase.id)
            const tab = getTab(task.id)
            const isAI = !!task.generatedContent

            return (
              <div key={task.id} style={{ ...winCard(pc.color, pc.dark), opacity: isDone ? 0.65 : 1 }}>
                {/* Card header */}
                <div
                  style={styles.cardHeader}
                  onClick={() => setExpandedId(isOpen ? null : task.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isOpen ? null : task.id)}
                >
                  <div style={styles.cardLeft}>
                    <span style={{ ...styles.phaseDot, background: pc.color }} />
                    <div style={styles.cardMeta}>
                      <div style={{ ...styles.emailIndex, color: pc.color }}>#{i + 1}</div>
                      <div style={styles.cardName}>{fill(task.name)}</div>
                      {isAI && <div style={{ ...styles.aiBadge, color: pc.dark, borderColor: pc.color }}>✦ AI</div>}
                    </div>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={{
                      ...styles.dateChip,
                      ...(overdue && !isDone ? { color: T.yellowDark, background: T.progressBg } : {}),
                      ...(isDone ? { color: T.mintDark, background: T.completeBg } : {}),
                    }}>
                      {isDone ? '✓ ' : overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
                    </span>
                    <span style={styles.expandHint}>{isOpen ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Subject preview */}
                <div style={{ ...styles.subjectRow, borderBottom: isOpen ? `1px dotted ${pc.color}` : 'none' }}>
                  <span style={{ ...styles.subjectLabel, color: pc.color }}>Subject:</span>
                  <span style={styles.subjectText}>{displayContent.email.subject}</span>
                </div>

                {/* Expanded body */}
                {isOpen && (
                  <div style={{ ...styles.bodySection, background: T.insetBg }}>
                    {/* Email / Social tabs — only show if social exists */}
                    {hasSocial && (
                      <div style={styles.tabs}>
                        <button
                          style={{ ...styles.tab, ...(tab === 'email' ? { ...styles.tabActive, background: pc.color, borderColor: pc.dark } : { color: pc.dark, borderColor: pc.color }) }}
                          onClick={() => setTab(task.id, 'email')}
                        >
                          ✉ Email
                        </button>
                        <button
                          style={{ ...styles.tab, ...(tab === 'social' ? { ...styles.tabActive, background: pc.color, borderColor: pc.dark } : { color: pc.dark, borderColor: pc.color }) }}
                          onClick={() => setTab(task.id, 'social')}
                        >
                          📱 Social post
                        </button>
                      </div>
                    )}

                    {/* Email tab */}
                    {tab === 'email' && (
                      <>
                        <pre style={styles.bodyPre}>{displayContent.email.body}</pre>
                        <div style={styles.actionRow}>
                          <button
                            style={{
                              ...styles.copyBtn,
                              background: copiedId === task.id + '-email' ? pc.dark : pc.color,
                              border: `1px solid ${pc.dark}`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                            }}
                            onClick={() => handleCopyEmail(task)}
                          >
                            {copiedId === task.id + '-email' ? '✓ Copied!' : 'Copy email'}
                          </button>
                          {onUpdateTask && (
                            <GenerateButton
                              task={task}
                              phase={phase}
                              offerDetails={od}
                              hasExisting={isAI}
                              onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                            />
                          )}
                        </div>
                      </>
                    )}

                    {/* Social tab */}
                    {tab === 'social' && hasSocial && (
                      <>
                        <pre style={styles.bodyPre}>{displayContent.social.copy}</pre>
                        <div style={styles.actionRow}>
                          <button
                            style={{
                              ...styles.copyBtn,
                              background: copiedId === task.id + '-social' ? pc.dark : pc.color,
                              border: `1px solid ${pc.dark}`,
                              boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                            }}
                            onClick={() => handleCopySocial(task)}
                          >
                            {copiedId === task.id + '-social' ? '✓ Copied!' : 'Copy post'}
                          </button>
                          {onUpdateTask && (
                            <GenerateButton
                              task={task}
                              phase={phase}
                              offerDetails={od}
                              hasExisting={isAI}
                              onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {filtered.length === 0 && (
            <div style={styles.empty}>No emails for this filter.</div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: T.pageBg,
    minHeight: 'calc(100vh - 120px)',
    paddingBottom: 60,
  },
  container: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '32px 24px',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  pageTitle: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    margin: '0 0 8px',
    lineHeight: 1.6,
  },
  pageSubtitle: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  generateAllBtn: {
    background: T.purple,
    color: T.indigo,
    border: `1px solid ${T.purpleDark}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    padding: '9px 16px',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  copyAllBtn: {
    background: T.mint,
    color: T.indigo,
    border: `1px solid ${T.mintDark}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    padding: '9px 16px',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  filterPill: {
    background: T.cardBg,
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '5px 14px',
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    color: T.muted,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    cursor: 'pointer',
    gap: 12,
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  phaseDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    flexShrink: 0,
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  emailIndex: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  cardName: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 14,
    color: T.indigo,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  aiBadge: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    padding: '2px 5px',
    border: '1px solid',
    borderRadius: 8,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  cardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  dateChip: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.muted,
    background: T.insetBg,
    borderRadius: 8,
    padding: '2px 8px',
  },
  expandHint: {
    fontFamily: T.body,
    fontSize: 10,
    color: T.muted,
    opacity: 0.6,
  },
  subjectRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 6,
    padding: '0 14px 10px',
  },
  subjectLabel: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    flexShrink: 0,
  },
  subjectText: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  bodySection: {
    padding: '14px',
    borderTop: `1px dotted ${T.light}`,
  },
  tabs: {
    display: 'flex',
    gap: 6,
    marginBottom: 14,
  },
  tab: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 8,
    border: '1px solid',
    cursor: 'pointer',
    background: T.cardBg,
    transition: 'all 0.15s',
  },
  tabActive: {
    color: T.indigo,
  },
  bodyPre: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: '0 0 12px',
    lineHeight: 1.6,
    opacity: 0.85,
  },
  copyBtn: {
    color: T.indigo,
    borderRadius: 8,
    padding: '6px 14px',
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  empty: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    textAlign: 'center',
    padding: '40px 0',
  },
  actionRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}
