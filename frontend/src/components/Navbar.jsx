import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar({ onLogout, token, role }) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userName = localStorage.getItem('agri_user_name') || 'User'
  const userEmail = localStorage.getItem('agri_user_email') || ''

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="text-xl font-bold text-slate-900">AgriTrack</span>
        </Link>
        <div className="flex items-center gap-6">
          {token && role === 'admin' && (
            <nav className="flex items-center gap-4">
              <Link to="/admin" className="text-slate-600 hover:text-emerald-600 font-medium transition">
                📊 Dashboard
              </Link>
              <Link to="/admin/fields" className="text-slate-600 hover:text-emerald-600 font-medium transition">
                🌾 Manage Fields
              </Link>
            </nav>
          )}
          {token && role === 'agent' && (
            <nav className="flex items-center gap-4">
              <Link to="/agent" className="text-slate-600 hover:text-sky-600 font-medium transition">
                📋 My Fields
              </Link>
            </nav>
          )}

          {/* User Menu */}
          {token && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                <span className="text-lg">👤</span>
                <span className="text-sm font-medium text-slate-700">{userName}</span>
                <span className="text-xs">{showUserMenu ? '▼' : '▶'}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-200">
                    <p className="text-sm font-semibold text-slate-900">{userName}</p>
                    <p className="text-xs text-slate-600">{userEmail}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Role: <span className="font-semibold">{role === 'admin' ? '👑 Administrator' : '👨‍🌾 Field Agent'}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onLogout()
                      setShowUserMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!token && (
            <Link to="/login" className="rounded-lg border-2 border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition">
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
