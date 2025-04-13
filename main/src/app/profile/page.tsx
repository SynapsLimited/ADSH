'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaEdit, FaCheck } from 'react-icons/fa';
import { useUserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';

const UserProfile = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const { currentUser } = useUserContext();
  const router = useRouter();
  const token = currentUser?.token;
  const userId = currentUser?._id; // Use _id instead of id

  useEffect(() => {
    if (!token || !userId) {
      router.push('/login');
    } else {
      const getUser = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { name, email, avatar } = response.data;
          setName(name);
          setEmail(email);
          setAvatarPreview(avatar || '');
        } catch (err) {
          console.error('Error fetching user:', err);
        }
      };
      getUser();
    }
  }, [token, userId, router]);

  const changeAvatarHandler = async () => {
    if (!avatar) return;
    try {
      const formData = new FormData();
      formData.append('avatar', avatar);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/users/change-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setAvatarPreview(response.data.avatar); // Update preview with new URL
      setError('');
      setIsAvatarTouched(false);
    } catch (err: any) {
      setError(err.response?.data?.message || t('userProfile.failedUpdateAvatar'));
    }
  };

  const updateUserDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData = { name, email, currentPassword, newPassword, confirmNewPassword };
      const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/edit-user`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        router.push('/logout'); // Redirect to logout after update
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('userProfile.error'));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
      setIsAvatarTouched(true);
    }
  };

  return (
    <section data-aos="fade-up" className="profile">
      <div className="container profile-container">
        <div className="profile-details">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              <img src={avatarPreview} alt={t('userProfile.avatarAlt')} />
            </div>
            <form className="avatar-form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={handleAvatarChange}
                accept="image/png, image/jpeg, image/webp"
              />
              <label className="btn btn-primary profile-avatar-btn" htmlFor="avatar">
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button
                className="btn btn-primary profile-avatar-btn"
                onClick={changeAvatarHandler}
                type="button"
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser?.name}</h1>
          <form className="form profile-form" onSubmit={updateUserDetails}>
            {error && <p className="form-error-message">{t('userProfile.error')}: {error}</p>}
            <input type="text" placeholder={t('userProfile.fullName')} value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" placeholder={t('userProfile.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input
              type="password"
              placeholder={t('userProfile.currentPassword')}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t('userProfile.newPassword')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder={t('userProfile.confirmNewPassword')}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary btn-submit-profile">
              {t('userProfile.updateDetails')}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;