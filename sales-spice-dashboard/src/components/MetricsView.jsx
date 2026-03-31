import { useState, useEffect } from 'react'
import { initialLaunches } from '../data/metricsData'
import { T, winCard, winTitleBar } from '../theme'

function metricsKey(clientId) {
  return clientId ? `salesSpice_metrics_v1_${clientId}` : 'salesSpice_metrics_v1'
}

function debriefKey(clientId) {
  return clientId ? `salesSpice_debrief_v1_${clientId}` : 'salesSpice_debrief_v1'
}

function loadMetrics(clientId) {
  try {
    const raw = localStorage.getItem(metricsKey(clientId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function loadDebrief(clientId) {
  try {
    const raw = localStorage.getItem(debriefKey(clientId))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const DEBRIEF_FIELDS = [
  { key: 'whatWorked', label: 'What worked well', hint: 'The things you\'d do again — strategies, timing, copy, platforms…' },
  { key: 'whatDidnt', label: 'What didn\'t work', hint: 'Be honest. What would you cut or do differently next time?' },
  { key: 'whatSurprised', label: 'What surprised you', hint: 'Unexpected wins, unexpected blocks, patterns you didn\'t predict.' },
  { key: 'growthLevers', label: 'Your 3 growth levers', hint: 'The 3 specific things that, if improved, would most impact your next launch.' },
  { key: 'nextLaunch', label: 'Next launch date + intention', hint: 'Lock in the date while momentum is high. What\'s the focus?' },
]

// ─── helpers ────────────────────────────────────────────────────────────────

function calcDerived(m) {
  const convRate = m.leadsGenerated > 0 ? (m.sales / m.leadsGenerated) * 100 : 0
  const roas = m.adSpend > 0 ? m.revenue / m.adSpend : 0
  const listGrowth = m.emailListAfter - m.emailListBefore
  const listGrowthPct =
    m.emailListBefore > 0 ? (listGrowth / m.emailListBefore) * 100 : 0
  const attendancePct =
    m.leadsGenerated > 0 ? (m.liveEventAttendance / m.leadsGenerated) * 100 : 0
  return { convRate, roas, listGrowth, listGrowthPct, attendancePct }
}

function pctChange(current, previous) {
  if (!previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

function fmt(n, prefix = '', decimals = 0) {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return (
    prefix +
    Number(n).toLocaleString('en-GB', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  )
}

// ─── main component ──────────────────────────────────────────────────────────

export default function MetricsView({ clientId }) {
  const [launches, setLaunches] = useState(() => loadMetrics(clientId) ?? initialLaunches)
  const [editing, setEditing] = useState(false)
  const [compareMode, setCompareMode] = useState(true)
  const [debrief, setDebrief] = useState(() => loadDebrief(clientId))
  const [debriefSaved, setDebriefSaved] = useState(false)

  useEffect(() => {
    localStorage.setItem(metricsKey(clientId), JSON.stringify(launches))
  }, [launches, clientId])

  function updateDebrief(field, value) {
    setDebrief((prev) => ({ ...prev, [field]: value }))
    setDebriefSaved(false)
  }

  function saveDebrief() {
    localStorage.setItem(debriefKey(clientId), JSON.stringify(debrief))
    setDebriefSaved(true)
    setTimeout(() => setDebriefSaved(false), 2000)
  }

  function updateMetric(launchId, field, value) {
    setLaunches((prev) =>
      prev.map((l) =>
        l.id === launchId
          ? { ...l, metrics: { ...l.metrics, [field]: parseFloat(value) || 0 } }
          : l
      )
    )
  }

  const current = launches[0]
  const previous = launches[1]

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Page header */}
        <div style={styles.pageHeader}>
          <div>
            <h2 style={styles.pageTitle}>Launch Metrics</h2>
            <p style={styles.pageSubtitle}>Your numbers, all in one place</p>
          </div>
          <div style={styles.headerActions}>
            <button
              style={{
                ...styles.actionBtn,
                ...(compareMode ? styles.actionBtnActive : {}),
              }}
              onClick={() => setCompareMode((c) => !c)}
            >
              {compareMode ? '↔ Comparing' : '↔ Compare Launches'}
            </button>
            <button
              style={{
                ...styles.actionBtn,
                ...(editing ? styles.actionBtnDone : {}),
              }}
              onClick={() => setEditing((e) => !e)}
            >
              {editing ? '✓ Done' : '✎ Edit Numbers'}
            </button>
          </div>
        </div>

        {/* Edit panel */}
        {editing && (
          <EditPanel launches={launches} onUpdate={updateMetric} />
        )}

        {/* Main view */}
        {compareMode ? (
          <CompareView current={current} previous={previous} />
        ) : (
          <SingleView launch={current} />
        )}

        {/* Debrief notes */}
        <DebriefNotes debrief={debrief} onUpdate={updateDebrief} onSave={saveDebrief} saved={debriefSaved} />
      </div>
    </div>
  )
}

// ─── single launch view ───────────────────────────────────────────────────────

function SingleView({ launch }) {
  const m = launch.metrics
  const d = calcDerived(m)

  return (
    <div>
      <div style={styles.launchBadgeRow}>
        <span style={styles.launchBadge}>{launch.name}</span>
        {launch.current && <span style={styles.currentTag}>Current Launch</span>}
      </div>

      {/* Row 1: 4 KPI cards */}
      <div style={styles.kpiGrid}>
        <KPICard label="Leads Generated" value={fmt(m.leadsGenerated)} accent={T.blue} accentDark={T.blueDark} />
        <KPICard label="Sales" value={fmt(m.sales)} accent={T.pink} accentDark={T.pinkDark} />
        <KPICard label="Revenue" value={fmt(m.revenue, '£')} accent={T.mint} accentDark={T.mintDark} />
        <ConversionCard leads={m.leadsGenerated} sales={m.sales} rate={d.convRate} />
      </div>

      {/* Row 2: list growth + ROAS */}
      <div style={styles.wideGrid}>
        <ListGrowthCard
          before={m.emailListBefore}
          after={m.emailListAfter}
          growth={d.listGrowth}
          growthPct={d.listGrowthPct}
        />
        <ROASCard
          spend={m.adSpend}
          revenue={m.revenue}
          roas={d.roas}
        />
      </div>

      {/* Row 3: event attendance */}
      <AttendanceCard
        attendance={m.liveEventAttendance}
        leads={m.leadsGenerated}
        pct={d.attendancePct}
      />
    </div>
  )
}

// ─── compare view ─────────────────────────────────────────────────────────────

function CompareView({ current, previous }) {
  const cm = current.metrics
  const pm = previous.metrics
  const cd = calcDerived(cm)
  const pd = calcDerived(pm)

  const rows = [
    {
      label: 'Leads Generated',
      curr: fmt(cm.leadsGenerated),
      prev: fmt(pm.leadsGenerated),
      change: pctChange(cm.leadsGenerated, pm.leadsGenerated),
    },
    {
      label: 'Sales',
      curr: fmt(cm.sales),
      prev: fmt(pm.sales),
      change: pctChange(cm.sales, pm.sales),
    },
    {
      label: 'Revenue',
      curr: fmt(cm.revenue, '£'),
      prev: fmt(pm.revenue, '£'),
      change: pctChange(cm.revenue, pm.revenue),
    },
    {
      label: 'Conversion Rate',
      curr: fmt(cd.convRate, '', 1) + '%',
      prev: fmt(pd.convRate, '', 1) + '%',
      change: pctChange(cd.convRate, pd.convRate),
      note: 'leads → sales',
    },
    {
      label: 'Return on Ad Spend',
      curr: fmt(cd.roas, '', 1) + '×',
      prev: fmt(pd.roas, '', 1) + '×',
      change: pctChange(cd.roas, pd.roas),
      note: 'revenue ÷ ad spend',
    },
    {
      label: 'Email List Growth',
      curr: '+' + fmt(cd.listGrowth) + ' (' + fmt(cd.listGrowthPct, '', 0) + '%)',
      prev: '+' + fmt(pd.listGrowth) + ' (' + fmt(pd.listGrowthPct, '', 0) + '%)',
      change: pctChange(cd.listGrowth, pd.listGrowth),
      note: 'new subscribers',
    },
    {
      label: 'Live Event Attendance',
      curr: fmt(cm.liveEventAttendance),
      prev: fmt(pm.liveEventAttendance),
      change: pctChange(cm.liveEventAttendance, pm.liveEventAttendance),
    },
    {
      label: 'Ad Spend',
      curr: fmt(cm.adSpend, '£'),
      prev: fmt(pm.adSpend, '£'),
      change: pctChange(cm.adSpend, pm.adSpend),
      invertColor: true, // more spend isn't inherently better
    },
  ]

  return (
    <div style={styles.compareWrapper}>
      {/* Column headers */}
      <div style={styles.compareHeader}>
        <div style={styles.compareMetricCol} />
        <div style={styles.compareValueCol}>
          <div style={styles.compareColLabel}>{current.name}</div>
          <span style={styles.currentTag}>Current</span>
        </div>
        <div style={styles.compareTrendCol} />
        <div style={styles.compareValueCol}>
          <div style={styles.compareColLabel}>{previous.name}</div>
          <span style={styles.prevTag}>Previous</span>
        </div>
      </div>

      {/* Rows */}
      <div style={styles.compareTable}>
        {rows.map((row, i) => (
          <CompareRow key={i} row={row} />
        ))}
      </div>

      {/* Summary banner */}
      <div style={styles.summaryBanner}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryNumber}>
            {fmt(pctChange(cm.revenue, pm.revenue), '', 0)}%
          </span>
          <span style={styles.summaryLabel}>more revenue</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryNumber}>
            {fmt(pctChange(cm.leadsGenerated, pm.leadsGenerated), '', 0)}%
          </span>
          <span style={styles.summaryLabel}>more leads</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryNumber}>
            {fmt(pctChange(cm.sales, pm.sales), '', 0)}%
          </span>
          <span style={styles.summaryLabel}>more sales</span>
        </div>
        <div style={styles.summaryDivider} />
        <div style={styles.summaryItem}>
          <span style={styles.summaryNumber}>
            +{fmt(cd.listGrowth - pd.listGrowth)}
          </span>
          <span style={styles.summaryLabel}>extra subscribers</span>
        </div>
      </div>
    </div>
  )
}

function CompareRow({ row }) {
  const change = row.change
  const isPositive = row.invertColor ? change < 0 : change > 0
  const isNegative = row.invertColor ? change > 0 : change < 0

  return (
    <div style={styles.compareRow}>
      <div style={styles.compareMetricCol}>
        <div style={styles.compareMetricName}>{row.label}</div>
        {row.note && <div style={styles.compareMetricNote}>{row.note}</div>}
      </div>
      <div style={{ ...styles.compareValueCol, ...styles.compareCurrentVal }}>
        {row.curr}
      </div>
      <div style={styles.compareTrendCol}>
        {change !== null && (
          <span
            style={{
              ...styles.trendBadge,
              background: isPositive ? T.completeBg : isNegative ? T.progressBg : T.pendingBg,
              color: isPositive ? T.mintDark : isNegative ? T.yellowDark : T.muted,
            }}
          >
            {change > 0 ? '↑' : change < 0 ? '↓' : '→'}{' '}
            {Math.abs(change).toFixed(0)}%
          </span>
        )}
      </div>
      <div style={{ ...styles.compareValueCol, ...styles.comparePrevVal }}>
        {row.prev}
      </div>
    </div>
  )
}

// ─── card components ──────────────────────────────────────────────────────────

function KPICard({ label, value, accent, accentDark }) {
  return (
    <div style={{ border: `1px solid ${accent}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: T.cardBg, padding: '18px 20px' }}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={{ ...styles.kpiValue, color: accentDark }}>{value}</div>
    </div>
  )
}

function ConversionCard({ leads, sales, rate }) {
  const barPct = Math.max((sales / leads) * 100, 1.5)

  return (
    <div style={{ border: `1px solid ${T.purple}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: T.cardBg, padding: '18px 20px' }}>
      <div style={styles.kpiLabel}>Conversion Rate</div>
      <div style={{ ...styles.kpiValue, color: T.purpleDark }}>
        {rate.toFixed(1)}%
      </div>
      <div style={styles.funnelBar}>
        <div style={styles.funnelTrack}>
          <div style={{ ...styles.funnelFill, width: `${barPct}%` }} />
        </div>
      </div>
      <div style={styles.funnelLabel}>
        {fmt(sales)} sales from {fmt(leads)} leads
      </div>
    </div>
  )
}

function ListGrowthCard({ before, after, growth, growthPct }) {
  return (
    <div style={{ border: `1px solid ${T.blue}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: T.cardBg, padding: '18px 20px' }}>
      <div style={styles.kpiLabel}>Email List Growth</div>
      <div style={styles.listGrowthRow}>
        <div style={styles.listBubble}>
          <div style={styles.listBubbleNumber}>{fmt(before)}</div>
          <div style={styles.listBubbleLabel}>Before launch</div>
        </div>
        <div style={styles.listArrow}>→</div>
        <div style={{ ...styles.listBubble, ...styles.listBubbleAfter }}>
          <div style={{ ...styles.listBubbleNumber, color: T.blueDark }}>
            {fmt(after)}
          </div>
          <div style={styles.listBubbleLabel}>After cart close</div>
        </div>
      </div>
      <div style={styles.listGrowthStat}>
        <span style={styles.listGrowthNumber}>+{fmt(growth)}</span>
        <span style={styles.listGrowthPct}> new subscribers ({growthPct.toFixed(0)}% growth)</span>
      </div>
    </div>
  )
}

function ROASCard({ spend, revenue, roas }) {
  const perPound = roas.toFixed(2)

  return (
    <div style={{ border: `1px solid ${T.yellow}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: T.cardBg, padding: '18px 20px' }}>
      <div style={styles.kpiLabel}>Return on Ad Spend</div>
      <div style={{ ...styles.kpiValue, color: T.yellowDark }}>
        {roas.toFixed(1)}×
      </div>
      <div style={styles.roasRow}>
        <div style={styles.roasItem}>
          <div style={styles.roasNum}>{fmt(spend, '£')}</div>
          <div style={styles.roasItemLabel}>spent on ads</div>
        </div>
        <div style={styles.roasArrow}>→</div>
        <div style={styles.roasItem}>
          <div style={{ ...styles.roasNum, color: T.yellowDark }}>{fmt(revenue, '£')}</div>
          <div style={styles.roasItemLabel}>revenue earned</div>
        </div>
      </div>
      <div style={styles.roasNote}>
        For every £1 spent, you earned £{perPound}
      </div>
    </div>
  )
}

function AttendanceCard({ attendance, leads, pct }) {
  const barPct = Math.min(pct, 100)

  return (
    <div style={{ border: `1px solid ${T.pink}`, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', background: T.cardBg, padding: '18px 20px', ...styles.cardFull }}>
      <div style={styles.attendanceInner}>
        <div style={styles.attendanceLeft}>
          <div style={styles.kpiLabel}>Live Event Attendance</div>
          <div style={{ ...styles.kpiValue, color: T.pinkDark, fontSize: 40 }}>
            {fmt(attendance)}
          </div>
          <div style={styles.attendanceDesc}>
            people attended live
          </div>
        </div>
        <div style={styles.attendanceRight}>
          <div style={styles.attendancePctLabel}>
            {pct.toFixed(0)}% of your leads attended
          </div>
          <div style={styles.attendanceTrack}>
            <div
              style={{
                ...styles.attendanceFill,
                width: `${barPct}%`,
              }}
            />
          </div>
          <div style={styles.attendanceSubtext}>
            {fmt(attendance)} attendees from {fmt(leads)} leads
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── edit panel ───────────────────────────────────────────────────────────────

const FIELDS = [
  { key: 'leadsGenerated', label: 'Leads Generated', prefix: '' },
  { key: 'sales', label: 'Sales', prefix: '' },
  { key: 'revenue', label: 'Revenue', prefix: '£' },
  { key: 'emailListBefore', label: 'Email List — Before Launch', prefix: '' },
  { key: 'emailListAfter', label: 'Email List — After Cart Close', prefix: '' },
  { key: 'liveEventAttendance', label: 'Live Event Attendance', prefix: '' },
  { key: 'adSpend', label: 'Ad Spend', prefix: '£' },
]

function EditPanel({ launches, onUpdate }) {
  return (
    <div style={styles.editPanel}>
      <div style={styles.editPanelTitle}>Edit Your Numbers</div>
      <div style={styles.editGrid}>
        {launches.map((launch) => (
          <div key={launch.id} style={styles.editCol}>
            <div style={styles.editColHeader}>
              {launch.name}
              {launch.current && (
                <span style={styles.currentTag}>Current</span>
              )}
            </div>
            {FIELDS.map((field) => (
              <div key={field.key} style={styles.editField}>
                <label style={styles.editLabel}>{field.label}</label>
                <div style={styles.editInputWrap}>
                  {field.prefix && (
                    <span style={styles.editPrefix}>{field.prefix}</span>
                  )}
                  <input
                    type="number"
                    style={styles.editInput}
                    value={launch.metrics[field.key]}
                    onChange={(e) => onUpdate(launch.id, field.key, e.target.value)}
                    min="0"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── debrief notes ────────────────────────────────────────────────────────────

function DebriefNotes({ debrief, onUpdate, onSave, saved }) {
  return (
    <div style={debriefStyles.section}>
      <div style={winTitleBar(T.purple)}><span>LAUNCH DEBRIEF</span><span style={{ opacity: 0.6, letterSpacing: 4 }}>_ □ ×</span></div>
      <div style={debriefStyles.header}>
        <div>
          <div style={debriefStyles.title}>Launch Debrief</div>
          <div style={debriefStyles.subtitle}>Write while the launch is fresh — these notes feed directly into your next launch plan.</div>
        </div>
        <button style={{ ...debriefStyles.saveBtn, background: saved ? T.purpleDark : T.purple }} onClick={onSave}>
          {saved ? '✓ Saved' : 'Save notes'}
        </button>
      </div>
      <div style={debriefStyles.fields}>
        {DEBRIEF_FIELDS.map((f) => (
          <div key={f.key} style={debriefStyles.field}>
            <label style={debriefStyles.label}>{f.label}</label>
            <p style={debriefStyles.hint}>{f.hint}</p>
            <textarea
              style={debriefStyles.textarea}
              rows={4}
              value={debrief[f.key] || ''}
              onChange={(e) => onUpdate(f.key, e.target.value)}
              placeholder={`${f.label}…`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

const debriefStyles = {
  section: {
    marginTop: 48,
    ...winCard(T.purple, T.purpleDark),
    overflow: 'visible',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
    padding: '20px 24px 0',
  },
  title: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 4,
    lineHeight: 1.6,
  },
  subtitle: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    maxWidth: 480,
  },
  saveBtn: {
    color: T.indigo,
    border: `1px solid ${T.purpleDark}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    padding: '7px 16px',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.15s',
    background: T.purple,
  },
  fields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    padding: '0 24px 24px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  label: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    color: T.indigo,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  hint: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    margin: '0 0 6px',
  },
  textarea: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    background: T.insetBg,
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '10px 12px',
    resize: 'vertical',
    lineHeight: 1.5,
    outline: 'none',
  },
}

// ─── styles ───────────────────────────────────────────────────────────────────

const styles = {
  page: {
    background: T.pageBg,
    minHeight: 'calc(100vh - 120px)',
    paddingBottom: 80,
  },
  container: {
    maxWidth: 1200,
    margin: '0 auto',
    padding: '32px 24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  pageTitle: {
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  pageSubtitle: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
  headerActions: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '7px 16px',
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    background: T.cardBg,
    color: T.indigo,
    fontSize: 12,
    fontWeight: 700,
    fontFamily: T.body,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  actionBtnActive: {
    background: T.blue,
    borderColor: T.blueDark,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    color: T.indigo,
  },
  actionBtnDone: {
    background: T.mint,
    borderColor: T.mintDark,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    color: T.indigo,
  },
  launchBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  launchBadge: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    lineHeight: 1.6,
  },
  currentTag: {
    background: T.pink,
    color: T.indigo,
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 8,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    border: `1px solid ${T.pinkDark}`,
  },
  prevTag: {
    background: T.light,
    color: T.muted,
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 8,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 16,
  },
  wideGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: T.cardBg,
    borderRadius: 8,
    border: `1px solid`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '18px 20px',
  },
  cardFull: {
    gridColumn: '1 / -1',
    marginBottom: 0,
  },
  kpiLabel: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    color: T.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 10,
  },
  kpiValue: {
    fontFamily: T.body,
    fontSize: 44,
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-1px',
    marginBottom: 10,
  },
  funnelBar: {
    marginBottom: 8,
  },
  funnelTrack: {
    height: 6,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    border: `1px solid ${T.light}`,
  },
  funnelFill: {
    height: '100%',
    background: T.purple,
    borderRadius: 2,
    transition: 'width 0.5s ease',
    minWidth: 8,
  },
  funnelLabel: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  listGrowthRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  listBubble: {
    background: T.insetBg,
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    padding: '10px 16px',
    textAlign: 'center',
    minWidth: 90,
  },
  listBubbleAfter: {
    background: T.completeBg,
    border: `1px solid ${T.mintDark}`,
  },
  listBubbleNumber: {
    fontFamily: T.body,
    fontSize: 28,
    fontWeight: 800,
    color: T.indigo,
    letterSpacing: '-0.5px',
  },
  listBubbleLabel: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginTop: 2,
  },
  listArrow: {
    fontFamily: T.body,
    fontSize: 24,
    color: T.blueDark,
    fontWeight: 700,
  },
  listGrowthStat: {
    fontFamily: T.body,
    fontSize: 14,
  },
  listGrowthNumber: {
    fontFamily: T.body,
    fontWeight: 800,
    color: T.blueDark,
    fontSize: 18,
  },
  listGrowthPct: {
    fontFamily: T.body,
    color: T.muted,
    fontSize: 13,
  },
  roasRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  roasItem: {
    flex: 1,
    minWidth: 80,
  },
  roasNum: {
    fontFamily: T.body,
    fontSize: 22,
    fontWeight: 800,
    color: T.indigo,
    letterSpacing: '-0.5px',
  },
  roasItemLabel: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginTop: 2,
  },
  roasArrow: {
    fontFamily: T.body,
    fontSize: 20,
    color: T.yellowDark,
    fontWeight: 700,
  },
  roasNote: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    fontStyle: 'italic',
  },
  attendanceInner: {
    display: 'flex',
    gap: 40,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  attendanceLeft: {
    flexShrink: 0,
  },
  attendanceDesc: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
  attendanceRight: {
    flex: 1,
    minWidth: 200,
  },
  attendancePctLabel: {
    fontFamily: T.body,
    fontSize: 15,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 10,
  },
  attendanceTrack: {
    height: 8,
    background: T.pendingBg,
    borderRadius: 2,
    overflow: 'hidden',
    border: `1px solid ${T.light}`,
    marginBottom: 8,
  },
  attendanceFill: {
    height: '100%',
    background: `linear-gradient(90deg, ${T.pink}, ${T.purple})`,
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },
  attendanceSubtext: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  compareWrapper: {
    ...winCard(T.blue, T.blueDark),
    overflow: 'hidden',
    marginBottom: 24,
  },
  compareHeader: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 80px 1fr',
    gap: 0,
    ...winTitleBar(T.blue),
    padding: '10px 24px',
    alignItems: 'center',
    fontSize: 8,
  },
  compareMetricCol: {},
  compareValueCol: {
    textAlign: 'center',
  },
  compareTrendCol: {
    textAlign: 'center',
  },
  compareColLabel: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 4,
  },
  compareTable: {},
  compareRow: {
    display: 'grid',
    gridTemplateColumns: '200px 1fr 80px 1fr',
    gap: 0,
    padding: '12px 24px',
    borderBottom: `1px dotted ${T.light}`,
    alignItems: 'center',
  },
  compareMetricName: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
  },
  compareMetricNote: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginTop: 2,
  },
  compareCurrentVal: {
    fontFamily: T.body,
    fontSize: 20,
    fontWeight: 800,
    color: T.blueDark,
    textAlign: 'center',
  },
  comparePrevVal: {
    fontFamily: T.body,
    fontSize: 18,
    fontWeight: 600,
    color: T.muted,
    textAlign: 'center',
  },
  trendBadge: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 8,
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  summaryBanner: {
    background: T.pendingBg,
    padding: '18px 24px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
    borderTop: `1px dotted ${T.blueDark}`,
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryNumber: {
    display: 'block',
    fontFamily: T.body,
    fontSize: 28,
    fontWeight: 800,
    color: T.blueDark,
    letterSpacing: '-0.5px',
  },
  summaryLabel: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    marginTop: 2,
    display: 'block',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    background: T.light,
    flexShrink: 0,
  },
  editPanel: {
    ...winCard(T.purple, T.purpleDark),
    marginBottom: 24,
  },
  editPanelTitle: {
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    color: T.indigo,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 20,
    padding: '18px 24px 0',
  },
  editGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 32,
    padding: '0 24px 24px',
  },
  editCol: {},
  editColHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: `2px dotted ${T.light}`,
  },
  editField: {
    marginBottom: 14,
  },
  editLabel: {
    display: 'block',
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    color: T.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  editInputWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  editPrefix: {
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    color: T.indigo,
  },
  editInput: {
    flex: 1,
    padding: '8px 12px',
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    fontFamily: T.body,
    fontSize: 14,
    color: T.indigo,
    background: T.insetBg,
    outline: 'none',
  },
}
