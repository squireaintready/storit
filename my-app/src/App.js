// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Registration from "./components/Registration";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
// import other components

const App = () => {
  const [token, setToken] = useState(null);

  const handleLoginSuccess = (token) => {
    setToken(token);
    // You can also store the token in localStorage for session persistence
    localStorage.setItem('token', token);
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
          <h1>Welcome</h1>
          <FileUpload token={token} />
          <FileList token={token} />
        </div>
      )}
    </div>
  );
};

export default App;
