import { useState } from 'react'
import { applyOfferDetails, applyOfferDetailsToTemplate } from '../utils/launchBuilder'
import LeadMagnetPicker from './LeadMagnetPicker'
import WebinarScript from './WebinarScript'
import SalesPageBuilder from './SalesPageBuilder'
import OfferCompletionBanner from './OfferCompletionBanner'
import { downloadICS, exportToGoogleCal } from '../utils/calendarExport'
import { T, winCard, winTitleBar, winBtn, phaseColor } from '../theme'

const STATUS_CONFIG = {
  complete:     { label: 'Complete',    bg: T.completeBg, color: T.mintDark },
  'in-progress':{ label: 'In Progress', bg: T.progressBg, color: T.yellowDark },
  'not-started':{ label: 'Not Started', bg: T.pendingBg,  color: T.muted },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function isOverdue(dateStr, status) {
  if (status === 'complete') return false
  return new Date(dateStr) < new Date()
}

export default function CalendarView({ phases, tasks, client, offerDetails, templateId, calendarMode, onUpdateTask, onEditOfferDetails }) {
  const [expandedTask, setExpandedTask] = useState(null)
  const [filter, setFilter] = useState('all')

  const mode = calendarMode || '90day'
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const thirtyDayEnd = new Date(today)
  thirtyDayEnd.setDate(thirtyDayEnd.getDate() + 30)

  function getFilteredTasks(phaseTasks) {
    return phaseTasks.filter((t) => {
      const task = tasks.find((x) => x.id === t.id) || t
      if (filter === 'this-week') {
        const d = new Date(task.dueDate)
        return d >= today && d <= weekEnd
      }
      if (filter === 'in-progress') return task.status === 'in-progress'
      if (filter === 'incomplete') return task.status !== 'complete'
      // 30-day mode: tasks due within 30 days OR overdue + incomplete
      if (mode === '30day') {
        if (!task.dueDate) return false
        const d = new Date(task.dueDate)
        const isUpcoming = d >= today && d <= thirtyDayEnd
        const isOverdueIncomplete = d < today && task.status !== 'complete'
        return isUpcoming || isOverdueIncomplete
      }
      return true
    })
  }

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'complete').length
  const progressPct = Math.round((completedTasks / totalTasks) * 100)

  // ── 7-day week grid ────────────────────────────────────────────────────────
  if (mode === '7day') {
    return (
      <WeekGrid
        phases={phases}
        tasks={tasks}
        client={client}
        offerDetails={offerDetails}
        expandedTask={expandedTask}
        onExpandTask={(id) => setExpandedTask(expandedTask === id ? null : id)}
        onUpdateTask={onUpdateTask}
        today={today}
      />
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Progress bar */}
        <div style={styles.progressSection}>
          <div style={styles.progressHeader}>
            <span style={styles.progressLabel}>
              Overall Progress — {completedTasks} of {totalTasks} tasks complete
            </span>
            <span style={styles.progressPct}>{progressPct}%</span>
          </div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Offer completion banner */}
        <OfferCompletionBanner
          launch={{ templateId }}
          offerDetails={offerDetails}
          onEditOfferDetails={onEditOfferDetails}
        />

        {/* Filters + export controls */}
        <div style={styles.filterRow}>
          <div style={styles.filters}>
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'this-week', label: 'This Week' },
              { key: 'incomplete', label: 'Not Done' },
            ].map((f) => (
              <button
                key={f.key}
                style={{
                  ...styles.filterBtn,
                  ...(filter === f.key ? styles.filterBtnActive : {}),
                }}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div style={styles.exportBtns}>
            <button style={styles.exportBtn} onClick={() => exportToGoogleCal(tasks, client)} title="Add to Google Calendar">
              📅 Google Cal
            </button>
            <button style={styles.exportBtn} onClick={() => downloadICS(tasks, client)} title="Download .ics file">
              ⬇ .ics
            </button>
          </div>
        </div>

        {/* Phases */}
        {phases.map((phase) => {
          const phaseTasks = getFilteredTasks(phase.tasks)
          if (phaseTasks.length === 0) return null

          return (
            <PhaseSection
              key={phase.id}
              phase={phase}
              tasks={tasks}
              phaseTasks={phaseTasks}
              expandedTask={expandedTask}
              onExpandTask={(id) => setExpandedTask(expandedTask === id ? null : id)}
              onUpdateTask={onUpdateTask}
              client={client}
              offerDetails={offerDetails}
            />
          )
        })}
      </div>
    </div>
  )
}

