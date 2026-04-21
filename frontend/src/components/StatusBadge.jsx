export default function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-800',
    'At Risk': 'bg-amber-100 text-amber-800',
    Completed: 'bg-sky-100 text-sky-800',
  }
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${styles[status] || 'bg-slate-100 text-slate-800'}`}>
      {status}
    </span>
  )
}
