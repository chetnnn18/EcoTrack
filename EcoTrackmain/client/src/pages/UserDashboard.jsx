import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle2, Clock3, ClipboardList, Plus, Trophy } from 'lucide-react';
import StatCard from '../components/StatCard';
import EmptyState from '../components/EmptyState';
import { dashboardAPI } from '../services/api';
import { useAsync } from '../hooks/useAsync';

const UserDashboard = () => {
  const { data, loading, error } = useAsync(() => dashboardAPI.getDashboard(), []);
  const stats = data?.stats || {};
  const user = data?.user;

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-emerald-50" />)}</div>;
  }

  if (error) {
    return <EmptyState title="Dashboard unavailable" message={error} />;
  }

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-lg p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Welcome back</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">{user?.name || 'WasteWise user'}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Track report status, review recent activity, and submit new waste issues from one responsive dashboard.</p>
          </div>
          <Link to="/report" className="btn-primary">
            <Plus className="h-4 w-4" />
            New report
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ClipboardList} label="Total reports" value={stats.total} tone="emerald" />
        <StatCard icon={Clock3} label="Pending" value={stats.pending} tone="amber" />
        <StatCard icon={BarChart3} label="In progress" value={stats.in_progress + stats.assigned} tone="teal" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.completed} tone="leaf" />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">Activity overview</h2>
            <Link to="/reports" className="text-sm font-bold text-emerald-700">View reports</Link>
          </div>
          {data?.recentActivity?.length ? (
            <div className="mt-5 space-y-3">
              {data.recentActivity.map((item) => (
                <div key={item._id} className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-700">{item.description}</p>
                  <p className="text-sm font-bold text-emerald-700">+{item.amount}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No activity yet" message="Submit your first waste report to start building your cleanup history." />
          )}
        </div>

        <div className="card p-6">
          <div className="grid h-14 w-14 place-items-center rounded-lg bg-amber-50 text-amber-700">
            <Trophy className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-950">Reward standing</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">You have earned <span className="font-bold text-emerald-700">{user?.rewardPoints || 0}</span> points.</p>
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-500">Leaderboard rank</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950">#{data?.leaderboard?.position || '-'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;
