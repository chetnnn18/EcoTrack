import { Leaf } from 'lucide-react';

const Logo = ({ compact = false }) => (
  <div className="flex items-center gap-3">
    <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-600 text-white shadow-sm">
      <Leaf className="h-5 w-5" />
    </div>
    {!compact && (
      <div>
        <p className="text-lg font-extrabold text-slate-950">WasteWise</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Clean city ops</p>
      </div>
    )}
  </div>
);

export default Logo;
