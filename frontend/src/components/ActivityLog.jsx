import { useState } from 'react'
import api from '../api'

export default function ActivityLog({ field, onActivityLogged }) {
  const [activityType, setActivityType] = useState('Inspection')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [cost, setCost] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const activityTypes = [
    'Fertilizer Application',
    'Irrigation',
    'Pesticide/Herbicide',
    'Field Inspection',
    'Harvest',
    'Other',
  ]

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const payload = {
        activity_type: activityType,
        description,
        quantity: quantity || undefined,
        cost: cost ? parseFloat(cost) : undefined,
        activity_date: new Date().toISOString(),
      }
      await api.post(`/fields/${field.id}/activity/`, payload)
      setDescription('')
      setQuantity('')
      setCost('')
      onActivityLogged()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to log activity')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Activity Type</label>
        <select
          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 focus:border-sky-500 focus:outline-none"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
        >
          {activityTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          placeholder="Details about the activity..."
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700">Quantity</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 50kg, 100L"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Cost ($)</label>
          <input
            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="0.00"
            step="0.01"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Logging...' : 'Log Activity'}
      </button>
    </form>
  )
}
