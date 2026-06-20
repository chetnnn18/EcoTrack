import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2 } from 'lucide-react';
import { useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import { authAPI, getErrorMessage } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.forgotPassword(email);
      const devOtp = response.data?.data?.devOtp;
      const otpParam = devOtp ? `&otp=${encodeURIComponent(devOtp)}` : '';
      navigate(`/reset-password?email=${encodeURIComponent(email)}${otpParam}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to send reset OTP'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset password" subtitle="Request a one-time password to set a new login password.">
      <form onSubmit={submit} className="space-y-5">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input mt-2" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
          Send reset OTP
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
