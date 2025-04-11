'use client';

import React from 'react';
import '@/css/backgroundanimation.css';

const BackgroundAnimation: React.FC = () => {
  const fireflies = Array.from({ length: 15 }, (_, i) => (
    <div key={i} className={`firefly firefly-${i + 1}`}></div>
  ));

  return <div className="background-animation">{fireflies}</div>;
};

export default BackgroundAnimation;