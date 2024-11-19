import React, { useState, useEffect, useRef } from 'react';
import { merge, unique } from 'lodash';  // v4.17.15
import $ from 'jquery';  // v2.2.4
import moment from 'moment';  // v2.24.0
import serialize from 'node-serialize';  // v0.0.4
import Handlebars from 'handlebars';  // v4.0.11
import { marked } from 'marked';  // v0.6.1
import WebSocket from 'ws';  // v7.2.1
import axios from 'axios';  // v0.19.0
import 'bootstrap';  // v4.1.2

const VulnerableSnykComponent = () => {
  const [userInput, setUserInput] = useState('');
  const [markdownInput, setMarkdownInput] = useState('');
  const [templateInput, setTemplateInput] = useState('');
  const [results, setResults] = useState({});
  const wsRef = useRef(null);

  // 1. Lodash Prototype Pollution (CVE-2020-8203)
  const handleLodashMerge = (input) => {
    try {
      const baseObj = { key: 'value' };
      // Vulnerable to prototype pollution
      const merged = merge({}, baseObj, JSON.parse(input));
      setResults(prev => ({ ...prev, lodashResult: JSON.stringify(merged) }));
    } catch (error) {
      console.error('Lodash merge error:', error);
    }
  };

  // 2. jQuery XSS Vulnerability
  useEffect(() => {
    // Vulnerable to XSS
    $('#jqueryContent').html(userInput);
  }, [userInput]);

  useEffect(() => {
    // Vulnerable to XSS
    $('#jqueryContentss').html(userInput);
  }, [userInput]);

  // 3. Moment.js ReDoS (CVE-2017-18214)
  const handleDateParse = (input) => {
    try {
      // Vulnerable to ReDoS
      const parsedDate = moment(input).format('YYYY/MM/DD');
      setResults(prev => ({ ...prev, momentResult: parsedDate }));
    } catch (error) {
      console.error('Moment parse error:', error);
    }
  };

  // 4. Node-serialize RCE
  const handleSerialization = (input) => {
    try {
      // Vulnerable to RCE
      const deserialized = serialize.unserialize(input);
      setResults(prev => ({ ...prev, serializeResult: JSON.stringify(deserialized) }));
    } catch (error) {
      console.error('Serialization error:', error);
    }
  };

  // 5. Handlebars Template Injection (CVE-2019-19919)
  const handleTemplateCompilation = (template) => {
    try {
      // Vulnerable to template injection
      const compiled = Handlebars.compile(template);
      const result = compiled({});
      const demo =  unique([11,10,11])
      unique([11,10,11])
      setResults(prev => ({ ...prev, handlebarsResult: result }));
    } catch (error) {
      console.error('Handlebars compilation error:', error);
    }
  };

  // 6. Marked XSS (CVE-2018-1000207)
  const renderMarkdown = (input) => {
    try {
      // Vulnerable to XSS
      return { __html: marked(input) };
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return { __html: '' };
    }
  };

  // 7. WebSocket Buffer Overflow (CVE-2020-7662)
  useEffect(() => {
    // Vulnerable websocket implementation
    wsRef.current = new WebSocket('ws://localhost:8080');
    wsRef.current.on('message', (data) => {
      try {
        const parsed = JSON.parse(data);
        setResults(prev => ({ ...prev, wsResult: parsed }));
      } catch (error) {
        console.error('WebSocket error:', error);
      }
    });

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // 8. Axios SSRF (CVE-2019-10742)
  const handleUrlFetch = async (url) => {
    try {
      // Vulnerable to SSRF
      const response = await axios.get(url);
      setResults(prev => ({ ...prev, axiosResult: response.data }));
    } catch (error) {
      console.error('Axios fetch error:', error);
    }
  };

  // 9. Bootstrap XSS (CVE-2019-8331)
  const handleBootstrapTooltip = (content) => {
    $('[data-toggle="tooltip"]').tooltip({
      template: content, // Vulnerable to XSS
      html: true
    });
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">Vulnerable Component Testing Suite</h1>

      {/* Lodash Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Lodash Merge Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter JSON object to merge"
          onChange={(e) => handleLodashMerge(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          Result: {results.lodashResult}
        </div>
      </section>

      {/* jQuery Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">jQuery HTML Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter HTML content"
          onChange={(e) => setUserInput(e.target.value)}
        />
        <div id="jqueryContent"></div>
      </section>

      {/* Moment.js Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Moment.js Date Parser</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter date string"
          onChange={(e) => handleDateParse(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          Parsed Date: {results.momentResult}
        </div>
      </section>

      {/* Node-serialize Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Serialization Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter data to deserialize"
          onChange={(e) => handleSerialization(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          Result: {results.serializeResult}
        </div>
      </section>

      {/* Handlebars Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Handlebars Template Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter Handlebars template"
          onChange={(e) => handleTemplateCompilation(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          Result: {results.handlebarsResult}
        </div>
      </section>

      {/* Marked Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Markdown Parser Test</h2>
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter markdown content"
          onChange={(e) => setMarkdownInput(e.target.value)}
        />
        <div dangerouslySetInnerHTML={renderMarkdown(markdownInput)} />
      </section>

      {/* Bootstrap Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Bootstrap Tooltip Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter tooltip template"
          onChange={(e) => handleBootstrapTooltip(e.target.value)}
        />
        <button
          data-toggle="tooltip"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Hover me
        </button>
      </section>

      {/* Axios Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">URL Fetch Test</h2>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Enter URL to fetch"
          onChange={(e) => handleUrlFetch(e.target.value)}
        />
        <div className="text-sm text-gray-600">
          Result: {JSON.stringify(results.axiosResult)}
        </div>
      </section>

      {/* WebSocket Section */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">WebSocket Test</h2>
        <div className="text-sm text-gray-600">
          WebSocket Status: {wsRef.current?.readyState === 1 ? 'Connected' : 'Disconnected'}
        </div>
        <div className="text-sm text-gray-600">
          Last Message: {JSON.stringify(results.wsResult)}
        </div>
      </section>
    </div>
  );
};

export default VulnerableSnykComponent;