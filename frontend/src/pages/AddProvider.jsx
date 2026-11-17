import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const AddProvider = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    aadhaarNumber: '',
    profession: '',
    cost: '',
  });
  const [slots, setSlots] = useState([
    { date: '', startTime: '', endTime: '', available: true },
  ]);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlotChange = (index, field, value) => {
    setSlots((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addSlot = () => {
    setSlots((prev) => [...prev, { date: '', startTime: '', endTime: '', available: true }]);
  };

  const removeSlot = (index) => {
    setSlots((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setMessage(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      Array.from(images).forEach((file) => formData.append('images', file));

      const filteredSlots = slots.filter((slot) => slot.date && slot.startTime && slot.endTime);
      formData.append('timeSlots', JSON.stringify(filteredSlots));

      await api.post('/providers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage({ type: 'success', text: 'Provider added successfully!' });
      setForm({ name: '', email: '', phoneNumber: '', aadhaarNumber: '', profession: '', cost: '' });
      setSlots([{ date: '', startTime: '', endTime: '', available: true }]);
      setImages([]);

      setTimeout(() => navigate('/providers'), 1200);
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'error',
        text: err?.response?.data?.message || 'Failed to add provider. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-slate-900">Add a service provider</h1>
        <p className="mt-2 text-sm text-slate-500">
          Share accurate details, upload work snapshots, and add available time slots. Your provider profile will be
          instantly visible to customers.
        </p>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-600'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-slate-600">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaarNumber"
                value={form.aadhaarNumber}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Profession</label>
              <input
                type="text"
                name="profession"
                value={form.profession}
                onChange={handleChange}
                required
                placeholder="e.g. Electrician"
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Cost (₹)</label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Work Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setImages(event.target.files)}
              className="mt-1 w-full rounded-xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-primary"
            />
            <p className="mt-2 text-xs text-slate-400">Upload up to 5 images showcasing past work or identity.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Available Time Slots</label>
              <button
                type="button"
                onClick={addSlot}
                className="text-sm font-semibold text-primary hover:underline"
              >
                + Add slot
              </button>
            </div>

            {slots.map((slot, index) => (
              <div key={index} className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[1fr,1fr,1fr,auto]">
                <input
                  type="date"
                  value={slot.date}
                  onChange={(event) => handleSlotChange(index, 'date', event.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(event) => handleSlotChange(index, 'startTime', event.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(event) => handleSlotChange(index, 'endTime', event.target.value)}
                  required
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="text-sm font-semibold text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {submitting ? 'Saving...' : 'Save Provider'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProvider;

