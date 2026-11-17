const crypto = require('crypto');
const db = require('../config/db');
const { ensureSeedImage } = require('../config/uploads');

const parseTimeSlots = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string') return [];
  try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
};

const normalizeProvider = (row, users = new Map()) => ({
  _id: row.id,
  name: row.name,
  email: row.email,
  phoneNumber: row.phone_number,
  profession: row.profession,
  images: row.images || [],
  rating: Number(row.rating),
  reviews: (row.reviews || []).map((review) => ({
    ...review,
    user: review.user ? (users.get(review.user) || null) : null,
  })),
  cost: Number(row.cost),
  timeSlots: row.time_slots || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const fetchProvider = async (id, client = db) => {
  const result = await client.query('SELECT * FROM providers WHERE id = $1', [id]);
  return result.rows[0] || null;
};

const withReviewUsers = async (row) => {
  const ids = [...new Set((row.reviews || []).map((review) => review.user).filter(Boolean))];
  const users = new Map();
  if (ids.length) {
    const result = await db.query('SELECT id, name FROM users WHERE id = ANY($1::uuid[])', [ids]);
    result.rows.forEach((user) => users.set(user.id, { _id: user.id, name: user.name }));
  }
  return normalizeProvider(row, users);
};

exports.addProvider = async (req, res) => {
  const { name, email, phoneNumber, aadhaarNumber, profession, cost } = req.body;
  const numericCost = Number(cost);
  if (!name?.trim() || !email?.trim() || !phoneNumber?.trim() || !aadhaarNumber?.trim() || !profession?.trim() || cost === undefined || !Number.isFinite(numericCost) || numericCost < 0) {
    return res.status(400).json({ message: 'Valid name, email, phone, Aadhaar, profession, and cost are required' });
  }
  const slots = parseTimeSlots(req.body.timeSlots).map((slot) => ({
    _id: slot._id || crypto.randomUUID(),
    date: String(slot.date || ''),
    startTime: String(slot.startTime || ''),
    endTime: String(slot.endTime || ''),
    available: slot.available !== false,
  }));
  if (slots.some((slot) => !slot.date || !slot.startTime || !slot.endTime)) {
    return res.status(400).json({ message: 'Each time slot needs a date, start time, and end time' });
  }
  try {
    const result = await db.query(
      `INSERT INTO providers (id, name, email, phone_number, aadhaar_number, profession, cost, images, time_slots)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb) RETURNING *`,
      [crypto.randomUUID(), name.trim(), email.trim().toLowerCase(), phoneNumber.trim(), aadhaarNumber.trim(), profession.trim(), numericCost,
        JSON.stringify((req.files || []).map((file) => `/uploads/${file.filename}`)), JSON.stringify(slots)]
    );
    return res.status(201).json(normalizeProvider(result.rows[0]));
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'Provider with this email already exists' });
    console.error('Add provider error:', error);
    return res.status(500).json({ message: 'Failed to add provider' });
  }
};

exports.getProviders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM providers');
    const { profession, minCost, maxCost, minRating, date, startTime, endTime, sortBy, order = 'desc' } = req.query;
    const providers = result.rows.map((row) => normalizeProvider(row)).filter((provider) => {
      if (profession && !provider.profession.toLowerCase().includes(profession.toLowerCase())) return false;
      if (minCost !== undefined && minCost !== '' && provider.cost < Number(minCost)) return false;
      if (maxCost !== undefined && maxCost !== '' && provider.cost > Number(maxCost)) return false;
      if (minRating !== undefined && minRating !== '' && provider.rating < Number(minRating)) return false;
      if (date || startTime || endTime) return provider.timeSlots.some((slot) => slot.available !== false
        && (!date || slot.date === date) && (!startTime || slot.startTime === startTime) && (!endTime || slot.endTime === endTime));
      return true;
    });
    if (sortBy === 'rating' || sortBy === 'cost') {
      const direction = order === 'asc' ? 1 : -1;
      providers.sort((a, b) => direction * (a[sortBy] - b[sortBy]));
    }
    return res.json(providers);
  } catch (error) {
    console.error('Get providers error:', error);
    return res.status(500).json({ message: 'Failed to fetch providers' });
  }
};

exports.getProviderById = async (req, res) => {
  try {
    const row = await fetchProvider(req.params.id);
    if (!row) return res.status(404).json({ message: 'Provider not found' });
    return res.json(await withReviewUsers(row));
  } catch (error) {
    console.error('Get provider error:', error);
    return res.status(500).json({ message: 'Failed to fetch provider' });
  }
};

