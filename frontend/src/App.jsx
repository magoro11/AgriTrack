import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import FieldManagement from './pages/FieldManagement'
import Navbar from './components/Navbar'
import { clearStoredAuth, getStoredAuth } from './auth'
import { refreshAccessToken } from './api'

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => getStoredAuth().accessToken)
  const [role, setRole] = useState(() => getStoredAuth().role)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const restoreSession = async () => {
      const { accessToken, refreshToken, role: storedRole } = getStoredAuth()

      if (accessToken && storedRole) {
        if (isMounted) {
          setToken(accessToken)
          setRole(storedRole)
          setAuthReady(true)
        }
        return
      }

      if (refreshToken && storedRole) {
        try {
          const nextAccessToken = await refreshAccessToken()
          if (isMounted) {
            setToken(nextAccessToken)
            setRole(storedRole)
          }
        } catch (error) {
          clearStoredAuth()
          if (isMounted) {
            setToken(null)
            setRole(null)
          }
        }
      }

      if (isMounted) {
        setAuthReady(true)
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogout = () => {
    clearStoredAuth()
    setToken(null)
    setRole(null)
    navigate('/login')
  }

  const handleLogin = (accessToken, userRole) => {
    setToken(accessToken)
    setRole(userRole)
  }

  // Protected route wrapper with navbar
  const ProtectedRoute = ({ element, allowedRole }) => {
    if (!authReady) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
          Restoring your session...
        </div>
      )
    }

    if (!token) return <Navigate to="/login" />
    if (allowedRole && role !== allowedRole) return <Navigate to="/login" />

    return (
      <>
        <Navbar onLogout={handleLogout} token={token} role={role} />
        <div className="container mx-auto px-4 py-6">
          {element}
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={authReady && token ? <Navigate to={role === 'admin' ? '/admin' : '/agent'} /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />} />
        <Route path="/admin/fields" element={<ProtectedRoute element={<FieldManagement />} allowedRole="admin" />} />
        <Route path="/agent" element={<ProtectedRoute element={<AgentDashboard />} allowedRole="agent" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
