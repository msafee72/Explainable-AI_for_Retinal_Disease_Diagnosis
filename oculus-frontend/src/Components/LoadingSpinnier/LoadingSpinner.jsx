import React from 'react';

const LoadingSpinner = ({ message = 'Loading...' }) => {
  const spinnerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    width: '100%',
    padding: '20px'
  };

  const spinnerCircleStyle = {
    width: '40px',
    height: '40px',
    margin: '0 auto',
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '50%',
    borderTop: '4px solid #3498db',
    animation: 'spin 1s linear infinite'
  };

  const spinnerMessageStyle = {
    marginTop: '15px',
    fontSize: '16px',
    color: '#333',
    textAlign: 'center'
  };

  return (
    <div style={spinnerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerCircleStyle}></div>
      <div style={spinnerMessageStyle}>{message}</div>
    </div>
  );
};

export default LoadingSpinner;