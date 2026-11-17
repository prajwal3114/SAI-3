const About = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow">
        <h1 className="text-3xl font-bold text-slate-900">About Service Snaps</h1>
        <p className="mt-4 text-slate-600">
          Service Snaps is built to make local services transparent, reliable, and joyful. We connect customers with
          verified professionals—electricians, plumbers, carpenters, chefs, and domestic help—through a simple and
          trustworthy experience.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800">Our mission</h2>
            <p className="mt-3 text-sm text-slate-600">
              Empower local professionals with digital tools and help customers make decisions based on transparent
              pricing, verified identities, and community reviews.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-6">
            <h2 className="text-xl font-semibold text-slate-800">Trust & safety</h2>
            <p className="mt-3 text-sm text-slate-600">
              Every profile is identity-checked. We highlight real work images, ratings, and availability so you can
              book with confidence.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm text-slate-600">
          <p>
            Whether you are hiring or offering services, Service Snaps saves you time with clear comparisons, instant
            booking, and helpful reviews. We continue to evolve with feedback from our community—thank you for building
            the future of local services with us!
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;

