import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, Menu, Recycle, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/report', label: 'Report Waste', icon: Recycle },
  { to: '/reports', label: 'My Reports', icon: ClipboardList },
  { to: '/profile', label: 'Profile', icon: UserRound }
];

const adminLinks = [
  { to: '/admin', label: 'Admin', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: UserRound }
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = user?.role === 'admin' ? adminLinks : userLinks;

  const signOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/85 backdrop-blur-xl">
        <div className="container-page flex h-16 items-center justify-between">
          <NavLink to={user?.role === 'admin' ? '/admin' : '/dashboard'} aria-label="WasteWise home">
            <Logo />
          </NavLink>
          <button className="btn-secondary px-3 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <nav className="hidden items-center gap-2 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button onClick={signOut} className="btn-secondary ml-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
        {open && (
          <nav className="container-page grid gap-2 pb-4 md:hidden">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                    isActive ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button onClick={signOut} className="btn-secondary justify-start">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        )}
      </header>
      <main className="container-page py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
