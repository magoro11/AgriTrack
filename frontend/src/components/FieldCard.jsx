import StatusBadge from './StatusBadge'

export default function FieldCard({ field, clickable }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all ${clickable ? 'cursor-pointer hover:border-sky-400 hover:shadow-md' : ''}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">{field.crop_type}</p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">{field.name}</h3>
          <p className="text-xs text-slate-500 mt-1">{field.location || 'No location'}</p>
        </div>
        <StatusBadge status={field.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
        <div className="text-xs">
          <p className="text-slate-500 font-medium">Stage</p>
          <p className="text-slate-900 font-semibold text-sm mt-1">{field.current_stage}</p>
        </div>
        <div className="text-xs">
          <p className="text-slate-500 font-medium">Days</p>
          <p className="text-slate-900 font-semibold text-sm mt-1">{field.days_since_planting} days</p>
        </div>
        {field.area_hectares && (
          <div className="text-xs">
            <p className="text-slate-500 font-medium">Area</p>
            <p className="text-slate-900 font-semibold text-sm mt-1">{field.area_hectares} ha</p>
          </div>
        )}
        {field.total_input_cost > 0 && (
          <div className="text-xs">
            <p className="text-slate-500 font-medium">Cost/ha</p>
            <p className="text-slate-900 font-semibold text-sm mt-1">${field.cost_per_hectare}</p>
          </div>
        )}
      </div>

      {(field.expected_yield_kg || field.actual_yield_kg) && (
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-600">Expected Yield:</span>
            <span className="font-semibold text-slate-900">{field.expected_yield_kg || '—'} kg</span>
          </div>
          {field.actual_yield_kg && (
            <div className="flex justify-between">
              <span className="text-slate-600">Actual Yield:</span>
              <span className="font-semibold text-emerald-700">{field.actual_yield_kg} kg</span>
            </div>
          )}
          {field.yield_efficiency && (
            <div className="flex justify-between">
              <span className="text-slate-600">Efficiency:</span>
              <span className="font-semibold text-sky-700">{field.yield_efficiency}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
