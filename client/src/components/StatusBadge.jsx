const statusStyles = {
  pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  assigned: 'bg-teal-100 text-teal-800 ring-teal-200',
  in_progress: 'bg-sky-100 text-sky-800 ring-sky-200',
  completed: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  cancelled: 'bg-red-100 text-red-800 ring-red-200',
  active: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  full: 'bg-red-100 text-red-800 ring-red-200',
  maintenance: 'bg-amber-100 text-amber-800 ring-amber-200',
  inactive: 'bg-slate-100 text-slate-700 ring-slate-200'
};

const labels = {
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Resolved',
  cancelled: 'Cancelled',
  active: 'Active',
  full: 'Full',
  maintenance: 'Maintenance',
  inactive: 'Inactive'
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusStyles[status] || statusStyles.inactive}`}>
    {labels[status] || status}
  </span>
);

export default StatusBadge;
