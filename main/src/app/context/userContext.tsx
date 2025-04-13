'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Restore user state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setCurrentUser({ _id: '', name: '', token: storedToken });
    }
  }, []);

  // Custom setter to persist token in localStorage
  const setUserWithPersistence = (user: User | null) => {
    setCurrentUser(user);
    if (user?.token) {
      localStorage.setItem('token', user.token);
    } else {
      localStorage.removeItem('token');
    }
  };

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