// src/routes/files.js
const express = require("express");
const multer = require("multer");
const File = require("../models/file");
const authenticate = require("../middlewares/auth");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Adjust the path as necessary
  },
  filename: function (req, file, cb) {
    const customFilename = req.body.customFilename;
    const extension = path.extname(file.originalname);
    cb(null, customFilename + extension);
  },
});
const upload = multer({ storage: storage });

router.post('/upload', authenticate, upload.single("file"), async (req, res) => {
  try {
    if (!req.user) return res.status(401).send('User not authenticated');
    if (!req.file) return res.status(400).send('No file uploaded.');
    const newFile = new File({
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      filename: req.body.customFilename || req.file.filename,
      userId: req.user._id 
    });
    console.log(req.user)
    await newFile.save();
    res.send("File uploaded and saved to database successfully");
  } catch (error) {
    console.error("Error in file upload:", error);
    res.status(500).send("Error uploading the file");
  }
});

// Endpoint to list user files
router.get("/", authenticate, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id });
    res.send(files);
  } catch (error) {
    console.error("Error in fetching files:", error);
    res.status(500).send("Error in fetching files");
  }
});

// Endpoint to download a file
router.get("/download/:id", authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user._id.toString()) {
      return res.status(404).send("File not found.");
    }

    res.download(path.resolve(file.path), file.filename);
  } catch (error) {
    console.error("Error in downloading file:", error);
    res.status(500).send("Error in downloading file");
  }
});

// Endpoint to delete a file
router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send("File not found.");
    // if (!file || file.userId.toString() !== req.user._id.toString()) {
    //   return res.status(404).send("File not found.");
    // }
    // fs.unlinkSync(path.resolve(file.path));
    // fs.unlinkSync(file.path);
    const filePath = file.path; // The path where the file is stored
    fs.unlink(filePath, (err) => {
      if (err) {
        throw err;
      }
    });
    // await file.remove();
    await File.deleteOne({ _id: file._id });
    res.send("File deleted.");
  } catch (error) {
    console.error("Error in deleting file:", error);
    res.status(500).send("Error in deleting file");
  }
});

module.exports = router;


// router.post(
//   "/upload",
//   authenticate,
//   upload.single("file"),
//   async (req, res) => {
//     try {
//       if (!req.user) return res.status(401).send("User not authenticated");
//       if (!req.file) return res.status(400).send("No file uploaded.");
//       const newFile = new File({
//         path: req.file.path,
//         size: req.file.size,
//         mimeType: req.file.mimetype,
//         filename: req.body.customFilename || req.file.filename,
//         userId: req.user._id,
//       });
//       console.log(req.user);
//       await newFile.save();
//       res.send("File uploaded and saved to database successfully");
//     } catch (error) {
//       console.error("Error in file upload:", error);
//       res.status(500).send("Error uploading the file");
//     }
//   }
// );