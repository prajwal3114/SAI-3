import { useState } from 'react';

const ReviewSection = ({ reviews = [], canReview, onSubmit, submitting }) => {
  const [form, setForm] = useState({ rating: 5, comment: '' });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.rating) {
      setError('Please add a rating.');
      return;
    }
    setError(null);
    onSubmit?.({ rating: Number(form.rating), comment: form.comment.trim() });
    setForm({ rating: 5, comment: '' });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Reviews</h3>
        <span className="text-sm text-slate-500">{reviews.length} shared experiences</span>
      </div>

      <div className="mt-4 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500">No reviews yet. Be the first to share your experience!</p>
        ) : (
          reviews.map((review) => (
            <article key={review._id || review.createdAt} className="rounded-xl border border-slate-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {review.user?.name || 'Verified customer'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m12 17.27 6.18 3.64-1.64-7.03L21 9.24l-7.19-.61L12 2 10.19 8.63 3 9.24l4.46 4.64L5.82 21z" />
                  </svg>
                  <span className="text-sm font-semibold">{review.rating}</span>
                </div>
              </div>
              {review.comment && <p className="mt-2 text-sm text-slate-600">{review.comment}</p>}
            </article>
          ))
        )}
      </div>

      {canReview && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl bg-slate-50 p-5">
          <div>
            <label className="text-sm font-medium text-slate-600">Rating</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} - {['Excellent', 'Great', 'Good', 'Average', 'Poor'][5 - value]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600">Comment</label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="3"
              placeholder="Share highlights from your experience"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}
    </section>
  );
};

export default ReviewSection;

