import { winCard, winTitleBar, T } from '../theme'

export default function WindowCard({ title, accent, accentDark, children, style, bodyStyle }) {
  const ac = accent || T.purple
  const acd = accentDark || T.purpleDark

  return (
    <div style={{ ...winCard(ac, acd), ...style }}>
      {title && (
        <div style={winTitleBar(ac)}>
          <span>{title}</span>
          <span style={{ opacity: 0.6, letterSpacing: 4 }}>_ □ ×</span>
        </div>
      )}
      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}
