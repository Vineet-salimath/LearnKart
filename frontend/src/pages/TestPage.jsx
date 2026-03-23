import React from 'react';

const TestPage = () => {
  return (
    <div style={{
      padding: '50px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontSize: '24px',
      color: '#333'
    }}>
      <h1>🚀 React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestPage;