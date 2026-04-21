import { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import api from '../api'
import FieldCard from '../components/FieldCard'
import FieldAnalytics from '../components/FieldAnalytics'

export default function AdminDashboard() {
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [agentForm, setAgentForm] = useState({ email: '', full_name: '', password: '' })
  const [creatingAgent, setCreatingAgent] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fieldsRes, dashboardRes] = await Promise.all([
          api.get('/fields/'),
          api.get('/dashboard/'),
        ])
        setFields(fieldsRes.data)
        setDashboard(dashboardRes.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const statusChartData = dashboard
    ? [
        { name: 'Active', value: dashboard.status_counts?.Active || 0, fill: '#10b981' },
        { name: 'At Risk', value: dashboard.status_counts?.['At Risk'] || 0, fill: '#f59e0b' },
        { name: 'Completed', value: dashboard.status_counts?.Completed || 0, fill: '#3b82f6' },
      ]
    : []

  const yieldData = fields.slice(0, 8).map((f) => ({
    name: f.name.substring(0, 15),
    expected: f.expected_yield_kg || 0,
    actual: f.actual_yield_kg || 0,
  }))

  const costByFieldData = fields.slice(0, 10).map((f) => ({
    name: f.name.substring(0, 15),
    cost: f.total_input_cost,
    costPerHa: f.cost_per_hectare || 0,
  }))

  // Get admin user info from localStorage
  const adminName = localStorage.getItem('agri_user_name') || 'Administrator'
  const adminEmail = localStorage.getItem('agri_user_email') || 'admin@agritrack.com'

  const handleCreateAgent = async (e) => {
    e.preventDefault()
    setCreatingAgent(true)
    try {
      await api.post('/auth/create/', { ...agentForm, role: 'agent' })
      setAgentForm({ email: '', full_name: '', password: '' })
      setShowCreateAgent(false)
      alert('Agent created successfully!')
    } catch (error) {
      alert('Failed to create agent: ' + (error.response?.data?.detail || 'Unknown error'))
    } finally {
      setCreatingAgent(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Admin Header with Profile Info */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="mt-1 text-emerald-100">Welcome back, {adminName}</p>
              <p className="text-sm text-emerald-100/80">{adminEmail}</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateAgent(true)}
            className="rounded-lg bg-white text-emerald-700 px-6 py-2 font-semibold hover:bg-emerald-50 transition"
          >
            + Add Agent
          </button>
        </div>
      </div>

      {/* Admin Info Card */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-5 shadow-sm border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Admin Account</p>
              <p className="mt-2 text-xs text-purple-600">Full access</p>
            </div>
            <span className="text-3xl">👑</span>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-sm border border-green-200">
          <p className="text-sm font-medium text-green-700">System Status</p>
          <p className="mt-3 text-2xl font-bold text-green-900">Active</p>
          <p className="mt-2 text-xs text-green-600">All systems operational</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 shadow-sm border border-indigo-200">
          <p className="text-sm font-medium text-indigo-700">Users Registered</p>
          <p className="mt-3 text-2xl font-bold text-indigo-900">{dashboard?.total_agents || 0}</p>
          <p className="mt-2 text-xs text-indigo-600">Active agents</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-5 shadow-sm border border-orange-200">
          <p className="text-sm font-medium text-orange-700">Last Login</p>
          <p className="mt-3 text-sm font-bold text-orange-900">Today</p>
          <p className="mt-2 text-xs text-orange-600">Just now</p>
        </div>
      </div>

      {/* Main Dashboard Section Header */}
      <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-emerald-600">
        <h2 className="text-2xl font-bold text-slate-900">Farm Operations Overview</h2>
        <p className="mt-1 text-slate-600">Real-time monitoring of all fields and farm activities</p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-slate-500">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm border-l-4 border-blue-500">
              <p className="text-sm font-medium text-blue-700">Total Fields</p>
              <p className="mt-3 text-4xl font-bold text-blue-900">{dashboard?.total_fields}</p>
              <p className="mt-2 text-xs text-blue-600">📍 {dashboard?.total_area_hectares?.toFixed(2)} ha total area</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 shadow-sm border-l-4 border-emerald-500">
              <p className="text-sm font-medium text-emerald-700">Active Fields</p>
              <p className="mt-3 text-4xl font-bold text-emerald-900">{dashboard?.status_counts?.Active || 0}</p>
              <p className="mt-2 text-xs text-emerald-600">✓ Actively growing</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 shadow-sm border-l-4 border-amber-500">
              <p className="text-sm font-medium text-amber-700">At Risk</p>
              <p className="mt-3 text-4xl font-bold text-amber-900">{dashboard?.status_counts?.['At Risk'] || 0}</p>
              <p className="mt-2 text-xs text-amber-600">⚠️ Require attention</p>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-sky-50 to-sky-100 p-5 shadow-sm border-l-4 border-sky-500">
              <p className="text-sm font-medium text-sky-700">Total Investment</p>
              <p className="mt-3 text-4xl font-bold text-sky-900">${dashboard?.total_costs?.toFixed(2) || 0}</p>
              <p className="mt-2 text-xs text-sky-600">💰 Input expenses</p>
            </div>
          </div>

          {/* Additional Metrics Row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Avg Cost per Hectare</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">${(dashboard?.total_costs / (dashboard?.total_area_hectares || 1))?.toFixed(2) || 0}</p>
              <p className="mt-1 text-xs text-slate-500">Efficiency metric</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Total Expected Yield</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{fields.reduce((sum, f) => sum + (f.expected_yield_kg || 0), 0).toLocaleString()} kg</p>
              <p className="mt-1 text-xs text-slate-500">Projected harvest</p>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-700">Completed Fields</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{dashboard?.status_counts?.Completed || 0}</p>
              <p className="mt-1 text-xs text-slate-500">Harvested</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">📊 Analytics & Performance</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-6 shadow-sm border-t-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <span>📈</span> Expected vs Actual Yield
                </h3>
                <p className="mt-1 text-sm text-slate-600">Top 8 fields comparison</p>
                {yieldData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="expected" fill="#3b82f6" name="Expected (kg)" />
                      <Bar dataKey="actual" fill="#10b981" name="Actual (kg)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="mt-6 text-center text-sm text-slate-500">No yield data available</p>
                )}
              </div>

              <div className="rounded-xl bg-white p-6 shadow-sm border-t-4 border-emerald-500">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <span>📍</span> Field Status Distribution
                </h3>
                <p className="mt-1 text-sm text-slate-600">Current field statuses</p>
                {statusChartData.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={statusChartData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                        {statusChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="mt-24 text-center text-sm text-slate-500">No fields yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Cost Analysis Section */}
          <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-amber-500">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <span>💰</span> Input Costs by Field
            </h3>
            <p className="mt-1 text-sm text-slate-600">Top 10 fields investment analysis</p>
            {costByFieldData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={costByFieldData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                  <Bar dataKey="cost" fill="#f59e0b" name="Total Cost ($)" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="mt-6 text-center text-sm text-slate-500">No cost data available</p>
            )}
          </div>

          {/* Field Management Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">🌾 Field Management</h3>
              <span className="text-sm text-slate-600">{fields.length} fields total</span>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 mb-4">All Fields</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {fields.length > 0 ? (
                      fields.map((field) => (
                        <div key={field.id} onClick={() => setSelectedField(field)} className="cursor-pointer transform transition hover:scale-102">
                          <FieldCard field={field} clickable />
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-sm text-slate-500 py-8">No fields created yet</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Field Details Sidebar */}
              {selectedField ? (
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm border-l-4 border-emerald-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">📋 Field Details</h3>
                    <button
                      onClick={() => setSelectedField(null)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      ✕
                    </button>
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-700 mb-4">{selectedField.name}</h4>
                  <FieldAnalytics field={selectedField} />
                </div>
              ) : (
                <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm border-2 border-dashed border-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-5xl">👆</span>
                    <p className="mt-3 text-slate-600 font-medium">Click on a field to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Create Agent Modal */}
      {showCreateAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl border-t-4 border-emerald-600">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">👨‍🌾</span>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Register New Agent</h3>
                <p className="text-sm text-slate-600">Add a field agent to the system</p>
              </div>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={agentForm.email}
                  onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                  placeholder="agent@example.com"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={agentForm.full_name}
                  onChange={(e) => setAgentForm({ ...agentForm, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={agentForm.password}
                  onChange={(e) => setAgentForm({ ...agentForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum 8 characters recommended</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-4">
                <p className="text-xs text-emerald-800">
                  <span className="font-semibold">ℹ️ Agent Role:</span> Field agents can log updates, manage their assigned fields, and track activities.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateAgent(false)}
                  className="rounded-lg border-2 border-slate-300 px-5 py-2.5 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingAgent}
                  className="rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-2.5 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingAgent ? '⏳ Creating...' : '✓ Create Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
