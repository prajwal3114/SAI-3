import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api, { assetUrl } from '../api/axios.js';
import BookingModal from '../components/BookingModal.jsx';
import ReviewSection from '../components/ReviewSection.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const ProviderProfile = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProvider = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/providers/${id}`);
      setProvider(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load provider details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProvider();
  }, [fetchProvider]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (!isAuthenticated) {
      setError('Login required to add a review.');
      return;
    }
    setReviewLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/providers/${id}/reviews`, { rating, comment });
      setProvider(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewLoading(false);
    }
  };

  const confirmBooking = async (slotId) => {
    if (!slotId) return;
    setBookingLoading(true);
    setError(null);
    try {
      await api.post(`/providers/${id}/book`, { slotId });
      setBookingModal(false);
      fetchProvider();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <span className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!provider) return null;

  const availableSlots = provider.timeSlots?.filter((slot) => slot.available !== false) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-1/2">
              <div className="grid grid-cols-2 gap-3">
                {(provider.images?.length ? provider.images : ['/uploads/seed/service.png']).map((image, index) => {
                  const imageSrc = assetUrl(image);
                  return (
                  <img
                    key={`${image}-${index}`}
                    src={imageSrc}
                    alt={provider.profession}
                    className="h-40 w-full rounded-2xl object-cover"
                  />
                  );
                })}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
                  Verified Professional
                </span>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">{provider.name}</h1>
                <p className="text-sm text-slate-500">{provider.profession}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-600">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 17.27 6.18 3.64-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.64L5.82 21z" />
                  </svg>
                  {provider.rating?.toFixed?.(1) ?? provider.rating ?? 'New'} • {provider.reviews?.length || 0} reviews
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                  ₹{provider.cost} / visit
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
                  {availableSlots.length} slots open
                </span>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-600">
                <p>
                  Book hassle-free with transparent pricing. All contact information is verified through Aadhaar and
                  phone confirmation.
                </p>
                <p className="mt-2 text-xs text-slate-400">Phone: {provider.phoneNumber}</p>
                <p className="text-xs text-slate-400">Email: {provider.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setBookingModal(true)}
                className="w-full rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Book a Time Slot
              </button>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        </div>

        <ReviewSection
          reviews={provider.reviews}
          canReview={isAuthenticated}
          onSubmit={handleReviewSubmit}
          submitting={reviewLoading}
        />
      </div>

      <BookingModal
        isOpen={bookingModal}
        slots={provider.timeSlots || []}
        onClose={() => setBookingModal(false)}
        onConfirm={confirmBooking}
        loading={bookingLoading}
      />
    </div>
  );
};

export default ProviderProfile;

