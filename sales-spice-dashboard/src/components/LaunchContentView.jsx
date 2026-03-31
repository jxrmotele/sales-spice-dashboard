import { useState } from 'react'
import { applyOfferDetails, applyOfferDetailsToTemplate } from '../utils/launchBuilder'
import GenerateButton from './GenerateButton'
import { generateTaskContent } from '../utils/generateContent'
import { generateContentBank, loadContentBank } from '../utils/generateContentBank'
import { T, winBtn, phaseColor } from '../theme'

// ─── Sequence / bank metadata ─────────────────────────────────────────────────

const SEQUENCES = [
  { key: 'waitlist-drive',  label: 'Drive to Waitlist',          icon: '📣', accent: 1 },
  { key: 'waitlist-nurture',label: 'Nurture & Sell to Waitlist', icon: '💌', accent: 2 },
  { key: 'webinar-drive',   label: 'Drive to Webinar',           icon: '🎙', accent: 3 },
  { key: 'cart-open',       label: 'Open to Close Cart',         icon: '🛒', accent: 4 },
  { key: 'onboarding',      label: 'Client Onboarding',          icon: '🎉', accent: 1 },
]

const CONTENT_BANKS = [
  { key: 'pre-launch',  label: 'Pre-Launch Bank',   icon: '🌱', accent: 1, description: 'Social posts for building awareness before your launch begins.' },
  { key: 'driving',     label: 'Driving Period Bank', icon: '🚀', accent: 2, description: 'Posts for the main driving period — desire, objections, social proof.' },
  { key: 'cart-period', label: 'Cart Period Bank',   icon: '🔥', accent: 3, description: 'Posts for the open-to-close window — urgency, FAQs, final day.' },
]

