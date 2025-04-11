// src/pages/UserProfile.jsx

import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaCheck } from "react-icons/fa";
import './../css/blog.css';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const UserProfile = () => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');

  const { currentUser } = useContext(UserContext);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const token = currentUser?.token;
  const navigate = useNavigate();

  // Redirect to login page for any user who isn't logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        const { name, email, avatar } = response.data;
        setName(name);
        setEmail(email);
        setAvatarPreview(avatar);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [currentUser.id, token]);

  const changeAvatarHandler = async () => {
    try {
      if (!avatar) return;

      const formData = new FormData();
      formData.append('avatar', avatar);

      // Call backend to upload the avatar and update user profile
      await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setError('');
    } catch (error) {
      console.error(t('userProfile.errorChangingAvatar'), error);
      setError(t('userProfile.failedUpdateAvatar'));
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword,
      };
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        navigate('/logout');
      }
    } catch (error) {
      setError(error.response?.data?.message || t('userProfile.error'));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
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
            {/* Form to update avatar */}
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

          <h1>{currentUser.name}</h1>

          {/* Form to update user details */}
          <form className="form profile-form" onSubmit={updateUserDetails}>
            {error && <p className="form-error-message">{t('userProfile.error')}: {error}</p>}
            <input type="text" placeholder={t('userProfile.fullName')} value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder={t('userProfile.email')} value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder={t('userProfile.currentPassword')} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder={t('userProfile.newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder={t('userProfile.confirmNewPassword')} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type="submit" className='btn btn-primary btn-submit-profile'>{t('userProfile.updateDetails')}</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
