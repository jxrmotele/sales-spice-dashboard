import { useState } from 'react'
import { T, phaseColor } from '../theme'

const PAGE_NAV = [
  { key: 'launch',  label: 'Launch View',   icon: '🚀', accent: 1 },
  { key: 'report',  label: 'Launch Report', icon: '📊', accent: 2 },
  { key: 'assets',  label: 'Launch Assets', icon: '🗂',  accent: 3 },
  { key: 'content', label: 'Launch Content',icon: '✉',  accent: 4 },
]

const LAUNCH_SUBTABS = [
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'guided',   label: 'Guided',   icon: '✦' },
]

const CALENDAR_MODES = [
  { key: '90day', label: '90 Days' },
  { key: '30day', label: '30 Days' },
  { key: '7day',  label: '7 Days'  },
]

export default function Header({
  client,
  page,
  onPageChange,
  launchSubView,
  onLaunchSubViewChange,
  calendarMode,
  onCalendarModeChange,
  onSwitchClients,
  onReset,
  exportButton,
  onShowSummary,
  onShowIdeasBank,
}) {
  return (
    <header style={styles.header}>
      {/* ── Row 1: brand + greeting + action buttons ── */}
      <div style={styles.inner}>
        {/* Wordmark — clicking returns to dashboard */}
        <button style={styles.brandBtn} onClick={() => onPageChange('dashboard')}>
          <div style={styles.wordmark}>
            <span style={styles.wordGet}>GET</span>
            <span style={styles.wordVolume}> VOLUME</span>
          </div>
          <div style={styles.subline}>LAUNCH DASHBOARD</div>
        </button>

        {/* Client greeting */}
        <div style={styles.greeting}>
          Welcome back, <strong>{client.name}</strong>
          <div style={styles.launchName}>{client.launchName}</div>
        </div>

        {/* Action buttons */}
        <div style={styles.clientActions}>
          {exportButton}
          {onShowSummary && (
            <button style={styles.actionBtn} onClick={onShowSummary} title="View progress summary">
              📋 Summary
            </button>
          )}
          {onShowIdeasBank && (
            <button style={styles.actionBtn} onClick={onShowIdeasBank} title="Your hooks, stories & copy angles">
              💡 Ideas
            </button>
          )}
          {onSwitchClients && (
            <button style={styles.actionBtn} onClick={onSwitchClients} title="Back to all clients">
              ← Clients
            </button>
          )}
          {onReset && (
            <button style={{ ...styles.actionBtn, fontSize: 11 }} onClick={onReset} title="Reset this launch plan">
              ↺ Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Compact card strip — shown when NOT on dashboard ── */}
      {page !== 'dashboard' && (
        <div style={styles.cardStrip}>
          <div style={styles.cardStripInner}>
            {/* Back to dashboard chip */}
            <button
              style={styles.homeChip}
              onClick={() => onPageChange('dashboard')}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#F3F4F6' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              ⌂ Home
            </button>

            <div style={styles.stripDivider} />

            {/* Compact page cards */}
            {PAGE_NAV.map(({ key, label, icon, accent }) => {
              const pc = phaseColor(accent)
              const isActive = page === key
              return (
                <button
                  key={key}
                  style={{
                    ...styles.stripCard,
                    ...(isActive
                      ? { background: `${pc.color}60`, borderColor: pc.color, color: T.indigo }
                      : { background: 'transparent', borderColor: T.border, color: T.muted }),
                  }}
                  onClick={() => onPageChange(key)}
                >
                  <span style={styles.stripIcon}>{icon}</span>
                  <span style={styles.stripLabel}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Launch sub-nav (calendar/guided + mode pills) ── */}
      {page === 'launch' && (
        <div style={styles.subRow}>
          <div style={styles.subRowInner}>
            <div style={styles.subTabs}>
              {LAUNCH_SUBTABS.map(({ key, label, icon }) => (
                <button
                  key={key}
                  style={{
                    ...styles.subTab,
                    ...(launchSubView === key ? styles.subTabActive : styles.subTabInactive),
                  }}
                  onClick={() => onLaunchSubViewChange(key)}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>

            {launchSubView === 'calendar' && (
              <div style={styles.modePills}>
                {CALENDAR_MODES.map(({ key, label }) => (
                  <button
                    key={key}
                    style={{
                      ...styles.modePill,
                      ...(calendarMode === key ? styles.modePillActive : styles.modePillInactive),
                    }}
                    onClick={() => onCalendarModeChange(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Key dates bar ── */}
      <KeyDatesBar client={client} />
    </header>
  )
}

function KeyDatesBar({ client }) {
  const today = new Date()

  const dates = [
    { label: 'LAUNCH START', date: client.launchStart, accent: T.pink,   accentDark: T.pinkDark },
    { label: 'CART OPENS',   date: client.cartOpen,    accent: T.blue,   accentDark: T.blueDark },
    { label: 'CART CLOSES',  date: client.cartClose,   accent: T.mint,   accentDark: T.mintDark },
  ]

  function daysFrom(dateStr) {
    const d = new Date(dateStr)
    const diff = Math.ceil((d - today) / (1000 * 60 * 60 * 24))
    if (diff < 0) return `${Math.abs(diff)}d ago`
    if (diff === 0) return 'Today'
    return `in ${diff}d`
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  return (
    <div style={styles.datesBar}>
      <div style={styles.datesInner}>
        {dates.map((d, i) => (
          <div key={i} style={styles.dateItem}>
            <div style={{ ...styles.dateDot, background: d.accent, border: `1px solid ${d.accentDark}40` }} />
            <div>
              <div style={{ ...styles.dateLabel, color: d.accentDark }}>{d.label}</div>
              <div style={styles.dateValue}>
                {formatDate(d.date)}{' '}
                <span style={{ ...styles.dateDiff, color: d.accentDark }}>{daysFrom(d.date)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  header: {
    background: T.headerBg,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: `1px solid ${T.headerBorder}`,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  brandBtn: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    textAlign: 'left',
    flexShrink: 0,
  },
  wordmark: {
    fontFamily: T.body,
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '-0.3px',
  },
  wordGet: {
    color: T.pinkDark,
  },
  wordVolume: {
    color: T.blueDark,
  },
  subline: {
    fontFamily: T.body,
    fontSize: 9,
    fontWeight: 600,
    color: T.muted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 3,
  },
  greeting: {
    flex: 1,
    color: T.indigo,
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 500,
    minWidth: 120,
  },
  launchName: {
    color: T.muted,
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 500,
    marginTop: 2,
    letterSpacing: '0.02em',
  },
  clientActions: {
    display: 'flex',
    gap: 6,
    flexShrink: 0,
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '5px 10px',
    borderRadius: 6,
    border: `1px solid ${T.border}`,
    background: 'transparent',
    color: T.muted,
    fontSize: 12,
    fontFamily: T.body,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  // ── Compact card strip ──
  cardStrip: {
    borderTop: `1px solid ${T.border}`,
    background: T.pageBg,
  },
  cardStripInner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '8px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  homeChip: {
    padding: '5px 10px',
    borderRadius: 6,
    border: `1px solid ${T.border}`,
    background: 'transparent',
    color: T.muted,
    fontSize: 11,
    fontFamily: T.body,
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s ease',
  },
  stripDivider: {
    width: 1,
    height: 24,
    background: T.border,
    flexShrink: 0,
  },
  stripCard: {
    position: 'relative',
    padding: '5px 12px',
    borderRadius: 8,
    border: '1px solid',
    cursor: 'pointer',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    transition: 'all 0.12s ease',
    flexShrink: 0,
  },
  stripIcon: {
    fontSize: 12,
  },
  stripLabel: {
    whiteSpace: 'nowrap',
  },
  // ── Sub-row ──
  subRow: {
    borderTop: `1px solid ${T.border}`,
    background: T.pageBg,
  },
  subRowInner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '7px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  subTabs: {
    display: 'flex',
    gap: 5,
  },
  subTab: {
    padding: '5px 12px',
    borderRadius: 20,
    cursor: 'pointer',
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    transition: 'all 0.12s ease',
    border: '1px solid',
  },
  subTabActive: {
    background: T.blue,
    borderColor: T.blueDark,
    color: T.indigo,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  subTabInactive: {
    background: 'transparent',
    borderColor: T.border,
    color: T.muted,
    boxShadow: 'none',
  },
  modePills: {
    display: 'flex',
    gap: 4,
    marginLeft: 'auto',
  },
  modePill: {
    padding: '4px 10px',
    borderRadius: 20,
    cursor: 'pointer',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid',
    transition: 'all 0.12s ease',
  },
  modePillActive: {
    background: T.mint,
    borderColor: T.mintDark,
    color: T.indigo,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
  },
  modePillInactive: {
    background: 'transparent',
    borderColor: T.border,
    color: T.muted,
    boxShadow: 'none',
  },
  // ── Key dates bar ──
  datesBar: {
    borderTop: `1px solid ${T.headerBorder}`,
    background: '#F9FAFB',
  },
  datesInner: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '8px 24px',
    display: 'flex',
    gap: 40,
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  dateItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  dateDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    flexShrink: 0,
  },
  dateLabel: {
    fontFamily: T.body,
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  dateValue: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    fontWeight: 700,
  },
  dateDiff: {
    fontWeight: 400,
    fontSize: 12,
  },
}
