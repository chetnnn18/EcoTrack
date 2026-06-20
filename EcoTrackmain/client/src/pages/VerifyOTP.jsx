import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { authAPI, getErrorMessage } from '../services/api';

const VerifyOTP = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get('email') || '');
  const [otp, setOtp] = useState(params.get('otp') || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authAPI.verifyOTP({ email, otp });
      navigate('/login');
    } catch (err) {
      setError(getErrorMessage(err, 'OTP verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setMessage('');
    try {
      const response = await authAPI.resendOTP(email);
      const devOtp = response.data?.data?.devOtp;
      if (devOtp) setOtp(devOtp);
      setMessage(devOtp ? `A new development OTP has been generated: ${devOtp}` : 'A new OTP has been sent.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not resend OTP'));
    }
  };

  return (
    <AuthLayout title="Verify email" subtitle="Enter the 6-digit OTP sent to your inbox.">
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}
        {params.get('otp') && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            Development OTP: {params.get('otp')}
          </div>
        )}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input mt-2" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="otp">OTP</label>
          <input id="otp" className="input mt-2 text-center text-xl font-bold tracking-[0.35em]" inputMode="numeric" maxLength={6} minLength={6} required value={otp} onChange={(event) => setOtp(event.target.value)} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
          Verify
        </button>
        <div className="flex items-center justify-between text-sm">
          <button type="button" onClick={resend} className="font-bold text-emerald-700">Resend OTP</button>
          <Link className="font-semibold text-slate-600" to="/login">Back to login</Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOTP;
