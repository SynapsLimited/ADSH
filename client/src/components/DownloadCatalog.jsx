// src/components/DownloadCatalog.jsx

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import Loader from './Loader'; // Import the Loader component

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
const addFooter = (doc) => {
  const pageCount = doc.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 20; // Define a fixed left margin

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('ManjariThin', 'normal'); // Use 'ManjariThin' font
    doc.setFontSize(10);
    // Align footer to the left using the fixed left margin
    doc.text(`Faqja ${i} nga ${pageCount}`, leftMargin, pageHeight - 10);
  }
};

// Helper function to register custom fonts
const loadFonts = async (doc) => {
  const fontBaseUrl = '/fonts/'; // Path to fonts in public folder
  const fonts = [
    // Manjari Fonts
    { name: 'Manjari-Bold.ttf', fontName: 'ManjariBold', fontStyle: 'bold' },
    { name: 'Manjari-Regular.ttf', fontName: 'ManjariRegular', fontStyle: 'normal' },
    { name: 'Manjari-Thin.ttf', fontName: 'ManjariThin', fontStyle: 'normal' },

    // Nunito Sans Fonts
    { name: 'NunitoSans-Black.ttf', fontName: 'NunitoSansBlack', fontStyle: 'normal' },
    { name: 'NunitoSans-BlackItalic.ttf', fontName: 'NunitoSansBlackItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-Bold.ttf', fontName: 'NunitoSansBold', fontStyle: 'normal' },
    { name: 'NunitoSans-BoldItalic.ttf', fontName: 'NunitoSansBoldItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-ExtraBold.ttf', fontName: 'NunitoSansExtraBold', fontStyle: 'normal' },
    { name: 'NunitoSans-ExtraBoldItalic.ttf', fontName: 'NunitoSansExtraBoldItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-ExtraLight.ttf', fontName: 'NunitoSansExtraLight', fontStyle: 'normal' },
    { name: 'NunitoSans-ExtraLightItalic.ttf', fontName: 'NunitoSansExtraLightItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-Italic.ttf', fontName: 'NunitoSansItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-Light.ttf', fontName: 'NunitoSansLight', fontStyle: 'normal' },
    { name: 'NunitoSans-LightItalic.ttf', fontName: 'NunitoSansLightItalic', fontStyle: 'italic' },
    { name: 'NunitoSans-Regular.ttf', fontName: 'NunitoSansRegular', fontStyle: 'normal' },
    { name: 'NunitoSans-SemiBold.ttf', fontName: 'NunitoSansSemiBold', fontStyle: 'normal' },
    { name: 'NunitoSans-SemiBoldItalic.ttf', fontName: 'NunitoSansSemiBoldItalic', fontStyle: 'italic' },
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

// Helper function to convert image URL to data URL with high quality based on desired physical size in mm
const getImageDataUrl = async (
  url,
  desiredWidthMM,
  desiredHeightMM,
  dpi = 300,
  outputFormat = 'PNG',
  borderRadius = 0
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

    // Draw the image onto the canvas with the new dimensions
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);

    // Use the specified format for quality
    const dataURL = canvas.toDataURL(`image/${outputFormat}`, 1.0);
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
const estimateProductHeight = (doc, product, containerWidth, imageHeightMM) => {
  let height = 0;

  // Product Name
  doc.setFont('NunitoSansBold', 'normal');
  doc.setFontSize(16);
  const nameText = product.name;
  const splitName = doc.splitTextToSize(nameText, containerWidth);
  height += splitName.length * 7 + 10; // 7mm per line + spacing

  // Product Image
  if (product.images && product.images.length > 0) {
    height += imageHeightMM + 15; // Image height + spacing
  }

  // Variations
  if (product.variations && product.variations.length > 0) {
    doc.setFont('NunitoSansSemiBold', 'normal');
    doc.setFontSize(14);
    const variationsText = `Variantet: ${product.variations.join(', ')}`;
    const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
    height += splitVariations.length * 7 + 7; // 7mm per line + spacing
  }

  // Description
  doc.setFont('ManjariThin', 'normal');
  doc.setFontSize(12);
  const splitDescription = doc.splitTextToSize(product.description, containerWidth);
  height += splitDescription.length * 7 + 10; // 7mm per line + spacing

  // Additional padding at the bottom
  height += 10;

  return height;
};

// Helper function to add a cover page with additional sections
const addCoverPage = async (doc, category, bgDataURL, categoryTranslationMap) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20; // Fixed margin in mm
  const containerWidth = pageWidth - 2 * margin; // 170mm
  const centerX = pageWidth / 2;

  try {
    // Add background image
    doc.addImage(bgDataURL, 'PNG', 0, 0, pageWidth, pageHeight); // Full-page background

    // Add logo with decreased size by 2x
    // Original Dimensions: 1890px width x 1417px height
    // Desired Dimensions: 80mm width x 60mm height
    const logoUrl = '/assets/Logo-Red.png'; // Ensure this path is correct and points to the red logo
    const desiredLogoWidthMM = 80; // 80mm width as calculated
    const desiredLogoHeightMM = 60; // 60mm height as calculated

    const imgDataObj = await getImageDataUrl(
      logoUrl,
      desiredLogoWidthMM,
      desiredLogoHeightMM,
      300,
      'PNG',
      80 // Border radius in pixels
    ); // Use 'PNG' for product images with rounded corners
    const { dataURL } = imgDataObj;

    // Calculate centered position
    const imgX = (pageWidth - desiredLogoWidthMM) / 2;
    const imgY = pageHeight * 0.05; // Reduced from 10% to 5% to decrease top padding
    doc.addImage(dataURL, 'PNG', imgX, imgY, desiredLogoWidthMM, desiredLogoHeightMM); // Use 'PNG' format

    let currentY = imgY + desiredLogoHeightMM + 10; // Reduced spacing after logo from 20 to 10

    // Add Catalog Title (h1)
    doc.setFont('NunitoSansBold', 'normal'); // Use NunitoSansBold
    doc.setFontSize(24);
    const titleText = category
      ? `Katalog për ${capitalizeFirstLetter(categoryTranslationMap[category])}`
      : 'Katalog i Plotë';
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Reduced spacing after title from 20 to 15

    // Add Mission Statement (p)
    doc.setFont('ManjariThin', 'normal'); // Use the thin variant
    doc.setFontSize(12);
    const missionText = category
      ? `Mirë se vini në Katalogun e ${capitalizeFirstLetter(categoryTranslationMap[category])} të Albanian Dairy & Supply Hub (ADSH). Zbuloni gamën tonë të produkteve të larta të cilësisë së ${category.toLowerCase()} të dizajnuara për të plotësuar nevojat tuaja.`
      : `Mirë se vini në Katalogun e Plotë të Albanian Dairy & Supply Hub (ADSH). Shfletoni gamën tonë të gjerë të produkteve në të gjitha kategoritë, të krijuara me cilësi dhe kujdes për t'ju shërbyer më mirë.`;

    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });

    currentY += splitMission.length * 7 + 15; // Reduced spacing after mission statement from 25 to 15

    // Function to add a section with centered title and paragraph
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('NunitoSansBold', 'normal'); // Use NunitoSansBold for section titles
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Reduced spacing after section title from 10 to 7

      // Add Section Paragraph
      doc.setFont('ManjariThin', 'normal'); // Use ManjariThin for paragraph text
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Reduced spacing after section from 20 to 15
    };

    // Add "Rreth Nesh" Section
    const aboutUsTitle = 'Rreth Nesh';
    const aboutUsText = `ADSH-2014 është një kompani që është krijuar në vitin 2014. Stafi ka operuar që në vitin 1995 nën kompaninë D&A. Kompania zotëron mbi 26 vite eksperiencë në fushën e lëndëve të para për bulmetore dhe pastiçeri.`;
    addSection(aboutUsTitle, aboutUsText);

    // Add "Produktet Tona" Section
    const productsTitle = 'Produktet Tona';
    const productsText = `Cilësi e lartë dhe çmime konkuruse në treg. Kemi rreth 200 produkte në dispozim. Disa prej tyre mund ti gjeni më poshtë.`;
    addSection(productsTitle, productsText);

    // Add "Vlerat e Kompanisë" Section
    const valuesTitle = 'Vlerat e Kompanisë';
    const valuesText = `Shërbim gjatë 24 orëve në çdo ditë të javës për klientët tanë. Produkte me cilësi dhe çmime konkuruese. Të përbushim kërkesat e konsumatorëve në Shqipëri.`;
    addSection(valuesTitle, valuesText);
  } catch (error) {
    console.error('Error loading logo image:', error);
    // Proceed without the logo

    // Starting Y position
    let currentY = margin + 30; // Increased starting Y position

    // Add Catalog Title (h1)
    doc.setFont('NunitoSansBold', 'normal'); // Use NunitoSansBold
    doc.setFontSize(24);
    const titleText = category
      ? `${categoryTranslationMap[category]} Katalog`
      : 'Katalog i Plotë';
    doc.text(titleText, centerX, currentY, { align: 'center' });

    currentY += 15; // Increased spacing after title

    // Add Mission Statement (p)
    doc.setFont('ManjariThin', 'normal');
    doc.setFontSize(12);
    const missionText = category
      ? `Mirë se vini në Katalogun e ${capitalizeFirstLetter(categoryTranslationMap[category])} të Albanian Dairy & Supply Hub (ADSH). Zbuloni gamën tonë të produkteve të larta të cilësisë së ${category.toLowerCase()} të dizajnuara për të plotësuar nevojat tuaja.`
      : `Mirë se vini në Katalogun e Plotë të Albanian Dairy & Supply Hub (ADSH). Shfletoni gamën tonë të gjerë të produkteve në të gjitha kategoritë, të krijuara me cilësi dhe kujdes për t'ju shërbyer më mirë.`;

    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });

    currentY += splitMission.length * 7 + 15; // Increased spacing after mission statement

    // Function to add a section with centered title and paragraph
    const addSection = (title, text) => {
      // Add Section Title
      doc.setFont('NunitoSansBold', 'normal'); // Use NunitoSansBold for section titles
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });

      currentY += 7; // Reduced spacing after section title from 10 to 7

      // Add Section Paragraph
      doc.setFont('ManjariThin', 'normal'); // Use ManjariThin for paragraph text
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });

      currentY += splitText.length * 7 + 15; // Reduced spacing after section from 20 to 15
    };

    // Add "Rreth Nesh" Section
    const aboutUsTitle = 'Rreth Nesh';
    const aboutUsText = `ADSH-2014 është një kompani që është krijuar në vitin 2014. Stafi ka operuar që në vitin 1995 nën kompaninë D&A. Kompania zotëron mbi 26 vite eksperiencë në fushën e lëndëve të para për bulmetore dhe pastiçeri.`;
    addSection(aboutUsTitle, aboutUsText);

    // Add "Produktet Tona" Section
    const productsTitle = 'Produktet Tona';
    const productsText = `Cilësi e lartë dhe çmime konkuruse në treg. Kemi rreth 200 produkte në dispozim. Disa prej tyre mund ti gjeni më poshtë.`;
    addSection(productsTitle, productsText);

    // Add "Vlerat e Kompanisë" Section
    const valuesTitle = 'Vlerat e Kompanisë';
    const valuesText = `Shërbim gjatë 24 orëve në çdo ditë të javës për klientët tanë. Produkte me cilësi dhe çmime konkuruese. Të përbushim kërkesat e konsumatorëve në Shqipëri.`;
    addSection(valuesTitle, valuesText);

    // Add a new page after the cover
    doc.addPage();
  }
};

