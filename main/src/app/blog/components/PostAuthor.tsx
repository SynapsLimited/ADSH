'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios, { AxiosError } from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import sq from 'javascript-time-ago/locale/sq.json';
import { useTranslation } from 'react-i18next';
import '@/css/blog.css';


TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(sq);

interface PostAuthorProps {
  authorID: string;
  createdAt: string;
}

interface Author {
  name: string;
  avatar?: string;
}

const PostAuthor = ({ authorID, createdAt }: PostAuthorProps) => {
  const [author, setAuthor] = useState<Author>({ name: 'ADSH' });
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const timeAgoLocale = currentLanguage === 'sq' ? 'sq' : 'en-US';
  const defaultAvatar = '/assets/Avatar-default.png';

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/users/${authorID}`);
        setAuthor(response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          'Error fetching author:',
          axiosError.response?.data || axiosError.message
        );
      }
    };
    if (typeof authorID === 'string') getAuthor();
    else console.error('Invalid authorID:', authorID);
  }, [authorID]);

  return (
    <Link href={`/blog/posts/users/${authorID}`} className="post-author">
      <div className="post-author-avatar">
        <img src={author.avatar || defaultAvatar} alt={author.name} />
      </div>
      <div className="post-author-details">
        <h5>{author.name}</h5>
        {createdAt && (
          <small>
            <ReactTimeAgo date={new Date(createdAt)} locale={timeAgoLocale} />
          </small>
        )}
      </div>
    </Link>
  );
};

export default PostAuthor;