import { Link } from 'react-router-dom';
import { assetUrl } from '../api/axios.js';

const ProviderCard = ({ provider }) => {
  const imageSrc = provider.images?.[0]
    ? provider.images[0].startsWith('http')
      ? provider.images[0]
      : assetUrl(provider.images[0])
    : assetUrl('/uploads/seed/service.png');

  const availableSlots = provider.timeSlots?.filter((slot) => slot.available !== false) ?? [];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <img src={imageSrc} alt={provider.profession} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase text-primary shadow">
          {provider.profession}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">{provider.name}</h3>
            <span className="flex items-center gap-1 text-sm font-medium text-amber-500">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="m12 17.27 6.18 3.64-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.64L5.82 21z" />
              </svg>
              {provider.rating?.toFixed?.(1) ?? provider.rating ?? 'New'}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {provider.reviews?.[0]?.comment || 'Trusted and verified professional ready to help you.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            ₹{provider.cost} / visit
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
            {availableSlots.length} slots open
          </span>
        </div>

        <div className="mt-auto">
          <Link
            to={`/providers/${provider._id}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProviderCard;

