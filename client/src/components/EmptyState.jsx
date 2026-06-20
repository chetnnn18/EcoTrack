import { Sprout } from 'lucide-react';

const EmptyState = ({ title, message, action }) => (
  <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
      <Sprout className="h-7 w-7" />
    </div>
    <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
    {message && <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">{message}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
