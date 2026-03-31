import { useState } from 'react'
import LeadMagnetPicker from './LeadMagnetPicker'
import SalesPageBuilder from './SalesPageBuilder'
import WebinarScript from './WebinarScript'
import OptInGenerator from './OptInGenerator'
import { T, winCard, winTitleBar, phaseColor } from '../theme'

// 2×2 grid — top row: Lead Magnet + Opt-in / bottom row: Sales Page + Webinar Script
const ASSETS = [
  {
    key: 'leadmagnet',
    label: 'Lead Magnet',
    icon: '🧲',
    accent: 1,
    desc: 'Choose your format and generate a full personalised outline you can copy and launch.',
  },
  {
    key: 'optin',
    label: 'Opt-In Page Copy',
    icon: '📋',
    accent: 4,
    desc: 'AI-generate your opt-in page headline, sub-headline, and bullet points in one block.',
  },
  {
    key: 'salespage',
    label: 'Sales Page',
    icon: '📄',
    accent: 2,
    desc: 'Generate your full sales page copy as one ready-to-paste block using your messaging.',
  },
  {
    key: 'webinar',
    label: 'Webinar Script',
    icon: '🎤',
    accent: 3,
    desc: 'Your full live event / webinar script framework, personalised to your offer.',
  },
]

export default function AssetsView({ offerDetails, phases, tasks, client, onUpdateTask }) {
  const [expanded, setExpanded] = useState(null)

  // Find the lead magnet task to sync selectedType
  const leadMagnetTask = tasks.find((t) => t.leadMagnetPicker)

  function handleLeadMagnetSelect(type) {
    if (leadMagnetTask && onUpdateTask) {
      onUpdateTask(leadMagnetTask.id, { leadMagnetType: type })
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.heading}>
          <span style={styles.headingLabel}>LAUNCH ASSETS</span>
          <p style={styles.headingDesc}>
            Your core launch materials — build each one and copy it when you need it.
          </p>
        </div>

        <div style={styles.cardGrid}>
          {ASSETS.map(({ key, label, icon, accent, desc }) => {
            const pc = phaseColor(accent)
            const isOpen = expanded === key

            return (
              <div key={key} style={styles.assetCard}>
                {/* Gallery card header — always visible */}
                <button
                  style={{
                    ...styles.cardFace,
                    borderColor: isOpen ? pc.color : T.light,
                    boxShadow: isOpen ? '0 2px 8px rgba(0,0,0,0.10)' : '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                  onClick={() => setExpanded(isOpen ? null : key)}
                >
                  <div style={styles.cardFaceTop}>
                    <span style={{ ...styles.cardFaceIcon, color: pc.color }}>{icon}</span>
                    <div style={{ ...styles.cardFaceAccent, background: pc.color }} />
                  </div>
                  <div style={styles.cardFaceLabel}>{label}</div>
                  <p style={styles.cardFaceDesc}>{desc}</p>
                  <div style={{ ...styles.cardFaceAction, color: pc.color }}>
                    {isOpen ? '▲ close' : '▼ open'}
                  </div>
                </button>

                {/* Expanded panel below the card */}
                {isOpen && (
                  <div style={{ ...styles.expandedPanel, borderColor: pc.color, borderTopColor: 'transparent' }}>
                    {key === 'leadmagnet' && (
                      <LeadMagnetPicker
                        selectedType={leadMagnetTask?.leadMagnetType || null}
                        onSelect={handleLeadMagnetSelect}
                        offerDetails={offerDetails}
                      />
                    )}
                    {key === 'optin' && (
                      <OptInGenerator offerDetails={offerDetails} accent={pc.color} accentDark={pc.dark} />
                    )}
                    {key === 'salespage' && (
                      <SalesPageBuilder offerDetails={offerDetails} />
                    )}
                    {key === 'webinar' && (
                      <WebinarScript offerDetails={offerDetails} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
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
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
  },
  heading: {
    marginBottom: 32,
  },
  headingLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.indigo,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 8,
  },
  headingDesc: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    margin: 0,
    lineHeight: 1.5,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
    alignItems: 'start',
  },
  assetCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardFace: {
    background: T.cardBg,
    border: `1px solid`,
    borderRadius: 10,
    padding: '24px 24px 20px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.15s ease',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  },
  cardFaceTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardFaceIcon: {
    fontSize: 28,
    lineHeight: 1,
  },
  cardFaceAccent: {
    width: 4,
    height: 32,
    borderRadius: 2,
    opacity: 0.3,
  },
  cardFaceLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.indigo,
    marginBottom: 10,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  cardFaceDesc: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.55,
    margin: '0 0 16px',
    fontWeight: 500,
  },
  cardFaceAction: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    marginTop: 'auto',
  },
  expandedPanel: {
    background: T.cardBg,
    border: `1px solid`,
    borderTop: 'none',
    borderRadius: '0 0 10px 10px',
    overflow: 'hidden',
    marginTop: -1,
  },
}