// Truncate a task name to first 3 words for compact calendar cells
function truncateName(name) {
  const words = (name || '').split(' ')
  if (words.length <= 3) return name
  return words.slice(0, 3).join(' ') + '…'
}

// ─── 7-Day Week Grid ──────────────────────────────────────────────────────────
function WeekGrid({ phases, tasks, client, offerDetails, expandedTask, onExpandTask, onUpdateTask, today }) {
  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Build array of 7 days starting from today
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    return d
  })

  // Flatten all tasks and index by date string (YYYY-MM-DD)
  const allPhaseTasks = phases.flatMap((phase) =>
    phase.tasks.map((pt) => {
      const live = tasks.find((t) => t.id === pt.id)
      return { ...pt, ...(live || {}), phase }
    })
  )

  // Use local date parts to avoid UTC timezone mismatch (especially around DST)
  function toDateKey(date) {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const dayKeys = days.map(toDateKey)
  const tasksByDay = {}
  const undated = []

  allPhaseTasks.forEach((task) => {
    if (!task.dueDate) {
      undated.push(task)
      return
    }
    // Use local date key to match the toDateKey() helper above
    const taskDate = new Date(task.dueDate)
    const key = toDateKey(taskDate)
    if (dayKeys.includes(key)) {
      if (!tasksByDay[key]) tasksByDay[key] = []
      tasksByDay[key].push(task)
    }
  })

  return (
    <div style={styles.page}>
      <div style={{ ...styles.container, maxWidth: 1400 }}>
        <div style={styles.exportBtnsRow}>
          <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase' }}>7-DAY VIEW</span>
          <div style={styles.exportBtns}>
            <button style={styles.exportBtn} onClick={() => exportToGoogleCal(tasks, client)}>📅 Google Cal</button>
            <button style={styles.exportBtn} onClick={() => downloadICS(tasks, client)}>⬇ .ics</button>
          </div>
        </div>

        <div style={styles.weekGrid}>
          {days.map((day, i) => {
            const key = toDateKey(day)
            const dayTasks = tasksByDay[key] || []
            const isToday = i === 0
            const label = DAY_LABELS[day.getDay() === 0 ? 6 : day.getDay() - 1]
            const dateLabel = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

            return (
              <div key={key} style={{ ...styles.weekDay, ...(isToday ? styles.weekDayToday : {}) }}>
                <div style={{ ...styles.weekDayHeader, background: isToday ? T.pink : T.light }}>
                  <span style={{ ...styles.weekDayLabel, color: isToday ? T.indigo : T.muted }}>{label}</span>
                  <span style={{ ...styles.weekDayDate, color: isToday ? T.indigo : T.muted }}>{dateLabel}</span>
                </div>
                <div style={styles.weekDayTasks}>
                  {dayTasks.length === 0 && (
                    <div style={styles.emptyDay}>—</div>
                  )}
                  {dayTasks.map((task) => {
                    const pc = phaseColor(task.phase.id)
                    const STATUS_CONFIG_LOCAL = {
                      complete: { dot: T.mint },
                      'in-progress': { dot: T.yellow },
                      'not-started': { dot: T.light },
                    }
                    const dot = STATUS_CONFIG_LOCAL[task.status]?.dot || T.light
                    return (
                      <div
                        key={task.id}
                        style={{ ...styles.weekTask, border: `1px solid ${pc.color}`, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}
                        onClick={() => onExpandTask(task.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && onExpandTask(task.id)}
                      >
                        <div style={styles.weekTaskHeader}>
                          <div style={{ ...styles.weekTaskDot, background: dot }} />
                          <span style={styles.weekTaskName} title={task.name}>
                            {expandedTask === task.id ? task.name : truncateName(task.name)}
                          </span>
                        </div>
                        {expandedTask === task.id && (
                          <div style={styles.weekTaskExpanded}>
                            <p style={styles.weekTaskDesc}>{task.description}</p>
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                              {['not-started', 'in-progress', 'complete'].map((s) => (
                                <button
                                  key={s}
                                  style={{
                                    padding: '3px 8px',
                                    borderRadius: 3,
                                    fontSize: 10,
                                    fontFamily: T.body,
                                    cursor: 'pointer',
                                    border: `1.5px solid ${task.status === s ? pc.color : T.light}`,
                                    background: task.status === s ? pc.color : 'transparent',
                                    color: task.status === s ? T.indigo : T.muted,
                                    fontWeight: 600,
                                  }}
                                  onClick={(e) => { e.stopPropagation(); onUpdateTask(task.id, { status: s }) }}
                                >
                                  {s.replace('-', ' ')}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Undated tasks */}
        {undated.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontFamily: T.body, fontWeight: 700, fontSize: 10, letterSpacing: '0.07em', textTransform: 'uppercase', color: T.muted, marginBottom: 12 }}>UNDATED TASKS</div>
            <div style={styles.taskGrid}>
              {undated.map((task) => {
                const pc = phaseColor(task.phase.id)
                return (
                  <div key={task.id} style={{ ...winCard(pc.color, pc.dark), padding: '12px 14px' }}>
                    <div style={{ fontFamily: T.body, fontSize: 13, fontWeight: 700, color: T.indigo }}>{task.name}</div>
                    <div style={{ fontFamily: T.body, fontSize: 11, color: T.muted, marginTop: 4 }}>{task.phase.name}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PhaseSection({ phase, tasks, phaseTasks, expandedTask, onExpandTask, onUpdateTask, client, offerDetails }) {
  const allPhaseTasks = tasks.filter((t) => t.id.startsWith(`${phase.id}-`))
  const completedCount = allPhaseTasks.filter((t) => t.status === 'complete').length
  const pc = phaseColor(phase.id)

  return (
    <div style={styles.phase}>
      <div style={{ ...winCard(pc.color, pc.dark), marginBottom: 16 }}>
        <div style={{ ...winTitleBar(pc.color) }}>
          <div style={styles.phaseLeft}>
            <span style={styles.phaseNumber}>{phase.id}</span>
            <div>
              <span style={styles.phaseName}>{phase.name}</span>
              {phase.tagline && <span style={styles.phaseTagline}> — {phase.tagline}</span>}
            </div>
          </div>
          <span style={{ opacity: 0.7 }}>{completedCount}/{allPhaseTasks.length} done</span>
        </div>
      </div>

      <div className="task-grid" style={styles.taskGrid}>
        {phaseTasks.map((phaseTask) => {
          const liveTask = tasks.find((t) => t.id === phaseTask.id)
          const task = liveTask ? { ...phaseTask, ...liveTask } : phaseTask
          const isExpanded = expandedTask === task.id
          const overdue = isOverdue(task.dueDate, task.status)

          return (
            <TaskCard
              key={task.id}
              task={task}
              phaseColor={pc.color}
              phaseDark={pc.dark}
              isExpanded={isExpanded}
              overdue={overdue}
              onToggle={() => onExpandTask(task.id)}
              onUpdateTask={onUpdateTask}
              client={client}
              offerDetails={offerDetails}
            />
          )
        })}
      </div>
    </div>
  )
}

function TaskCard({ task, phaseColor: pColor, phaseDark, isExpanded, overdue, onToggle, onUpdateTask, client, offerDetails }) {
  const status = STATUS_CONFIG[task.status]
  const [contentTab, setContentTab] = useState('email')
  const [copied, setCopied] = useState(false)

  const od = offerDetails || {}
  const processedContent = task.contentTemplate
    ? applyOfferDetailsToTemplate(task.contentTemplate, od)
    : null

  function handleStatusChange(newStatus) {
    onUpdateTask(task.id, { status: newStatus })
  }

  function handleNotesChange(e) {
    onUpdateTask(task.id, { notes: e.target.value })
  }

  function personalise(text) {
    if (!text) return ''
    if (Object.keys(od).length > 0) return applyOfferDetails(text, od)
    return text
      .replace(/\[Your Offer Name\]/g, client.offer || '[Your Offer Name]')
      .replace(/\[Your Price\]/g, client.price || '[Your Price]')
      .replace(/\[Your Live Event Title\]/g, client.liveEventTitle || '[Live Event Title]')
      .replace(/\[Your Lead Magnet Name\]/g, client.leadMagnet || '[Lead Magnet]')
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasTabs = processedContent
    ? [processedContent.email && 'email', processedContent.social && 'social', processedContent.salesPage && 'page']
        .filter(Boolean)
    : []

  return (
    <div
      style={{
        ...winCard(overdue ? T.yellow : pColor, overdue ? T.yellowDark : phaseDark),
        ...(isExpanded ? { boxShadow: '0 2px 8px rgba(0,0,0,0.10)' } : {}),
      }}
    >
      {/* Card header */}
      <div style={styles.cardHeader} onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}>
        <div style={styles.cardTop}>
          <div style={styles.cardName}>{personalise(task.name)}</div>
          <span style={{ ...styles.statusBadge, background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>
        <div style={styles.cardMeta}>
          <span style={{ ...styles.dueDate, ...(overdue ? styles.dueDateOverdue : {}) }}>
            {overdue ? '⚠ ' : ''}Due {formatDate(task.dueDate)}
          </span>
          <div style={styles.cardMetaRight}>
            {processedContent && (
              <span style={{ ...styles.contentBadge, color: pColor, background: T.insetBg }}>
                ✦ Content
              </span>
            )}
            <span style={styles.expandHint}>{isExpanded ? '▲' : '▼'}</span>
          </div>
        </div>
        <p style={styles.cardPreview}>{personalise(task.description).slice(0, 100)}…</p>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div style={styles.cardBody}>
          <p style={styles.cardDescription}>{personalise(task.description)}</p>

          {task.leadMagnetPicker && (
            <LeadMagnetPicker
              selectedType={task.leadMagnetType || null}
              onSelect={(type) => onUpdateTask(task.id, { leadMagnetType: type })}
              offerDetails={offerDetails}
            />
          )}

          {task.superfans60Script && <WebinarScript offerDetails={offerDetails} />}
          {task.salesPageBuilder && <SalesPageBuilder offerDetails={offerDetails} />}

          {/* Status buttons */}
          <div style={styles.statusButtons}>
            {['not-started', 'in-progress', 'complete'].map((s) => {
              const sc = STATUS_CONFIG[s]
              const isActive = task.status === s
              return (
                <button
                  key={s}
                  style={{
                    ...styles.statusBtn,
                    background: isActive ? sc.bg : T.insetBg,
                    color: isActive ? sc.color : T.muted,
                    border: `2px solid ${isActive ? sc.color : T.light}`,
                    fontWeight: isActive ? 700 : 500,
                  }}
                  onClick={() => handleStatusChange(s)}
                >
                  {sc.label}
                </button>
              )
            })}
          </div>

          {/* Generated content section */}
          {processedContent && hasTabs.length > 0 && (
            <div style={{ ...styles.contentSection, border: `1.5px dotted ${pColor}` }}>
              <div style={{ ...styles.contentSectionHeader, borderBottom: `1.5px dotted ${pColor}` }}>
                <span style={{ ...styles.contentSectionLabel, color: pColor }}>✦ Your generated content</span>
                <div style={styles.contentTabs}>
                  {processedContent.email && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'email' ? { ...styles.contentTabActive, background: pColor } : { color: pColor }) }}
                      onClick={() => setContentTab('email')}
                    >
                      Email
                    </button>
                  )}
                  {processedContent.social && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'social' ? { ...styles.contentTabActive, background: pColor } : { color: pColor }) }}
                      onClick={() => setContentTab('social')}
                    >
                      Social
                    </button>
                  )}
                  {processedContent.salesPage && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'page' ? { ...styles.contentTabActive, background: pColor } : { color: pColor }) }}
                      onClick={() => setContentTab('page')}
                    >
                      Page Copy
                    </button>
                  )}
                </div>
              </div>

              {contentTab === 'email' && processedContent.email && (
                <ContentBlock
                  label={`Subject: ${processedContent.email.subject}`}
                  body={processedContent.email.body}
                  copyText={`Subject: ${processedContent.email.subject}\n\n${processedContent.email.body}`}
                  onCopy={handleCopy}
                  copied={copied}
                  accent={pColor}
                />
              )}
              {contentTab === 'social' && processedContent.social && (
                <ContentBlock
                  body={processedContent.social.copy}
                  copyText={processedContent.social.copy}
                  onCopy={handleCopy}
                  copied={copied}
                  accent={pColor}
                />
              )}
              {contentTab === 'page' && processedContent.salesPage && (
                <SalesPageBlock
                  salesPage={processedContent.salesPage}
                  onCopy={handleCopy}
                  copied={copied}
                  accent={pColor}
                />
              )}
            </div>
          )}

          {/* Notes */}
          <div style={styles.notesSection}>
            <label style={styles.notesLabel}>Your notes</label>
            <textarea
              style={styles.notesInput}
              value={task.notes}
              onChange={handleNotesChange}
              placeholder="Add your own notes here — ideas, reminders, links, anything…"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function ContentBlock({ label, body, copyText, onCopy, copied, accent }) {
  return (
    <div style={styles.contentBlock}>
      {label && <div style={{ ...styles.contentSubLabel, color: T.muted }}>{label}</div>}
      <pre style={styles.contentPre}>{body}</pre>
      <button style={{ ...styles.copyBtn, color: accent, borderColor: accent }} onClick={() => onCopy(copyText)}>
        {copied ? '✓ Copied!' : 'Copy'}
      </button>
    </div>
  )
}

function SalesPageBlock({ salesPage, onCopy, copied, accent }) {
  const fullText = salesPage.sections.map((s) => `${s.label}\n${'─'.repeat(30)}\n${s.content}`).join('\n\n')
  return (
    <div style={styles.contentBlock}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <span style={{ ...styles.contentSubLabel, color: T.muted }}>{salesPage.title}</span>
        <button style={{ ...styles.copyBtn, color: accent, borderColor: accent }} onClick={() => onCopy(fullText)}>
          {copied ? '✓ Copied!' : 'Copy all'}
        </button>
      </div>
      {salesPage.sections.map((section, i) => (
        <div key={i} style={{ ...styles.pageSection, borderBottom: `1px dotted ${T.light}` }}>
          <div style={{ ...styles.pageSectionLabel, color: accent }}>{section.label}</div>
          <pre style={styles.contentPre}>{section.content}</pre>
        </div>
      ))}
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
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
  },
  progressSection: {
    marginBottom: 28,
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
  progressPct: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.pinkDark,
  },
  progressTrack: {
    height: 8,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    border: `1px solid ${T.light}`,
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${T.pink}, ${T.purple})`,
    borderRadius: 2,
    transition: 'width 0.5s ease',
  },
  filterRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  exportBtns: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
  },
  exportBtnsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  exportBtn: {
    padding: '6px 12px',
    borderRadius: 8,
    border: `2px dotted ${T.purple}`,
    background: T.cardBg,
    color: T.purple,
    fontSize: 11,
    fontFamily: T.body,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  filterBtn: {
    padding: '6px 16px',
    borderRadius: 20,
    border: `1px solid ${T.light}`,
    background: T.cardBg,
    color: T.muted,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: T.body,
    fontWeight: 600,
    transition: 'all 0.15s ease',
  },
  filterBtnActive: {
    background: T.indigo,
    borderColor: T.indigo,
    color: T.light,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  phase: {
    marginBottom: 40,
  },
  phaseLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  phaseNumber: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    background: 'rgba(255,255,255,0.3)',
    padding: '3px 7px',
    borderRadius: 2,
  },
  phaseName: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  phaseTagline: {
    fontFamily: T.body,
    fontSize: 11,
    opacity: 0.8,
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  cardHeader: {
    padding: '14px 16px',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  cardName: {
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    color: T.indigo,
    lineHeight: 1.4,
    flex: 1,
  },
  statusBadge: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 9px',
    borderRadius: 8,
    flexShrink: 0,
    letterSpacing: '0.02em',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardMetaRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  contentBadge: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 4,
    letterSpacing: '0.04em',
    border: '1px dotted currentColor',
  },
  dueDate: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  dueDateOverdue: {
    color: T.yellowDark,
    fontWeight: 700,
  },
  expandHint: {
    fontSize: 10,
    color: T.muted,
    opacity: 0.6,
  },
  cardPreview: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.5,
  },
  cardBody: {
    padding: '0 16px 16px',
    borderTop: `2px dotted ${T.light}`,
    paddingTop: 14,
  },
  cardDescription: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.65,
    marginBottom: 16,
    opacity: 0.85,
  },
  statusButtons: {
    display: 'flex',
    gap: 6,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statusBtn: {
    padding: '5px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 12,
    fontFamily: T.body,
    transition: 'all 0.15s ease',
  },
  notesSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 4,
  },
  notesLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  notesInput: {
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    fontFamily: T.body,
    color: T.indigo,
    lineHeight: 1.5,
    resize: 'vertical',
    outline: 'none',
    background: T.insetBg,
    transition: 'border-color 0.15s ease',
  },
  contentSection: {
    marginBottom: 16,
    background: T.insetBg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  contentSectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    flexWrap: 'wrap',
    gap: 8,
  },
  contentSectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  contentTabs: {
    display: 'flex',
    gap: 4,
  },
  contentTab: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 8,
    border: '1.5px dotted currentColor',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'all 0.15s ease',
  },
  contentTabActive: {
    color: T.indigo,
    border: '1.5px solid transparent',
  },
  contentBlock: {
    padding: '10px 12px 12px',
  },
  contentSubLabel: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  contentPre: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    margin: 0,
    marginBottom: 10,
    opacity: 0.85,
  },
  copyBtn: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    background: 'transparent',
    border: '2px dotted currentColor',
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  pageSection: {
    marginBottom: 12,
    paddingBottom: 12,
  },
  pageSectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
  },
  // Week grid
  weekGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 10,
    alignItems: 'start',
  },
  weekDay: {
    background: T.cardBg,
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    overflow: 'hidden',
    minHeight: 160,
  },
  weekDayToday: {
    border: `1px solid ${T.pink}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  weekDayHeader: {
    padding: '6px 8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekDayLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  weekDayDate: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 600,
  },
  weekDayTasks: {
    padding: '6px 6px 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  emptyDay: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.light,
    textAlign: 'center',
    padding: '12px 0',
  },
  weekTask: {
    borderRadius: 8,
    background: T.cardBg,
    padding: '7px 8px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
  weekTaskHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 6,
  },
  weekTaskDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 3,
  },
  weekTaskName: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    color: T.indigo,
    lineHeight: 1.4,
  },
  weekTaskExpanded: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: `1px dotted ${T.light}`,
  },
  weekTaskDesc: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    lineHeight: 1.5,
    margin: 0,
  },
}
