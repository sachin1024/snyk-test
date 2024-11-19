import React, { useState, useEffect } from 'react';

const VulnerableComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState('');
  const [users, setUsers] = useState([]);

  // XSS Vulnerability: Directly inserting HTML from user input
  const renderUserContent = () => {
    return { __html: userInput };
  };

  // Prototype Pollution: Merging user input directly into objects
  const updateUserPreferences = (newPrefs) => {
    const preferences = {};
    Object.assign(preferences, JSON.parse(newPrefs));
    return preferences;
  };

  // Insecure Direct Object References (IDOR)
  const getUserData = (userId) => {
    fetch(`/api/users/${userId}/data`)
      .then((response) => response.json())
      .then((data) => setData(data));
  };

  // Information Exposure: Logging sensitive data
  const handleLogin = (username, password) => {
    console.log('Login attempt:', { username, password });
    // Process login...
  };

  // Memory Leak: Not cleaning up event listeners
  useEffect(() => {
    const handleResize = () => {
      console.log('Window resized');
    };
    window.addEventListener('resize', handleResize);
    // Missing cleanup
  }, []);

  return (
    <div className='p-4'>
      <h2 className='text-xl font-bold mb-4'>Vulnerable Component</h2>

      {/* XSS Vulnerability */}
      <div className='mb-4'>
        <input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className='border p-2 rounded'
          placeholder='Enter HTML content'
        />
        <div dangerouslySetInnerHTML={renderUserContent()} />
      </div>

      {/* IDOR Vulnerability */}
      <button onClick={() => getUserData(123)} className='bg-blue-500 text-white px-4 py-2 rounded'>
        Get User Data
      </button>

      {/* Insecure Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin(e.target.username.value, e.target.password.value);
        }}
        className='mt-4'
      >
        <input type='text' name='username' placeholder='Username' className='border p-2 rounded block mb-2' />
        <input type='password' name='password' placeholder='Password' className='border p-2 rounded block mb-2' />
        <button type='submit' className='bg-green-500 text-white px-4 py-2 rounded'>
          Login
        </button>
      </form>
    </div>
  );
};

export default VulnerableComponent;
