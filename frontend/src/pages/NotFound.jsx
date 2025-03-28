import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
    fontSize: '4rem',
    marginBottom: '20px',
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    marginBottom: '30px',
  };

  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    background: '#fff',
    color: '#333',
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>404</h1>
      <p style={subtitleStyle}>Page Not Found</p>
      <Link to="/" style={buttonStyle}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
