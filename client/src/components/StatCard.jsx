const StatCard = ({ icon: Icon, label, value, tone = 'emerald' }) => {
  const toneClasses = {
    emerald: 'bg-emerald-50 text-emerald-700',
    teal: 'bg-teal-50 text-teal-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-red-50 text-red-700',
    leaf: 'bg-lime-50 text-lime-700'
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-950">{value ?? 0}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-lg ${toneClasses[tone] || toneClasses.emerald}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
