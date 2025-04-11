'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { jsPDF } from 'jspdf';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';

const slugify = (text: string): string =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

const normalizeCategory = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const addFooter = (doc: jsPDF, t: (key: string) => string): void => {
  const pageCount = doc.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.getHeight();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('ManjariBold', 'bold');
    doc.setFontSize(10);
    doc.text(`${t('downloadCatalog.page')} ${i} ${t('downloadCatalog.of')} ${pageCount}`, 20, pageHeight - 10);
  }
};

const loadFonts = async (doc: jsPDF): Promise<void> => {
  const fontBaseUrl = '/fonts/';
  const fonts = [
    { name: 'Manjari-Regular.ttf', fontName: 'ManjariRegular', fontStyle: 'normal' },
    { name: 'Manjari-Thin.ttf', fontName: 'ManjariThin', fontStyle: 'normal' },
    { name: 'Manjari-Bold.ttf', fontName: 'ManjariBold', fontStyle: 'bold' },
  ];
  for (const font of fonts) {
    try {
      const response = await fetch(`${fontBaseUrl}${font.name}`);
      if (!response.ok) throw new Error(`Failed to fetch font: ${font.name}`);
      const buffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(buffer);
      doc.addFileToVFS(font.name, base64);
      doc.addFont(font.name, font.fontName, font.fontStyle);
    } catch (error) {
      console.error(`Error loading font ${font.name}:`, error);
    }
  }
};

const getImageDataUrl = async (
  url: string,
  desiredWidthMM: number,
  desiredHeightMM: number,
  dpi: number = 150,
  outputFormat: string = 'JPEG',
  quality: number = 0.85,
  borderRadius: number = 0
): Promise<{ dataURL: string; width: number; height: number }> => {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
    const pxPerMm = dpi / 25.4;
    const desiredWidthPx = desiredWidthMM * pxPerMm;
    const desiredHeightPx = desiredHeightMM * pxPerMm;
    const aspectRatio = img.width / img.height;
    let targetWidthPx = desiredWidthPx;
    let targetHeightPx = desiredHeightPx;
    if (img.width > img.height) {
      targetHeightPx = desiredWidthPx / aspectRatio;
    } else {
      targetWidthPx = desiredHeightPx * aspectRatio;
    }
    targetWidthPx = Math.min(targetWidthPx, img.width);
    targetHeightPx = Math.min(targetHeightPx, img.height);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidthPx;
    canvas.height = targetHeightPx;
    const ctx = canvas.getContext('2d')!;
    if (borderRadius > 0) {
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
    if (outputFormat.toUpperCase() === 'JPEG') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(img, 0, 0, targetWidthPx, targetHeightPx);
    const dataURL = canvas.toDataURL(`image/${outputFormat}`, quality);
    return { dataURL, width: targetWidthPx, height: targetHeightPx };
  } catch (error) {
    console.error(`Error loading image ${url}:`, error);
    throw error;
  }
};

const capitalizeFirstLetter = (string: string): string =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

const estimateProductHeight = (
  doc: jsPDF,
  product: any,
  containerWidth: number,
  imageHeightMM: number,
  currentLanguage: string
): number => {
  let height = 0;
  doc.setFont('ManjariBold', 'bold');
  doc.setFontSize(16);
  const nameText = currentLanguage === 'en' ? product.name_en || product.name : product.name;
  const splitName = doc.splitTextToSize(nameText, containerWidth);
  height += splitName.length * 7 + 10;
  if (product.images && product.images.length > 0) {
    height += imageHeightMM + 15;
  }
  const variations = currentLanguage === 'en' ? product.variations_en : product.variations;
  if (variations && variations.length > 0) {
    doc.setFont('ManjariRegular', 'normal');
    doc.setFontSize(14);
    const variationsText = `${variations.join(', ')}`;
    const splitVariations = doc.splitTextToSize(variationsText, containerWidth);
    height += splitVariations.length * 7 + 7;
  }
  doc.setFont('ManjariThin', 'normal');
  doc.setFontSize(12);
  const descriptionText = currentLanguage === 'en' ? product.description_en || product.description : product.description;
  const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
  height += splitDescription.length * 7 + 10;
  height += 10;
  return height;
};

