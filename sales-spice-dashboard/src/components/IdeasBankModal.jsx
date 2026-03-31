import { useState } from 'react'
import { T, winCard, winTitleBar } from '../theme'
import { loadIdeasBank, saveIdeasBank } from '../utils/generateContent'

export default function IdeasBankModal({ onClose }) {
  const [text, setText] = useState(() => loadIdeasBank())
  const [saved, setSaved] = useState(false)

  function handleSave() {
    saveIdeasBank(text)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        {/* Title bar */}
        <div style={styles.titleBar}>
          <span>💡 IDEAS BANK</span>
          <div style={{ display: 'flex', gap: 6, opacity: 0.7 }}>
            <span>_</span><span>□</span>
            <span style={{ cursor: 'pointer' }} onClick={onClose}>×</span>
          </div>
        </div>

        <div style={styles.body}>
          <div style={styles.subtitle}>
            Brain-dump anything here — hooks, angles, client wins, stories, objections you hear, phrases that land.
            Claude will pick what's relevant for each piece of content at generation time.
            This bank is shared across all clients.
          </div>

          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`E.g.\n\n— "The biggest objection I always hear is 'I don't have time' — but my best clients are the busiest people I know"\n— Hook that always works: start with a question they're already asking themselves\n— Client win: Sarah went from 0 to £4k in her first launch using this exact method\n— My favourite phrase: "You don't need a huge audience, you need the right audience"\n— Story about the time I launched to 47 people and made £12k...`}
            rows={16}
          />

          <div style={styles.footer}>
            <span style={styles.hint}>
              {wordCount > 0 ? `${wordCount.toLocaleString()} words` : 'Empty — AI will use offer details only'}
            </span>
            <div style={styles.footerBtns}>
              <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button
                style={{ ...styles.saveBtn, background: saved ? T.purpleDark : T.purple }}
                onClick={handleSave}
              >
                {saved ? '✓ Saved!' : 'Save Ideas Bank'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(30, 27, 75, 0.6)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflowY: 'auto',
    padding: '40px 24px 60px',
  },
  modal: {
    ...winCard(T.purple, T.purpleDark),
    width: '100%',
    maxWidth: 680,
  },
  titleBar: {
    ...winTitleBar(T.purple),
  },
  body: {
    padding: '24px 28px 28px',
  },
  subtitle: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.5,
    maxWidth: 520,
    marginBottom: 16,
  },
  textarea: {
    width: '100%',
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    border: `1px solid ${T.light}`,
    borderRadius: 4,
    padding: '12px 14px',
    background: T.insetBg,
    resize: 'vertical',
    lineHeight: 1.6,
    boxSizing: 'border-box',
    outline: 'none',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    gap: 12,
    flexWrap: 'wrap',
  },
  hint: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  footerBtns: {
    display: 'flex',
    gap: 8,
  },
  cancelBtn: {
    background: T.light,
    color: T.muted,
    border: 'none',
    borderRadius: 4,
    padding: '9px 16px',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  saveBtn: {
    color: T.indigo,
    border: 'none',
    borderRadius: 4,
    padding: '9px 18px',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
}
