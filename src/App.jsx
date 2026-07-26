import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage.jsx'
import RegistrationForm from './components/RegistrationForm.jsx'
import SuccessPage from './components/SuccessPage.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import RegistrationTable from './components/RegistrationTable.jsx'
import LuckyDraw from './components/LuckyDraw.jsx'
import WinnerPage from './components/WinnerPage.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

function useAdminToken() {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token'))
  const login = (t) => {
    sessionStorage.setItem('admin_token', t)
    setToken(t)
  }
  const logout = () => {
    sessionStorage.removeItem('admin_token')
    setToken(null)
  }
  return { token, login, logout }
}

function RequireAdmin({ token, children }) {
  if (!token) return <Navigate to="/tnadmin2003/login" replace />
  return children
}

export default function App() {
  const { token, login, logout } = useAdminToken()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light')
    localStorage.setItem('theme', 'light')
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/success" element={<SuccessPage />} />

        <Route path="/tnadmin2003/login" element={<AdminLogin onLogin={login} loggedIn={!!token} />} />
        <Route
          path="/tnadmin2003"
          element={
            <RequireAdmin token={token}>
              <AdminLayout onLogout={logout} />
            </RequireAdmin>
          }
        >
          <Route path="dashboard" element={<AdminDashboard token={token} />} />
          <Route path="registrations" element={<RegistrationTable token={token} />} />
          <Route path="lucky-draw" element={<LuckyDraw token={token} />} />
          <Route path="winners" element={<WinnerPage token={token} />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
