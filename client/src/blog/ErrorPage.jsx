import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <section data-aos="fade-up" className="container error-page">
      <div className="center">
        <Link to="/" className="btn btn-primary">Kthehu</Link>
        <h3>Faqja nuk u gjet!</h3>
      </div>
    </section>
  );
};

export default ErrorPage;
