'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/userContext';

const Logout = () => {
  const { setCurrentUser } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    setCurrentUser(null);
    router.push('/');
  }, [setCurrentUser, router]);

  return null;
};

export default Logout;