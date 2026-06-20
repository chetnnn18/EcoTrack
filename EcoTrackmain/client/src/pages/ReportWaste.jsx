import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Loader2, MapPin, Send } from 'lucide-react';
import { dashboardAPI, getErrorMessage, uploadAPI } from '../services/api';

const categories = [
  ['plastic', 'Plastic'],
  ['paper', 'Paper'],
  ['glass', 'Glass'],
  ['metal', 'Metal'],
  ['organic', 'Organic'],
  ['electronic', 'Electronic Waste'],
  ['mixed', 'Mixed Waste']
];

const weights = [
  ['less_than_5kg', 'Less than 5 kg'],
  ['5_to_10kg', '5 to 10 kg'],
  ['10_to_20kg', '10 to 20 kg'],
  ['more_than_20kg', 'More than 20 kg']
];

const ReportWaste = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    wasteType: 'plastic',
    estimatedWeight: 'less_than_5kg',
    address: ''
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      let images = [];
      if (files.length) {
        const uploadResponse = await uploadAPI.uploadImages(files);
        images = uploadResponse.data.data.urls;
      }

      await dashboardAPI.createReport({
        ...form,
        location: { address: form.address },
        images
      });
      navigate('/reports');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not submit report'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Report waste</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Submit a cleanup request</h1>
      </div>

      <form onSubmit={submit} className="card space-y-6 p-6">
        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" className="input mt-2" required maxLength={100} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="wasteType">Category</label>
            <select id="wasteType" className="input mt-2" value={form.wasteType} onChange={(event) => setForm({ ...form, wasteType: event.target.value })}>
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="description">Description</label>
          <textarea id="description" className="input mt-2 min-h-32" required maxLength={500} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="estimatedWeight">Estimated weight</label>
            <select id="estimatedWeight" className="input mt-2" value={form.estimatedWeight} onChange={(event) => setForm({ ...form, estimatedWeight: event.target.value })}>
              {weights.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="address">Location</label>
            <div className="relative mt-2">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-emerald-700" />
              <input id="address" className="input pl-10" required value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Street, area, landmark" />
            </div>
          </div>
        </div>

        <div>
          <label className="label" htmlFor="images">Images</label>
          <label htmlFor="images" className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-emerald-200 bg-emerald-50/60 px-6 py-10 text-center transition hover:bg-emerald-50">
            <Camera className="h-8 w-8 text-emerald-700" />
            <span className="mt-3 text-sm font-bold text-slate-800">Upload up to 5 images</span>
            <span className="mt-1 text-xs text-slate-500">{files.length ? files.map((file) => file.name).join(', ') : 'JPEG, PNG, GIF, or WebP'}</span>
          </label>
          <input id="images" className="sr-only" type="file" accept="image/*" multiple onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 5))} />
        </div>

        <div className="flex justify-end">
          <button className="btn-primary" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Submit report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportWaste;
