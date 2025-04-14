'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

const Register = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const registerUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation for password match
    if (userData.password !== userData.password2) {
      setError(t('register.passwordMismatch'));
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/register`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password2: userData.password2,
      });
      if (response.data) {
        router.push('/');
      } else {
        setError(t('register.unexpectedError'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('register.error'));
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
        <small>
          {t('register.haveAccount')} <Link href="/login">{t('login.title')}</Link>
        </small>
      </div>
    </section>
  );
};

export default Register;