const COLORS = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-slate-200 text-slate-700',
};
export default function StatusBadge({ status }) {
  return <span className={`badge ${COLORS[status] || 'bg-slate-100'}`}>{status}</span>;
}
