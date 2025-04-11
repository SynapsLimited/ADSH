import React, { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/context/userContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface DeleteProductProps {
  slug: string;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ slug }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const context = useContext(UserContext);
  const currentUser = context?.currentUser;
  const token = currentUser?.token;

  const removeProduct = async () => {
    if (!slug) {
      console.error('Product slug is undefined.');
      toast.error(t("Couldn't delete product."));
      return;
    }
    try {
      const response = await axios.delete(`/api/products/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success(t('Product deleted successfully.'));
        router.push('/products/dashboard');
      }
    } catch (error) {
      toast.error(t("Couldn't delete product."));
    }
  };

  return (
    <button
      className="btn btn-secondary"
      style={{ fontFamily: 'Righteous, sans-serif' }}
      onClick={removeProduct}
    >
      {t('delete')}
    </button>
  );
};

export default DeleteProduct;