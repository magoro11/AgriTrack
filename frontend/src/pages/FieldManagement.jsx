import { useState } from 'react'
import api from '../api'

export default function FieldManagement() {
  const [formData, setFormData] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    expected_harvest_date: '',
    location: '',
    area_hectares: '',
    assigned_agent_id: '',
    soil_pH: '',
    soil_nitrogen_ppm: '',
    soil_phosphorus_ppm: '',
    soil_potassium_ppm: '',
    avg_rainfall_mm: '',
    avg_temperature_celsius: '',
    expected_yield_kg: '',
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agents, setAgents] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setIsSubmitting(true)

    const payload = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
    )

    if (formData.assigned_agent_id) {
      payload.assigned_agent_id = parseInt(formData.assigned_agent_id)
    }

    try {
      await api.post('/fields/', payload)
      setSuccess(true)
      setFormData({
        name: '',
        crop_type: '',
        planting_date: '',
        expected_harvest_date: '',
        location: '',
        area_hectares: '',
        assigned_agent_id: '',
        soil_pH: '',
        soil_nitrogen_ppm: '',
        soil_phosphorus_ppm: '',
        soil_potassium_ppm: '',
        avg_rainfall_mm: '',
        avg_temperature_celsius: '',
        expected_yield_kg: '',
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create field')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Create New Field</h1>
        <p className="mt-1 text-slate-600">Add a new field to the system with detailed crop and soil information</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">Field created successfully!</div>}

          {/* Basic Information */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Basic Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Field Name *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Crop Type *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  name="crop_type"
                  value={formData.crop_type}
                  onChange={handleChange}
                  placeholder="e.g., Wheat, Corn, Rice"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Location</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., North Field, Plot 5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Assigned Agent</label>
                <select
                  className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 focus:border-sky-500 focus:outline-none"
                  name="assigned_agent_id"
                  value={formData.assigned_agent_id}
                  onChange={handleChange}
                >
                  <option value="">Select an agent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Planting & Harvest</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Planting Date *</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="date"
                  name="planting_date"
                  value={formData.planting_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Expected Harvest Date</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="date"
                  name="expected_harvest_date"
                  value={formData.expected_harvest_date}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Field Metrics */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Field Metrics</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Area (hectares)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  step="0.01"
                  name="area_hectares"
                  value={formData.area_hectares}
                  onChange={handleChange}
                  placeholder="1.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Expected Yield (kg)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  name="expected_yield_kg"
                  value={formData.expected_yield_kg}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Soil Data */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Soil Data</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">pH Level</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  step="0.1"
                  name="soil_pH"
                  value={formData.soil_pH}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Nitrogen (ppm)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  name="soil_nitrogen_ppm"
                  value={formData.soil_nitrogen_ppm}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phosphorus (ppm)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  name="soil_phosphorus_ppm"
                  value={formData.soil_phosphorus_ppm}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Potassium (ppm)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  name="soil_potassium_ppm"
                  value={formData.soil_potassium_ppm}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Weather Data */}
          <div className="pb-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Weather Data</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Avg Rainfall (mm)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  name="avg_rainfall_mm"
                  value={formData.avg_rainfall_mm}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Avg Temperature (°C)</label>
                <input
                  className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
                  type="number"
                  step="0.1"
                  name="avg_temperature_celsius"
                  value={formData.avg_temperature_celsius}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded bg-sky-600 px-4 py-3 font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Creating Field...' : 'Create Field'}
          </button>
        </form>
      </div>
    </div>
  )
}
