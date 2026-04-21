import { useState } from 'react'
import api from '../api'

export default function UpdateForm({ field, onSuccess }) {
  const [stage, setStage] = useState(field.current_stage)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await api.post(`/fields/${field.id}/update/`, { stage, notes })
      setNotes('')
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit update')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700">Field</label>
        <p className="mt-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-800">{field.name}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Stage</label>
        <select
          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 focus:border-sky-500 focus:outline-none"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          <option>Planted</option>
          <option>Growing</option>
          <option>Ready</option>
          <option>Harvested</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Notes</label>
        <textarea
          className="mt-1 w-full rounded border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows="4"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full justify-center rounded bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Update'}
      </button>
    </form>
  )
}
