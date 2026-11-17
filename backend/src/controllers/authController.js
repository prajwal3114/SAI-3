const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const userResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const generateToken = (user) => jwt.sign(
  { id: user.id, role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const result = await db.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [crypto.randomUUID(), name.trim(), normalizedEmail, await bcrypt.hash(password, 10), 'customer']
    );
    const user = result.rows[0];
    return res.status(201).json({ token: generateToken(user), user: userResponse(user) });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ message: 'User with this email already exists' });
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Failed to signup user' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const result = await db.query('SELECT id, name, email, password, role FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.json({ token: generateToken(user), user: userResponse(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Failed to login user' });
  }
};
