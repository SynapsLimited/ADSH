import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import axios from 'axios';
import Loader from '@/components/Loader';
import DeleteProduct from '@/products/components/DeleteProduct';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const ProductDashboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(UserContext);
  const currentUser = context?.currentUser;
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userProducts = response.data.filter((product: any) => {
          if (product.creator) {
            const creatorId = typeof product.creator === 'object' ? product.creator.id.toString() : product.creator.toString();
            const currentUserId = currentUser?.id?.toString();
            return creatorId === currentUserId;
          }
          return false;
        });
        setProducts(userProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(t('Failed to fetch products.'));
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, [currentUser?.id, token, t]); // Removed currentUser?._id from dependencies

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section data-aos="fade-up" className="dashboard">
      <div className="blog-title-filtered">
        <h1>{t('productDashboard')}</h1>
      </div>
      {products.length ? (
        <div className="container dashboard-container">
          {products.map((product) => (
            <article key={product.slug} className="dashboard-post">
              <div className="dashboard-post-info">
                <div className="dashboard-post-thumbnail">
                  <img src={product.images[0]} alt={product.name} />
                </div>
                <h4>{product.name}</h4>
              </div>
              <div className="dashboard-post-actions">
                <Link href={`/products/${product.slug}`} className="btn btn-primary">
                  {t('view')}
                </Link>
                <Link href={`/products/${product.slug}/edit`} className="btn btn-primary">
                  {t('edit')}
                </Link>
                <DeleteProduct slug={product.slug} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">{t('noProductsFound')}</h2>
      )}
    </section>
  );
};

export default ProductDashboard;