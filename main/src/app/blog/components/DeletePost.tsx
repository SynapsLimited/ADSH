'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';


interface DeletePostProps {
  postId: string;
}

const DeletePost = ({ postId }: DeletePostProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { currentUser } = useUserContext();
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  const removePost = async () => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/blog/posts/${postId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        router.push('/blog');
      }
    } catch (error) {
      console.log(t('deletePost.error'), error);
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removePost}
    >
      {t('deletePost.delete')}
    </button>
  );
};

export default DeletePost;