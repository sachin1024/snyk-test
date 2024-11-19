import React, { useState } from 'react';

function BadCodeComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [isActive, setIsActive] = useState(false);

  // Large function that handles multiple unrelated tasks
  const handleActions = () => {
    // Task 1: Increment count
    setCount(count + 1);

    // Task 2: Toggle active status
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }

    // Task 3: Handle user input text
    if (text.length > 5) {
      setText(text.slice(0, 5)); // Truncate text to 5 characters
    } else {
      setText(text.toUpperCase());
    }

    // Task 4: Unnecessary repeated logic
    if (text === 'hello') {
      setCount(count + 2); // Duplicated logic: Increasing count
    }

    // Task 5: Repeated check, redundant code
    if (text === 'world') {
      setText('worldworldworld'); // Unnecessary manipulation of text
    }

    // Task 6: Unnecessary complex logic for simple task
    if (count < 10) {
      if (isActive && text.length > 0) {
        setCount(count + 3);
      } else {
        setCount(count + 1);
      }
    }

    // Repeated state updates
    setCount(count + 1); // Unnecessary state update here
  };

  // A redundant function
  const handleReset = () => {
    setCount(0);
    setText('');
    setIsActive(false);
  };

  // Function that does nothing and is never used
  const unusedFunction = () => {
    console.log('This does nothing');
  };

  return (
    <div>
      <button onClick={handleActions}>Execute Actions</button>
      <button onClick={handleReset}>Reset</button>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

export default BadCodeComponent;