exports.addReview = async (req, res) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');
    const row = await fetchProvider(req.params.id, client);
    if (!row) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'Provider not found' }); }
    const reviews = row.reviews || [];
    const review = { _id: crypto.randomUUID(), user: req.user.id, rating, comment: String(req.body.comment || '').trim(), createdAt: new Date().toISOString() };
    const index = reviews.findIndex((item) => item.user === req.user.id);
    if (index >= 0) reviews[index] = review; else reviews.push(review);
    const avg = reviews.reduce((sum, item) => sum + Number(item.rating), 0) / reviews.length;
    await client.query('UPDATE providers SET reviews=$1::jsonb, rating=$2, updated_at=NOW() WHERE id=$3', [JSON.stringify(reviews), Number(avg.toFixed(1)), req.params.id]);
    await client.query('COMMIT');
    return res.json(await withReviewUsers({ ...row, reviews, rating: Number(avg.toFixed(1)) }));
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Add review error:', error);
    return res.status(500).json({ message: 'Failed to add review' });
  } finally { client.release(); }
};

exports.bookProvider = async (req, res) => {
  if (!req.body.slotId) return res.status(400).json({ message: 'slotId is required' });
  const client = await db.getPool().connect();
  try {
    await client.query('BEGIN');
    const row = await client.query('SELECT * FROM providers WHERE id=$1 FOR UPDATE', [req.params.id]);
    if (!row.rows[0]) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'Provider not found' }); }
    const provider = row.rows[0];
    const slots = provider.time_slots || [];
    const slot = slots.find((item) => item._id === req.body.slotId);
    if (!slot) { await client.query('ROLLBACK'); return res.status(404).json({ message: 'Time slot not found' }); }
    if (!slot.available) { await client.query('ROLLBACK'); return res.status(400).json({ message: 'Time slot already booked' }); }
    slot.available = false;
    const updated = await client.query('UPDATE providers SET time_slots=$1::jsonb, updated_at=NOW() WHERE id=$2 RETURNING *', [JSON.stringify(slots), req.params.id]);
    await client.query('COMMIT');
    return res.json({ message: 'Booking confirmed', provider: normalizeProvider(updated.rows[0]) });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Book provider error:', error);
    return res.status(500).json({ message: 'Failed to book provider' });
  } finally { client.release(); }
};

exports.seedProviders = async (req, res) => {
  try {
    const existing = await db.query('SELECT COUNT(*)::int AS count FROM providers');
    if (existing.rows[0].count >= 5) return res.json({ message: 'Providers already seeded' });
    const image = ensureSeedImage();
    const samples = [
      ['Ravi Kumar', 'ravi.plumber@example.com', '9876543210', '1234-5678-9012', 'Plumber', 500, 5, 'Fixed our leaking pipe quickly!'],
      ['Asha Sharma', 'asha.electrician@example.com', '9123456780', '2345-6789-0123', 'Electrician', 600, 5, 'Efficient and professional.'],
      ['Mohit Singh', 'mohit.carpenter@example.com', '9988776655', '3456-7890-1234', 'Carpenter', 700, 4, 'Built sturdy shelves for us.'],
      ['Priya Verma', 'priya.chef@example.com', '9001122233', '4567-8901-2345', 'Chef', 1200, 5, 'Delicious meals and great presentation.'],
      ['Sita Devi', 'sita.maid@example.com', '9112233445', '5678-9012-3456', 'Maid', 400, 4, 'Keeps our home spotless.'],
    ];
    const date = (days) => { const value = new Date(); value.setDate(value.getDate() + days); return value.toISOString().slice(0, 10); };
    const slots = [10, 11, 12].map((day, i) => ({ _id: crypto.randomUUID(), date: date(i + 1), startTime: ['10:00', '14:00', '09:00'][i], endTime: ['12:00', '16:00', '11:00'][i], available: true }));
    const client = await db.getPool().connect();
    try {
      await client.query('BEGIN');
      for (const [name, email, phone, aadhaar, profession, cost, rating, comment] of samples) {
        await client.query(`INSERT INTO providers (id,name,email,phone_number,aadhaar_number,profession,cost,images,rating,reviews,time_slots)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10::jsonb,$11::jsonb) ON CONFLICT (email) DO NOTHING`,
        [crypto.randomUUID(), name, email, phone, aadhaar, profession, cost, JSON.stringify([image]), rating,
          JSON.stringify([{ _id: crypto.randomUUID(), user: null, comment, rating, createdAt: new Date().toISOString() }]), JSON.stringify(slots)]);
      }
      await client.query('COMMIT');
    } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
    const seeded = await db.query('SELECT * FROM providers ORDER BY created_at');
    return res.status(201).json({ message: 'Providers seeded successfully', providers: seeded.rows.map((row) => normalizeProvider(row)) });
  } catch (error) {
    console.error('Seed providers error:', error);
    return res.status(500).json({ message: 'Failed to seed providers' });
  }
};
