import { useState } from 'react'
import { api } from '../api/api.js'

export default function LuckyDraw({ token }) {
  const [count, setCount] = useState(100)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const runDraw = async () => {
    setConfirmOpen(false)
    setRunning(true)
    setError('')
    try {
      const res = await api.runLuckyDraw(token, count)
      setResult(res)
    } catch (err) {
      setError(err.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{ paddingTop: 20, maxWidth: 480 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>🎲 Lucky Draw</h2>
      <p style={{ marginBottom: 20, fontSize: 14 }}>
        Randomly select winners from all pending registrations. This shuffles every pending
        entry and marks the first {count} as <strong>Winner</strong>; everyone else stays{' '}
        <strong>Pending</strong>.
      </p>

      <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
          Number of winners
        </label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          style={{
            width: 100,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 800,
            padding: '10px 0',
            borderRadius: 12,
            border: '1.5px solid rgba(18,54,43,0.14)',
            marginBottom: 20
          }}
        />

        <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => setConfirmOpen(true)} disabled={running}>
          {running ? 'Shuffling…' : '🎲 Select Winners'}
        </button>

        {error && <div style={{ color: 'var(--danger)', marginTop: 12, fontSize: 13 }}>{error}</div>}

        {result && (
          <div style={{ marginTop: 20, textAlign: 'left', background: 'rgba(47,169,104,0.08)', borderRadius: 12, padding: 16 }}>
            <strong style={{ color: 'var(--leaf-600)' }}>
              🎉 {result.winnerCount} winners selected!
            </strong>
            <p style={{ fontSize: 12.5, marginTop: 6 }}>
              Visit the Winners tab to view, contact, and mark deliveries.
            </p>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(12,32,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }}>
          <div className="glass-card" style={{ background: 'var(--glass-bg-strong)', maxWidth: 360, padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Run the lucky draw?</h3>
            <p style={{ fontSize: 13.5, marginBottom: 20 }}>
              This will randomly select {count} winners from pending registrations. It can be
              re-run, but previously selected winners will be re-shuffled back into the pool
              unless you've already marked them Delivered.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmOpen(false)}>Cancel</button>
              <button className="btn btn-gold" style={{ flex: 1 }} onClick={runDraw}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
