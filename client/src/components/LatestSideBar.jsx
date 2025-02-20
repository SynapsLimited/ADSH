import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Milk,
  IceCream,
  Package,
  Nut,
  ChevronLeft,
  Wrench,
  Cake,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./../css/LatestSideBar.css";

// Define the Bread icon for the Bakery category
const Bread = (props) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon-small"
  >
    <path d="M2 12c0-5.523 4.477-10 10-10s10 4.477 10 10v7a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-7z" />
  </svg>
);

function LatestSideBar() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [latestProducts, setLatestProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  // New state to track if the sidebar is closed (hidden)
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);

  // Detect mobile view (viewport width below 1024px)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch latest products when no category is active
  useEffect(() => {
    if (!activeCategory) {
      const fetchLatestProducts = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/products`
          );
          const data = await response.json();
          const sortedByTime = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setLatestProducts(sortedByTime.slice(0, 10));
        } catch (error) {
          console.error("Error fetching latest products:", error);
        }
      };
      fetchLatestProducts();
    }
  }, [activeCategory]);

  // Fetch products for the active category
  useEffect(() => {
    if (activeCategory) {
      const fetchCategoryProducts = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BASE_URL}/products`
          );
          const data = await response.json();
          const filtered = data.filter(
            (product) =>
              product.category &&
              product.category.toLowerCase() === activeCategory.toLowerCase()
          );
          setCategoryProducts(filtered.slice(0, 10));
        } catch (error) {
          console.error("Error fetching category products:", error);
        }
      };
      fetchCategoryProducts();
    }
  }, [activeCategory]);

  // Truncate description using a translation fallback if not available
  const truncateDescription = (description) => {
    if (!description) return t("latestSideBar.noDescription");
    const words = description.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : description;
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) setActiveCategory(null);
  };

  const toggleCategory = (categoryName) => {
    setActiveCategory(activeCategory === categoryName ? null : categoryName);
    if (!isExpanded) setIsExpanded(true);
  };

  const navigateToProduct = (slug) => {
    navigate(`/products/${slug}`);
  };

  // Updated ProductCard: use the proper language for product name and description
  const ProductCard = ({ product }) => {
    const productName =
      currentLanguage === "en" ? product.name_en || product.name : product.name;
    const productDescription =
      currentLanguage === "en"
        ? product.description_en || product.description
        : product.description;
    const imgSrc =
      product.image ||
      (product.images && product.images.length > 0
        ? product.images[0]
        : "/placeholder.svg");
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="product-card">
        <div className="product-image-container" onClick={() => navigateToProduct(product.slug)}>
          <img src={imgSrc} alt={productName} className="product-image" />
          <h3 className="product-title" tabIndex="0" style={{ fontSize: "1rem" }}>
            {productName}
          </h3>
        </div>
        <p className="product-description" style={{ color: "var(--color-background)" }}>
          {truncateDescription(productDescription)}
        </p>
        <button onClick={() => navigateToProduct(product.slug)} className="btn btn-primary">
          {t("latestSideBar.viewDetails")}
        </button>
      </motion.div>
    );
  };

  // Helper to map category names to translation keys
  const getCategoryKey = (name) => {
    switch (name) {
      case "Dairy":
        return "dairy";
      case "Ice Cream":
        return "iceCream";
      case "Pastry":
        return "pastry";
      case "Packaging":
        return "packaging";
      case "Dried Fruits":
        return "driedFruits";
      case "Bakery":
        return "bakery";
      case "Equipment":
        return "equipment";
      default:
        return name;
    }
  };

  const categories = [
    { name: "Dairy", icon: Milk },
    { name: "Ice Cream", icon: IceCream },
    { name: "Pastry", icon: Cake },
    { name: "Packaging", icon: Package },
    { name: "Dried Fruits", icon: Nut },
    { name: "Bakery", icon: Bread },
    { name: "Equipment", icon: Wrench },
  ];

  // Animate width from right to left for both desktop and mobile
  const animationProps = {
    initial: { width: "60px", x: 60, opacity: 0 },
    animate: { width: isExpanded ? "320px" : "60px", x: 0, opacity: 1 },
  };

  return (
    <>
      <AnimatePresence>
        {/* Render sidebar only when it is not closed */}
        {!isSidebarClosed && (
          <motion.div
            key="sidebar"
            className="latest-sidebar"
            {...animationProps}
            exit={{ x: 60, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-container">
              {/* Icons Column */}
              <div className="sidebar-icons">
                <motion.button onClick={toggleSidebar} className="sidebar-toggle-button" whileHover={{ scale: 1.1 }}>
                  <ChevronLeft className={`chevron-icon ${isExpanded ? "rotated" : ""}`} />
                </motion.button>
                {categories.map((category) => (
                  <motion.button
                    key={category.name}
                    onClick={() => toggleCategory(category.name)}
                    className={`sidebar-icon-button ${activeCategory === category.name ? "active" : ""}`}
                    title={t(`categories.${getCategoryKey(category.name)}`)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {React.createElement(category.icon, { className: "icon-small" })}
                  </motion.button>
                ))}
                {/* Updated Close Button with the nicer X icon */}
                <motion.button
                  onClick={() => setIsSidebarClosed(true)}
                  className="sidebar-close-button"
                  whileHover={{ scale: 1.1 }}
                >
                  <X className="icon-small" />
                </motion.button>
              </div>
              {/* Content Area */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="sidebar-content"
                    style={{ color: "var(--color-white)" }}
                  >
                    {activeCategory ? (
                      <div className="category-section">
                        <h2 className="section-heading" style={{ color: "var(--color-white)" }}>
                          {t(`categories.${getCategoryKey(activeCategory)}`)}
                        </h2>
                        <div className="grid-gap-4">
                          {categoryProducts.length > 0 ? (
                            categoryProducts.map((product) => (
                              <ProductCard key={product._id || product.id} product={product} />
                            ))
                          ) : (
                            <p>{t("latestSideBar.noProductsFound")}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="default-section">
                        <section>
                          <h2 className="section-heading section-heading--mb" style={{ color: "var(--color-white)" }}>
                            {t("latestSideBar.latestProducts")}
                          </h2>
                          <div className="grid-gap-4">
                            {latestProducts.length > 0 ? (
                              latestProducts.map((product) => (
                                <ProductCard key={product._id || product.id} product={product} />
                              ))
                            ) : (
                              <p>{t("latestSideBar.noProductsFound")}</p>
                            )}
                          </div>
                        </section>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {/* Render the open button if the sidebar is closed */}
        {isSidebarClosed && (
          <motion.button
            key="openButton"
            className="sidebar-open-button"
            onClick={() => {
              setIsSidebarClosed(false);
              setIsExpanded(true);
              setActiveCategory(null);
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="chevron-icon rotated" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default LatestSideBar;
