import { useState } from 'react'
import { generateTaskContent } from '../utils/generateContent'
import { T } from '../theme'

export default function GenerateButton({ task, phase, offerDetails, onGenerated, hasExisting }) {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState(null)

  async function handleGenerate() {
    setStatus('loading')
    setErrorMsg(null)
    try {
      const result = await generateTaskContent({ phase, task, offerDetails })
      onGenerated(task.id, result)
      setStatus('idle')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message)
    }
  }

  const label =
    status === 'loading'
      ? '⏳ Generating...'
      : hasExisting
      ? '↺ Regenerate'
      : '✦ Generate with AI'

  return (
    <div style={styles.wrapper}>
      <button
        style={{
          ...styles.btn,
          background: status === 'loading' ? T.insetBg : T.purple,
          border: `2px solid ${status === 'loading' ? T.light : T.purpleDark}`,
          boxShadow: status === 'loading' ? 'none' : `2px 2px 0 0 ${T.purpleDark}`,
          color: status === 'loading' ? T.muted : T.indigo,
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
        onClick={handleGenerate}
        disabled={status === 'loading'}
      >
        {label}
      </button>
      {status === 'error' && errorMsg && (
        <div style={styles.error}>{errorMsg}</div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  btn: {
    padding: '6px 14px',
    borderRadius: 4,
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    transition: 'all 0.15s',
  },
  error: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.pinkDark,
    maxWidth: 280,
    lineHeight: 1.4,
  },
}
