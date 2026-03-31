import { useState } from 'react'
import { applyOfferDetails, applyOfferDetailsToTemplate } from '../utils/launchBuilder'
import LeadMagnetPicker from './LeadMagnetPicker'
import Superfans60Script from './Superfans60Script'
import SalesPageBuilder from './SalesPageBuilder'
import GenerateButton from './GenerateButton'
import { T, winCard, winTitleBar, phaseColor } from '../theme'

const STATUS_CONFIG = {
  complete:      { label: 'Complete',    bg: T.completeBg, color: T.mintDark },
  'in-progress': { label: 'In Progress', bg: T.progressBg, color: T.yellowDark },
  'not-started': { label: 'Not Started', bg: T.pendingBg,  color: T.muted },
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function formatShortDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function GuidedView({ phases, tasks, client, offerDetails, onUpdateTask }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const weekEnd = new Date(today)
  weekEnd.setDate(weekEnd.getDate() + 7)

  const todayTasks = tasks.filter((t) => {
    const d = new Date(t.dueDate)
    d.setHours(0, 0, 0, 0)
    return d <= today && t.status !== 'complete'
  })

  const weekTasks = tasks.filter((t) => {
    const d = new Date(t.dueDate)
    d.setHours(0, 0, 0, 0)
    return d > today && d <= weekEnd && t.status !== 'complete'
  })

  const [focusIndex, setFocusIndex] = useState(0)

  const focusList = todayTasks.length > 0 ? todayTasks : weekTasks
  const currentTask = focusList[focusIndex] || null

  function getPhase(taskId) {
    const phaseId = parseInt(taskId.split('-')[0])
    return phases.find((p) => p.id === phaseId)
  }

  function personalise(text) {
    if (!text) return ''
    const od = offerDetails || {}
    if (Object.keys(od).length > 0) return applyOfferDetails(text, od)
    return text
      .replace(/\[Your Offer Name\]/g, client.offer || '[Your Offer Name]')
      .replace(/\[Your Price\]/g, client.price || '[Your Price]')
      .replace(/\[Your Live Event Title\]/g, client.liveEventTitle || '[Live Event Title]')
      .replace(/\[Your Lead Magnet Name\]/g, client.leadMagnet || '[Lead Magnet]')
  }

  function handleComplete(taskId) {
    onUpdateTask(taskId, { status: 'complete' })
    if (focusIndex < focusList.length - 1) {
      setFocusIndex(focusIndex + 1)
    }
  }

  function handleNotesChange(taskId, value) {
    onUpdateTask(taskId, { notes: value })
  }

  const completedToday = tasks.filter((t) => {
    const d = new Date(t.dueDate)
    d.setHours(0, 0, 0, 0)
    return d <= today && t.status === 'complete'
  }).length

  const totalToday = tasks.filter((t) => {
    const d = new Date(t.dueDate)
    d.setHours(0, 0, 0, 0)
    return d <= today
  }).length

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Greeting */}
        <div style={styles.greetingBlock}>
          <h1 style={styles.greetingText}>
            {greeting()}, {client.name.split(' ')[0]}
          </h1>
          <p style={styles.dateText}>{formatDate(new Date().toISOString())}</p>
        </div>

        {/* Today's summary */}
        <div style={styles.summaryRow}>
          <div style={styles.summaryPill}>
            <span style={styles.summaryDot} />
            {todayTasks.length > 0
              ? `${todayTasks.length} task${todayTasks.length > 1 ? 's' : ''} need${todayTasks.length === 1 ? 's' : ''} your attention today`
              : weekTasks.length > 0
              ? `${weekTasks.length} task${weekTasks.length > 1 ? 's' : ''} coming up this week`
              : "You're all caught up! Nothing due right now."}
          </div>
          {totalToday > 0 && (
            <div style={styles.miniProgress}>
              <span style={styles.miniProgressText}>
                {completedToday} / {totalToday} overdue tasks done
              </span>
              <div style={styles.miniTrack}>
                <div style={{ ...styles.miniFill, width: `${Math.round((completedToday / totalToday) * 100)}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Section label */}
        <div style={styles.sectionLabel}>
          {todayTasks.length > 0 ? "Today's Focus" : "Coming Up This Week"}
        </div>

        {focusList.length === 0 ? (
          <AllDoneCard />
        ) : (
          <>
            {focusList.length > 1 && (
              <div style={styles.navDots}>
                {focusList.map((_, i) => {
                  const pc = getPhase(focusList[i]?.id)
                  const col = pc ? phaseColor(pc.id).color : T.purple
                  return (
                    <button
                      key={i}
                      style={{
                        ...styles.dot,
                        background: i === focusIndex ? col : T.light,
                        width: i === focusIndex ? 24 : 8,
                      }}
                      onClick={() => setFocusIndex(i)}
                    />
                  )
                })}
              </div>
            )}

            {currentTask && (
              <FocusCard
                task={currentTask}
                phase={getPhase(currentTask.id)}
                index={focusIndex}
                total={focusList.length}
                onPrev={() => setFocusIndex(Math.max(0, focusIndex - 1))}
                onNext={() => setFocusIndex(Math.min(focusList.length - 1, focusIndex + 1))}
                onComplete={() => handleComplete(currentTask.id)}
                onNotesChange={(val) => handleNotesChange(currentTask.id, val)}
                onStatusChange={(s) => onUpdateTask(currentTask.id, { status: s })}
                onLeadMagnetSelect={(type) => onUpdateTask(currentTask.id, { leadMagnetType: type })}
                onUpdateTask={onUpdateTask}
                personalise={personalise}
                offerDetails={offerDetails || {}}
              />
            )}
          </>
        )}

        {/* This week section */}
        {weekTasks.length > 0 && todayTasks.length > 0 && (
          <div style={styles.weekSection}>
            <div style={styles.sectionLabel}>Coming Up This Week</div>
            <div style={styles.weekList}>
              {weekTasks.map((task) => {
                const phase = getPhase(task.id)
                return (
                  <WeekTaskRow
                    key={task.id}
                    task={task}
                    phase={phase}
                    personalise={personalise}
                    onUpdateTask={onUpdateTask}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FocusCard({ task, phase, index, total, onPrev, onNext, onComplete, onNotesChange, onStatusChange, onLeadMagnetSelect, onUpdateTask, personalise, offerDetails }) {
  const isComplete = task.status === 'complete'
  const [showContent, setShowContent] = useState(false)
  const [contentTab, setContentTab] = useState('email')
  const [copied, setCopied] = useState(false)

  const pc = phase ? phaseColor(phase.id) : { color: T.purple, dark: T.purpleDark }

  const processedContent = task.contentTemplate
    ? applyOfferDetailsToTemplate(task.contentTemplate, offerDetails)
    : null

  // Prefer AI-generated content over template placeholders
  const displayContent = task.generatedContent || processedContent

  function handleCopy(text) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      ...winCard(pc.color, pc.dark),
      marginBottom: 40,
      opacity: isComplete ? 0.8 : 1,
    }}>
      {/* Title bar */}
      <div style={winTitleBar(pc.color)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {phase && <span>Phase {phase.id}: {phase.name}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {total > 1 && <span style={{ opacity: 0.7 }}>{index + 1}/{total}</span>}
          <span style={{ opacity: 0.6, letterSpacing: 4 }}>_ □ ×</span>
        </div>
      </div>

      <div style={styles.focusCardBody}>
        <h2 style={styles.focusTaskName}>{personalise(task.name)}</h2>
        <div style={styles.focusDueDate}>Due {formatShortDate(task.dueDate)}</div>
        <p style={styles.focusDescription}>{personalise(task.description)}</p>

        {task.leadMagnetPicker && (
          <LeadMagnetPicker
            selectedType={task.leadMagnetType || null}
            onSelect={onLeadMagnetSelect}
            offerDetails={offerDetails}
          />
        )}
        {task.superfans60Script && <Superfans60Script offerDetails={offerDetails} />}
        {task.salesPageBuilder && <SalesPageBuilder offerDetails={offerDetails} />}

        {/* Generated content */}
        {displayContent && (
          <div style={{ ...styles.focusContentSection, border: `1.5px dotted ${pc.color}` }}>
            <button style={{ ...styles.contentToggle, color: pc.color }} onClick={() => setShowContent((v) => !v)}>
              <span>{task.generatedContent ? '✦ AI content for this task' : '✦ Your content for this task'}</span>
              <span>{showContent ? '▲' : '▼'}</span>
            </button>

            {showContent && (
              <div style={{ ...styles.focusContentBody, borderTop: `1.5px dotted ${pc.color}` }}>
                <div style={styles.contentTabs}>
                  {displayContent.email && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'email' ? { ...styles.contentTabActive, background: pc.color } : { color: pc.color }) }}
                      onClick={() => setContentTab('email')}
                    >
                      Email
                    </button>
                  )}
                  {displayContent.social && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'social' ? { ...styles.contentTabActive, background: pc.color } : { color: pc.color }) }}
                      onClick={() => setContentTab('social')}
                    >
                      Social
                    </button>
                  )}
                  {displayContent.salesPage && (
                    <button
                      style={{ ...styles.contentTab, ...(contentTab === 'page' ? { ...styles.contentTabActive, background: pc.color } : { color: pc.color }) }}
                      onClick={() => setContentTab('page')}
                    >
                      Page Copy
                    </button>
                  )}
                </div>

                {contentTab === 'email' && displayContent.email && (
                  <div>
                    <div style={styles.focusContentSubLabel}>Subject: {displayContent.email.subject}</div>
                    <pre style={styles.focusContentPre}>{displayContent.email.body}</pre>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
                      <button style={{ ...styles.copyBtn, color: pc.color, borderColor: pc.color }} onClick={() => handleCopy(`Subject: ${displayContent.email.subject}\n\n${displayContent.email.body}`)}>
                        {copied ? '✓ Copied!' : 'Copy email'}
                      </button>
                      {onUpdateTask && (
                        <GenerateButton
                          task={task}
                          phase={phase}
                          offerDetails={offerDetails}
                          hasExisting={!!task.generatedContent}
                          onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                        />
                      )}
                    </div>
                  </div>
                )}
                {contentTab === 'social' && displayContent.social && (
                  <div>
                    <pre style={styles.focusContentPre}>{displayContent.social.copy}</pre>
                    <button style={{ ...styles.copyBtn, color: pc.color, borderColor: pc.color }} onClick={() => handleCopy(displayContent.social.copy)}>
                      {copied ? '✓ Copied!' : 'Copy post'}
                    </button>
                  </div>
                )}
                {contentTab === 'page' && displayContent.salesPage && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={styles.focusContentSubLabel}>{displayContent.salesPage.title}</span>
                      <button style={{ ...styles.copyBtn, color: pc.color, borderColor: pc.color }} onClick={() => handleCopy(
                        displayContent.salesPage.sections.map((s) => `${s.label}\n${s.content}`).join('\n\n')
                      )}>
                        {copied ? '✓ Copied!' : 'Copy all'}
                      </button>
                    </div>
                    {displayContent.salesPage.sections.map((s, i) => (
                      <div key={i} style={{ ...styles.pageSectionFocus, borderBottom: `1px dotted ${T.light}` }}>
                        <div style={{ ...styles.pageSectionLabel, color: pc.color }}>{s.label}</div>
                        <pre style={styles.focusContentPre}>{s.content}</pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Notes */}
        <div style={styles.notesSection}>
          <label style={styles.notesLabel}>Your notes</label>
          <textarea
            style={styles.notesInput}
            value={task.notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Jot down ideas, links, progress, anything you want to remember…"
            rows={3}
          />
        </div>

        {/* Actions */}
        <div style={styles.focusActions}>
          {!isComplete ? (
            <button style={{ ...styles.completeBtn, background: pc.color, border: `2px solid ${pc.dark}`, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }} onClick={onComplete}>
              ✓ Mark as Complete
            </button>
          ) : (
            <button style={styles.undoBtn} onClick={() => onStatusChange('in-progress')}>
              ↩ Mark as In Progress
            </button>
          )}
        </div>

        {total > 1 && (
          <div style={styles.navRow}>
            <button
              style={{ ...styles.navBtn, color: pc.color, opacity: index === 0 ? 0.3 : 1 }}
              onClick={onPrev}
              disabled={index === 0}
            >
              ← Previous
            </button>
            <button
              style={{ ...styles.navBtn, color: pc.color, opacity: index === total - 1 ? 0.3 : 1 }}
              onClick={onNext}
              disabled={index === total - 1}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function WeekTaskRow({ task, phase, personalise, onUpdateTask }) {
  const isComplete = task.status === 'complete'
  const pc = phase ? phaseColor(phase.id) : { color: T.purple, dark: T.purpleDark }

  return (
    <div style={{
      ...winCard(pc.color, pc.dark),
      opacity: isComplete ? 0.55 : 1,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '10px 14px',
    }}>
      <div style={{ ...styles.weekDot, background: pc.color }} />
      <div style={styles.weekRowContent}>
        <span style={styles.weekTaskName}>{personalise(task.name)}</span>
        <span style={styles.weekDueDate}>Due {formatShortDate(task.dueDate)}</span>
      </div>
      <button
        style={{
          ...styles.weekCompleteBtn,
          border: `2px solid ${isComplete ? pc.color : T.light}`,
          background: isComplete ? pc.color : 'transparent',
          color: isComplete ? T.indigo : T.muted,
        }}
        onClick={() => onUpdateTask(task.id, { status: isComplete ? 'not-started' : 'complete' })}
      >
        {isComplete ? '✓' : '○'}
      </button>
    </div>
  )
}

function AllDoneCard() {
  return (
    <div style={{ ...winCard(T.mint, T.mintDark), marginBottom: 40 }}>
      <div style={winTitleBar(T.mint)}>
        <span>All Done!</span>
        <span style={{ opacity: 0.6, letterSpacing: 4 }}>_ □ ×</span>
      </div>
      <div style={styles.allDone}>
        <div style={styles.allDoneEmoji}>✨</div>
        <h2 style={styles.allDoneTitle}>You're all caught up!</h2>
        <p style={styles.allDoneText}>
          No tasks due today or this week. Switch to Calendar View to see your full launch plan.
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: T.pageBg,
    minHeight: 'calc(100vh - 120px)',
    paddingBottom: 80,
  },
  container: {
    maxWidth: 680,
    margin: '0 auto',
    padding: '40px 24px',
  },
  greetingBlock: {
    marginBottom: 24,
  },
  greetingText: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  dateText: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  summaryPill: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: T.pendingBg,
    color: T.indigo,
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    padding: '8px 16px',
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  summaryDot: {
    width: 7,
    height: 7,
    borderRadius: 2,
    background: T.purple,
    display: 'inline-block',
    flexShrink: 0,
  },
  miniProgress: {
    flex: 1,
    minWidth: 160,
  },
  miniProgressText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    marginBottom: 5,
    display: 'block',
  },
  miniTrack: {
    height: 4,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    border: `1px solid ${T.light}`,
  },
  miniFill: {
    height: '100%',
    background: T.purple,
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  sectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.purpleDark,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 16,
    marginTop: 8,
  },
  navDots: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  dot: {
    height: 8,
    borderRadius: 2,
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.2s ease',
  },
  focusCardBody: {
    padding: '20px 24px 24px',
  },
  focusTaskName: {
    fontFamily: T.body,
    fontSize: 20,
    fontWeight: 800,
    color: T.indigo,
    lineHeight: 1.35,
    marginBottom: 8,
  },
  focusDueDate: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    marginBottom: 16,
  },
  focusDescription: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.indigo,
    lineHeight: 1.7,
    marginBottom: 24,
    opacity: 0.85,
  },
  notesSection: {
    marginBottom: 20,
  },
  notesLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    display: 'block',
    marginBottom: 8,
  },
  notesInput: {
    width: '100%',
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '10px 12px',
    fontSize: 13,
    fontFamily: T.body,
    color: T.indigo,
    lineHeight: 1.6,
    resize: 'vertical',
    outline: 'none',
    background: T.insetBg,
    boxSizing: 'border-box',
    transition: 'border-color 0.15s ease',
  },
  focusActions: {
    marginBottom: 16,
  },
  completeBtn: {
    width: '100%',
    padding: '12px',
    color: T.indigo,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    fontFamily: T.body,
    cursor: 'pointer',
    letterSpacing: '0.02em',
    transition: 'all 0.1s ease',
  },
  undoBtn: {
    width: '100%',
    padding: '12px',
    background: T.insetBg,
    color: T.muted,
    border: `2px dotted ${T.light}`,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    fontFamily: T.body,
    cursor: 'pointer',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: T.body,
    cursor: 'pointer',
    padding: '4px 0',
    transition: 'opacity 0.15s',
  },
  weekSection: {
    marginTop: 8,
  },
  weekList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  weekDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    flexShrink: 0,
  },
  weekRowContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  weekTaskName: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    color: T.indigo,
  },
  weekDueDate: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  weekCompleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    fontFamily: T.body,
    fontWeight: 700,
    transition: 'all 0.15s ease',
  },
  allDone: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  allDoneEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  allDoneTitle: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 12,
    lineHeight: 1.6,
  },
  allDoneText: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    lineHeight: 1.6,
    maxWidth: 360,
    margin: '0 auto',
  },
  focusContentSection: {
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    background: T.insetBg,
  },
  contentToggle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  focusContentBody: {
    padding: '12px 14px 14px',
  },
  contentTabs: {
    display: 'flex',
    gap: 6,
    marginBottom: 14,
  },
  contentTab: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 12px',
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
  focusContentSubLabel: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    color: T.muted,
    marginBottom: 10,
    lineHeight: 1.4,
  },
  focusContentPre: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    margin: 0,
    marginBottom: 12,
    opacity: 0.85,
  },
  copyBtn: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    background: 'transparent',
    border: '2px dotted currentColor',
    borderRadius: 8,
    padding: '5px 14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  pageSectionFocus: {
    marginBottom: 14,
    paddingBottom: 14,
  },
  pageSectionLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 6,
  },
}
