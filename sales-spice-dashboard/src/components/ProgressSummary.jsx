// ProgressSummary — print-friendly launch progress overlay.
// Triggered by the "📋 Summary" button in the header.

import { T, winCard, winTitleBar, phaseColor } from '../theme'

function metricsKey(clientId) {
  return clientId ? `salesSpice_metrics_v1_${clientId}` : 'salesSpice_metrics_v1'
}

function loadMetrics(clientId) {
  try {
    const raw = localStorage.getItem(metricsKey(clientId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function daysFrom(dateStr) {
  if (!dateStr) return ''
  const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return `${Math.abs(diff)}d ago`
  if (diff === 0) return 'Today'
  return `in ${diff}d`
}

export default function ProgressSummary({ launch, phases, tasks, clientId, onClose }) {
  const metrics = loadMetrics(clientId)
  const current = metrics?.[0]

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'complete').length
  const pct = Math.round((completedTasks / totalTasks) * 100)

  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ ...winCard(T.purple, T.purpleDark), width: '100%', maxWidth: 720, position: 'relative' }}>
        {/* Title bar */}
        <div style={winTitleBar(T.purple)}>
          <span>LAUNCH PROGRESS</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={styles.printBtn} onClick={() => window.print()}>🖨 Print</button>
            <button style={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div style={styles.body}>
          {/* Print-only header */}
          <div style={styles.printHeader}>
            <span style={{ color: T.pinkDark, fontFamily: T.body, fontWeight: 700, fontSize: 14, letterSpacing: '0.07em', textTransform: 'uppercase' }}>GET</span>
            <span style={{ color: T.blueDark, fontFamily: T.body, fontWeight: 700, fontSize: 14, letterSpacing: '0.07em', textTransform: 'uppercase' }}> VOLUME</span>
          </div>

          {/* Launch title */}
          <div style={styles.launchTitle}>{launch.client?.launchName || 'Launch Progress'}</div>
          <div style={styles.launchClient}>{launch.client?.name}</div>
          <div style={styles.reportDate}>Report generated {today}</div>

          {/* Key dates */}
          <div style={{ ...winCard(T.indigo, T.purpleDark), marginBottom: 24 }}>
            <div style={{ ...winTitleBar(T.indigo), justifyContent: 'flex-start', gap: 40, flexWrap: 'wrap' }}>
              {[
                { label: 'LAUNCH START', date: launch.client?.launchStart, accent: T.pink },
                { label: 'CART OPENS', date: launch.client?.cartOpen, accent: T.blue },
                { label: 'CART CLOSES', date: launch.client?.cartClose, accent: T.mint },
              ].filter((d) => d.date).map((d) => (
                <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '10px', fontFamily: T.body, fontWeight: 700, color: d.accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{d.label}</span>
                  <span style={{ fontFamily: T.body, fontWeight: 700, fontSize: 13, color: T.light }}>
                    {formatDate(d.date)} <span style={{ color: d.accent, fontWeight: 400, fontSize: 11 }}>{daysFrom(d.date)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div style={styles.overallSection}>
            <div style={styles.overallHeader}>
              <span style={styles.overallLabel}>Overall Progress</span>
              <span style={styles.overallPct}>{pct}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${pct}%` }} />
            </div>
            <div style={styles.overallCount}>{completedTasks} of {totalTasks} tasks complete</div>
          </div>

          {/* Phase breakdown */}
          <div style={styles.phasesSection}>
            <div style={styles.sectionTitle}>Phase Progress</div>
            {phases.map((phase) => {
              const phaseTasks = tasks.filter((t) => t.id.startsWith(`${phase.id}-`))
              const done = phaseTasks.filter((t) => t.status === 'complete').length
              const total = phaseTasks.length
              const phasePct = total > 0 ? Math.round((done / total) * 100) : 0
              const pc = phaseColor(phase.id)
              return (
                <div key={phase.id} style={{ ...styles.phaseRow, borderBottom: `1px dotted ${T.light}` }}>
                  <div style={styles.phaseLeft}>
                    <div style={{ ...styles.phaseNum, background: pc.color }}>{phase.id}</div>
                    <div>
                      <div style={styles.phaseName}>{phase.name}</div>
                      <div style={styles.phaseTagline}>{phase.tagline}</div>
                    </div>
                  </div>
                  <div style={styles.phaseRight}>
                    <div style={styles.phaseCount}>{done}/{total}</div>
                    <div style={styles.phaseMiniTrack}>
                      <div style={{ ...styles.phaseMiniBar, width: `${phasePct}%`, background: pc.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Metrics snapshot */}
          {current && (current.metrics.sales > 0 || current.metrics.revenue > 0) && (
            <div style={styles.metricsSection}>
              <div style={styles.sectionTitle}>Metrics Snapshot</div>
              <div style={styles.metricsGrid}>
                {[
                  { label: 'Sales', value: current.metrics.sales || '—', accent: T.pink, accentDark: T.pinkDark },
                  { label: 'Revenue', value: current.metrics.revenue ? `£${Number(current.metrics.revenue).toLocaleString('en-GB')}` : '—', accent: T.mint, accentDark: T.mintDark },
                  { label: 'Leads', value: current.metrics.leadsGenerated || '—', accent: T.blue, accentDark: T.blueDark },
                  { label: 'Conversion', value: current.metrics.leadsGenerated > 0 ? `${((current.metrics.sales / current.metrics.leadsGenerated) * 100).toFixed(1)}%` : '—', accent: T.purple, accentDark: T.purpleDark },
                ].map((m) => (
                  <div key={m.label} style={{ ...winCard(m.accent, m.accentDark), padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ ...styles.metricValue, color: m.accent }}>{m.value}</div>
                    <div style={styles.metricLabel}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30,27,75,0.65)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: '40px 24px 60px',
  },
  body: {
    padding: '24px 28px',
  },
  printBtn: {
    background: 'transparent',
    color: T.indigo,
    border: `1px solid rgba(30,27,75,0.3)`,
    borderRadius: 8,
    padding: '3px 10px',
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    opacity: 0.8,
  },
  closeBtn: {
    background: 'transparent',
    color: T.indigo,
    border: 'none',
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    opacity: 0.7,
    padding: '0 2px',
  },
  printHeader: {
    display: 'none',
    marginBottom: 16,
  },
  launchTitle: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 6,
    lineHeight: 1.6,
  },
  launchClient: {
    fontFamily: T.body,
    fontSize: 15,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 4,
  },
  reportDate: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    marginBottom: 20,
  },
  overallSection: {
    marginBottom: 28,
  },
  overallHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  overallLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    letterSpacing: '0.05em',
  },
  overallPct: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 14,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
  },
  progressTrack: {
    height: 8,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
    border: `1px solid ${T.light}`,
  },
  progressFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${T.purple}, ${T.pink})`,
    borderRadius: 2,
    transition: 'width 0.4s',
  },
  overallCount: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
  phasesSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    color: T.indigo,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  },
  phaseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    padding: '10px 0',
  },
  phaseLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  phaseNum: {
    width: 26,
    height: 26,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    flexShrink: 0,
  },
  phaseName: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 13,
    color: T.indigo,
  },
  phaseTagline: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  phaseRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  },
  phaseCount: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    width: 36,
    textAlign: 'right',
  },
  phaseMiniTrack: {
    width: 80,
    height: 6,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    border: `1px solid ${T.light}`,
  },
  phaseMiniBar: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s',
  },
  metricsSection: {
    marginBottom: 8,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 12,
  },
  metricValue: {
    fontFamily: T.body,
    fontWeight: 800,
    fontSize: 22,
    marginBottom: 4,
  },
  metricLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
}
