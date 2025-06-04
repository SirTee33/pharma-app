import React from 'react';
import '../styles/ProgressBar.css';

const ProgressBar = ({ progress, striped = false, animated = false, color = '#4caf50' }) => {
  const barStyle = {
    width: `${progress}%`,
    backgroundColor: color,
    backgroundImage: striped
      ? 'repeating-linear-gradient(45deg, rgba(255,255,255,.15), rgba(255,255,255,.15) 10px, transparent 10px, transparent 20px)'
      : 'none',
    transition: animated ? 'width 0.5s ease-in-out' : 'none',
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={barStyle}>
        <span className="progress-bar-text">{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
