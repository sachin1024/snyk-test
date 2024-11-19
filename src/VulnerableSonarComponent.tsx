import { useState, useEffect, useRef } from 'react';
import { merge } from 'lodash';
import 'bootstrap';
import crypto from 'crypto'; // For demonstrating crypto issues

const VulnerableSonarComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [markdownInput, setMarkdownInput] = useState('');
  const [templateInput, setTemplateInput] = useState('');
  const [results, setResults] = useState({});
  const [password, setPassword] = useState('defaultPassword'); // SONAR: Hardcoded credentials
  const wsRef = useRef(null);
  
  // SONAR: Weak cryptographic algorithm
  const weakHash = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
  };

  // SONAR: SQL Injection vulnerability
  const executeQuery = (userInput) => {
    const query = `SELECT * FROM users WHERE id = ${userInput}`; // SONAR: SQL injection
    fetch(`/api/query?q=${query}`);
  };

  // SONAR: Insecure cookie configuration
  useEffect(() => {
    document.cookie = "sessionId=123; path=/"; // SONAR: Missing secure flag
  }, []);

  // SONAR: Weak SSL/TLS configuration
  const createInsecureHttpsServer = () => {
    const https = require('https');
    const options = {
      secureOptions: require('constants').SSL_OP_NO_TLSv1_2, // SONAR: Weak TLS
      ciphers: 'RC4', // SONAR: Weak cipher
    };
  };

  // SONAR: Directory traversal
  const readFile = async (fileName) => {
    try {
      const response = await fetch(`/api/files/../${fileName}`); // SONAR: Path traversal
      return await response.text();
    } catch (error) {
      console.error(error); // SONAR: Sensitive error exposure
    }
  };

  // SONAR: Insecure random number generation
  const generateToken = () => {
    return Math.random().toString(36).substring(7); // SONAR: Weak randomness
  };

  // SONAR: XML External Entity vulnerability
  const parseXML = (xmlString) => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, 'text/xml'); // SONAR: XXE vulnerability
    return xml;
  };

  // SONAR: Regular Expression DoS
  const validateEmail = (email) => {
    const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email); // SONAR: Regex complexity
  };

  // SONAR: Cross-Site Request Forgery
  const updateProfile = async (userData) => {
    // SONAR: Missing CSRF token
    await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  };

  // SONAR: Insecure authentication
  const login = async (username, password) => {
    const base64Creds = Buffer.from(`${username}:${password}`).toString('base64');
    // SONAR: Basic auth over HTTP
    await fetch('http://api.example.com/login', {
      headers: { 'Authorization': `Basic ${base64Creds}` }
    });
  };

  // Previous vulnerable code remains...
  const handleLodashMerge = (input) => {
    try {
      const baseObj = { key: 'value' };
      // SONAR: Prototype pollution
      const merged = merge({}, baseObj, JSON.parse(input));
      setResults(prev => ({ ...prev, lodashResult: JSON.stringify(merged) }));
    } catch (error) {
      console.log(error); // SONAR: Sensitive information exposure
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">SonarQube Vulnerability Test Suite</h1>

      {/* Weak Cryptography Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Weak Cryptography Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter text to hash"
          onChange={(e) => {
            const hash = weakHash(e.target.value);
            setResults(prev => ({ ...prev, hashResult: hash }));
          }}
        />
        <div className="text-sm text-gray-600">
          Hash Result: {results.hashResult}
        </div>
      </section>

      {/* SQL Injection Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">SQL Query Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter user ID"
          onChange={(e) => executeQuery(e.target.value)}
        />
      </section>

      {/* Directory Traversal Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">File Access Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter file name"
          onChange={(e) => readFile(e.target.value)}
        />
      </section>

      {/* Insecure Authentication Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Login Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded mb-2"
          placeholder="Username"
        />
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Password"
          onChange={(e) => login('admin', e.target.value)}
        />
      </section>

      {/* Email Validation Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Email Validation Test</h2>
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Enter email to validate"
          onChange={(e) => {
            const isValid = validateEmail(e.target.value);
            setResults(prev => ({ ...prev, emailValid: isValid }));
          }}
        />
        <div className="text-sm text-gray-600">
          Valid: {results.emailValid ? 'Yes' : 'No'}
        </div>
      </section>

      {/* Token Generation Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Token Generation Test</h2>
        <button
          onClick={() => {
            const token = generateToken();
            setResults(prev => ({ ...prev, token }));
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Token
        </button>
        <div className="text-sm text-gray-600">
          Token: {results.token}
        </div>
      </section>

      {/* XML Parsing Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">XML Parser Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter XML to parse"
          onChange={(e) => {
            const parsed = parseXML(e.target.value);
            setResults(prev => ({ ...prev, xmlResult: parsed }));
          }}
        />
      </section>

      {/* Profile Update Test */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Profile Update Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter profile data (JSON)"
          onChange={(e) => updateProfile(e.target.value)}
        />
      </section>

      {/* Previous vulnerable sections remain... */}
    </div>
  );
};

// SONAR: Debug code in production
const DEBUG = true;
if (DEBUG) {
  console.log('Debug mode enabled');
}

// SONAR: Hard-coded IP address
const API_ENDPOINT = 'http://192.168.1.1:3000';

export default VulnerableSonarComponent;