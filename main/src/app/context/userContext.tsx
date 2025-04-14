'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

interface User {
  _id: string;
  name: string;
  token?: string;
  email?: string;
  avatar?: string;
  posts?: number;
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decodedToken = jwt.decode(storedToken) as { id: string; name: string; exp: number } | null;
        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          setCurrentUser({ _id: decodedToken.id, name: decodedToken.name, token: storedToken });
        } else {
          localStorage.removeItem('token');
          setCurrentUser(null);
          router.push('/');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setCurrentUser(null);
        router.push('/');
      }
    }
  }, [router]);

  const setUserWithPersistence = (user: User | null) => {
    setCurrentUser(user);
    if (user?.token) {
      localStorage.setItem('token', user.token);
      // Set expiration to at least 1 hour if not already set longer
      const decoded = jwt.decode(user.token) as { exp: number } | null;
      const now = Math.floor(Date.now() / 1000);
      const oneHourFromNow = now + 3600; // 1 hour in seconds
      if (!decoded || (decoded.exp && decoded.exp < oneHourFromNow)) {
        console.warn('Token expiration is less than 1 hour; ensure backend sets longer expiration.');
      }
    } else {
      localStorage.removeItem('token');
    }
  };

  // Periodically check token expiration
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwt.decode(token) as { exp: number } | null;
        if (decoded && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setCurrentUser(null);
          router.push('/');
        }
      }
    };
    const interval = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [router]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser: setUserWithPersistence }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('UserContext must be used within a UserProvider');
  return context;
};