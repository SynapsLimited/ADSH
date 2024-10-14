// src/components/BackgroundAnimation.jsx

import React from 'react';
import './../css/backgroundanimation.css'; // Import the CSS file

const BackgroundAnimation = () => {
  // Generate an array of fireflies
  const fireflies = Array.from({ length: 15 }, (_, i) => (
    <div key={i} className={`firefly firefly-${i + 1}`}></div>
  ));

  return <div className="background-animation">{fireflies}</div>;
};

export default BackgroundAnimation;
