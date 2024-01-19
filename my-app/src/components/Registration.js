// src/components/Registration.js

import React, { useState } from 'react';
import axios from 'axios';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            await axios.post('http://localhost:3000/api/users/register', {
                username,
                password
            });
            // Handle success (e.g., redirecting to login or auto-login)
        } catch (err) {
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button onClick={handleRegister}>Register</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Registration;


// // src/components/Registration.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const Registration = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleRegister = async () => {
//     try {
//       await axios.post('http://localhost:3000/api/users/register', { username, password });
//       // Handle post-registration logic (e.g., redirect to login)
//     } catch (error) {
//       setError(error.response.data);
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <input 
//         type="text" 
//         value={username} 
//         onChange={e => setUsername(e.target.value)} 
//         placeholder="Username" 
//       />
//       <input 
//         type="password" 
//         value={password} 
//         onChange={e => setPassword(e.target.value)} 
//         placeholder="Password" 
//       />
//       <button onClick={handleRegister}>Register</button>
//       {error && <p>{error}</p>}
//     </div>
//   );
// };

// export default Registration;
