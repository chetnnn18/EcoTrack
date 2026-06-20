import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form);
      navigate(location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to manage your reports and WasteWise operations.">
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input mt-2" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">Password</label>
            <Link className="text-sm font-semibold text-emerald-700 hover:text-emerald-900" to="/forgot-password">Forgot?</Link>
          </div>
          <input id="password" className="input mt-2" type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Login
        </button>
        <p className="text-center text-sm text-slate-600">
          New to WasteWise? <Link className="font-bold text-emerald-700" to="/register">Create an account</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
