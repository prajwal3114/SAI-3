const { Pool } = require('pg');

let pool;

const getPool = () => {
  if (!pool) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined in environment variables.');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL.replace(/[?&]sslmode=require/i, ''),
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: Number(process.env.DB_POOL_MAX || 10),
    });
  }
  return pool;
};

const connectDB = async () => {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS providers (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone_number TEXT NOT NULL,
      aadhaar_number TEXT NOT NULL,
      profession TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      rating NUMERIC(2,1) NOT NULL DEFAULT 0,
      reviews JSONB NOT NULL DEFAULT '[]'::jsonb,
      cost NUMERIC(12,2) NOT NULL CHECK (cost >= 0),
      time_slots JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log('PostgreSQL connected and schema ready');
};

const query = (text, params) => getPool().query(text, params);

module.exports = connectDB;
module.exports.query = query;
module.exports.getPool = getPool;

