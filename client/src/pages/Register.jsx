import { Link, useNavigate } from 'react-router-dom';
import { Loader2, UserPlus } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { authAPI, getErrorMessage } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(form);
      const devOtp = response.data?.data?.devOtp;
      const otpParam = devOtp ? `&otp=${encodeURIComponent(devOtp)}` : '';
      navigate(`/verify-otp?email=${encodeURIComponent(form.email)}${otpParam}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Register to submit and track waste reports.">
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input id="name" className="input mt-2" required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input mt-2" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input id="phone" className="input mt-2" inputMode="numeric" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" className="input mt-2" type="password" minLength={6} required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Register
        </button>
        <p className="text-center text-sm text-slate-600">
          Already registered? <Link className="font-bold text-emerald-700" to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
