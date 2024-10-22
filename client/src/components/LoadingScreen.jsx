// LoadingScreen.jsx
import React from 'react';
import './../css/loadingscreen.css'; // Import your CSS styles
import logoWhite from '../assets/Logo-White.png'; // Adjust the path as necessary

function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="spinner-container">
        {/* Logo Image */}
        <img src={logoWhite} alt="Logo" className="logo-image" />

        {/* Circles */}
        <div className="outer-circle">
          <div className="inner-circle"></div>
        </div>

        {/* Orbiting Dots */}
        <div className="orbit-container">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="orbit-dot"
              style={{
                transform: `rotate(${index * 60}deg) translateY(-96px) rotate(-${index * 60}deg)`, // Adjusted translateY
                animation: `orbit 3s linear infinite, twinkle 1.5s ease-in-out infinite ${
                  index * 0.25
                }s`,
              }}
            ></div>
          ))}
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
