import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import FieldManagement from './pages/FieldManagement'
import Navbar from './components/Navbar'

function App() {
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('agri_access_token'))
  const [role, setRole] = useState(localStorage.getItem('agri_user_role'))

  const handleLogout = () => {
    localStorage.removeItem('agri_access_token')
    localStorage.removeItem('agri_user_role')
    localStorage.removeItem('agri_user_email')
    localStorage.removeItem('agri_user_name')
    setToken(null)
    setRole(null)
    navigate('/login')
  }

  const handleLogin = (accessToken, userRole) => {
    localStorage.setItem('agri_access_token', accessToken)
    localStorage.setItem('agri_user_role', userRole)
    setToken(accessToken)
    setRole(userRole)
  }

  // Protected route wrapper with navbar
  const ProtectedRoute = ({ element }) => {
    if (!token) return <Navigate to="/login" />
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
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/admin" element={token && role === 'admin' ? <ProtectedRoute element={<AdminDashboard />} /> : <Navigate to="/login" />} />
        <Route path="/admin/fields" element={token && role === 'admin' ? <ProtectedRoute element={<FieldManagement />} /> : <Navigate to="/login" />} />
        <Route path="/agent" element={token && role === 'agent' ? <ProtectedRoute element={<AgentDashboard />} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
