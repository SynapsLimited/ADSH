// src/components/LogoShowcase.jsx

import React from 'react';
import './../css/logoshowcase.css'; // Import the corresponding CSS

const LogoShowcase = () => {
  return (
    <section className="logoshowcase" id="logoshowcase">
      <div className="container">
        <div className="row wow animate__animated animate__fadeInUp animate__slow">
          <div className="logoshowcase-item">
            <div className="logoshowcase-img">
              <img src="/assets/Logo-White.png" alt="Logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoShowcase;
