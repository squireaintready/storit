// src/components/FileUpload.js
import React, { useState } from "react";
import axios from "axios";

const FileUpload = ({ token }) => {
  const [file, setFile] = useState(null);
  const [customFilename, setCustomFilename] = useState("");
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCustomFilename(e.target.files[0].name.split(".").slice(0, -1).join("."));
  };

  const handleFilenameChange = (e) => {
    setCustomFilename(e.target.value);
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('customFilename', customFilename);

    try {
        const response = await axios.post('http://localhost:3000/api/files/upload', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,  
              'Content-Type': 'multipart/form-data'
            }
        });
        setUploadStatus('File uploaded successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        setUploadStatus('Error uploading file');
    }
};

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <input
        type="text"
        value={customFilename}
        onChange={handleFilenameChange}
        placeholder="Enter new filename"
      />
      <button onClick={handleUpload}>Upload</button>
      {!setUploadStatus && <p>File uploaded successfully!</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default FileUpload;
