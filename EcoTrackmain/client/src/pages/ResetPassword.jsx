import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { authAPI, getErrorMessage } from '../services/api';

const ResetPassword = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: params.get('email') || '', otp: params.get('otp') || '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.resetPassword(form);
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to reset password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Set new password" subtitle="Use your reset OTP and choose a secure password.">
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {params.get('otp') && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Development OTP: {params.get('otp')}
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input mt-2" type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="otp">OTP</label>
          <input id="otp" className="input mt-2" inputMode="numeric" maxLength={6} minLength={6} required value={form.otp} onChange={(event) => setForm({ ...form, otp: event.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input id="newPassword" className="input mt-2" type="password" minLength={6} required value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
          Reset password
        </button>
        <p className="text-center text-sm text-slate-600">
          Remembered it? <Link className="font-bold text-emerald-700" to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
