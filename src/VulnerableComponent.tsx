import React, { useState, useEffect, useRef } from 'react';

const VulnerableComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [data, setData] = useState('');
  const [users, setUsers] = useState([]);
  const [config, setConfig] = useState({});
  const fileInputRef = useRef();

  // Vulnerable to ReDoS (Regular Expression Denial of Service)
  const validateEmail = (email) => {
    const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
  };

  // Command Injection Vulnerability
  const executeCommand = (command) => {
    fetch(`/api/exec?cmd=${command}`)
      .then(response => response.json())
      .then(result => console.log(result));
  };

  // Insecure Direct Object References (IDOR)
  const getUserData = (userId) => {
    fetch(`/api/users/${userId}/data`)
      .then(response => response.json())
      .then(data => setData(data));
  };

  // Path Traversal Vulnerability
  const readFile = (filename) => {
    fetch(`/api/files/${filename}`)
      .then(response => response.text())
      .then(content => setData(content));
  };

  // Prototype Pollution
  const updateConfig = (newConfig) => {
    setConfig({...config, ...JSON.parse(newConfig)});
  };

  // XSS Vulnerability
  const renderUserContent = () => {
    return { __html: userInput };
  };

  // Insecure File Upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
  };

  // SQL Injection Vulnerability
  const searchUsers = (searchTerm) => {
    fetch(`/api/users/search?q=${searchTerm}`)
      .then(response => response.json())
      .then(results => setUsers(results));
  };

  // Insecure Authentication
  const login = (username, password) => {
    // Plain text password in request
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
  };

  // Memory Leak in Event Listeners
  useEffect(() => {
    const handleScroll = () => {
      console.log('Scrolled', window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    // Missing cleanup
  }, []);

  // Insecure localStorage Usage
  useEffect(() => {
    localStorage.setItem('userToken', 'sensitive-token-value');
    localStorage.setItem('userCredentials', JSON.stringify({
      username: 'admin',
      password: 'password123'
    }));
  }, []);

  // Zip Slip Vulnerability
  const extractZip = (zipFile) => {
    fetch('/api/extract', {
      method: 'POST',
      body: zipFile
    });
  };

  // Insecure Randomness
  const generateToken = () => {
    return Math.random().toString(36).substring(7);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Security Test Component</h2>
      
      {/* XSS Test Section */}
      <section className="space-y-2">
        <h3 className="text-xl">XSS Test</h3>
        <input 
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter HTML content"
        />
        <div dangerouslySetInnerHTML={renderUserContent()} />
      </section>

      {/* Command Injection Test */}
      <section className="space-y-2">
        <h3 className="text-xl">Command Test</h3>
        <input 
          type="text"
          onChange={(e) => executeCommand(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter command"
        />
      </section>

      {/* File Upload Test */}
      <section className="space-y-2">
        <h3 className="text-xl">File Upload Test</h3>
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="border p-2 rounded w-full"
        />
      </section>

      {/* Search with SQL Injection */}
      <section className="space-y-2">
        <h3 className="text-xl">User Search</h3>
        <input 
          type="text"
          onChange={(e) => searchUsers(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Search users..."
        />
      </section>

      {/* Path Traversal Test */}
      <section className="space-y-2">
        <h3 className="text-xl">File Reader</h3>
        <input 
          type="text"
          onChange={(e) => readFile(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter file path"
        />
      </section>

      {/* Login Form */}
      <section className="space-y-2">
        <h3 className="text-xl">Login</h3>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            login(e.target.username.value, e.target.password.value);
          }}
          className="space-y-2"
        >
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="border p-2 rounded block w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="border p-2 rounded block w-full"
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Login
          </button>
        </form>
      </section>

      {/* Configuration Update */}
      <section className="space-y-2">
        <h3 className="text-xl">Update Config</h3>
        <textarea
          onChange={(e) => updateConfig(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="Enter JSON configuration"
        />
      </section>
    </div>
  );
};

export default VulnerableComponent;