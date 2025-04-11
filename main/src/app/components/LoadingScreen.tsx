'use client';

import React from 'react';
import '@/css/loadingscreen.css';

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        <img src="/assets/Logo-White.png" alt="Logo" className="logo-image" />
        <div className="outer-circle">
          <div className="inner-circle"></div>
        </div>
        <div className="orbit-container">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="orbit-dot"
              style={{
                transform: `rotate(${index * 60}deg) translateY(-96px) rotate(-${index * 60}deg)`,
                animation: `orbit 3s linear infinite, twinkle 1.5s ease-in-out infinite ${index * 0.25}s`,
              }}
            ></div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;