const addCoverPage = async (
  doc: jsPDF,
  category: string | null,
  bgDataURL: string,
  categoryTranslationMap: Record<string, string>,
  currentLanguage: string,
  t: (key: string, options?: any) => string
): Promise<void> => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const containerWidth = pageWidth - 2 * margin;
  const centerX = pageWidth / 2;
  doc.addImage(bgDataURL, 'JPEG', 0, 0, pageWidth, pageHeight);
  try {
    const logoUrl = '/assets/Logo-Red.png';
    const { dataURL } = await getImageDataUrl(logoUrl, 80, 60, 150, 'PNG', 0.85, 0);
    const imgX = (pageWidth - 80) / 2;
    const imgY = pageHeight * 0.05;
    doc.addImage(dataURL, 'PNG', imgX, imgY, 80, 60);
    let currentY = imgY + 60 + 10;
    doc.setFont('ManjariBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `${t('downloadCatalog.catalogFor')} ${capitalizeFirstLetter(categoryTranslationMap[category])}`
      : t('downloadCatalog.fullCatalog');
    doc.text(titleText, centerX, currentY, { align: 'center' });
    currentY += 15;
    doc.setFont('ManjariThin', 'normal');
    doc.setFontSize(12);
    const missionText = category
      ? t('downloadCatalog.missionTextCategory', { category: capitalizeFirstLetter(categoryTranslationMap[category]) })
      : t('downloadCatalog.missionTextFull');
    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });
    currentY += splitMission.length * 7 + 15;
    const addSection = (title: string, text: string) => {
      doc.setFont('ManjariBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });
      currentY += 7;
      doc.setFont('ManjariThin', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });
      currentY += splitText.length * 7 + 15;
    };
    addSection(t('downloadCatalog.aboutUsTitle'), t('downloadCatalog.aboutUsText'));
    addSection(t('downloadCatalog.productsTitle'), t('downloadCatalog.productsText'));
    addSection(t('downloadCatalog.valuesTitle'), t('downloadCatalog.valuesText'));
  } catch (error) {
    console.error('Error loading logo image:', error);
    let currentY = margin + 30;
    doc.setFont('ManjariBold', 'bold');
    doc.setFontSize(24);
    const titleText = category
      ? `${capitalizeFirstLetter(categoryTranslationMap[category])} ${t('downloadCatalog.catalog')}`
      : t('downloadCatalog.fullCatalog');
    doc.text(titleText, centerX, currentY, { align: 'center' });
    currentY += 15;
    doc.setFont('ManjariThin', 'normal');
    doc.setFontSize(12);
    const missionText = category
      ? t('downloadCatalog.missionTextCategory', { category: capitalizeFirstLetter(categoryTranslationMap[category]) })
      : t('downloadCatalog.missionTextFull');
    const splitMission = doc.splitTextToSize(missionText, containerWidth);
    doc.text(splitMission, centerX, currentY, { align: 'center' });
    currentY += splitMission.length * 7 + 15;
    const addSection = (title: string, text: string) => {
      doc.setFont('ManjariBold', 'bold');
      doc.setFontSize(16);
      doc.text(title, centerX, currentY, { align: 'center' });
      currentY += 7;
      doc.setFont('ManjariThin', 'normal');
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(text, containerWidth);
      doc.text(splitText, centerX, currentY, { align: 'center' });
      currentY += splitText.length * 7 + 15;
    };
    addSection(t('downloadCatalog.aboutUsTitle'), t('downloadCatalog.aboutUsText'));
    addSection(t('downloadCatalog.productsTitle'), t('downloadCatalog.productsText'));
    addSection(t('downloadCatalog.valuesTitle'), t('downloadCatalog.valuesText'));
    doc.addPage();
  }
};

