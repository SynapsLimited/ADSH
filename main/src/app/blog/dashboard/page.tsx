'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useUserContext } from '@/context/userContext';
import axios from 'axios';
import Loader from '@/components/Loader';
import DeletePost from '@/blog/components/DeletePost';
import { useTranslation } from 'react-i18next';

interface Post {
  _id: string;
  title: string;
  thumbnail: string;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useUserContext();
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) router.push('/login');
  }, [token, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/blog/posts/users/${id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    if (id) fetchPosts();
  }, [id, token]);

  if (isLoading) return <Loader />;

  return (
    <section data-aos="fade-up" className="dashboard">
      <div className="blog-title-filtered">
        <h1>{t('dashboard.title')}</h1>
      </div>
      {posts.length ? (
        <div className="container dashboard-container">
          {posts.map((post) => (
            <article key={post._id} className="dashboard-post">
              <div className="dashboard-post-info">
                <div className="dashboard-post-thumbnail">
                  <img src={post.thumbnail} alt={post.title} />
                </div>
                <h4>{post.title}</h4>
              </div>
              <div className="dashboard-post-actions">
                <Link href={`/blog/posts/${post._id}`} className="btn btn-primary">
                  {t('dashboard.view')}
                </Link>
                <Link href={`/blog/posts/${post._id}/edit`} className="btn btn-primary">
                  {t('dashboard.edit')}
                </Link>
                <DeletePost postId={post._id} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">{t('dashboard.noPosts')}</h2>
      )}
    </section>
  );
};

export default Dashboard;