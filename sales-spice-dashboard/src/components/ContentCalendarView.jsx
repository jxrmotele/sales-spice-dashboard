import { useState } from 'react'
import { applyOfferDetails, applyOfferDetailsToTemplate } from '../utils/launchBuilder'
import GenerateButton from './GenerateButton'
import { T, winCard, winTitleBar, phaseColor } from '../theme'

function getWeekStart(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d)
  monday.setDate(diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

function formatWeekLabel(monday) {
  return monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
}

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

function isOverdue(dateStr, status) {
  if (status === 'complete') return false
  return new Date(dateStr) < new Date()
}

function contentChips(task) {
  const chips = []
  if (task.contentTemplate?.email) chips.push({ label: 'Email', colorKey: 'pink' })
  if (task.contentTemplate?.social) chips.push({ label: 'Social', colorKey: 'blue' })
  if (task.contentTemplate?.salesPage) chips.push({ label: 'Page Copy', colorKey: 'purple' })
  if (task.salesPageBuilder) chips.push({ label: 'Sales Page', colorKey: 'mint' })
  if (task.leadMagnetPicker) chips.push({ label: 'Lead Magnet', colorKey: 'yellow' })
  if (task.superfans60Script) chips.push({ label: 'Live Script', colorKey: 'pink' })
  return chips
}

export default function ContentCalendarView({ phases, tasks, offerDetails, client, onUpdateTask }) {
  const [expandedId, setExpandedId] = useState(null)
  const [contentTab, setContentTab] = useState({})
  const [copiedId, setCopiedId] = useState(null)

  const od = offerDetails || {}

  function fill(text) {
    if (!text) return ''
    return Object.keys(od).length > 0 ? applyOfferDetails(text, od) : text
  }

  function setCopied(id) {
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleCopy(text, id) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(id)
  }

  const contentTasks = []
  phases.forEach((phase) => {
    phase.tasks.forEach((phaseTask) => {
      const hasContent =
        phaseTask.contentTemplate ||
        phaseTask.leadMagnetPicker ||
        phaseTask.superfans60Script ||
        phaseTask.salesPageBuilder
      if (!hasContent) return
      const live = tasks.find((t) => t.id === phaseTask.id)
      const task = live ? { ...phaseTask, ...live } : phaseTask
      contentTasks.push({ task, phase })
    })
  })
  contentTasks.sort((a, b) => new Date(a.task.dueDate) - new Date(b.task.dueDate))

  const weekMap = new Map()
  contentTasks.forEach(({ task, phase }) => {
    const monday = getWeekStart(task.dueDate)
    const key = monday.toISOString()
    if (!weekMap.has(key)) weekMap.set(key, { monday, items: [] })
    weekMap.get(key).items.push({ task, phase })
  })
  const weeks = Array.from(weekMap.values())

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Content Plan</h2>
            <p style={styles.pageSubtitle}>
              {contentTasks.length} content task{contentTasks.length !== 1 ? 's' : ''} across {weeks.length} week{weeks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Weeks */}
        {weeks.map(({ monday, items }) => {
          const weekDone = items.filter((i) => i.task.status === 'complete').length
          return (
            <div key={monday.toISOString()} style={styles.week}>
              {/* Week header */}
              <div style={styles.weekHeader}>
                <div style={styles.weekLabel}>Week of {formatWeekLabel(monday)}</div>
                <div style={styles.weekProgress}>{weekDone}/{items.length} done</div>
              </div>

              <div style={styles.taskList}>
                {items.map(({ task, phase }) => {
                  const chips = contentChips(task)
                  const isOpen = expandedId === task.id
                  const overdue = isOverdue(task.dueDate, task.status)
                  const isDone = task.status === 'complete'
                  const processedContent = task.contentTemplate
                    ? applyOfferDetailsToTemplate(task.contentTemplate, od)
                    : null
                  const displayContent = task.generatedContent || processedContent
                  const currentTab = contentTab[task.id] || (displayContent?.email ? 'email' : displayContent?.social ? 'social' : 'page')
                  const pc = phaseColor(phase.id)

                  return (
                    <div key={task.id} style={{ borderBottom: `1px dotted ${T.light}`, opacity: isDone ? 0.55 : 1 }}>
                      {/* Row header */}
                      <div
                        style={styles.taskRowHeader}
                        onClick={() => setExpandedId(isOpen ? null : task.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isOpen ? null : task.id)}
                      >
                        <div style={styles.taskLeft}>
                          <span style={{
                            ...styles.statusDot,
                            background: isDone ? T.mint : overdue ? T.yellow : T.light,
                          }} />
                          <span style={{ ...styles.phaseBadge, background: pc.color }}>
                            Ph {phase.id}
                          </span>
                          <span style={styles.taskName}>{fill(task.name)}</span>
                          <div style={styles.chips}>
                            {chips.map((c) => (
                              <span key={c.label} style={{ ...styles.chip, background: T[c.colorKey], color: T.indigo }}>
                                {c.label}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={styles.taskRight}>
                          <span style={{
                            ...styles.dateChip,
                            ...(overdue && !isDone ? { color: T.yellowDark, fontWeight: 700 } : {}),
                          }}>
                            {overdue && !isDone ? '⚠ ' : ''}{formatShortDate(task.dueDate)}
                          </span>
                          <span style={styles.expandHint}>{isOpen ? '▲' : '▼'}</span>
                        </div>
                      </div>

                      {/* Expanded: template content */}
                      {isOpen && processedContent && (
                        <div style={{ ...styles.contentBody, borderTop: `1px dotted ${pc.color}` }}>
                          <div style={styles.tabs}>
                            {displayContent?.email && (
                              <button
                                style={{ ...styles.tab, ...(currentTab === 'email' ? { background: pc.color, color: T.indigo } : { color: pc.color }) }}
                                onClick={() => setContentTab((p) => ({ ...p, [task.id]: 'email' }))}
                              >Email</button>
                            )}
                            {displayContent?.social && (
                              <button
                                style={{ ...styles.tab, ...(currentTab === 'social' ? { background: pc.color, color: T.indigo } : { color: pc.color }) }}
                                onClick={() => setContentTab((p) => ({ ...p, [task.id]: 'social' }))}
                              >Social</button>
                            )}
                            {displayContent?.salesPage && (
                              <button
                                style={{ ...styles.tab, ...(currentTab === 'page' ? { background: pc.color, color: T.indigo } : { color: pc.color }) }}
                                onClick={() => setContentTab((p) => ({ ...p, [task.id]: 'page' }))}
                              >Page Copy</button>
                            )}
                          </div>

                          {currentTab === 'email' && displayContent?.email && (
                            <div>
                              <div style={styles.subjectLine}>
                                <span style={{ ...styles.subjectLabel, color: pc.color }}>Subject:</span> {displayContent.email.subject}
                              </div>
                              <pre style={styles.pre}>{displayContent.email.body}</pre>
                              <div style={styles.actionRow}>
                                <button
                                  style={{ ...styles.copyBtn, background: copiedId === task.id + 'e' ? pc.dark : pc.color, border: `1px solid ${pc.dark}`, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                                  onClick={() => handleCopy(`Subject: ${displayContent.email.subject}\n\n${displayContent.email.body}`, task.id + 'e')}
                                >
                                  {copiedId === task.id + 'e' ? '✓ Copied!' : 'Copy email'}
                                </button>
                                {onUpdateTask && (
                                  <GenerateButton
                                    task={task}
                                    phase={phase}
                                    offerDetails={od}
                                    hasExisting={!!task.generatedContent}
                                    onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {currentTab === 'social' && displayContent?.social && (
                            <div>
                              <pre style={styles.pre}>{displayContent.social.copy}</pre>
                              <div style={styles.actionRow}>
                                <button
                                  style={{ ...styles.copyBtn, background: copiedId === task.id + 's' ? pc.dark : pc.color, border: `1px solid ${pc.dark}`, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                                  onClick={() => handleCopy(displayContent.social.copy, task.id + 's')}
                                >
                                  {copiedId === task.id + 's' ? '✓ Copied!' : 'Copy post'}
                                </button>
                                {onUpdateTask && (
                                  <GenerateButton
                                    task={task}
                                    phase={phase}
                                    offerDetails={od}
                                    hasExisting={!!task.generatedContent}
                                    onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                                  />
                                )}
                              </div>
                            </div>
                          )}

                          {currentTab === 'page' && displayContent?.salesPage && (
                            <div>
                              {displayContent.salesPage.sections.map((sec, i) => (
                                <div key={i} style={{ marginBottom: 12 }}>
                                  <div style={{ ...styles.pageSectionLabel, color: pc.color }}>{sec.label}</div>
                                  <pre style={styles.pre}>{sec.content}</pre>
                                </div>
                              ))}
                            </div>
                          )}

                          {task.generatedContent && (
                            <div style={{ ...styles.generatedBadge, color: pc.color }}>✦ AI generated</div>
                          )}
                        </div>
                      )}

                      {/* Expanded: non-template content */}
                      {isOpen && !processedContent && (
                        <div style={{ ...styles.contentBody, borderTop: `1px dotted ${pc.color}` }}>
                          <p style={{ fontFamily: T.body, fontSize: 13, color: T.muted, margin: 0 }}>
                            {fill(task.description)}
                          </p>
                          <p style={{ fontFamily: T.body, fontSize: 12, color: T.muted, marginTop: 8, marginBottom: 0, opacity: 0.7 }}>
                            {chips.map((c) => c.label).join(' · ')} — expand this task in Calendar View or Guided Mode to access the full tool.
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {contentTasks.length === 0 && (
          <div style={styles.empty}>No content tasks found.</div>
        )}
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
    maxWidth: 920,
    margin: '0 auto',
    padding: '32px 24px',
  },
  pageHeader: {
    marginBottom: 28,
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
  week: {
    marginBottom: 32,
  },
  weekHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
  },
  weekProgress: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  taskList: {
    background: T.cardBg,
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  taskRowHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    cursor: 'pointer',
    gap: 10,
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    minWidth: 0,
    flexWrap: 'wrap',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
    flexShrink: 0,
  },
  phaseBadge: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    borderRadius: 2,
    padding: '2px 6px',
    flexShrink: 0,
  },
  taskName: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 13,
    color: T.indigo,
  },
  chips: {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  },
  chip: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 8,
    padding: '2px 7px',
    border: '1px solid rgba(0,0,0,0.08)',
  },
  taskRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  dateChip: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  expandHint: {
    fontFamily: T.body,
    fontSize: 10,
    color: T.muted,
    opacity: 0.6,
  },
  contentBody: {
    padding: '12px 14px 14px',
    background: T.insetBg,
  },
  tabs: {
    display: 'flex',
    gap: 6,
    marginBottom: 12,
  },
  tab: {
    background: 'transparent',
    border: '1.5px dotted currentColor',
    borderRadius: 8,
    padding: '4px 12px',
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  subjectLine: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    marginBottom: 10,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  subjectLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    fontStyle: 'normal',
  },
  pre: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    margin: '0 0 10px',
    lineHeight: 1.5,
    opacity: 0.85,
  },
  pageSectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  copyBtn: {
    color: T.indigo,
    borderRadius: 8,
    padding: '5px 12px',
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
    padding: '60px 0',
  },
  actionRow: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  generatedBadge: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginTop: 10,
  },
}
