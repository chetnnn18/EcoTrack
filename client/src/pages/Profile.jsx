import { Loader2, Save, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authAPI, dashboardAPI, getErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState({ name: '', phone: '', address: '', avatar: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      avatar: user?.avatar || ''
    });
  }, [user]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await dashboardAPI.updateProfile(profile);
      await refreshUser();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not update profile'));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setChanging(true);
    setError('');
    setMessage('');
    try {
      await authAPI.changePassword(passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setMessage('Password changed successfully.');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not change password'));
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Account settings</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Profile</h1>
      </div>

      {(message || error) && (
        <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <form onSubmit={saveProfile} className="card space-y-5 p-6">
          <h2 className="text-xl font-bold text-slate-950">Personal information</h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" className="input mt-2" value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" className="input mt-2" value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="address">Address</label>
            <input id="address" className="input mt-2" value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="avatar">Avatar URL</label>
            <input id="avatar" className="input mt-2" value={profile.avatar} onChange={(event) => setProfile({ ...profile, avatar: event.target.value })} />
          </div>
          <button className="btn-primary" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save profile
          </button>
        </form>

        <form onSubmit={changePassword} className="card space-y-5 p-6">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-teal-700">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-950">Change password</h2>
          <div>
            <label className="label" htmlFor="currentPassword">Current password</label>
            <input id="currentPassword" className="input mt-2" type="password" required value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="newPassword">New password</label>
            <input id="newPassword" className="input mt-2" type="password" minLength={6} required value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} />
          </div>
          <button className="btn-secondary w-full" disabled={changing}>
            {changing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            Update password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