const DownloadCatalog: React.FC = () => {
  const { category } = useParams<{ category?: string }>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const downloadInitiated = useRef<boolean>(false);
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const normalizedCategory = category ? normalizeCategory(category) : null;

  const categoryTranslationMap: Record<string, string> = {
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
        const response = await fetch('/api/products');
        if (!response.ok) {
          console.error(`Failed to fetch products: ${response.status} ${response.statusText}`);
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const filteredProducts = normalizedCategory
          ? data.filter((product: any) => product.category === normalizedCategory)
          : data;
        if (filteredProducts.length === 0) {
          alert(t('downloadCatalog.noProductsInCategory'));
          router.push('/');
          return;
        }
        const sortedProducts = filteredProducts.sort((a: any, b: any) => {
          const nameA = currentLanguage === 'en' ? a.name_en || a.name : a.name;
          const nameB = currentLanguage === 'en' ? b.name_en || b.name : b.name;
          return nameA.localeCompare(nameB);
        });
        const doc = new jsPDF('p', 'mm', 'a4');
        await loadFonts(doc);
        doc.setFont('ManjariRegular', 'normal');
        const bgUrl = '/assets/ADSH PDF BG.jpg';
        const bgDataObj = await getImageDataUrl(bgUrl, 210, 297, 150, 'JPEG', 0.85, 0);
        await addCoverPage(doc, normalizedCategory, bgDataObj.dataURL, categoryTranslationMap, currentLanguage, t);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const containerWidth = pageWidth - 2 * margin;
        const centerX = pageWidth / 2;
        for (const product of sortedProducts) {
          doc.addPage();
          doc.addImage(bgDataObj.dataURL, 'JPEG', 0, 0, pageWidth, pageHeight);
          const originalWidthMM = (1920 / 150) * 25.4;
          const originalHeightMM = (1080 / 150) * 25.4;
          const scaledWidthMM = originalWidthMM * 1.4;
          const scaledHeightMM = originalHeightMM * 1.4;
          const maxWidthMM = containerWidth;
          const maxHeightMM = pageHeight - 2 * margin;
          let finalWidthMM = scaledWidthMM;
          let finalHeightMM = scaledHeightMM;
          if (finalWidthMM > maxWidthMM) {
            const scalingFactor = maxWidthMM / finalWidthMM;
            finalWidthMM = maxWidthMM;
            finalHeightMM *= scalingFactor;
          }
          if (finalHeightMM > maxHeightMM) {
            const scalingFactor = maxHeightMM / finalHeightMM;
            finalHeightMM = maxHeightMM;
            finalWidthMM *= scalingFactor;
          }
          const requiredHeight = estimateProductHeight(doc, product, containerWidth, finalHeightMM, currentLanguage);
          let y = (pageHeight - requiredHeight) / 2;
          doc.setFont('ManjariBold', 'bold');
          doc.setFontSize(16);
          const nameText = currentLanguage === 'en' ? product.name_en || product.name : product.name;
          const splitName = doc.splitTextToSize(nameText, containerWidth);
          doc.text(splitName, centerX, y, { align: 'center' });
          y += splitName.length * 7 + 10;
          if (product.images && product.images.length > 0) {
            try {
              const imgDataObj = await getImageDataUrl(product.images[0], finalWidthMM, finalHeightMM, 150, 'JPEG', 0.85, 0);
              const imgX = (pageWidth - finalWidthMM) / 2;
              doc.addImage(imgDataObj.dataURL, 'JPEG', imgX, y, finalWidthMM, finalHeightMM);
              y += finalHeightMM + 10;
            } catch (error) {
              console.error(`Error loading image for product ${product.name}:`, error);
              y += 10;
            }
          } else {
            y += 10;
          }
          const variations = currentLanguage === 'en' ? product.variations_en : product.variations;
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
          doc.setFont('ManjariThin', 'normal');
          doc.setFontSize(12);
          const descriptionText = currentLanguage === 'en' ? product.description_en || product.description : product.description;
          const splitDescription = doc.splitTextToSize(descriptionText, containerWidth);
          splitDescription.forEach((line: string) => {
            if (y + 7 > pageHeight - margin) {
              doc.addPage();
              doc.addImage(bgDataObj.dataURL, 'JPEG', 0, 0, pageWidth, pageHeight);
              y = margin + 10;
            }
            doc.text(line, centerX, y, { align: 'center' });
            y += 7;
          });
        }
        addFooter(doc, t);
        const fileName = normalizedCategory
          ? `${capitalizeFirstLetter(categoryTranslationMap[normalizedCategory])}_${t('downloadCatalog.catalog')}.pdf`
          : `${t('downloadCatalog.fullCatalog')}.pdf`;
        doc.save(fileName);
        setIsLoading(false);
        router.push('/');
      } catch (error) {
        console.error('Error generating catalog PDF:', error);
        alert(`${t('downloadCatalog.errorGeneratingCatalog')}: ${(error as Error).message}. ${t('downloadCatalog.pleaseTryAgain')}`);
        setIsLoading(false);
        router.push('/products');
      }
    };
    fetchAndDownload();
  }, [normalizedCategory, router, currentLanguage, t]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>{t('downloadCatalog.downloadCompleted')}</p>
        </div>
      )}
    </div>
  );
};

export default DownloadCatalog;