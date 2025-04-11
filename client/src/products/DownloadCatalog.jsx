// src/components/DownloadCatalog.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Loader from '../components/Loader'; // Import the Loader component
import { useTranslation } from 'react-i18next';

// Helper functions for slugifying and normalizing categories
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -

const normalizeCategory = (slug) =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

// Helper function to convert array buffer to Base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Helper function to add footers with page numbers aligned to the left
const addFooter = (doc, t) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 20; // Define a fixed left margin

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('ManjariBold', 'bold'); // Use ManjariBold for footers
    doc.setFontSize(10);
    // Align footer to the left using the fixed left margin
    doc.text(`${t('downloadCatalog.page')} ${i} ${t('downloadCatalog.of')} ${pageCount}`, leftMargin, pageHeight - 10);
  }
};

// Helper function to register custom fonts
const loadFonts = async (doc) => {
  const fontBaseUrl = '/fonts/'; // Path to fonts in public folder
  const fonts = [
    // Manjari Fonts
    { name: 'Manjari-Regular.ttf', fontName: 'ManjariRegular', fontStyle: 'normal' },
    { name: 'Manjari-Thin.ttf', fontName: 'ManjariThin', fontStyle: 'normal' },
    { name: 'Manjari-Bold.ttf', fontName: 'ManjariBold', fontStyle: 'bold' },
  ];

  for (const font of fonts) {
    try {
      const response = await fetch(`${fontBaseUrl}${font.name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${font.name}`);
      }
      const buffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      doc.addFileToVFS(font.name, base64);
      doc.addFont(font.name, font.fontName, font.fontStyle);
    } catch (error) {
      console.error(`Error loading font ${font.name}:`, error);
    }
  }
};

