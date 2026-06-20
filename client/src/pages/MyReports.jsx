import { Link } from 'react-router-dom';
import { Filter, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import { assetUrl, dashboardAPI, getErrorMessage } from '../services/api';

const statusOptions = ['all', 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'];

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await dashboardAPI.getReports({ status, search });
      setReports(response.data.data.reports);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load reports'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadReports, 250);
    return () => clearTimeout(timer);
  }, [status, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Complaint history</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">My reports</h1>
        </div>
        <Link to="/report" className="btn-primary">
          <Plus className="h-4 w-4" />
          New report
        </Link>
      </div>

      <div className="card grid gap-3 p-4 md:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-700" />
          <input className="input pl-10" placeholder="Search title, description, or location" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-700" />
          <select className="input pl-10" value={status} onChange={(event) => setStatus(event.target.value)}>
            {statusOptions.map((option) => <option key={option} value={option}>{option === 'all' ? 'All statuses' : option.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      {error && <EmptyState title="Reports unavailable" message={error} />}
      {loading && <div className="grid gap-4 md:grid-cols-2">{[1, 2, 3, 4].map((item) => <div key={item} className="h-56 animate-pulse rounded-lg bg-emerald-50" />)}</div>}
      {!loading && !reports.length && (
        <EmptyState title="No reports found" message="Try a different filter or submit a new cleanup request." action={<Link to="/report" className="btn-primary">Create report</Link>} />
      )}
      {!loading && reports.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {reports.map((report) => (
            <article key={report._id} className="card overflow-hidden">
              {report.images?.[0] ? (
                <img className="h-44 w-full object-cover" src={assetUrl(report.images[0])} alt={report.title} />
              ) : (
                <div className="grid h-44 place-items-center bg-emerald-50 text-sm font-bold text-emerald-700">No image</div>
              )}
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">{report.title}</h2>
                    <p className="mt-1 text-sm capitalize text-slate-500">{report.wasteType?.replace('_', ' ')}</p>
                  </div>
                  <StatusBadge status={report.status} />
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-slate-600">{report.description}</p>
                <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">Location:</span> {report.location?.address}
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  {report.rewardPointsEarned > 0 && <span className="text-emerald-700">+{report.rewardPointsEarned} points</span>}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReports;
