import { useEffect, useState } from 'react'
import { api } from '../api/api.js'

export default function RegistrationTable({ token }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const load = () => {
    setLoading(true)
    api
      .listRegistrations(token, { search })
      .then((res) => setRows(res.registrations || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(load, [token])

  const handleDelete = async (id) => {
    if (!confirm('Delete this registration? This cannot be undone.')) return
    try {
      await api.deleteRegistration(token, id)
      setRows((r) => r.filter((row) => row.registrationId !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateRegistration(token, id, { status })
      setRows((r) => r.map((row) => (row.registrationId === id ? { ...row, status } : row)))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          placeholder="Search name, mobile, district…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          style={{
            flex: 1,
            minWidth: 200,
            padding: '10px 14px',
            borderRadius: 999,
            border: '1.5px solid rgba(18,54,43,0.14)',
            background: 'rgba(255,255,255,0.6)'
          }}
        />
        <button className="btn btn-ghost" onClick={load}>Search</button>
        <a className="btn btn-primary" href={api.exportUrl(token)} target="_blank" rel="noreferrer">
          Export Excel
        </a>
      </div>

      {error && <div style={{ color: 'var(--danger)', marginBottom: 12 }}>{error}</div>}
      {loading && <p>Loading registrations…</p>}

      <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760, fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'rgba(47,169,104,0.1)' }}>
              {['Reg ID', 'Name', 'Mobile', 'Category', 'School/College/Occ.', 'Guide', 'District', 'Date', 'Status', 'Actions'].map((h) => (
                <th key={h} style={{ padding: '12px 14px', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.registrationId} style={{ borderTop: '1px solid rgba(18,54,43,0.08)' }}>
                <td style={{ padding: '10px 14px' }}>{r.registrationId}</td>
                <td style={{ padding: '10px 14px' }}>{r.fullName}</td>
                <td style={{ padding: '10px 14px' }}>{r.mobile}</td>
                <td style={{ padding: '10px 14px' }}>{r.category}</td>
                <td style={{ padding: '10px 14px' }}>{r.schoolName || r.collegeName || r.occupation}</td>
                <td style={{ padding: '10px 14px' }}>{r.guideType}</td>
                <td style={{ padding: '10px 14px' }}>{r.district}</td>
                <td style={{ padding: '10px 14px' }}>{r.timestamp?.slice(0, 10)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <StatusBadge status={r.status} />
                </td>
                <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => setSelected(r)} style={{ border: 'none', background: 'none', marginRight: 8 }}>👁️</button>
                  <button onClick={() => handleStatusChange(r.registrationId, r.status === 'Pending' ? 'Winner' : 'Pending')} style={{ border: 'none', background: 'none', marginRight: 8 }}>✏️</button>
                  <button onClick={() => handleDelete(r.registrationId)} style={{ border: 'none', background: 'none' }}>🗑️</button>
                </td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: 24, textAlign: 'center', color: 'var(--ink-400)' }}>
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <ViewModal row={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    Pending: { bg: 'rgba(217,164,65,0.15)', fg: '#b9862c' },
    Winner: { bg: 'rgba(47,169,104,0.15)', fg: '#1f8f57' },
    Delivered: { bg: 'rgba(18,54,43,0.12)', fg: '#12362b' }
  }
  const c = colors[status] || colors.Pending
  return (
    <span style={{ background: c.bg, color: c.fg, padding: '4px 10px', borderRadius: 999, fontWeight: 700, fontSize: 12 }}>
      {status}
    </span>
  )
}

function ViewModal({ row, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(12,32,24,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: 16 }}
    >
      <div onClick={(e) => e.stopPropagation()} className="glass-card" style={{ background: 'var(--glass-bg-strong)', maxWidth: 420, width: '100%', padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{row.fullName}</h3>
        {Object.entries(row).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(18,54,43,0.06)' }}>
            <span style={{ color: 'var(--ink-400)' }}>{k}</span>
            <span style={{ fontWeight: 600, textAlign: 'right' }}>{String(v ?? '-')}</span>
          </div>
        ))}
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 16 }} onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
