// src/routes/users.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  try {
    console.log('Registering user:', req.body);
    let user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User already exists.');

    user = new User({ username: req.body.username, password: req.body.password });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).send({ token });
  } catch (error) {
    console.error('Error in user registration:', error);
    res.status(500).send('Error in saving user');
  }
});
// router.post('/register', async (req, res) => {
//   try {
//     let user = await User.findOne({ username: req.body.username });
//     if (user) return res.status(400).send('User already exists.');

//     user = new User({ username: req.body.username, password: req.body.password });
//     await user.save();

//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.status(201).send({ token });
//   } catch (error) {
//     res.status(500).send('Error in saving user');
//   }
// });

// User login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(400).send('Invalid credentials.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid credentials.');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.send({ token });
  } catch (error) {
    res.status(500).send('Error in user authentication');
  }
});

module.exports = router;
