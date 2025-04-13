'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useUserContext } from '@/context/userContext';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

const Login = () => {
  const { t } = useTranslation();
  const [userData, setUserData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { setCurrentUser } = useUserContext();

  const changeInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const loginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/login`, userData);
      const { token, user } = response.data;
      setCurrentUser({
        _id: user.id,
        name: user.name,
        email: user.email,
        token,
      });
      router.push('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('login.error'));
    }
  };

  return (
    <section data-aos="fade-up" className="login">
      <div className="container">
        <div className="blog-title">
          <h1>{t('login.title')}</h1>
        </div>
        <form className="form login-form" onSubmit={loginUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input
            type="text"
            placeholder={t('login.email')}
            name="email"
            value={userData.email}
            onChange={changeInputHandler}
            autoFocus
          />
          <input
            type="password"
            placeholder={t('login.password')}
            name="password"
            value={userData.password}
            onChange={changeInputHandler}
          />
          <button type="submit" className="btn btn-secondary btn-submit">
            {t('login.loginButton')}
          </button>
        </form>
        <small>
          {t('login.noAccount')} <Link href="/register">{t('login.register')}</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;