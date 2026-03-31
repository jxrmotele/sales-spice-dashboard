import { useState } from 'react'
import { generateContentDoc } from '../utils/exportDocx'
import { T } from '../theme'

export default function ExportButton({ launch, phases }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleExport() {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      await generateContentDoc(launch, phases)
    } catch (e) {
      console.error('Export failed:', e)
      setError('Export failed')
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      style={{
        background: error ? T.pinkDark : T.mint,
        color: T.indigo,
        border: `2px solid ${error ? T.pinkDark : T.mintDark}`,
        boxShadow: `2px 2px 0 0 ${error ? T.pinkDark : T.mintDark}`,
        borderRadius: 4,
        padding: '5px 12px',
        fontFamily: T.body,
        fontSize: 12,
        fontWeight: 700,
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'opacity 0.15s',
        whiteSpace: 'nowrap',
      }}
      onClick={handleExport}
      disabled={loading}
    >
      {loading ? 'Generating…' : error ? error : '↓ Export content'}
    </button>
  )
}
