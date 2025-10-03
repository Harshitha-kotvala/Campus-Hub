 const express = require('express');
 const bcrypt = require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const User = require('../models/User');
 const auth = require('../middleware/auth');
 const router = express.Router();

// Quick health check to verify the auth router is mounted
router.get('/health', (req, res) => {
  return res.json({ ok: true, route: 'auth' });
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    console.log('[AUTH] /signup called');
    const { name, email, password, startYear, passOutYear, department, rollNumber, avatarUrl } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    const normalizedEmail = String(email).trim().toLowerCase();

    // Ensure JWT secret is configured BEFORE creating the user, to avoid creating users then failing to sign token
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email: normalizedEmail, password: hash, startYear, passOutYear, department, rollNumber, avatarUrl });

    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      token,
      user: {
        name: user.name,
        email: user.email,
        startYear: user.startYear,
        passOutYear: user.passOutYear,
        department: user.department,
        rollNumber: user.rollNumber,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    console.log('[AUTH] /login called');
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // Update last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET not set' });
    }
    const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        startYear: user.startYear,
        passOutYear: user.passOutYear,
        department: user.department,
        rollNumber: user.rollNumber,
        avatarUrl: user.avatarUrl,
        lastLoginAt: user.lastLoginAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('name email startYear passOutYear department rollNumber avatarUrl lastLoginAt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user });
  } catch (err) {
    console.error('Me error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
