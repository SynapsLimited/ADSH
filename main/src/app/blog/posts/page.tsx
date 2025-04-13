'use client';

import Posts from '../components/Posts';
import '@/css/blog.css';
import { useTranslation } from 'react-i18next';


const PostsPage = () => {
    const { t } = useTranslation();
  return (
    <div>
    <div className="blog-title">
        <h1>{t('blog.intro.heading')}</h1>
        <p>{t('blog.intro.description')}</p>
      </div>
      <Posts />;
      </div>
  )
};

export default PostsPage;