function getSeqMeta(key) {
  return SEQUENCES.find((s) => s.key === key) || { key, label: key, icon: '📧', accent: 1 }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short',
  })
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LaunchContentView({ phases, tasks, offerDetails, client, clientId, onUpdateTask }) {
  const [openSeq, setOpenSeq] = useState(null)   // which sequence card is expanded
  const [openBank, setOpenBank] = useState(null)  // which bank card is expanded
  const od = offerDetails || {}

  function fill(text) {
    if (!text) return ''
    return Object.keys(od).length > 0 ? applyOfferDetails(text, od) : text
  }

  // Flatten all tasks that have a contentTemplate.email, attach phase + sequence
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

  // Group by sequence
  const grouped = {}
  emailTasks.forEach(({ task, phase }) => {
    const seq = task.sequence || '__other__'
    if (!grouped[seq]) grouped[seq] = []
    grouped[seq].push({ task, phase })
  })

  // Ordered sequence keys (defined sequences first, then "other")
  const sequenceKeys = [
    ...SEQUENCES.map((s) => s.key).filter((k) => grouped[k]),
    ...(grouped['__other__'] ? ['__other__'] : []),
  ]

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Row 1: Email Sequences ── */}
        <div style={styles.rowHeading}>
          <span style={styles.rowLabel}>✉ EMAIL SEQUENCES</span>
          <p style={styles.rowDesc}>Click a sequence card to expand all {emailTasks.length > 0 ? emailTasks.length : ''} emails. Generate, review, and copy — ready to send.</p>
        </div>

        <div style={styles.cardRow}>
          {sequenceKeys.map((seqKey) => {
            const meta = seqKey === '__other__'
              ? { key: '__other__', label: 'Other Emails', icon: '📧', accent: 4 }
              : getSeqMeta(seqKey)
            const pc = phaseColor(meta.accent)
            const items = grouped[seqKey] || []
            const generated = items.filter(({ task }) => !!task.generatedContent).length
            const isOpen = openSeq === seqKey

            return (
              <button
                key={seqKey}
                style={{
                  ...styles.seqCard,
                  borderColor: isOpen ? pc.color : T.light,
                  boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.10)' : '0 1px 2px rgba(0,0,0,0.06)',
                  background: isOpen ? pc.color : T.cardBg,
                }}
                onClick={() => setOpenSeq(isOpen ? null : seqKey)}
              >
                <div style={styles.seqCardTop}>
                  <span style={{ ...styles.seqCardIcon, color: isOpen ? T.indigo : pc.color }}>
                    {meta.icon}
                  </span>
                  <span style={{ ...styles.seqCardCount, color: isOpen ? T.indigo : T.muted }}>
                    {items.length} emails
                  </span>
                </div>
                <div style={{
                  ...styles.seqCardLabel,
                  color: isOpen ? T.indigo : T.indigo,
                  fontFamily: T.body,
                }}>
                  {meta.label}
                </div>
                <div style={{ ...styles.seqCardProgress, color: isOpen ? T.indigo : T.muted }}>
                  {generated > 0 ? `${generated}/${items.length} generated` : 'Not generated yet'}
                </div>
                <div style={{ ...styles.seqCardArrow, color: isOpen ? T.indigo : pc.color }}>
                  {isOpen ? '▲' : '▼'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Expanded sequence panel */}
        {openSeq && grouped[openSeq] && (
          <SequencePanel
            key={openSeq}
            seqKey={openSeq}
            items={grouped[openSeq]}
            od={od}
            fill={fill}
            onUpdateTask={onUpdateTask}
            phases={phases}
          />
        )}

        {/* ── Row 2: Social Content Banks ── */}
        <div style={{ ...styles.rowHeading, marginTop: 56 }}>
          <span style={styles.rowLabel}>📱 SOCIAL CONTENT BANKS</span>
          <p style={styles.rowDesc}>AI-generated batches of social posts. Click a card to expand and generate your posts.</p>
        </div>

        <div style={styles.cardRow}>
          {CONTENT_BANKS.map((bank) => {
            const pc = phaseColor(bank.accent)
            const posts = loadContentBank(clientId, bank.key)
            const isOpen = openBank === bank.key

            return (
              <button
                key={bank.key}
                style={{
                  ...styles.seqCard,
                  borderColor: isOpen ? pc.color : T.light,
                  boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.10)' : '0 1px 2px rgba(0,0,0,0.06)',
                  background: isOpen ? pc.color : T.cardBg,
                }}
                onClick={() => setOpenBank(isOpen ? null : bank.key)}
              >
                <div style={styles.seqCardTop}>
                  <span style={{ ...styles.seqCardIcon, color: isOpen ? T.indigo : pc.color }}>
                    {bank.icon}
                  </span>
                  <span style={{ ...styles.seqCardCount, color: isOpen ? T.indigo : T.muted }}>
                    {posts.length > 0 ? `${posts.length} posts` : '0 posts'}
                  </span>
                </div>
                <div style={{ ...styles.seqCardLabel, color: T.indigo, fontFamily: T.body }}>
                  {bank.label}
                </div>
                <div style={{ ...styles.seqCardProgress, color: isOpen ? T.indigo : T.muted }}>
                  {posts.length > 0 ? 'Generated ✓' : 'Not generated yet'}
                </div>
                <div style={{ ...styles.seqCardArrow, color: isOpen ? T.indigo : pc.color }}>
                  {isOpen ? '▲' : '▼'}
                </div>
              </button>
            )
          })}
        </div>

        {/* Expanded bank panel */}
        {openBank && (
          <ContentBankPanel
            key={openBank}
            bank={CONTENT_BANKS.find((b) => b.key === openBank)}
            offerDetails={od}
            clientId={clientId}
          />
        )}
      </div>
    </div>
  )
}

// ─── Expanded sequence panel ──────────────────────────────────────────────────

