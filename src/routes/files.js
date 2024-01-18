// src/routes/files.js
const express = require('express');
const multer = require('multer');
const File = require('../models/file');
const authenticate = require('../middlewares/auth');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  }
});

const upload = multer({ storage: storage });

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded.');

  const file = new File({
    userId: req.user._id,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size
  });

  await file.save();
  res.send(file);
});

// Endpoint to list user files
router.get('/', authenticate, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.send(files);
  } catch (error) {
    console.error('Error in fetching files:', error);
    res.status(500).send('Error in fetching files');
  }
});

// Endpoint to download a file
router.get('/download/:id', authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(404).send('File not found.');
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (error) {
    console.error('Error in downloading file:', error);
    res.status(500).send('Error in downloading file');
  }
});

// Endpoint to delete a file
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(404).send('File not found.');
    }

    // Delete file from the filesystem or cloud storage
    fs.unlinkSync(path.resolve(file.path));
    
    // await file.remove();
    await File.deleteOne({ _id: file._id });
    res.send('File deleted.');
  } catch (error) {
    console.error('Error in deleting file:', error);
    res.status(500).send('Error in deleting file');
  }
});

module.exports = router;
