import { T, winCard, winTitleBar, winBtn, PHASE_COLORS } from '../theme'

export default function ClientPicker({ clients, onSelect, onNew, onDelete }) {
  return (
    <div style={styles.page}>
      {/* Header bar */}
      <div style={styles.header}>
        <div style={styles.wordmark}>
          <span style={styles.wordGet}>GET</span>
          <span style={styles.wordVolume}> VOLUME</span>
        </div>
        <div style={styles.subline}>LAUNCH DASHBOARD</div>
      </div>

      <div style={styles.container}>
        <div style={{ ...styles.pageHeader, ...(clients.length === 0 ? { display: 'none' } : {}) }}>
          <div>
            <h1 style={styles.title}>Your launches</h1>
            <p style={styles.subtitle}>Select a launch to open, or add another.</p>
          </div>
          <button style={styles.newBtn} onClick={onNew}>
            + Add another
          </button>
        </div>

        {clients.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyPixel}>GET VOLUME</div>
            <div style={styles.emptyText}>Ready to plan your launch?</div>
            <div style={styles.emptySub}>Set up your personalised launch dashboard — it only takes a few minutes.</div>
            <button style={styles.emptyBtn} onClick={onNew}>
              Set up my launch →
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {clients.map((c, i) => {
              const pc = PHASE_COLORS[i % PHASE_COLORS.length]
              return (
                <div key={c.id} style={{ ...winCard(pc.color, pc.dark), display: 'flex', overflow: 'hidden' }}>
                  {/* Title bar */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ ...winTitleBar(pc.color), cursor: 'pointer' }} onClick={() => onSelect(c.id)}>
                      <span>{c.templateName || 'Launch'}</span>
                      <span style={{ opacity: 0.5, letterSpacing: 3 }}>_ □ ×</span>
                    </div>
                    <div style={styles.cardMain} onClick={() => onSelect(c.id)}>
                      <div style={styles.clientName}>{c.name}</div>
                      <div style={styles.launchName}>{c.launchName}</div>
                      <div style={styles.cardMeta}>
                        <span style={styles.progress}>
                          {c.completedTasks} / {c.totalTasks} tasks done
                        </span>
                        <span style={{ ...styles.openLink, color: pc.color }}>Open →</span>
                      </div>
                    </div>
                  </div>
                  <button
                    style={{ ...styles.deleteBtn, borderLeft: `1px dotted ${pc.color}` }}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (window.confirm(`Delete ${c.name}'s dashboard? This cannot be undone.`)) {
                        onDelete(c.id)
                      }
                    }}
                    title="Delete client"
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    fontFamily: T.body,
  },
  header: {
    background: '#FFFFFF',
    padding: '16px 32px',
    borderBottom: '1px solid #F3F4F6',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  wordmark: {
    fontFamily: T.body,
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  wordGet: {
    color: T.pinkDark,
  },
  wordVolume: {
    color: '#3a72a0',
  },
  subline: {
    fontFamily: T.body,
    fontWeight: 600,
    fontSize: '9px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: T.muted,
    marginTop: 4,
  },
  container: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '48px 24px',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 36,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  subtitle: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
  },
  newBtn: {
    padding: '10px 22px',
    borderRadius: 8,
    border: `1px solid ${T.mintDark}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    background: T.mint,
    color: T.indigo,
    fontSize: 13,
    fontWeight: 700,
    fontFamily: T.body,
    cursor: 'pointer',
    flexShrink: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
  },
  cardMain: {
    flex: 1,
    padding: '16px 18px 16px',
    cursor: 'pointer',
  },
  clientName: {
    fontFamily: T.body,
    fontSize: 18,
    fontWeight: 800,
    color: T.indigo,
    marginBottom: 4,
  },
  launchName: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.muted,
    marginBottom: 16,
    lineHeight: 1.8,
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progress: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  openLink: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 800,
  },
  deleteBtn: {
    width: 36,
    border: 'none',
    background: 'transparent',
    color: T.muted,
    fontSize: 12,
    cursor: 'pointer',
    fontFamily: T.body,
    flexShrink: 0,
    transition: 'all 0.15s',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 24px',
  },
  emptyPixel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    background: `linear-gradient(135deg, ${T.pink}, ${T.blue}, ${T.purple})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  emptyText: {
    fontFamily: T.body,
    fontSize: 22,
    fontWeight: 800,
    color: T.indigo,
    marginBottom: 8,
  },
  emptySub: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    marginBottom: 32,
    maxWidth: 400,
    margin: '0 auto 32px',
    lineHeight: 1.6,
  },
  emptyBtn: {
    padding: '12px 28px',
    borderRadius: 8,
    border: `1px solid ${T.pinkDark}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    background: T.pink,
    color: T.indigo,
    fontSize: 14,
    fontWeight: 800,
    fontFamily: T.body,
    cursor: 'pointer',
  },
}
