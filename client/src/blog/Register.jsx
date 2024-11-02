// src/pages/Register.jsx

import React, { useState } from 'react';
import './../css/blog.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const changeInputHandler = (e) => {
    setUserData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData, {
        withCredentials: true
      });
      if (response && response.data) {
        const newUser = response.data;
        if (!newUser) {
          setError(t('register.error'));
        } else {
          navigate('/login');
        }
      } else {
        setError(t('register.unexpectedError'));
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(t('register.errorResponse', { status: err.response.status, statusText: err.response.statusText }));
        }
      } else if (err.request) {
        setError(t('register.networkError'));
      } else {
        setError(`${t('register.unexpectedError')}: ${err.message}`);
      }
    }
  };

  return (
    <section data-aos="fade-up" className="register">
      <div className="container">
        <div className="blog-title">
          <h1>{t('register.title')}</h1>
        </div>
        <form className="form register-form" onSubmit={registerUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input
            type="text"
            placeholder={t('register.fullName')}
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="text"
            placeholder={t('register.email')}
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder={t('register.password')}
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder={t('register.confirmPassword')}
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn btn-secondary btn-submit">
            {t('register.registerButton')}
          </button>
        </form>
        <small>{t('register.haveAccount')} <Link to="/login">{t('login.title')}</Link></small>
      </div>
    </section>
  );
};

export default Register;