function SequencePanel({ seqKey, items, od, fill, onUpdateTask, phases }) {
  const [expandedId, setExpandedId] = useState(null)
  const [contentTab, setContentTab] = useState({})
  const [copiedId, setCopiedId] = useState(null)
  const [generatingAll, setGeneratingAll] = useState(false)
  const [genProgress, setGenProgress] = useState(null)

  const meta = seqKey === '__other__'
    ? { key: '__other__', label: 'Other Emails', icon: '📧', accent: 4 }
    : getSeqMeta(seqKey)
  const pc = phaseColor(meta.accent)

  function getTab(id) { return contentTab[id] || 'email' }
  function setTab(id, tab) { setContentTab((prev) => ({ ...prev, [id]: tab })) }

  function getContent(task) {
    return task.generatedContent || applyOfferDetailsToTemplate(task.contentTemplate, od)
  }

  function handleCopy(task, type) {
    const content = getContent(task)
    const text = type === 'email'
      ? `Subject: ${content.email.subject}\n\n${content.email.body}`
      : (content.social?.copy || '')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId(task.id + '-' + type)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleGenerateAll() {
    if (!onUpdateTask) return
    const toGen = items.filter(({ task }) => !task.generatedContent)
    if (!toGen.length) return
    setGeneratingAll(true)
    setGenProgress({ done: 0, total: toGen.length })
    for (let i = 0; i < toGen.length; i++) {
      const { task, phase } = toGen[i]
      try {
        const generated = await generateTaskContent({ phase, task, offerDetails: od })
        onUpdateTask(task.id, { generatedContent: generated })
      } catch {}
      setGenProgress({ done: i + 1, total: toGen.length })
    }
    setGeneratingAll(false)
    setGenProgress(null)
  }

  const ungeneratedCount = items.filter(({ task }) => !task.generatedContent).length

  return (
    <div style={{ ...styles.expandPanel, borderColor: pc.color }}>
      {/* Panel header */}
      <div style={{ ...styles.panelHeader, background: pc.color }}>
        <div style={styles.panelHeaderLeft}>
          <span style={styles.panelIcon}>{meta.icon}</span>
          <span style={styles.panelLabel}>{meta.label}</span>
          <span style={styles.panelCount}>{items.length} emails</span>
        </div>
        <div style={styles.panelActions}>
          {ungeneratedCount > 0 && !generatingAll && (
            <button
              style={styles.genAllBtn}
              onClick={handleGenerateAll}
            >
              ✦ Generate all {ungeneratedCount}
            </button>
          )}
          {generatingAll && genProgress && (
            <span style={styles.genProgress}>
              Generating {genProgress.done}/{genProgress.total}…
            </span>
          )}
        </div>
      </div>

      {/* Email list */}
      <div style={styles.emailList}>
        {items.map(({ task, phase }) => {
          const isExpanded = expandedId === task.id
          const content = getContent(task)
          const hasSocial = !!content.social?.copy
          const tab = getTab(task.id)
          const isAI = !!task.generatedContent

          return (
            <div key={task.id} style={styles.emailItem}>
              <div
                style={styles.emailItemHeader}
                onClick={() => setExpandedId(isExpanded ? null : task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setExpandedId(isExpanded ? null : task.id)}
              >
                <div style={styles.emailItemLeft}>
                  <div style={{ ...styles.phaseTag, background: pc.color, color: T.indigo }}>
                    {fill(task.name)}
                  </div>
                  <div style={styles.emailSubject}>
                    <span style={styles.subjectLabel}>Subject: </span>
                    <span style={styles.subjectText}>{fill(content.email.subject)}</span>
                  </div>
                </div>
                <div style={styles.emailItemRight}>
                  {task.dueDate && (
                    <span style={styles.dueDateSmall}>{formatDate(task.dueDate)}</span>
                  )}
                  {isAI && <span style={styles.aiBadge}>✦ AI</span>}
                  <span style={styles.expandHint}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && (
                <div style={styles.emailItemBody}>
                  {onUpdateTask && (
                    <div style={{ marginBottom: 14 }}>
                      <GenerateButton
                        task={task}
                        phase={phase}
                        offerDetails={od}
                        hasExisting={isAI}
                        onGenerated={(taskId, generated) => onUpdateTask(taskId, { generatedContent: generated })}
                      />
                    </div>
                  )}

                  {hasSocial && (
                    <div style={styles.tabs}>
                      {['email', 'social'].map((t) => (
                        <button
                          key={t}
                          style={{
                            ...styles.tab,
                            ...(tab === t ? { ...styles.tabActive, background: pc.color } : { color: pc.color }),
                          }}
                          onClick={() => setTab(task.id, t)}
                        >
                          {t === 'email' ? '✉ Email' : '📱 Social'}
                        </button>
                      ))}
                    </div>
                  )}

                  {tab === 'email' && (
                    <div style={styles.contentBlock}>
                      <div style={{ ...styles.subjectLine, borderColor: pc.color }}>
                        <span style={styles.subjectLineLabel}>Subject</span>
                        <span style={styles.subjectLineValue}>{fill(content.email.subject)}</span>
                      </div>
                      <pre style={styles.bodyPre}>{fill(content.email.body)}</pre>
                      <button
                        style={{ ...styles.copyBtn, color: pc.color, borderColor: pc.color }}
                        onClick={() => handleCopy(task, 'email')}
                      >
                        {copiedId === task.id + '-email' ? '✓ Copied!' : 'Copy email'}
                      </button>
                    </div>
                  )}

                  {tab === 'social' && hasSocial && (
                    <div style={styles.contentBlock}>
                      <pre style={styles.bodyPre}>{fill(content.social.copy)}</pre>
                      <button
                        style={{ ...styles.copyBtn, color: pc.color, borderColor: pc.color }}
                        onClick={() => handleCopy(task, 'social')}
                      >
                        {copiedId === task.id + '-social' ? '✓ Copied!' : 'Copy post'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Expanded content bank panel ─────────────────────────────────────────────

function ContentBankPanel({ bank, offerDetails, clientId }) {
  const [posts, setPosts] = useState(() => loadContentBank(clientId, bank.key))
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const pc = phaseColor(bank.accent)

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const result = await generateContentBank({
        bankLabel: bank.label,
        offerDetails,
        clientId,
        bankKey: bank.key,
        count: 10,
      })
      setPosts(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy(post) {
    navigator.clipboard.writeText(post.copy).catch(() => {})
    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleCopyAll() {
    const text = posts.map((p, i) => `Post ${i + 1}:\n\n${p.copy}`).join('\n\n---\n\n')
    navigator.clipboard.writeText(text).catch(() => {})
    setCopiedId('__all__')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div style={{ ...styles.expandPanel, borderColor: pc.color }}>
      {/* Panel header */}
      <div style={{ ...styles.panelHeader, background: pc.color }}>
        <div style={styles.panelHeaderLeft}>
          <span style={styles.panelIcon}>{bank.icon}</span>
          <span style={styles.panelLabel}>{bank.label}</span>
          {posts.length > 0 && (
            <span style={styles.panelCount}>{posts.length} posts</span>
          )}
        </div>
        <div style={styles.panelActions}>
          {posts.length > 0 && (
            <button style={styles.copyAllPostsBtn} onClick={handleCopyAll}>
              {copiedId === '__all__' ? '✓ Copied all!' : 'Copy all posts'}
            </button>
          )}
          <button
            style={{
              ...winBtn(T.cardBg, pc.dark, 'sm'),
              opacity: generating ? 0.7 : 1,
              cursor: generating ? 'wait' : 'pointer',
              color: pc.color,
            }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '✦ Generating…' : posts.length > 0 ? '↺ Regenerate 10' : '✦ Generate 10 posts'}
          </button>
        </div>
      </div>

      <div style={styles.bankPanelBody}>
        <p style={styles.bankDesc}>{bank.description}</p>

        {error && (
          <div style={styles.errorMsg}>{error}</div>
        )}

        {posts.length === 0 && !generating && (
          <div style={styles.bankEmpty}>
            Click "Generate 10 posts" to create your social content for this phase.
          </div>
        )}

        {generating && (
          <div style={styles.bankGenerating}>Writing your posts…</div>
        )}

        {posts.length > 0 && (
          <div style={styles.postsList}>
            {posts.map((post, i) => (
              <div key={post.id} style={styles.postItem}>
                <div style={styles.postHeader}>
                  <span style={{ ...styles.postNum, color: pc.color }}>Post {i + 1}</span>
                  <button
                    style={{ ...styles.copySmallBtn, color: pc.color, borderColor: pc.color }}
                    onClick={() => handleCopy(post)}
                  >
                    {copiedId === post.id ? '✓' : 'Copy'}
                  </button>
                </div>
                <pre style={styles.postCopy}>{post.copy}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  rowHeading: {
    marginBottom: 20,
  },
  rowLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.indigo,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 8,
  },
  rowDesc: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    margin: 0,
    lineHeight: 1.5,
  },
  // Card row
  cardRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
  },
  seqCard: {
    background: T.cardBg,
    border: '1px solid',
    borderRadius: 10,
    padding: '16px 16px 14px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 160,
    flex: '1 1 160px',
    maxWidth: 220,
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  seqCardTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  seqCardIcon: {
    fontSize: 20,
  },
  seqCardCount: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
  },
  seqCardLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    lineHeight: 1.35,
    marginBottom: 6,
  },
  seqCardProgress: {
    fontFamily: T.body,
    fontSize: 11,
    marginBottom: 10,
  },
  seqCardArrow: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    marginTop: 'auto',
  },
  // Expanded panel
  expandPanel: {
    border: '1px solid',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 12,
    background: T.cardBg,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    gap: 12,
    flexWrap: 'wrap',
  },
  panelHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  panelIcon: {
    fontSize: 16,
  },
  panelLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.indigo,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  panelCount: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.indigo,
    opacity: 0.7,
    fontWeight: 500,
  },
  panelActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  genAllBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    background: 'rgba(255,255,255,0.5)',
    border: `2px solid rgba(0,0,0,0.15)`,
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    color: T.indigo,
    transition: 'all 0.15s ease',
  },
  genProgress: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.indigo,
    opacity: 0.7,
  },
  copyAllPostsBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    background: 'rgba(255,255,255,0.5)',
    border: '2px solid rgba(0,0,0,0.15)',
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    color: T.indigo,
    transition: 'all 0.15s ease',
  },
  // Email list (inside expanded panel)
  emailList: {
    borderTop: `1.5px dotted ${T.light}`,
  },
  emailItem: {
    borderBottom: `1.5px dotted ${T.light}`,
  },
  emailItemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    cursor: 'pointer',
    gap: 12,
  },
  emailItemLeft: {
    flex: 1,
    minWidth: 0,
  },
  phaseTag: {
    display: 'inline-block',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 3,
    marginBottom: 5,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emailSubject: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 4,
    overflow: 'hidden',
  },
  subjectLabel: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    flexShrink: 0,
  },
  subjectText: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    color: T.indigo,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  emailItemRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  dueDateSmall: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  aiBadge: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 3,
    background: T.progressBg,
    color: T.yellowDark,
    border: '1px dotted currentColor',
  },
  expandHint: {
    fontSize: 10,
    color: T.muted,
    opacity: 0.6,
  },
  emailItemBody: {
    padding: '8px 16px 16px',
    borderTop: `1.5px dotted ${T.light}`,
    background: T.insetBg,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 14,
  },
  tab: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 12px',
    borderRadius: 8,
    border: '1.5px dotted currentColor',
    cursor: 'pointer',
    background: 'transparent',
    transition: 'all 0.15s ease',
  },
  tabActive: {
    color: T.indigo,
    border: '1.5px solid transparent',
  },
  contentBlock: {
    background: T.cardBg,
    borderRadius: 8,
    padding: '12px 14px',
    border: `1px solid ${T.light}`,
  },
  subjectLine: {
    display: 'flex',
    gap: 8,
    alignItems: 'baseline',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: '1.5px dotted',
  },
  subjectLineLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.muted,
    flexShrink: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  subjectLineValue: {
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    color: T.indigo,
    lineHeight: 1.4,
  },
  bodyPre: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.65,
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
    padding: '4px 14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  // Content bank panel
  bankPanelBody: {
    padding: '16px 18px 20px',
  },
  bankDesc: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.5,
    marginBottom: 16,
    marginTop: 0,
  },
  bankEmpty: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    fontStyle: 'italic',
    padding: '8px 0',
  },
  bankGenerating: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    fontStyle: 'italic',
    padding: '16px 0',
    textAlign: 'center',
  },
  errorMsg: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.yellowDark,
    background: T.progressBg,
    border: `1.5px solid ${T.yellow}`,
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 12,
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 500,
    overflowY: 'auto',
  },
  postItem: {
    background: T.cardBg,
    border: `1.5px solid ${T.light}`,
    borderRadius: 8,
    padding: '10px 12px',
  },
  postHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postNum: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  copySmallBtn: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    background: 'transparent',
    border: '1.5px dotted currentColor',
    borderRadius: 3,
    padding: '2px 8px',
    cursor: 'pointer',
  },
  postCopy: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    margin: 0,
    opacity: 0.9,
  },
}
