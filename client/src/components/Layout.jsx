// Layout.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


const Layout = ({ children }) => {
  useEffect(() => {
    AOS.refresh(); // Refresh AOS to detect new elements
  }, [children]); // Re-run when children change (i.e., on route change)

  return (
    <div>
      {children}
    </div>
  );
};

export default Layout;
