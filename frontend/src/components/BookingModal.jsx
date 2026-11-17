import { useEffect, useState } from 'react';

const BookingModal = ({ isOpen, slots = [], onClose, onConfirm, loading }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const firstAvailable = slots.find((slot) => slot.available !== false);
      setSelectedSlot(firstAvailable?._id || null);
    }
  }, [isOpen, slots]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Confirm Booking</h3>
          <button onClick={onClose} className="text-slate-400 transition hover:text-slate-600" aria-label="Close">
            ✕
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Choose a time slot that works best for you. Bookings are instantly confirmed.
        </p>

        <div className="mt-5 space-y-3">
          {slots.filter((slot) => slot.available !== false).length === 0 && (
            <p className="text-sm text-slate-500">No available slots at the moment. Please check back later.</p>
          )}

          {slots
            .filter((slot) => slot.available !== false)
            .map((slot) => (
              <label
                key={slot._id}
                className={`flex items-center justify-between rounded-xl border p-3 text-sm transition ${
                  selectedSlot === slot._id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary'
                }`}
              >
                <div>
                  <p className="font-semibold text-slate-700">
                    {slot.date} • {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <input
                  type="radio"
                  name="slot"
                  value={slot._id}
                  checked={selectedSlot === slot._id}
                  onChange={() => setSelectedSlot(slot._id)}
                  className="h-4 w-4"
                />
              </label>
            ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-primary hover:text-primary"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={() => onConfirm?.(selectedSlot)}
            type="button"
            disabled={!selectedSlot || loading}
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