// Helper function to convert image URL to data URL with optimized settings
const getImageDataUrl = async (
  url,
  desiredWidthMM,
  desiredHeightMM,
  dpi = 150, // Reduced DPI from 300 to 150
  outputFormat = 'JPEG', // Changed default to 'JPEG'
  quality = 0.85, // Increased JPEG quality to 0.85 for better clarity
  borderRadius = 0 // Default border radius
) => {
  try {
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous'); // To avoid CORS issues

    // Load the image
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    // Convert desired physical size in mm to pixels
    const pxPerMm = dpi / 25.4; // pixels per mm
    const desiredWidthPx = desiredWidthMM * pxPerMm;
    const desiredHeightPx = desiredHeightMM * pxPerMm;

    // Calculate aspect ratio
    const aspectRatio = img.width / img.height;

    let targetWidthPx = desiredWidthPx;
    let targetHeightPx = desiredHeightPx;

    if (img.width > img.height) {
      targetHeightPx = desiredWidthPx / aspectRatio;
    } else {
      targetWidthPx = desiredHeightPx * aspectRatio;
    }

    // Prevent upscaling
    targetWidthPx = Math.min(targetWidthPx, img.width);
    targetHeightPx = Math.min(targetHeightPx, img.height);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPx;
    canvas.height = targetHeightPx;
    const ctx = canvas.getContext('2d');

    if (borderRadius > 0) {
      // Draw rounded rectangle
      ctx.beginPath();
      ctx.moveTo(borderRadius, 0);
      ctx.lineTo(targetWidthPx - borderRadius, 0);
      ctx.quadraticCurveTo(targetWidthPx, 0, targetWidthPx, borderRadius);
      ctx.lineTo(targetWidthPx, targetHeightPx - borderRadius);
      ctx.quadraticCurveTo(targetWidthPx, targetHeightPx, targetWidthPx - borderRadius, targetHeightPx);
      ctx.lineTo(borderRadius, targetHeightPx);
      ctx.quadraticCurveTo(0, targetHeightPx, 0, targetHeightPx - borderRadius);
      ctx.lineTo(0, borderRadius);
      ctx.quadraticCurveTo(0, 0, borderRadius, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Fill background with white if outputFormat is JPEG to avoid black corners
    if (outputFormat.toUpperCase() === 'JPEG') {
      ctx.fillStyle = '#FFFFFF'; // White background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Draw the image onto the canvas with the new dimensions
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);

    // Use the specified format and quality for compression
    const dataURL = canvas.toDataURL(`image/${outputFormat}`, quality);
    return { dataURL, width: targetWidthPx, height: targetHeightPx };
  } catch (error) {
    console.error('Error loading image for PDF:', error);
    throw error;
  }
};

// Helper function to capitalize the first letter
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Helper function to estimate the height required for a product
const estimateProductHeight = (doc, product, containerWidth, imageHeightMM, currentLanguage) => {
  let height = 0;

  // Product Name
  doc.setFont('ManjariBold', 'bold');
  doc.setFontSize(16);
  const nameText = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const splitName = doc.splitTextToSize(nameText, containerWidth);
  height += splitName.length * 7 + 10; // 7mm per line + spacing

  // Product Image
  if (product.images && product.images.length > 0) {
    height += imageHeightMM + 15; // Image height + spacing
  }

  // Variations
  const variations = currentLanguage === 'en' ? product.variations_en : product.variations;
  if (variations && variations.length > 0) {
    doc.setFont('ManjariRegular', 'normal');
    doc.setFontSize(14);
    const variationsText = `${variations.join(', ')}`;
    const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
    height += splitVariations.length * 7 + 7; // 7mm per line + spacing
  }

  // Description
  doc.setFont('ManjariThin', 'normal');
  doc.setFontSize(12);
  const descriptionText = currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
  height += splitDescription.length * 7 + 10; // 7mm per line + spacing

  // Additional padding at the bottom
  height += 10;

  return height;
};

// Helper function to add a cover page with additional sections
const addCoverPage = async (doc, category, bgDataURL, categoryTranslationMap, currentLanguage, t) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // Fixed margin in mm
  const containerWidth = pageWidth - 2 * margin; // 170mm
  const centerX = pageWidth / 2;

  try {
    // Add background image
    doc.addImage(bgDataURL, 'JPEG', 0, 0, pageWidth, pageHeight); // Full-page background in JPEG

    // Add logo with border radius 22px
    const logoUrl = '/assets/Logo-Red.png'; // Ensure this path is correct and points to the red logo
    const desiredLogoWidthMM = 80; // Optimized width to 80mm
    const desiredLogoHeightMM = 60; // Optimized height to 60mm

    const imgDataObj = await getImageDataUrl(
      logoUrl,
      desiredLogoWidthMM,
      desiredLogoHeightMM,
      150, // Reduced DPI
      'PNG', // Changed to 'PNG' for the logo to maintain transparency and border radius
      0.85, // Increased JPEG quality (irrelevant for PNG but kept for consistency)
      0 // Border radius set to 22px
    );
    const { dataURL } = imgDataObj;

    // Calculate centered position
    const imgX = (pageWidth - desiredLogoWidthMM) / 2;
    const imgY = pageHeight * 0.05; // Reduced top padding to 5%
    doc.addImage(dataURL, 'PNG', imgX, imgY, desiredLogoWidthMM, desiredLogoHeightMM); // Use 'PNG' format for logo

    let currentY = imgY + desiredLogoHeightMM + 10; // Reduced spacing after logo to 10mm

    // Add Catalog Title (h1)
    doc.setFont('ManjariBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `${t('downloadCatalog.catalogFor')} ${capitalizeFirstLetter(categoryTranslationMap[category])}`
      : t('downloadCatalog.fullCatalog');
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Reduced spacing after title to 15mm

    // Add Mission Statement (p)
    doc.setFont('ManjariThin', 'normal');
    doc.setFontSize(12);
    const missionText = category
      ? t('downloadCatalog.missionTextCategory', {
          category: capitalizeFirstLetter(categoryTranslationMap[category]),
        })
      : t('downloadCatalog.missionTextFull');
    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });

    currentY += splitMission.length * 7 + 15; // Reduced spacing after mission statement to 15mm

    // Function to add a section with centered title and paragraph
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('ManjariBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Reduced spacing after section title to 7mm

      // Add Section Paragraph
      doc.setFont('ManjariThin', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Reduced spacing after section to 15mm
    };

    // Add "About Us" Section
    addSection(t('downloadCatalog.aboutUsTitle'), t('downloadCatalog.aboutUsText'));

    // Add "Our Products" Section
    addSection(t('downloadCatalog.productsTitle'), t('downloadCatalog.productsText'));

    // Add "Company Values" Section
    addSection(t('downloadCatalog.valuesTitle'), t('downloadCatalog.valuesText'));
  } catch (error) {
    console.error('Error loading logo image:', error);
    // Proceed without the logo

    // Starting Y position
    let currentY = margin + 30; // Increased starting Y position

    // Add Catalog Title (h1)
    doc.setFont('ManjariBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `${capitalizeFirstLetter(categoryTranslationMap[category])} ${t('downloadCatalog.catalog')}`
      : t('downloadCatalog.fullCatalog');
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Increased spacing after title

    // Add Mission Statement (p)
    doc.setFont('ManjariThin', 'normal');
    doc.setFontSize(12);
    const missionText = category
      ? t('downloadCatalog.missionTextCategory', {
          category: capitalizeFirstLetter(categoryTranslationMap[category]),
        })
      : t('downloadCatalog.missionTextFull');

    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });

    currentY += splitMission.length * 7 + 15; // Increased spacing after mission statement

    // Function to add a section with centered title and paragraph
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('ManjariBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Reduced spacing after section title to 7mm

      // Add Section Paragraph
      doc.setFont('ManjariThin', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Reduced spacing after section to 15mm
    };

    // Add "About Us" Section
    addSection(t('downloadCatalog.aboutUsTitle'), t('downloadCatalog.aboutUsText'));

    // Add "Our Products" Section
    addSection(t('downloadCatalog.productsTitle'), t('downloadCatalog.productsText'));

    // Add "Company Values" Section
    addSection(t('downloadCatalog.valuesTitle'), t('downloadCatalog.valuesText'));

    // Add a new page after the cover
    doc.addPage();
  }
};

const DownloadCatalog = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const downloadInitiated = useRef(false);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  // Normalize the category parameter if provided
  const normalizedCategory = category ? normalizeCategory(category) : null;

  // Mapping from English category names to translations
  const categoryTranslationMap = {
    Dairy: currentLanguage === 'en' ? 'Dairy' : 'Bulmetore',
    'Ice Cream': currentLanguage === 'en' ? 'Ice Cream' : 'Akullore',
    Pastry: currentLanguage === 'en' ? 'Pastry' : 'Pastiçeri',
    Bakery: currentLanguage === 'en' ? 'Bakery' : 'Furra',
    Packaging: currentLanguage === 'en' ? 'Packaging' : 'Ambalazhe',
    'Dried Fruits': currentLanguage === 'en' ? 'Dried Fruits' : 'Fruta të thata',
    Equipment: currentLanguage === 'en' ? 'Equipment' : 'Pajisje',
    'All Products': currentLanguage === 'en' ? 'All Products' : 'Të gjitha produktet',
    Other: currentLanguage === 'en' ? 'Other' : 'Të tjera',
  };

  useEffect(() => {
    const fetchAndDownload = async () => {
      if (downloadInitiated.current) return;
      downloadInitiated.current = true;

      try {
        // Fetch all products
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Filter products by category if a category is specified (using normalizedCategory)
        const filteredProducts = normalizedCategory
          ? data.filter(
              (product) =>
                product.category && product.category === normalizedCategory
            )
          : data;

        if (filteredProducts.length === 0) {
          alert(t('downloadCatalog.noProductsInCategory'));
          navigate('/'); // Redirect to Home.jsx
          return;
        }

        // Sort products alphabetically by name in the current language
        const sortedProducts = filteredProducts.sort((a, b) => {
          const nameA =
            currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB =
            currentLanguage === 'en' ? b.name_en || b.name : b.name;
          return nameA.localeCompare(nameB);
        });

        // Initialize jsPDF with optimized settings
        const doc = new jsPDF('p', 'mm', 'a4');

        // Load custom fonts
        await loadFonts(doc);

        // Set default font to ManjariRegular
        doc.setFont('ManjariRegular', 'normal');

        // **Load the high-resolution background image once**
        const bgUrl = '/assets/ADSH PDF BG.jpg';
        const bgDataObj = await getImageDataUrl(
          bgUrl,
          210, // A4 width in mm
          297, // A4 height in mm
          150,
          'JPEG',
          0.85,
          0
        );
        const bgDataURL = bgDataObj.dataURL;

        // Add Cover Page with additional sections and background
        await addCoverPage(doc, normalizedCategory, bgDataURL, categoryTranslationMap, currentLanguage, t);

        // Initialize coordinates after the cover page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const containerWidth = pageWidth - 2 * margin;
        const centerX = pageWidth / 2;

        for (const product of sortedProducts) {
          // Add a new page for each product
          doc.addPage();

          // **Add background image to the new page**
          doc.addImage(bgDataURL, 'JPEG', 0, 0, pageWidth, pageHeight);

          // Desired physical size for product image (optimized)
          const originalWidthMM = (1920 / 150) * 25.4;
          const originalHeightMM = (1080 / 150) * 25.4;
          const scaledWidthMM = originalWidthMM * 1.4;
          const scaledHeightMM = originalHeightMM * 1.4;

          // Adjust scaled size to fit within page margins
          const maxWidthMM = containerWidth;
          const maxHeightMM = pageHeight - 2 * margin;

          let finalWidthMM = scaledWidthMM;
          let finalHeightMM = scaledHeightMM;

          if (finalWidthMM > maxWidthMM) {
            const scalingFactor = maxWidthMM / finalWidthMM;
            finalWidthMM = maxWidthMM;
            finalHeightMM = finalHeightMM * scalingFactor;
          }

          if (finalHeightMM > maxHeightMM) {
            const scalingFactor = maxHeightMM / finalHeightMM;
            finalHeightMM = maxHeightMM;
            finalWidthMM = finalWidthMM * scalingFactor;
          }

          const requiredHeight = estimateProductHeight(
            doc,
            product,
            containerWidth,
            finalHeightMM,
            currentLanguage
          );

          const yStart = (pageHeight - requiredHeight) / 2;
          let y = yStart;

          // Add Product Name (h3)
          doc.setFont('ManjariBold', 'bold');
          doc.setFontSize(16);
          const nameText =
            currentLanguage === 'en' ? product.name_en || product.name : product.name;
          const splitName = doc.splitTextToSize(nameText, containerWidth);
          doc.text(splitName, centerX, y, { align: 'center' });
          y += splitName.length * 7 + 10;

          // Add Product Image (centered)
          if (product.images && product.images.length > 0) {
            try {
              const imgDataObj = await getImageDataUrl(
                product.images[0],
                finalWidthMM,
                finalHeightMM,
                150,
                'JPEG',
                0.85,
                0
              );
              const { dataURL } = imgDataObj;
              const imgX = (pageWidth - finalWidthMM) / 2;
              doc.addImage(dataURL, 'JPEG', imgX, y, finalWidthMM, finalHeightMM);
              y += finalHeightMM + 10;
            } catch (error) {
              console.error(`Error loading image for product ${product.name}:`, error);
              y += 10;
            }
          } else {
            y += 10;
          }

          // Add Variations (in reddish color)
          const variations =
            currentLanguage === 'en' ? product.variations_en : product.variations;
          if (variations && variations.length > 0) {
            doc.setFont('ManjariRegular', 'normal');
            doc.setFontSize(14);
            doc.setTextColor(237, 32, 90);
            const variationsText = `${variations.join(', ')}`;
            const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
            doc.text(splitVariations, centerX, y, { align: 'center' });
            y += splitVariations.length * 7 + 5;
            doc.setTextColor(0, 0, 0);
          }

          // Add Description (p) with centered alignment
          doc.setFont('ManjariThin', 'normal');
          doc.setFontSize(12);
          const descriptionText =
            currentLanguage === 'en' ? product.description_en || product.description : product.description;
          const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
          splitDescription.forEach((line) => {
            if (y + 7 > pageHeight - margin) {
              doc.addPage();
              doc.addImage(bgDataURL, 'JPEG', 0, 0, pageWidth, pageHeight);
              y = margin + 10;
            }
            doc.text(line, centerX, y, { align: 'center' });
            y += 7;
          });

          y += 15;
        }

        // Add footers with page numbers aligned to the left
        addFooter(doc, t);

        // Save the PDF with a file name based on the category (if provided)
        const fileName = normalizedCategory
          ? `${capitalizeFirstLetter(categoryTranslationMap[normalizedCategory])}_${t('downloadCatalog.catalog')}.pdf`
          : `${t('downloadCatalog.fullCatalog')}.pdf`;
        doc.save(fileName);

        setIsLoading(false);
        navigate('/');
      } catch (error) {
        console.error('Error generating catalog PDF:', error);
        alert(
          `${t('downloadCatalog.errorGeneratingCatalog')}: ${error.message}. ${t(
            'downloadCatalog.pleaseTryAgain'
          )}`
        );
        navigate('/products');
      }
    };

    fetchAndDownload();
  }, [normalizedCategory, navigate, currentLanguage, t]);

  return (
    <div>
      {isLoading ? (
        <Loader /> // Display Loader while generating PDF
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>{t('downloadCatalog.downloadCompleted')}</p>
        </div>
      )}
    </div>
  );
};

export default DownloadCatalog;
