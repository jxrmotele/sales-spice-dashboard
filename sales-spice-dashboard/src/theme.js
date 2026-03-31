// ─── Get Volume — Design Tokens ───────────────────────────────────────────────

export const T = {
  // Backgrounds
  pageBg:  '#F8F9FA',   // clean light gray page background
  cardBg:  '#ffffff',
  insetBg: '#F3F4F6',   // neutral inset panels

  // Muted pastel accents (unchanged)
  pink:   '#FADADD',
  blue:   '#DDEEFF',
  purple: '#E6D9FF',
  mint:   '#DFF5EA',
  yellow: '#FFF2B3',

  // Darker shades — WCAG AA against white
  pinkDark:   '#8a3d4a',
  blueDark:   '#3a72a0',
  purpleDark: '#6040a8',
  mintDark:   '#1e7a50',
  yellowDark: '#7a5c00',

  // Text
  indigo: '#111827',   // near-black body text
  muted:  '#6B7280',   // secondary text

  // Borders
  light:        '#E5E7EB',   // default border / inactive bg
  border:       '#E5E7EB',
  borderMid:    '#D1D5DB',

  // Header
  headerBg:     '#FFFFFF',
  headerBorder: '#F3F4F6',

  // Status backgrounds
  completeBg: '#DFF5EA',
  progressBg: '#FFF2B3',
  pendingBg:  '#E6D9FF',

  // Fonts — DM Sans throughout; no pixel font
  body: "'DM Sans', system-ui, sans-serif",
}

// Phase colours indexed 0–3 (wraps for extra phases)
export const PHASE_COLORS = [
  { color: T.pink,   dark: T.pinkDark   },
  { color: T.blue,   dark: T.blueDark   },
  { color: T.purple, dark: T.purpleDark },
  { color: T.mint,   dark: T.mintDark   },
]

export function phaseColor(phaseId) {
  const idx = (Number(phaseId) - 1) % PHASE_COLORS.length
  return PHASE_COLORS[Math.max(0, idx)]
}

// ─── Modern SaaS chrome helpers ───────────────────────────────────────────────

export function winCard(accent, accentDark) {
  return {
    background: '#FFFFFF',
    border: `1px solid ${accent}30`,
    borderRadius: '10px',
    boxShadow: `0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px ${accent}15`,
    overflow: 'hidden',
  }
}

export function winTitleBar(accent) {
  return {
    background: `${accent}18`,
    borderBottom: `1px solid ${accent}30`,
    padding: '8px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: '#111827',
    userSelect: 'none',
  }
}

export const WIN_CONTROLS = '_ □ ×'

export function winBtn(accent, accentDark, size = 'md') {
  const pad = size === 'sm' ? '4px 10px' : size === 'lg' ? '9px 18px' : '7px 14px'
  const fs  = size === 'sm' ? 11 : size === 'lg' ? 14 : 13
  return {
    background: accent,
    border: `1px solid ${accentDark}50`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
    borderRadius: '8px',
    color: '#111827',
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: fs,
    padding: pad,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }
}

export function winBtnOutline(accent, size = 'md') {
  const pad = size === 'sm' ? '4px 10px' : '6px 14px'
  return {
    background: 'transparent',
    border: `1px solid ${accent}`,
    borderRadius: '8px',
    color: accent,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: size === 'sm' ? 11 : 13,
    padding: pad,
    cursor: 'pointer',
  }
}
