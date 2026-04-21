export default function FieldAnalytics({ field }) {
  if (!field) return null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Yield Metrics */}
        <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 p-4">
          <h4 className="text-sm font-semibold text-emerald-900">Yield Data</h4>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-700">Expected:</span>
              <span className="font-semibold text-emerald-900">{field.expected_yield_kg || '—'} kg</span>
            </div>
            {field.actual_yield_kg && (
              <div className="flex justify-between">
                <span className="text-emerald-700">Actual:</span>
                <span className="font-semibold text-emerald-900">{field.actual_yield_kg} kg</span>
              </div>
            )}
            {field.yield_efficiency && (
              <div className="flex justify-between border-t border-emerald-200 pt-2">
                <span className="text-emerald-700">Efficiency:</span>
                <span className="font-bold text-emerald-900">{field.yield_efficiency}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 p-4">
          <h4 className="text-sm font-semibold text-sky-900">Cost Analysis</h4>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-sky-700">Total Input Cost:</span>
              <span className="font-semibold text-sky-900">${field.total_input_cost}</span>
            </div>
            {field.area_hectares && (
              <div className="flex justify-between">
                <span className="text-sky-700">Cost per Hectare:</span>
                <span className="font-semibold text-sky-900">${field.cost_per_hectare}</span>
              </div>
            )}
            {field.area_hectares && (
              <div className="flex justify-between">
                <span className="text-sky-700">Area:</span>
                <span className="font-semibold text-sky-900">{field.area_hectares} ha</span>
              </div>
            )}
          </div>
        </div>

        {/* Growth Timeline */}
        <div className="rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 p-4">
          <h4 className="text-sm font-semibold text-amber-900">Timeline</h4>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-amber-700">Days Since Planting:</span>
              <span className="font-semibold text-amber-900">{field.days_since_planting} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">Current Stage:</span>
              <span className="font-semibold text-amber-900">{field.current_stage}</span>
            </div>
            {field.expected_harvest_date && (
              <div className="flex justify-between">
                <span className="text-amber-700">Expected Harvest:</span>
                <span className="font-semibold text-amber-900">{new Date(field.expected_harvest_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Soil Data */}
        {(field.soil_pH || field.soil_nitrogen_ppm || field.soil_phosphorus_ppm || field.soil_potassium_ppm) && (
          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <h4 className="text-sm font-semibold text-orange-900">Soil Data</h4>
            <div className="mt-3 space-y-2 text-sm">
              {field.soil_pH && (
                <div className="flex justify-between">
                  <span className="text-orange-700">pH Level:</span>
                  <span className="font-semibold text-orange-900">{field.soil_pH}</span>
                </div>
              )}
              {field.soil_nitrogen_ppm && (
                <div className="flex justify-between">
                  <span className="text-orange-700">Nitrogen:</span>
                  <span className="font-semibold text-orange-900">{field.soil_nitrogen_ppm} ppm</span>
                </div>
              )}
              {field.soil_phosphorus_ppm && (
                <div className="flex justify-between">
                  <span className="text-orange-700">Phosphorus:</span>
                  <span className="font-semibold text-orange-900">{field.soil_phosphorus_ppm} ppm</span>
                </div>
              )}
              {field.soil_potassium_ppm && (
                <div className="flex justify-between">
                  <span className="text-orange-700">Potassium:</span>
                  <span className="font-semibold text-orange-900">{field.soil_potassium_ppm} ppm</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Weather Data */}
        {(field.avg_rainfall_mm || field.avg_temperature_celsius) && (
          <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 p-4">
            <h4 className="text-sm font-semibold text-cyan-900">Weather</h4>
            <div className="mt-3 space-y-2 text-sm">
              {field.avg_rainfall_mm && (
                <div className="flex justify-between">
                  <span className="text-cyan-700">Avg Rainfall:</span>
                  <span className="font-semibold text-cyan-900">{field.avg_rainfall_mm} mm</span>
                </div>
              )}
              {field.avg_temperature_celsius && (
                <div className="flex justify-between">
                  <span className="text-cyan-700">Avg Temperature:</span>
                  <span className="font-semibold text-cyan-900">{field.avg_temperature_celsius}°C</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Activity History */}
      {field.activity_logs && field.activity_logs.length > 0 && (
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <h4 className="font-semibold text-slate-900">Recent Activities</h4>
          <div className="mt-3 space-y-2">
            {field.activity_logs.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex justify-between border-b border-slate-100 pb-2 text-sm last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{activity.activity_type}</p>
                  <p className="text-xs text-slate-500">{new Date(activity.activity_date).toLocaleDateString()}</p>
                </div>
                {activity.cost && <p className="font-semibold text-slate-900">${activity.cost}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
