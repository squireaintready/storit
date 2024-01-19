const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
      let user = await User.findOne({ username: req.body.username });
      if (user) return res.status(400).send('User already exists.');
      user = new User({
          username: req.body.username,
          password: req.body.password
      });
      // const salt = await bcrypt.genSalt(10);
      // user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      // Create and send token
      // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      // res.header('Authorization', token).send({ token: token });
      res.status(201).send('User registered successfully');
  } catch (error) {
      res.status(500).send('Error in user registration');
  }
});

// User login endpoint
router.post('/login', async (req, res) => {
  try {
      // Check if the user exists
      const user = await User.findOne({ username: req.body.username });
      if (!user) return res.status(400).send('Invalid username or password.');

      // Compare the provided password with the stored hashed password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) return res.status(400).send('Invalid username or password.');

      // Create and assign a JWT token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.header('Authorization', token).send({ token: token });
      // res.send({ token });
  } catch (error) {
      res.status(500).send('Error in user login');
  }
});
module.exports = router;
