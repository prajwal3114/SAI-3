import { useCallback, useEffect, useMemo, useState } from 'react';

import api from '../api/axios.js';
import BookingModal from '../components/BookingModal.jsx';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProviderCard from '../components/ProviderCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const initialFilters = {
  sortBy: 'rating',
  order: 'desc',
};

const Providers = () => {
  const [providers, setProviders] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined && value !== '')
      );
      const { data } = await api.get('/providers', { params });
      setProviders(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load providers. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const ensureSeeded = async () => {
      try {
        await api.get('/providers/seed');
      } catch (err) {
        console.info('Seed endpoint responded:', err?.response?.data || err.message);
      }
    };
    ensureSeeded();
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleFilterChange = (updated) => {
    setFilters(updated);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const availableProviders = useMemo(() => providers, [providers]);

  const openBooking = (provider) => {
    if (!isAuthenticated) {
      setError('Please login to book a provider.');
      return;
    }
    setSelectedProvider(provider);
  };

  const confirmBooking = async (slotId) => {
    if (!slotId || !selectedProvider) return;
    try {
      setBookingLoading(true);
      await api.post(`/providers/${selectedProvider._id}/book`, { slotId });
      setSelectedProvider(null);
      fetchProviders();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="md:w-64">
          <button
            type="button"
            className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-primary hover:text-primary md:hidden"
            onClick={() => setShowFilters((prev) => !prev)}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5h18M6 12h12M10 19h4" />
            </svg>
            Filters
          </button>

          <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
            <FilterSidebar filters={filters} onChange={handleFilterChange} onReset={handleResetFilters} />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Find your next service expert</h1>
              <p className="text-sm text-slate-500">Browse verified professionals, compare pricing, and book instantly.</p>
            </div>
            <span className="hidden text-sm text-slate-500 md:block">
              {availableProviders.length} professionals available
            </span>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 flex items-center justify-center">
              <span className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {availableProviders.map((provider) => (
                <div key={provider._id} className="relative">
                  <ProviderCard provider={provider} />
                  <button
                    type="button"
                    onClick={() => openBooking(provider)}
                    className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-semibold text-primary shadow-md transition hover:bg-primary hover:text-white md:flex"
                  >
                    Quick Book Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={Boolean(selectedProvider)}
        slots={selectedProvider?.timeSlots || []}
        onClose={() => setSelectedProvider(null)}
        onConfirm={confirmBooking}
        loading={bookingLoading}
      />
    </div>
  );
};

export default Providers;

