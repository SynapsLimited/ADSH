// src/components/PostAuthor.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactTimeAgo from 'react-time-ago';
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import sq from 'javascript-time-ago/locale/sq.json';

import { useTranslation } from 'react-i18next';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(sq);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState({});
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const timeAgoLocale = currentLanguage === 'sq' ? 'sq' : 'en-US';

  const defaultAvatar = `${process.env.PUBLIC_URL}/assets/Avatar-default.png`;

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${authorID}`);
        setAuthor(response?.data);
      } catch (error) {
        console.error('Error fetching author:', error.response?.data || error.message);
      }
    };

    if (typeof authorID === 'string') {
      getAuthor();
    } else {
      console.error('Invalid authorID:', authorID);
    }
  }, [authorID]);

  return (
    <Link to={`/posts/users/${authorID}`} className="post-author">
      <div className="post-author-avatar">
        <img src={author?.avatar || defaultAvatar} alt={author?.name || 'Author Avatar'} />
      </div>
      <div className="post-author-details">
        <h5>{author?.name || 'ADSH'}</h5>
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
