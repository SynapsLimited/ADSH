'use client'; // Mark as a client component

import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  _id: string; // Changed from `id` to `_id` to match Mongoose and API
  name: string;
  token?: string; // Optional, as it may not always be present
  email?: string; // Optional, added to match API response
  avatar?: string; // Optional, added to match user model
  posts?: number; // Optional, added to match user model
}

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('UserContext must be used within a UserProvider');
  return context;
};