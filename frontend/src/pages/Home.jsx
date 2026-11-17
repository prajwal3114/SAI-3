import { Link } from 'react-router-dom';

const stats = [
  { value: '5+', label: 'pre-vetted professions' },
  { value: '100%', label: 'verified identities' },
  { value: '24/7', label: 'booking access' },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-white via-slate-50 to-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Discover trusted, local professionals
          </span>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
            Service Snaps connects you with reliable local experts in minutes.
          </h1>
          <p className="max-w-xl text-lg text-slate-600">
            Compare professionals, browse their work snaps, and book time slots instantly. Transparent
            pricing, authentic reviews, and verified profiles make decision-making effortless.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/providers"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              Explore Providers
            </Link>
            <Link
              to="/add-provider"
              className="rounded-xl border border-primary px-6 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              Add Your Services
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 pt-6">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-white p-4 shadow">
                <p className="text-2xl font-bold text-slate-900">{item.value}</p>
                <p className="text-sm text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <div className="relative mx-auto max-w-md rounded-[2.5rem] bg-white p-6 shadow-2xl">
            <div className="rounded-3xl border border-slate-100 bg-slate-900 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/60">Featured Professional</p>
                  <p className="text-xl font-semibold">Ravi Kumar</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm">
                  <svg className="h-4 w-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 17.27 6.18 3.64-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.64L5.82 21z" />
                  </svg>
                  4.8
                </span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                “Service Snaps helped me get verified leads and showcase my work snapshots. Customers can book my
                time slots instantly without back-and-forth calls.”
              </p>
              <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                <span>Plumber • Bengaluru</span>
                <span>₹500 / visit</span>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-6 hidden w-32 rounded-3xl border border-slate-100 bg-white p-4 text-xs text-slate-500 shadow lg:block">
              <p className="font-semibold text-slate-700">Instant bookings</p>
              <p className="mt-1">Pick a slot that suits you. Instant confirmations.</p>
            </div>
            <div className="absolute -top-10 -right-6 hidden w-32 rounded-3xl border border-slate-100 bg-white p-4 text-xs text-slate-500 shadow lg:block">
              <p className="font-semibold text-slate-700">Verified IDs</p>
              <p className="mt-1">Aadhaar-backed verification for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-slate-900">Why Service Snaps works for you</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[{
              title: 'Transparent comparisons',
              description: 'Filter by cost, ratings, and availability. Review real work snapshots before you decide.',
            },
            {
              title: 'Verified professionals',
              description: 'Every provider is identity-checked and reviewed by the community.',
            },
            {
              title: 'Frictionless bookings',
              description: 'Secure your time slot with one click and get instant confirmations.',
            }].map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

