import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Clock3, Loader2, Plus, Recycle, Search, Trash2, Users } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { adminAPI, binAPI, getErrorMessage } from '../services/api';

const chartColors = ['#059669', '#0f766e', '#78b82a', '#f59e0b', '#ef4444'];
const statuses = ['all', 'pending', 'assigned', 'in_progress', 'completed', 'cancelled'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [bins, setBins] = useState([]);
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  const [binForm, setBinForm] = useState({ name: '', location: '', fillLevel: 0, status: 'active' });
  const [selectedCollectors, setSelectedCollectors] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const chartData = useMemo(() => {
    const reportStats = stats?.reports || {};
    return [
      { name: 'Pending', value: reportStats.pending || 0 },
      { name: 'Assigned', value: reportStats.assigned || 0 },
      { name: 'In Progress', value: reportStats.in_progress || 0 },
      { name: 'Resolved', value: reportStats.completed || 0 },
      { name: 'Cancelled', value: reportStats.cancelled || 0 }
    ].filter((item) => item.value > 0);
  }, [stats]);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, reportsRes, usersRes, collectorsRes, binsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getReports(filters),
        adminAPI.getUsers(),
        adminAPI.getCollectors(),
        binAPI.getBins()
      ]);
      setStats(statsRes.data.data);
      setReports(reportsRes.data.data.reports);
      setUsers(usersRes.data.data);
      setCollectors(collectorsRes.data.data);
      setBins(binsRes.data.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not load admin dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadAll, 250);
    return () => clearTimeout(timer);
  }, [filters.status, filters.search]);

  const updateReport = async (report, action) => {
    setBusy(true);
    setError('');
    try {
      if (action === 'assign') {
        await adminAPI.updateReportStatus(report._id, {
          status: 'assigned',
          collectorId: selectedCollectors[report._id]
        });
      } else if (action === 'in_progress') {
        await adminAPI.updateReportStatus(report._id, { status: 'in_progress' });
      } else if (action === 'completed') {
        await adminAPI.updateReportStatus(report._id, { status: 'completed' });
      } else if (action === 'cancelled') {
        await adminAPI.rejectReport(report._id, 'Cancelled from admin dashboard');
      }
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update report'));
    } finally {
      setBusy(false);
    }
  };

  const createBin = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await binAPI.createBin({ ...binForm, fillLevel: Number(binForm.fillLevel) });
      setBinForm({ name: '', location: '', fillLevel: 0, status: 'active' });
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create bin'));
    } finally {
      setBusy(false);
    }
  };

  const updateBinFill = async (bin, fillLevel) => {
    setBusy(true);
    try {
      await binAPI.updateBin(bin._id, { fillLevel: Number(fillLevel) });
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update bin'));
    } finally {
      setBusy(false);
    }
  };

  const deleteBin = async (bin) => {
    setBusy(true);
    try {
      await binAPI.deleteBin(bin._id);
      await loadAll();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not delete bin'));
    } finally {
      setBusy(false);
    }
  };

  if (loading && !stats) {
    return <div className="grid gap-4 md:grid-cols-4">{[1, 2, 3, 4].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-emerald-50" />)}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Admin dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Waste operations</h1>
        </div>
        {busy && <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700"><Loader2 className="h-4 w-4 animate-spin" />Updating</div>}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Recycle} label="Total reports" value={stats?.reports?.total} tone="emerald" />
        <StatCard icon={Clock3} label="Pending" value={stats?.reports?.pending} tone="amber" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats?.reports?.completed} tone="leaf" />
        <StatCard icon={Users} label="Users" value={stats?.users?.total} tone="teal" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-950">Report status</h2>
          </div>
          <div className="mt-6 h-72">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={100} paddingAngle={4}>
                    {chartData.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No chart data" message="Reports will appear here after submission." />
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">User management</h2>
          <div className="mt-5 max-h-72 overflow-auto rounded-lg border border-emerald-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50 text-xs uppercase text-emerald-800">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Verified</th>
                  <th className="px-4 py-3">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {users.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{item.name}<div className="text-xs font-normal text-slate-500">{item.email}</div></td>
                    <td className="px-4 py-3 capitalize">{item.role}</td>
                    <td className="px-4 py-3">{item.isVerified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">{item.rewardPoints || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-bold text-slate-950">Reports</h2>
          <div className="grid gap-3 md:grid-cols-[260px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-700" />
              <input className="input pl-10" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search reports" />
            </div>
            <select className="input" value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              {statuses.map((status) => <option key={status} value={status}>{status === 'all' ? 'All statuses' : status.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {reports.map((report) => (
            <div key={report._id} className="rounded-lg border border-emerald-100 p-4">
              <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-slate-950">{report.title}</h3>
                    <StatusBadge status={report.status} />
                    <span className="text-xs font-bold uppercase text-emerald-700">{report.wasteType}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{report.description}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">{report.location?.address} by {report.user?.name || 'Unknown user'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {report.status === 'pending' && (
                    <>
                      <select className="input w-48" value={selectedCollectors[report._id] || ''} onChange={(event) => setSelectedCollectors({ ...selectedCollectors, [report._id]: event.target.value })}>
                        <option value="">Select collector</option>
                        {collectors.map((collector) => <option key={collector.id} value={collector.id}>{collector.name}</option>)}
                      </select>
                      <button className="btn-secondary" onClick={() => updateReport(report, 'assign')} disabled={!selectedCollectors[report._id] || busy}>Assign</button>
                    </>
                  )}
                  {report.status === 'assigned' && <button className="btn-secondary" onClick={() => updateReport(report, 'in_progress')} disabled={busy}>Start</button>}
                  {report.status === 'in_progress' && <button className="btn-primary" onClick={() => updateReport(report, 'completed')} disabled={busy}>Resolve</button>}
                  {!['completed', 'cancelled'].includes(report.status) && <button className="btn-secondary border-red-200 text-red-700 hover:bg-red-50" onClick={() => updateReport(report, 'cancelled')} disabled={busy}>Cancel</button>}
                </div>
              </div>
            </div>
          ))}
          {!reports.length && <EmptyState title="No reports found" message="Submitted reports will appear here." />}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={createBin} className="card space-y-4 p-6">
          <h2 className="text-xl font-bold text-slate-950">Add managed bin</h2>
          <input className="input" placeholder="Bin name" required value={binForm.name} onChange={(event) => setBinForm({ ...binForm, name: event.target.value })} />
          <input className="input" placeholder="Location" required value={binForm.location} onChange={(event) => setBinForm({ ...binForm, location: event.target.value })} />
          <input className="input" type="number" min="0" max="100" value={binForm.fillLevel} onChange={(event) => setBinForm({ ...binForm, fillLevel: event.target.value })} />
          <select className="input" value={binForm.status} onChange={(event) => setBinForm({ ...binForm, status: event.target.value })}>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="full">Full</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-primary w-full" disabled={busy}>
            <Plus className="h-4 w-4" />
            Add bin
          </button>
        </form>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-slate-950">Database-managed bins</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {bins.map((bin) => (
              <div key={bin._id} className="rounded-lg border border-emerald-100 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950">{bin.name}</h3>
                    <p className="mt-1 text-sm text-slate-500">{bin.location}</p>
                  </div>
                  <StatusBadge status={bin.status} />
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>Fill level</span>
                    <span>{bin.fillLevel}%</span>
                  </div>
                  <input className="w-full accent-emerald-600" type="range" min="0" max="100" value={bin.fillLevel} onChange={(event) => updateBinFill(bin, event.target.value)} disabled={busy} />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>{new Date(bin.lastUpdated || bin.updatedAt).toLocaleString()}</span>
                  <button className="rounded-lg p-2 text-red-600 hover:bg-red-50" onClick={() => deleteBin(bin)} aria-label={`Delete ${bin.name}`} disabled={busy}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {!bins.length && <EmptyState title="No bins yet" message="Add database-driven bins to track fill levels from the admin dashboard." />}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
