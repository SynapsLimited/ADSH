'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  User,
  BookOpen,
  Package,
  ChevronRight,
  LogOut,
  Users,
  PenTool,
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
} from 'lucide-react';
import '@/css/fixedmenu.css';
import { useUserContext } from '@/context/userContext';
import { useTranslation } from 'react-i18next';

interface SubmenuItem {
  icon: React.ReactNode; // Use React.ReactNode instead of JSX.Element for broader compatibility
  label: string;
  link: string;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  submenu: SubmenuItem[];
}

const FixedMenu: React.FC = () => {
  const { t } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useUserContext();

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setActiveMenu(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!currentUser) return null;

  const menuItems: MenuItem[] = [
    {
      icon: <User className="menu-icon" />,
      label: t('fixedMenu.profile'),
      submenu: [
        { icon: <User className="submenu-icon" />, label: t('fixedMenu.profile'), link: `/profile` },
        { icon: <LogOut className="submenu-icon" />, label: t('fixedMenu.logout'), link: `/logout` },
      ],
    },
    {
      icon: <BookOpen className="menu-icon" />,
      label: t('fixedMenu.blog'),
      submenu: [
        { icon: <BookOpen className="submenu-icon" />, label: t('fixedMenu.allPosts'), link: `/blog/posts` },
        { icon: <Users className="submenu-icon" />, label: t('fixedMenu.authors'), link: `/blog/authors` },
        { icon: <PenTool className="submenu-icon" />, label: t('fixedMenu.create'), link: `/blog/create` },
        { icon: <LayoutDashboard className="submenu-icon" />, label: t('fixedMenu.dashboard'), link: `/blog/dashboard` },
      ],
    },
    {
      icon: <Package className="menu-icon" />,
      label: t('fixedMenu.products'),
      submenu: [
        { icon: <ShoppingBag className="submenu-icon" />, label: t('fixedMenu.allProducts'), link: `/products/full-catalog` },
        { icon: <PlusCircle className="submenu-icon" />, label: t('fixedMenu.createProduct'), link: `/products/create` },
        { icon: <LayoutDashboard className="submenu-icon" />, label: t('fixedMenu.productsDashboard'), link: `/products/dashboard` },
      ],
    },
  ];

  const handleMenuToggle = (label: string) => {
    setActiveMenu((prev) => (prev === label ? null : label));
  };

  return (
    <div className="fixed-menu" ref={menuRef}>
      {menuItems.map((item, index) => (
        <div
          className={`menu-item-wrapper ${activeMenu === item.label ? 'active' : ''}`}
          key={index}
        >
          <button
            className={`menu-button ${activeMenu === item.label ? 'active' : ''}`}
            onClick={() => handleMenuToggle(item.label)}
            aria-haspopup="true"
            aria-expanded={activeMenu === item.label}
          >
            {item.icon}
            <span className="menu-label">{item.label}</span>
          </button>
          {activeMenu === item.label && (
            <div className="submenu" role="menu">
              {item.submenu.map((subItem, subIndex) => (
                <Link
                  href={subItem.link}
                  className="submenu-item"
                  key={subIndex}
                  onClick={() => setActiveMenu(null)}
                  role="menuitem"
                >
                  {subItem.icon}
                  <span className="submenu-label">{subItem.label}</span>
                  <ChevronRight className="submenu-chevron" />
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FixedMenu;