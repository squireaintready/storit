// src/components/FileList.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FileList = ({ token, onDeleteSuccess }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/files", {
          headers: { 
            Authorization: `Bearer ${token}`, 
          },
        });
        setFiles(response?.data);
      } catch (error) {
        setError(error?.response?.data);
      }
    };

    fetchFiles();
  }, [token, files]);

  const handleDownload = async (file) => {
    try {
        const response = await axios.get(`http://localhost:3000/api/files/download/${file._id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
            responseType: 'blob', // Important for files
        });

        // Create a URL for the blob and initiate download
        const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
        const link = document.createElement('a');
        link.href = url;

        // Use the original file name and extension
        link.setAttribute('download', file.filename); 

        document.body.appendChild(link);
        link.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        link.remove();
    } catch (error) {
        console.error('Error downloading file', error);
    }
};

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:3000/api/files/delete/${fileId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      onDeleteSuccess(fileId);
      // Update UI: Remove deleted file from state or re-fetch file list
    } catch (error) {
      console.error("Error deleting file", error);
    }
  };

  return (
    <div>
      {/* ... */}
      {files.map((file) => (
        <li key={file._id}>
          {file.filename}
          {/* {console.log(file)} */}
          <button onClick={() => handleDownload(file)}>Download</button>
          <button onClick={() => handleDelete(file._id)}>Delete</button>
        </li>
      ))}
    </div>
  );
};

export default FileList;
