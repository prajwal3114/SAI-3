const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const db = require('./config/db');
const { uploadsDir, ensureSeedImage } = require('./config/uploads');

const authRoutes = require('./routes/authRoutes');
const providerRoutes = require('./routes/providerRoutes');

const app = express();
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
);

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin.replace(/\/$/, '')));
  },
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

ensureSeedImage();
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', message: 'Service Snaps API is running' });
  } catch {
    res.status(503).json({ status: 'error', message: 'Database is unavailable' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/providers', providerRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;

