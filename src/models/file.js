// src/models/file.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model("File", fileSchema);
module.exports = File;

// // src/models/file.js

// const mongoose = require('mongoose');

// const fileSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   filename: {
//     type: String,
//     required: true
//   },
//   path: {
//     type: String,
//     required: true
//   },
//   size: {
//     type: Number,
//     required: true
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   }
//   // Add other relevant file attributes as needed
// });

// const File = mongoose.model('File', fileSchema);

// module.exports = File;
