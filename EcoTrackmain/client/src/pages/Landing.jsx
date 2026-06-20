import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, CheckCircle2, Leaf, Recycle, ShieldCheck, UploadCloud } from 'lucide-react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const stats = [
  ['7', 'waste categories'],
  ['24/7', 'report tracking'],
  ['100%', 'software managed']
];

const features = [
  { icon: UploadCloud, title: 'Image-backed reports', text: 'Residents submit waste evidence, location details, and descriptions in one focused flow.' },
  { icon: BarChart3, title: 'Operational analytics', text: 'Admins monitor pending, active, and resolved reports with live database-backed metrics.' },
  { icon: ShieldCheck, title: 'JWT-secured access', text: 'Role-aware dashboards keep user and admin workflows separated and protected.' }
];

const Landing = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="container-page flex h-20 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link className="btn-secondary" to="/login">Login</Link>
          <Link className="btn-primary" to="/register">Register</Link>
        </nav>
      </header>

      <main>
        <section className="container-page grid min-h-[calc(100vh-5rem)] items-center gap-10 pb-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 text-sm font-bold text-emerald-700 shadow-sm">
              <Leaf className="h-4 w-4" />
              Sustainable city reporting
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-950 sm:text-6xl">
              WasteWise
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-650 text-slate-600">
              A modern MERN platform for reporting waste, managing complaints, tracking cleanup status, and turning community action into measurable progress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary">
                Start reporting
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/login" className="btn-secondary">Open dashboard</Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
                  <p className="text-2xl font-extrabold text-emerald-700">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="relative">
            <img
              className="h-[540px] w-full rounded-lg object-cover shadow-soft"
              src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80"
              alt="Recycling bins and sorted waste containers"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/70 bg-white/80 p-5 shadow-soft backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white">
                  <Recycle className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-950">Report, review, resolve.</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Every report becomes a tracked database record with images, location, category, status, and admin visibility.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-emerald-100 bg-white py-16">
          <div className="container-page grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-lg border border-emerald-100 p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-950">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container-page py-16">
          <div className="rounded-lg bg-emerald-700 p-8 text-white shadow-soft sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-emerald-100">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-wide">Responsive web operations</span>
                </div>
                <h2 className="mt-4 text-3xl font-extrabold">Built for responsive web operations.</h2>
              </div>
              <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50">
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
