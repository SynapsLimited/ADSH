"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import {
  User,
  LogOut,
  BookOpen,
  Users,
  PenTool,
  LayoutDashboard,
  Package,
  ShoppingBag,
  PlusCircle,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserContext } from "@/context/userContext"
import { useTranslation } from "react-i18next"

type SubMenuItem = {
  icon: React.ReactNode
  label: string
  link: string
}

type MenuItem = {
  icon: React.ReactNode
  label: string
  submenu: SubMenuItem[]
}

export default function FixedMenu() {
  const { t } = useTranslation()
  const { currentUser } = useUserContext()
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const submenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenu !== null &&
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveMenu(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [activeMenu])

  if (!currentUser) return null

  const menuItems: MenuItem[] = [
    {
      icon: <User className="h-5 w-5" />,
      label: t("fixedMenu.profile"),
      submenu: [
        { icon: <User className="h-4 w-4" />, label: t("fixedMenu.profile"), link: `/profile` },
        { icon: <LogOut className="h-4 w-4" />, label: t("fixedMenu.logout"), link: `/logout` },
      ],
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: t("fixedMenu.blog"),
      submenu: [
        { icon: <BookOpen className="h-4 w-4" />, label: t("fixedMenu.allPosts"), link: `/blog/posts` },
        { icon: <Users className="h-4 w-4" />, label: t("fixedMenu.authors"), link: `/blog/authors` },
        { icon: <PenTool className="h-4 w-4" />, label: t("fixedMenu.create"), link: `/blog/posts/create` },
        { icon: <LayoutDashboard className="h-4 w-4" />, label: t("fixedMenu.dashboard"), link: `/blog/dashboard` },
      ],
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: t("fixedMenu.products"),
      submenu: [
        {
          icon: <ShoppingBag className="h-4 w-4" />,
          label: t("fixedMenu.allProducts"),
          link: `/products/full-catalog`,
        },
        { icon: <PlusCircle className="h-4 w-4" />, label: t("fixedMenu.createProduct"), link: `/products/create` },
        {
          icon: <LayoutDashboard className="h-4 w-4" />,
          label: t("fixedMenu.productsDashboard"),
          link: `/products/dashboard`,
        },
      ],
    },
  ]

  const toggleMenu = (index: number) => {
    setActiveMenu(activeMenu === index ? null : index)
  }

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        <div
          ref={menuRef}
          className="flex flex-col gap-6 items-center backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-full p-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20"
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => toggleMenu(index)}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                "hover:scale-110 active:scale-95",
                "after:content-[''] after:absolute after:inset-0 after:rounded-full after:opacity-0 after:bg-white/30 after:scale-0 hover:after:scale-100 hover:after:opacity-100 after:transition-all after:duration-300",
                activeMenu === index
                  ? "bg-white/20 text-white shadow-md"
                  : "hover:bg-white/10 text-white/80 hover:text-white",
              )}
            >
              {item.icon}
              {activeMenu === index && <span className="absolute inset-0 rounded-full animate-pulse-ring" />}
            </button>
          ))}
        </div>

        {activeMenu !== null && (
          <div
            ref={submenuRef}
            className="absolute left-20 top-1/2 -translate-y-1/2 min-w-56 backdrop-blur-lg bg-white/10 dark:bg-black/20 rounded-2xl p-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20 animate-in slide-in-from-left-4 fade-in duration-200"
          >
            <div className="py-2 px-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium pl-2">{menuItems[activeMenu].label}</h3>
                <button
                  onClick={() => setActiveMenu(null)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {menuItems[activeMenu].submenu.map((subItem, subIndex) => (
                  <Link
                    key={subIndex}
                    href={subItem.link}
                    className="flex items-center gap-3 text-white/80 hover:text-white px-2 py-2 rounded-lg hover:bg-white/10 transition-colors hover:scale-105 active:scale-95 transition-transform"
                  >
                    <span className="flex-shrink-0">{subItem.icon}</span>
                    <span className="text-sm">{subItem.label}</span>
                    <ChevronRight className="h-4 w-4 ml-auto opacity-60" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}