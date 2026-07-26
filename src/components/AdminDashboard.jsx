import { useEffect, useState } from 'react'
import { api } from '../api/api.js'

const CARD_CONFIG = [
  { key: 'total', label: 'மொத்த பதிவுகள்', subLabel: 'Total Registrations', icon: '🧾' },
  { key: 'school', label: 'பள்ளி மாணவர்கள்', subLabel: 'School Students', icon: '🏫' },
  { key: 'college', label: 'கல்லூரி மாணவர்கள்', subLabel: 'College Students', icon: '🎓' },
  { key: 'others', label: 'மற்றவர்கள்', subLabel: 'Others', icon: '👤' },
  { key: 'pending', label: 'நிலுவையில் உள்ளவை', subLabel: 'Pending', icon: '⏳' },
  { key: 'winners', label: 'தேர்ந்தெடுக்கப்பட்டவர்', subLabel: 'Selected Winners', icon: '🏆' },
  { key: 'delivered', label: 'வழங்கப்பட்டவை', subLabel: 'Delivered', icon: '📦' }
]

export default function AdminDashboard({ token }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api
      .getDashboardStats(token)
      .then((res) => !cancelled && setStats(res.stats))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div style={{ paddingTop: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>📊 மேலோட்டம் (Overview)</h2>

      {error && <div style={{ color: 'var(--danger)', marginBottom: 16 }}>{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {CARD_CONFIG.map((c) => (
          <div key={c.key} className="glass-card" style={{ padding: '18px 16px' }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--sky-600)' }}>
              {loading ? '–' : stats?.[c.key] ?? 0}
            </div>
            <div style={{ fontSize: 13, color: 'var(--ink-900)', fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-400)', fontWeight: 500 }}>{c.subLabel}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
