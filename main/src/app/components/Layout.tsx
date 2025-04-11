'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    AOS.init({ once: true });
    AOS.refresh();
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [children]);

  return <div>{children}</div>;
};

export default Layout;