import React, { useState } from 'react';

function FaultyComponent() {
  const [value, setValue] = useState(0);
  const [anotherValue, setAnotherValue] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Unnecessary duplicate state handling and updating state in multiple places
  const updateValues = () => {
    if (value > 5) {
      setValue(value + 10);
      setAnotherValue(anotherValue + 5);
      setIsActive(!isActive);
    } else {
      setValue(value + 1);
      setAnotherValue(anotherValue + 2);
      setIsActive(!isActive);
    }
    setValue(value + 3); // Unnecessary state update - potential infinite loop issue
    setAnotherValue(anotherValue + 4); // This could potentially overwrite the value earlier
  };

  const toggleActive = () => {
    if (isActive) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const doSomething = (param1) => {
    if (param1 > 10) {
      setValue(value + 5); // Same logic as above, duplicated code smell
    } else if (param1 < 5) {
      setValue(value + 2); // Again, same logic with slight modification
    } else {
      setValue(value - 1);
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (value > 100) {
      setValue(0); // Large value reset - potential major problem
    } else if (value < 10) {
      setValue(10); // Reset value to a fixed state - unnecessary complexity
    }
  };

  return (
    <div>
      <button onClick={updateValues}>Update Values</button>
      <button onClick={toggleActive}>Toggle Active</button>
      <button onClick={() => doSomething(15)}>Do Something</button>
      <input type="text" onChange={handleChange} />
      <p>Value: {value}</p>
      <p>Another Value: {anotherValue}</p>
      <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

export default FaultyComponent;
