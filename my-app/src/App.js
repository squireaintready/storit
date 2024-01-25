// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Registration from "./components/Registration";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
// import other components

const App = () => {
  const [token, setToken] = useState(null);
  const [files, setFiles] = useState([]);

  const handleLoginSuccess = (token) => {
    setToken(token);
    // You can also store the token in localStorage for session persistence
    localStorage.setItem('token', token);
};

const handleDeleteSuccess = (fileId) => {
  // setFiles(files.filter(file => file._id !== fileId));
};

  return (
    <div>
      {!token ? (
        <>
          <Login onLoginSuccess={handleLoginSuccess} />
          <Registration />
        </>
      ) : (
        // User is logged in, show other components
        <div>
          <FileUpload token={token} />
          <hr/>
          <FileList token={token} onDeleteSuccess={handleDeleteSuccess} />
          {/* <FileList token={token} /> */}
        </div>
      )}
    </div>
  );
};

export default App;