const DownloadCatalog = () => {
  const { category } = useParams(); // Get the category from the URL
  const navigate = useNavigate(); // For navigation after download
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const downloadInitiated = useRef(false); // Ref to prevent multiple downloads

  // Mapping from English category names to Albanian translations
  const categoryTranslationMap = {
    "Dairy": "Bulmetore",
    "Ice Cream": "Akullore",
    "Pastry": "Pastiçeri",
    "Bakery": "Furra",
    "Packaging": "Paketime",
    "Nuts": "Fruta të thata",
    "Equipment": "Pajisje",
    "All Products": "Të gjitha produktet",
    "Other": "Të tjera"
  };

  useEffect(() => {
    const fetchAndDownload = async () => {
      // Prevent multiple executions
      if (downloadInitiated.current) return;
      downloadInitiated.current = true;

      try {
        // Fetch all products
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        // Filter products by category if a category is specified
        const filteredProducts = category
          ? data.filter(
              (product) =>
                product.category &&
                product.category.toLowerCase() === category.toLowerCase()
            )
          : data;

        if (filteredProducts.length === 0) {
          alert('Nuk ka produkte në këtë kategori.');
          navigate('/'); // Redirect to Home.jsx
          return;
        }

        // Sort products alphabetically by name
        const sortedProducts = filteredProducts.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        // Initialize jsPDF with higher resolution (use 'mm' units)
        const doc = new jsPDF('p', 'mm', 'a4');

        // Load custom fonts
        await loadFonts(doc);

        // Set default font to NunitoSansRegular
        doc.setFont('NunitoSansRegular', 'normal');

        // **Load the high-resolution background image once**
        const bgUrl = '/assets/ADSH PDF BG.jpg'; // Path to the high-res background image
        const bgDataObj = await getImageDataUrl(
          bgUrl,
          210,
          297,
          300,
          'PNG'
        ); // A4 size: 210mm x 297mm at 300 DPI
        const bgDataURL = bgDataObj.dataURL;

        // Add Cover Page with additional sections and background
        await addCoverPage(doc, category, bgDataURL, categoryTranslationMap);

        // Initialize coordinates after the cover page
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20; // Fixed margin in mm
        const containerWidth = pageWidth - 2 * margin; // 170mm
        const centerX = pageWidth / 2;

        for (const product of sortedProducts) {
          // Add a new page for each product
          doc.addPage();

          // **Add background image to the new page**
          doc.addImage(bgDataURL, 'PNG', 0, 0, pageWidth, pageHeight); // Full-page background

          // Desired physical size for product image (1.4x original)
          const originalWidthMM = (1920 / 300) * 25.4; // 162.56mm
          const originalHeightMM = (1080 / 300) * 25.4; // 91.44mm
          const scaledWidthMM = originalWidthMM * 1.4; // 227.58mm
          const scaledHeightMM = originalHeightMM * 1.4; // 128.02mm

          // Adjust scaled size to fit within page margins
          const maxWidthMM = containerWidth; // 170mm
          const maxHeightMM = pageHeight - 2 * margin; // 257mm

          let finalWidthMM = scaledWidthMM;
          let finalHeightMM = scaledHeightMM;

          // If scaled width exceeds max width, scale down proportionally
          if (finalWidthMM > maxWidthMM) {
            const scalingFactor = maxWidthMM / finalWidthMM;
            finalWidthMM = maxWidthMM;
            finalHeightMM = finalHeightMM * scalingFactor;
          }

          // Similarly, if scaled height exceeds max height, scale down proportionally
          if (finalHeightMM > maxHeightMM) {
            const scalingFactor = maxHeightMM / finalHeightMM;
            finalHeightMM = maxHeightMM;
            finalWidthMM = finalWidthMM * scalingFactor;
          }

          // Estimate required height for the product
          const requiredHeight = estimateProductHeight(doc, product, containerWidth, finalHeightMM);

          // Calculate starting Y position to center content vertically
          const yStart = (pageHeight - requiredHeight) / 2;
          let y = yStart;

          // Add Product Name (h3)
          doc.setFont('NunitoSansBold', 'normal'); // Use NunitoSansBold
          doc.setFontSize(16);
          const nameText = product.name;
          const splitName = doc.splitTextToSize(nameText, containerWidth);
          doc.text(splitName, centerX, y, { align: 'center' });
          y += splitName.length * 7 + 10; // Spacing after name with increased padding

          // Add Product Image (centered) with improved quality and rounded corners
          if (product.images && product.images.length > 0) {
            try {
              // Product images are to be scaled up by 1.4x without quality drop
              const imgDataObj = await getImageDataUrl(
                product.images[0],
                finalWidthMM,
                finalHeightMM,
                300,
                'PNG',
                80 // Border radius in pixels
              ); // Use 'PNG' for product images with rounded corners
              const { dataURL } = imgDataObj;

              // Calculate centered position
              const imgX = (pageWidth - finalWidthMM) / 2;

              doc.addImage(dataURL, 'PNG', imgX, y, finalWidthMM, finalHeightMM); // Use 'PNG' format
              y += finalHeightMM + 10; // Increased spacing after image
            } catch (error) {
              console.error(`Error loading image for product ${product.name}:`, error);
              y += 10; // Add space if image fails to load
            }
          } else {
            y += 10; // Add space if no image
          }

          // Add Variations (h4) in primary color
          if (product.variations && product.variations.length > 0) {
            doc.setFont('NunitoSansSemiBold', 'normal'); // Use NunitoSansSemiBold
            doc.setFontSize(14);
            doc.setTextColor(237, 32, 90); // --color-primary: #ED205A
            const variationsText = `Variations: ${product.variations.join(', ')}`;
            const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
            doc.text(splitVariations, centerX, y, { align: 'center' });
            y += splitVariations.length * 7 + 5; // Spacing after variations
            doc.setTextColor(0, 0, 0); // Reset to black
          }

          // Add Description (p) with centered alignment
          doc.setFont('ManjariThin', 'normal'); // Use ManjariThin for paragraphs
          doc.setFontSize(12);
          const descriptionText = product.description || '';
          const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
          splitDescription.forEach((line) => {
            if (y + 7 > pageHeight - margin) {
              // If the text exceeds the page height, add a new page
              doc.addPage();

              // Add background image to the new page
              doc.addImage(bgDataURL, 'PNG', 0, 0, pageWidth, pageHeight); // Full-page background

              y = (pageHeight - requiredHeight) / 2; // Reset y position with top padding on new page
            }
            doc.text(line, centerX, y, { align: 'center' });
            y += 7;
          });

          // Add additional bottom padding between products
          y += 15; // Increased space before next product
        }

        // Add footers with page numbers aligned to the left
        addFooter(doc);

        // Save the PDF
        const fileName = category
          ? `${capitalizeFirstLetter(categoryTranslationMap[category])}_Katalog.pdf`
          : 'Katalog_i_Plotë.pdf';
        doc.save(fileName);

        // Update loading state and redirect to Home.jsx
        setIsLoading(false);
        navigate('/'); // Redirect to Home.jsx
      } catch (error) {
        console.error('Error generating catalog PDF:', error);
        alert(`Ka pasur një gabim gjatë krijimit të katalogut: ${error.message}. Ju lutem provoni përsëri.`);
        navigate('/products'); // Redirect to Products.jsx (Removed extra space)
      }
    };

    fetchAndDownload();
  }, [category, navigate]);

  return (
    <div>
      {isLoading ? (
        <Loader /> // Display Loader while generating PDF
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>Shkarkimi u krye.</p>
        </div>
      )}
    </div>
  );
};

export default DownloadCatalog;
