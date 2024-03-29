// src/app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');
const cors = require('cors');

const app = express();

// If your frontend is on a different port, use it here
const frontendUrl = 'http://localhost:3001'; 

// CORS configuration
app.use(cors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.use(express.json());
// Middleware to parse JSON
// app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));


// Routes will be added here
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
