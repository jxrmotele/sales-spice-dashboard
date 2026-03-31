import { useState } from 'react'
import { generateOptInCopy } from '../utils/generateContent'
import { T, winBtn } from '../theme'

const STORAGE_KEY = 'salesSpice_optInCopy_v2'

function loadSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function saveCopy(text) {
  try { localStorage.setItem(STORAGE_KEY, text) } catch {}
}

export default function OptInGenerator({ offerDetails, accent, accentDark }) {
  const [copy, setCopy] = useState(loadSaved)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const ac = accent || T.mint
  const acDark = accentDark || T.mintDark

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const result = await generateOptInCopy(offerDetails)
      setCopy(result)
      saveCopy(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  function handleCopy() {
    if (!copy) return
    navigator.clipboard.writeText(copy).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleEdit(e) {
    setCopy(e.target.value)
    saveCopy(e.target.value)
  }

  const hasOffer = offerDetails && Object.values(offerDetails).some((v) => v && String(v).trim())

  return (
    <div style={styles.wrapper}>
      <div style={styles.top}>
        <div>
          <div style={{ ...styles.topLabel, color: acDark }}>✦ Opt-In Page Copy</div>
          <div style={styles.topSub}>
            {copy ? 'Edit or regenerate below · click Copy to use it' : 'Generate your full opt-in page copy in one click'}
          </div>
        </div>
        <div style={styles.topActions}>
          {copy && (
            <button
              style={{ ...styles.copyBtn, color: acDark, borderColor: acDark }}
              onClick={handleCopy}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          )}
          <button
            style={{
              ...winBtn(ac, acDark, 'sm'),
              opacity: generating ? 0.7 : 1,
              cursor: generating ? 'wait' : 'pointer',
            }}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? '✦ Generating…' : copy ? '↺ Regenerate' : '✦ Generate opt-in copy'}
          </button>
        </div>
      </div>

      {!hasOffer && !copy && (
        <div style={styles.noOffer}>
          Complete your offer details in the setup to generate personalised copy.
        </div>
      )}

      {error && (
        <div style={styles.error}>
          ⚠ {error}
        </div>
      )}

      {copy && (
        <textarea
          style={styles.copyArea}
          value={copy}
          onChange={handleEdit}
          rows={20}
          spellCheck
        />
      )}

      {!copy && !generating && hasOffer && (
        <div style={styles.placeholder}>
          <div style={{ ...styles.placeholderIcon, color: ac }}>📋</div>
          <div style={styles.placeholderText}>
            Click "Generate opt-in copy" to create your headline, sub-headline,
            bullet points, and CTA — ready to copy into your page builder.
          </div>
        </div>
      )}

      {generating && (
        <div style={styles.generatingState}>
          <div style={{ ...styles.spinnerDot, background: ac }} />
          <span style={styles.generatingText}>Writing your opt-in copy…</span>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    padding: '20px 20px 24px',
  },
  top: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  topLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  topSub: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
  },
  topActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  copyBtn: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    background: 'transparent',
    border: '1px dotted currentColor',
    borderRadius: 8,
    padding: '5px 14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  noOffer: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    padding: '16px 0',
    lineHeight: 1.5,
  },
  error: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.pinkDark,
    background: '#fce7f3',
    border: `1.5px solid ${T.pink}`,
    borderRadius: 8,
    padding: '10px 14px',
    marginBottom: 12,
  },
  copyArea: {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '14px 16px',
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    lineHeight: 1.7,
    background: T.insetBg,
    resize: 'vertical',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    minHeight: 300,
  },
  placeholder: {
    textAlign: 'center',
    padding: '32px 24px',
    border: `2px dashed ${T.light}`,
    borderRadius: 8,
  },
  placeholderIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  placeholderText: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.6,
    maxWidth: 380,
    margin: '0 auto',
  },
  generatingState: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '24px',
    justifyContent: 'center',
  },
  spinnerDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    animation: 'pulse 1s ease-in-out infinite',
  },
  generatingText: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
  },
}
