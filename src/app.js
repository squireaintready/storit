// src/app.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/users');
const fileRoutes = require('./routes/files');

const app = express();
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






// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// app.use(express.json()); // for parsing application/json


// const userRoutes = require('./routes/users');
// // other requires...

// // Use routes
// app.use('/api/users', userRoutes);
// // other app.use()...


// // Connect to MongoDB (Update your connection string)
// mongoose.connect('mongodb://localhost:27017/datastorage', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

// // Define routes here

// const fileRoutes = require('./routes/files');
// // other requires...

// // Use routes
// app.use('/api/files', fileRoutes);
// // other app.use()...


// const port = process.env.PORT || 9000;
// app.listen(port, () => console.log(`Listening on port ${port}...`));