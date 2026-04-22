import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api'
import { getLastUsedEmail, persistAuthSession, setLastUsedEmail } from '../auth'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState(() => getLastUsedEmail())
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      setLastUsedEmail(email)
      const response = await api.post('/auth/login/', { email, password })
      const { access, refresh, user } = response.data
      persistAuthSession({ access, refresh, user })
      if (onLogin) {
        onLogin(access, user.role)
      }
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/agent')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoAdmin = () => {
    setEmail('admin@agritrack.com')
    setPassword('admin123')
  }

  const fillDemoAgent = () => {
    setEmail('agent@agritrack.com')
    setPassword('agent123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center">
      <Link to="/" className="fixed top-6 left-6 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent hover:opacity-80">
        🌾 AgriTrack
      </Link>

      <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your AgriTrack account</p>
            <p className="text-sm text-slate-500 mt-2">Already have an account? Log in below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
              <input
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-4 py-3 text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-900/30 border border-red-700/50 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 py-3 font-semibold text-white hover:shadow-lg hover:shadow-sky-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-400 mb-4">Try demo accounts:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="rounded-lg bg-emerald-900/30 border border-emerald-700/50 px-3 py-2 text-sm text-emerald-300 hover:bg-emerald-900/50 transition"
              >
                Demo Admin
              </button>
              <button
                type="button"
                onClick={fillDemoAgent}
                className="rounded-lg bg-sky-900/30 border border-sky-700/50 px-3 py-2 text-sm text-sky-300 hover:bg-sky-900/50 transition"
              >
                Demo Agent
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 text-center">Click to fill demo credentials</p>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-slate-400">
              New to AgriTrack?{' '}
              <Link to="/" className="text-sky-400 hover:text-sky-300 font-semibold transition">
                Learn more
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          © 2026 AgriTrack. All rights reserved.
        </p>
      </div>
    </div>
  )
}
