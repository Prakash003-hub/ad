import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField } from './FormField.jsx'
import { api } from '../api/api.js'

export default function AdminLogin({ onLogin, loggedIn }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (loggedIn) navigate('/tnadmin2003/dashboard', { replace: true })
  }, [loggedIn])

  if (loggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="glass-card" style={{ maxWidth: 380, width: '100%', padding: '36px 28px', textAlign: 'center' }}>
          <span className="tamil-eyebrow">நிர்வாக அணுகல்</span>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 12px' }}>Redirecting to admin dashboard</h1>
          <p style={{ fontSize: 14 }}>Your session is active. Taking you in now...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.adminLogin(username, password)
      onLogin(res.token)
      navigate('/tnadmin2003/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form onSubmit={handleSubmit} className="glass-card" style={{ maxWidth: 380, width: '100%', padding: '36px 28px' }}>
        <span className="tamil-eyebrow">நிர்வாக அணுகல்</span>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '8px 0 24px' }}>🔐 Admin Login</h1>

        <TextField name="username" label="Username" required value={username} onChange={setUsername} />
        <TextField name="password" label="Password" type="password" required value={password} onChange={setPassword} />

        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
