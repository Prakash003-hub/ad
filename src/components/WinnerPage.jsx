import { useEffect, useState } from 'react'
import { api } from '../api/api.js'

export default function WinnerPage({ token }) {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api
      .listWinners(token)
      .then((res) => setWinners(res.winners || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const markDelivered = async (id) => {
    try {
      await api.markDelivered(token, id)
      setWinners((w) => w.map((row) => (row.registrationId === id ? { ...row, status: 'Delivered' } : row)))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800 }}>🏆 Winners ({winners.length})</h2>
        <a className="btn btn-primary" href={api.exportUrl(token, 'winners')} target="_blank" rel="noreferrer">
          Export Winners
        </a>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
      {loading && <p>Loading winners…</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {winners.map((w) => (
          <div key={w.registrationId} className="glass-card" style={{ padding: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <strong>{w.fullName}</strong>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 10px',
                  borderRadius: 999,
                  background: w.status === 'Delivered' ? 'rgba(18,54,43,0.12)' : 'rgba(217,164,65,0.18)',
                  color: w.status === 'Delivered' ? '#12362b' : '#b9862c'
                }}
              >
                {w.status}
              </span>
            </div>
            <p style={{ fontSize: 13, marginBottom: 4 }}>📞 {w.mobile}</p>
            <p style={{ fontSize: 13, marginBottom: 4 }}>📍 {w.district}</p>
            <p style={{ fontSize: 13, marginBottom: 14 }}>📘 {w.guideType} ({w.language})</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <a className="btn btn-ghost" style={{ flex: 1, fontSize: 12.5, padding: '8px 10px' }} href={`tel:${w.mobile}`}>
                Contact
              </a>
              {w.status !== 'Delivered' && (
                <button className="btn btn-primary" style={{ flex: 1, fontSize: 12.5, padding: '8px 10px' }} onClick={() => markDelivered(w.registrationId)}>
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
        {!loading && winners.length === 0 && (
          <p style={{ color: 'var(--ink-400)' }}>No winners selected yet. Run the lucky draw first.</p>
        )}
      </div>
    </div>
  )
}
