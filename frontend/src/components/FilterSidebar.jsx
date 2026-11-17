const FilterSidebar = ({ filters, onChange, onReset }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        <div>
          <label className="block text-slate-500">Profession</label>
          <input
            type="text"
            name="profession"
            value={filters.profession || ''}
            onChange={handleChange}
            placeholder="e.g. Plumber"
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-500">Min Cost</label>
            <input
              type="number"
              name="minCost"
              value={filters.minCost || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500">Max Cost</label>
            <input
              type="number"
              name="maxCost"
              value={filters.maxCost || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-500">Minimum Rating</label>
          <select
            name="minRating"
            value={filters.minRating || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          >
            <option value="">Any</option>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value}+
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-slate-500">Date</label>
          <input
            type="date"
            name="date"
            value={filters.date || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-500">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={filters.startTime || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-500">End Time</label>
            <input
              type="time"
              name="endTime"
              value={filters.endTime || ''}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-500">Sort By</label>
          <select
            name="sortBy"
            value={filters.sortBy || ''}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          >
            <option value="">Default</option>
            <option value="rating">Rating</option>
            <option value="cost">Cost</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-500">Order</label>
          <select
            name="order"
            value={filters.order || 'desc'}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-primary focus:outline-none"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;

