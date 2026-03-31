import { T, winCard, winTitleBar, phaseColor } from '../theme'

const CARDS = [
  {
    key: 'launch',
    icon: '🚀',
    label: 'Launch View',
    description: 'Your day-by-day launch calendar and guided task flow.',
    detail: 'Calendar • Guided • 90 / 30 / 7 day views',
    accent: 1,
  },
  {
    key: 'report',
    icon: '📊',
    label: 'Launch Report',
    description: 'Track metrics, conversion rates, and debrief your results.',
    detail: 'KPIs • Compare launches • Debrief',
    accent: 2,
  },
  {
    key: 'assets',
    icon: '🗂',
    label: 'Launch Assets',
    description: 'Build your lead magnet, sales page, opt-in copy, and webinar script.',
    detail: 'Lead Magnet • Sales Page • Opt-in • Webinar Script',
    accent: 3,
  },
  {
    key: 'content',
    icon: '✉',
    label: 'Launch Content',
    description: 'Generate all your email sequences and social content banks.',
    detail: 'Email sequences • Social post banks • AI generation',
    accent: 4,
  },
]

export default function DashboardView({ client, onNavigate }) {
  const totalProgress = null // passed in if we want

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Welcome header */}
        <div style={styles.welcome}>
          <div style={styles.welcomeLabel}>YOUR LAUNCH DASHBOARD</div>
          <h1 style={styles.welcomeTitle}>Where do you want to work today?</h1>
          {client?.launchName && (
            <p style={styles.welcomeSub}>{client.launchName}</p>
          )}
        </div>

        {/* 4 large cards */}
        <div style={styles.cardGrid}>
          {CARDS.map(({ key, icon, label, description, detail, accent }) => {
            const pc = phaseColor(accent)
            return (
              <button
                key={key}
                style={styles.card}
                onClick={() => onNavigate(key)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)'
                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.10)`
                  e.currentTarget.style.borderColor = `${pc.color}80`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
                  e.currentTarget.style.borderColor = T.border
                }}
              >
                {/* Icon + label */}
                <div style={styles.cardTop}>
                  <span style={{ ...styles.cardIcon, color: pc.color }}>{icon}</span>
                  <div style={{ ...styles.cardAccentBar, background: pc.color }} />
                </div>

                <div style={styles.cardLabel}>{label}</div>
                <p style={styles.cardDesc}>{description}</p>
                <div style={{ ...styles.cardDetail, color: pc.color }}>{detail}</div>

                <div style={{ ...styles.cardArrow, color: pc.color }}>→</div>
              </button>
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
    minHeight: 'calc(100vh - 80px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 24px 60px',
  },
  container: {
    maxWidth: 1000,
    width: '100%',
  },
  welcome: {
    textAlign: 'center',
    marginBottom: 48,
  },
  welcomeLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: 10,
    color: T.muted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  welcomeTitle: {
    fontFamily: T.body,
    fontSize: 28,
    fontWeight: 800,
    color: T.indigo,
    margin: '0 0 10px',
    lineHeight: 1.2,
  },
  welcomeSub: {
    fontFamily: T.body,
    fontSize: 15,
    color: T.muted,
    margin: 0,
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
  },
  card: {
    background: T.cardBg,
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: '28px 28px 24px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    transition: 'all 0.15s ease',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    position: 'relative',
    outline: 'none',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardIcon: {
    fontSize: 32,
    lineHeight: 1,
  },
  cardAccentBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    opacity: 0.3,
  },
  cardLabel: {
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 12,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
  },
  cardDesc: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.indigo,
    lineHeight: 1.55,
    margin: '0 0 14px',
    fontWeight: 500,
    opacity: 0.85,
  },
  cardDetail: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    opacity: 0.8,
    marginBottom: 20,
  },
  cardArrow: {
    fontFamily: T.body,
    fontSize: 18,
    fontWeight: 700,
    marginTop: 'auto',
  },
}
