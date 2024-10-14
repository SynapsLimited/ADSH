import React, { useState } from 'react';
import './../css/blog.css'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Importing useTranslation hook

const Register = () => {
  const { t } = useTranslation(); // Initialize useTranslation hook
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
          setError("Couldn't register user. Please try again.");
        } else {
          navigate('/login');
        }
      } else {
        setError("Unexpected error. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Error: ${err.response.status} ${err.response.statusText}`);
        }
      } else if (err.request) {
        setError('No response received from server. Please check your network connection.');
      } else {
        setError(`An unexpected error occurred: ${err.message}`);
      }
    }
  };

  return (
    <section data-aos="fade-up"   className="register">
      <div  className="container">
        <div  className="blog-title">
          <h1>{t('Register.signUp')}</h1>
        </div>
        <form  className="form register-form" onSubmit={registerUser}>
          {error && <p  className="form-error-message">{error}</p>}
          <input
            type="text"
            placeholder={t('Register.fullNamePlaceholder')}
            name="name"
            value={userData.name}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="text"
            placeholder={t('Register.emailPlaceholder')}
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder={t('Register.passwordPlaceholder')}
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <input
            type="password"
            placeholder={t('Register.confirmPasswordPlaceholder')}
            name="password2"
            value={userData.password2}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn btn-secondary btn-submit">
            {t('Register.registerButton')}
          </button>
        </form>
        <small>{t('Register.signInPrompt')} <Link to="/login">{t('Login.signIn')}</Link></small>
      </div>
    </section>
  );
};

export default Register;
