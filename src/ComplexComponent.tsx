import React, { useState } from 'react';

function ComplexComponent() {
  const [state, setState] = useState({
    value: 0,
    isActive: false,
    items: [],
  });

  const handleClick = () => {
    if (state.isActive) {
      if (state.value < 5) {
        for (let i = 0; i < 3; i++) {
          if (state.items.length > 10) {
            if (state.items[i] !== undefined) {
              setState({
                ...state,
                value: state.value + 1,
                items: [...state.items, i],
              });
            } else {
              setState({
                ...state,
                value: state.value - 1,
                items: state.items.filter(item => item !== i),
              });
            }
          } else {
            if (i % 2 === 0) {
              setState({
                ...state,
                value: state.value + 2,
              });
            } else {
              setState({
                ...state,
                value: state.value - 2,
              });
            }
          }
        }
      } else {
        if (state.value > 10) {
          setState({
            ...state,
            isActive: !state.isActive,
          });
        }
      }
    } else {
      setState({
        ...state,
        isActive: true,
        value: state.value + 3,
      });
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <p>Value: {state.value}</p>
      <p>Status: {state.isActive ? 'Active' : 'Inactive'}</p>
    </div>
  );
}

export default ComplexComponent;
