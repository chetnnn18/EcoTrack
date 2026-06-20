import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-surface">
    <div className="container-page grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_460px]">
      <div className="hidden lg:block">
        <Link to="/">
          <Logo />
        </Link>
        <div className="mt-12 max-w-xl">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-700">Software-first waste management</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight text-slate-950">
            Cleaner reporting, faster resolution, greener neighborhoods.
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            WasteWise helps residents submit reports, upload evidence, track progress, and gives admins the tools to coordinate every cleanup.
          </p>
        </div>
      </div>
      <div className="glass-panel rounded-lg p-6 sm:p-8">
        <Link to="/" className="mb-8 inline-flex lg:hidden">
          <Logo />
        </Link>
        <h2 className="text-3xl font-extrabold text-slate-950">{title}</h2>
        {subtitle && <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
