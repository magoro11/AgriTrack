import { useEffect, useState } from 'react'
import api from '../api'
import FieldCard from '../components/FieldCard'
import UpdateForm from '../components/UpdateForm'
import ActivityLog from '../components/ActivityLog'
import FieldAnalytics from '../components/FieldAnalytics'

export default function AgentDashboard() {
  const [fields, setFields] = useState([])
  const [selectedField, setSelectedField] = useState(null)
  const [activeTab, setActiveTab] = useState('update') // 'update' or 'activity'
  const [loading, setLoading] = useState(true)

  // Get agent user info from localStorage
  const agentName = localStorage.getItem('agri_user_name') || 'Field Agent'
  const agentEmail = localStorage.getItem('agri_user_email') || 'agent@agritrack.com'

  useEffect(() => {
    const loadFields = async () => {
      try {
        const response = await api.get('/fields/')
        setFields(response.data)
        if (response.data.length > 0) {
          setSelectedField(response.data[0])
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadFields()
  }, [])

  const handleUpdateComplete = async () => {
    const response = await api.get('/fields/')
    setFields(response.data)
    const updated = response.data.find((f) => f.id === selectedField.id)
    setSelectedField(updated)
  }

  const handleActivityLogged = async () => {
    const response = await api.get(`/fields/${selectedField.id}/`)
    setSelectedField(response.data)
  }

  return (
    <div className="space-y-6">
      {/* Agent Header with Profile Info */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Field Agent Dashboard</h1>
              <p className="mt-1 text-sky-100">Welcome, {agentName}</p>
              <p className="text-sm text-sky-100/80">{agentEmail}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-sky-100/80">Your Role</p>
            <p className="text-2xl font-bold">👨‍🌾 Field Agent</p>
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-5 shadow-sm border border-blue-200">
          <p className="text-sm font-medium text-blue-700">Assigned Fields</p>
          <p className="mt-3 text-4xl font-bold text-blue-900">{fields.length}</p>
          <p className="mt-2 text-xs text-blue-600">📋 Total fields</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 shadow-sm border border-emerald-200">
          <p className="text-sm font-medium text-emerald-700">Active Fields</p>
          <p className="mt-3 text-4xl font-bold text-emerald-900">{fields.filter(f => f.status === 'Active').length}</p>
          <p className="mt-2 text-xs text-emerald-600">✓ Currently growing</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-5 shadow-sm border border-amber-200">
          <p className="text-sm font-medium text-amber-700">Pending Updates</p>
          <p className="mt-3 text-4xl font-bold text-amber-900">{fields.filter(f => !f.actual_yield_kg).length}</p>
          <p className="mt-2 text-xs text-amber-600">⚠️ Need attention</p>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-5 shadow-sm border border-green-200">
          <p className="text-sm font-medium text-green-700">Total Coverage</p>
          <p className="mt-3 text-4xl font-bold text-green-900">{fields.reduce((sum, f) => sum + (f.area_hectares || 0), 0).toFixed(1)} ha</p>
          <p className="mt-2 text-xs text-green-600">🌾 Area managed</p>
        </div>
      </div>

      {/* Main Work Section */}
      <div className="rounded-xl bg-white p-6 shadow-sm border-l-4 border-sky-600">
        <h2 className="text-2xl font-bold text-slate-900">Field Management</h2>
        <p className="mt-1 text-slate-600">Select a field to update status or log activities</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Fields List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📍</span> Your Assigned Fields
            </h3>
            <span className="text-sm text-slate-600">({fields.length} total)</span>
          </div>
          {loading ? (
            <div className="rounded-xl bg-white p-6 shadow-sm text-center">
              <p className="text-slate-500">⏳ Loading fields...</p>
            </div>
          ) : fields.length === 0 ? (
            <div className="rounded-xl bg-white p-8 shadow-sm text-center border-2 border-dashed border-slate-300">
              <span className="text-5xl">🌾</span>
              <p className="text-slate-500 mt-3 font-medium">No fields assigned yet.</p>
              <p className="text-sm text-slate-400 mt-1">Check back later for assigned fields</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field) => (
                <div
                  key={field.id}
                  onClick={() => {
                    setSelectedField(field)
                    setActiveTab('update')
                  }}
                  className={`cursor-pointer transition-all transform hover:scale-102 ${selectedField?.id === field.id ? 'ring-2 ring-sky-500 shadow-lg' : 'hover:shadow-md'}`}
                >
                  <FieldCard field={field} clickable />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Management Panel */}
        <div className="space-y-4">
          {selectedField ? (
            <>
              <div className="rounded-xl bg-white shadow-sm border-t-4 border-sky-500">
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab('update')}
                    className={`flex-1 px-4 py-3 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'update'
                        ? 'border-b-2 border-sky-500 text-sky-600 bg-sky-50'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📊</span> Update Stage
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`flex-1 px-4 py-3 text-center font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === 'activity'
                        ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>📝</span> Log Activity
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === 'update' ? (
                    <div>
                      <h3 className="mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>📊</span> Update Field Stage
                      </h3>
                      <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 mb-4 text-sm text-sky-800">
                        <p><strong>Current Field:</strong> {selectedField.name}</p>
                        <p><strong>Status:</strong> {selectedField.status || 'Not set'}</p>
                      </div>
                      <UpdateForm field={selectedField} onSuccess={handleUpdateComplete} />
                    </div>
                  ) : (
                    <div>
                      <h3 className="mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
                        <span>📝</span> Log Field Activity
                      </h3>
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mb-4 text-sm text-emerald-800">
                        <p><strong>Current Field:</strong> {selectedField.name}</p>
                        <p><strong>Area:</strong> {selectedField.area_hectares} ha</p>
                      </div>
                      <ActivityLog field={selectedField} onActivityLogged={handleActivityLogged} />
                    </div>
                  )}
                </div>
              </div>

              {/* Field Analytics */}
              <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-sm border-l-4 border-emerald-500">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📈</span> Field Metrics
                </h3>
                <FieldAnalytics field={selectedField} />
              </div>
            </>
          ) : (
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-8 shadow-sm border-2 border-dashed border-slate-300 flex items-center justify-center min-h-96">
              <div className="text-center">
                <span className="text-6xl">👆</span>
                <p className="text-slate-700 font-bold mt-3">Select a field to begin</p>
                <p className="text-sm text-slate-600 mt-2">Choose from your assigned fields on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
