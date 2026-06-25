const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateLogin } = require('../middleware/validate');
const { Admin } = require('../models/db_models');
const auth = require('../middleware/auth');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    // Return JWT
    const payload = {
      admin: {
        id: admin._id || admin.id,
        username: admin.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'ai_solutions_secret_key_123!@#',
      { expiresIn: 86400 }, // 24 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token, admin: { username: admin.username } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/verify
// @desc    Verify current token
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    res.json({ valid: true, username: admin.username });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
