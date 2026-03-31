import { useState } from 'react'
import {
  OCT_ESSENTIALS,
  OCT_SECTIONS,
  OCT_ARENA_EXTRAS,
  MESSAGING_CODEX_SECTIONS,
} from '../data/setupFrameworks'
import { T } from '../theme'

function buildSectionList(templateId) {
  const sections = []
  sections.push({ title: 'Basics', keys: OCT_ESSENTIALS.map((f) => f.key) })
  OCT_SECTIONS.forEach((s) => {
    sections.push({ title: s.title, keys: s.fields.map((f) => f.key) })
  })
  if (templateId === 'arena') {
    sections.push({ title: 'Arena extras', keys: OCT_ARENA_EXTRAS.map((f) => f.key) })
  }
  MESSAGING_CODEX_SECTIONS.forEach((s) => {
    sections.push({ title: s.title, keys: s.fields.map((f) => f.key) })
  })
  return sections
}

function countFields(sections, offerDetails) {
  const od = offerDetails || {}
  let total = 0
  let filled = 0
  sections.forEach(({ keys }) => {
    keys.forEach((k) => {
      total++
      if (od[k] && od[k].trim && od[k].trim() !== '') filled++
    })
  })
  return { total, filled }
}

export default function OfferCompletionBanner({ launch, offerDetails, onEditOfferDetails }) {
  const [collapsed, setCollapsed] = useState(false)

  if (!offerDetails || !launch) return null

  const templateId = launch.templateId
  const sections = buildSectionList(templateId)
  const { total, filled } = countFields(sections, offerDetails)
  const pct = Math.round((filled / total) * 100)

  if (pct >= 100) return null

  const incompleteSections = sections.filter(({ keys }) =>
    keys.some((k) => !offerDetails[k] || offerDetails[k].trim?.() === '')
  )

  return (
    <div style={styles.banner}>
      <div style={styles.bannerTop}>
        <div style={styles.bannerLeft}>
          <div style={styles.bannerTitle}>Offer details {pct}% complete</div>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${pct}%` }} />
          </div>
          <div style={styles.bannerSub}>{filled} of {total} fields filled in</div>
        </div>
        <div style={styles.bannerRight}>
          {onEditOfferDetails && (
            <button style={styles.editBtn} onClick={onEditOfferDetails}>
              Complete your details →
            </button>
          )}
          <button style={styles.collapseBtn} onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? '▼ Show' : '▲ Hide'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div style={styles.sectionList}>
          <div style={styles.sectionListLabel}>Missing sections:</div>
          <div style={styles.pills}>
            {incompleteSections.map(({ title }) => (
              <span key={title} style={styles.pill}>{title}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  banner: {
    background: T.progressBg,
    border: `1px solid ${T.yellowDark}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderRadius: 8,
    padding: '14px 18px',
    marginBottom: 24,
  },
  bannerTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    flexWrap: 'wrap',
  },
  bannerLeft: {
    flex: 1,
    minWidth: 0,
  },
  bannerTitle: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  progressTrack: {
    height: 6,
    background: 'rgba(0,0,0,0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
    border: `1px solid ${T.yellowDark}`,
  },
  progressFill: {
    height: '100%',
    background: T.yellow,
    borderRadius: 2,
    transition: 'width 0.3s',
  },
  bannerSub: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.yellowDark,
    fontWeight: 600,
  },
  bannerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  editBtn: {
    background: T.yellow,
    color: T.indigo,
    border: `1px solid ${T.yellowDark}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    padding: '6px 12px',
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  collapseBtn: {
    background: 'transparent',
    border: `1.5px dotted ${T.yellowDark}`,
    borderRadius: 8,
    padding: '5px 10px',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.yellowDark,
    cursor: 'pointer',
  },
  sectionList: {
    marginTop: 10,
  },
  sectionListLabel: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginBottom: 6,
  },
  pills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    background: T.yellow,
    color: T.indigo,
    borderRadius: 8,
    padding: '2px 9px',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    border: `1px solid ${T.yellowDark}`,
  },
}
