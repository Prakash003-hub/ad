import { NavLink, Outlet, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/tnadmin2003/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/tnadmin2003/registrations', label: 'Registrations', icon: '📋' },
  { to: '/tnadmin2003/lucky-draw', label: 'Lucky Draw', icon: '🎲' },
  { to: '/tnadmin2003/winners', label: 'Winners', icon: '🏆' }
]

export default function AdminLayout({ onLogout }) {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 90 }}>
      <header
        className="glass-card"
        style={{
          margin: '16px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--r-md)'
        }}
      >
        <h1 style={{ fontSize: 17, fontWeight: 800 }}>📘 Study Guide Admin</h1>
        <button
          className="btn btn-ghost"
          style={{ padding: '8px 16px', fontSize: 13 }}
          onClick={() => {
            onLogout()
            navigate('/tnadmin2003/login')
          }}
        >
          வெளியேறு (Logout)
        </button>
      </header>

      <div style={{ padding: '0 16px', maxWidth: 1100, margin: '0 auto' }}>
        <Outlet />
      </div>

      {/* Bottom tab bar - mobile first */}
      <nav
        className="glass-card"
        style={{
          position: 'fixed',
          bottom: 12,
          left: 12,
          right: 12,
          display: 'flex',
          justifyContent: 'space-around',
          padding: '10px 6px',
          borderRadius: 'var(--r-lg)',
          zIndex: 40
        }}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              fontSize: 11,
              fontWeight: 600,
              textDecoration: 'none',
              color: isActive ? 'var(--sky-600)' : 'var(--ink-400)',
              padding: '4px 10px'
            })}
          >
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
