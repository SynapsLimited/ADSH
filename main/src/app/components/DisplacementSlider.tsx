'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TweenLite, Expo } from 'gsap';
import imagesLoaded from 'imagesloaded';
import { useTranslation } from 'react-i18next';
import '@/css/home.css';

const DisplacementSlider: React.FC = () => {
  const { t } = useTranslation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const sliderContentRef = useRef<HTMLDivElement>(null);
  const slideTitleRef = useRef<HTMLHeadingElement>(null);
  const slideStatusRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.OrthographicCamera;
    let material: THREE.ShaderMaterial;
    let geometry: THREE.PlaneGeometry;
    let mesh: THREE.Mesh;
    let sliderImages: THREE.Texture[] = [];
    let isAnimating = false;
    let currentSlideIndex = 0;
    const sliderImagesAspectRatios: number[] = [];

    const images = Array.from(sliderRef.current!.querySelectorAll('img'));

    const init = () => {
      if (!sliderRef.current) {
        console.error('sliderRef.current is null');
        return;
      }
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;

      renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x23272a, 1.0);
      renderer.setSize(width, height);
      sliderRef.current.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
      camera.position.z = 1;

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = '';

      images.forEach((img, index) => {
        const texture = loader.load(img.src + '?v=' + Date.now(), (tex) => {
          const imgWidth = tex.image.width;
          const imgHeight = tex.image.height;
          const imgAspect = imgWidth / imgHeight;
          sliderImagesAspectRatios[index] = imgAspect;
          if (index === 0) setupMesh(imgAspect);
        });
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        sliderImages.push(texture);
      });

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

      const fragmentShader = `
        varying vec2 vUv;
        uniform sampler2D currentImage;
        uniform sampler2D nextImage;
        uniform float dispFactor;

        void main() {
          vec2 uv = vUv;
          vec4 _currentImage;
          vec4 _nextImage;
          float intensity = 0.3;

          vec4 orig1 = texture2D(currentImage, uv);
          vec4 orig2 = texture2D(nextImage, uv);

          _currentImage = texture2D(currentImage, vec2(uv.x, uv.y + dispFactor * (orig2.r * intensity)));
          _nextImage = texture2D(nextImage, vec2(uv.x, uv.y + (1.0 - dispFactor) * (orig1.r * intensity)));

          vec4 finalTexture = mix(_currentImage, _nextImage, dispFactor);
          gl_FragColor = finalTexture;
        }
      `;

      material = new THREE.ShaderMaterial({
        uniforms: {
          dispFactor: { value: 0.0 },
          currentImage: { value: sliderImages[0] },
          nextImage: { value: sliderImages[1] },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        opacity: 1.0,
      });

      animate();
    };

    const setupMesh = (imgAspect: number) => {
      if (!sliderRef.current) return;
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;
      const containerAspect = width / height;

      let meshWidth: number, meshHeight: number;
      if (containerAspect > imgAspect) {
        meshWidth = width;
        meshHeight = width / imgAspect;
      } else {
        meshWidth = height * imgAspect;
        meshHeight = height;
      }

      geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 1);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const updateMeshForImage = (slideId: number) => {
      if (!sliderRef.current) return;
      const imgAspect = sliderImagesAspectRatios[slideId];
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;
      const containerAspect = width / height;

      let meshWidth: number, meshHeight: number;
      if (containerAspect > imgAspect) {
        meshWidth = width;
        meshHeight = width / imgAspect;
      } else {
        meshWidth = height * imgAspect;
        meshHeight = height;
      }

      geometry.dispose();
      geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 1);
      mesh.geometry = geometry;
    };

    const updateMeshForCurrentImage = () => {
      updateMeshForImage(currentSlideIndex);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!sliderRef.current) return;
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;
      renderer.setSize(width, height);
      camera.left = width / -2;
      camera.right = width / 2;
      camera.top = height / 2;
      camera.bottom = height / -2;
      camera.updateProjectionMatrix();
      updateMeshForCurrentImage();
    };

    const addEvents = () => {
      const pagButtons = Array.from(paginationRef.current!.querySelectorAll('button'));
      pagButtons.forEach((button) => {
        button.addEventListener('click', () => {
          if (!isAnimating) {
            isAnimating = true;
            const activeButton = paginationRef.current!.querySelector('.active');
            if (activeButton) activeButton.classList.remove('active');
            button.classList.add('active');

            const slideId = parseInt(button.dataset.slide!, 10);
            const nextTexture = sliderImages[slideId];
            nextTexture.needsUpdate = true;
            material.uniforms.nextImage.value = nextTexture;

            TweenLite.to(material.uniforms.dispFactor, 1, {
              value: 1,
              ease: Expo.easeInOut,
              onComplete: () => {
                const currentTexture = sliderImages[slideId];
                currentTexture.needsUpdate = true;
                material.uniforms.currentImage.value = currentTexture;
                material.uniforms.dispFactor.value = 0.0;
                isAnimating = false;
                currentSlideIndex = slideId;
                updateMeshForCurrentImage();
              },
            });

            const nextSlideTitleElement = sliderContentRef.current!.querySelector(
              `[data-slide-title="${slideId}"]`
            );
            const nextSlideStatusElement = sliderContentRef.current!.querySelector(
              `[data-slide-status="${slideId}"]`
            );

            const nextSlideTitle = nextSlideTitleElement
              ? nextSlideTitleElement.innerHTML
              : '';
            const nextSlideStatus = nextSlideStatusElement
              ? nextSlideStatusElement.innerHTML
              : '';

            TweenLite.fromTo(
              slideTitleRef.current!,
              0.5,
              { autoAlpha: 1, y: 0 },
              {
                autoAlpha: 0,
                y: 20,
                ease: Expo.easeIn,
                onComplete: () => {
                  slideTitleRef.current!.innerHTML = nextSlideTitle;
                  TweenLite.to(slideTitleRef.current!, 0.5, { autoAlpha: 1, y: 0 });
                },
              }
            );

            TweenLite.fromTo(
              slideStatusRef.current!,
              0.5,
              { autoAlpha: 1, y: 0 },
              {
                autoAlpha: 0,
                y: 20,
                ease: Expo.easeIn,
                onComplete: () => {
                  slideStatusRef.current!.innerHTML = nextSlideStatus;
                  TweenLite.to(slideStatusRef.current!, 0.5, {
                    autoAlpha: 1,
                    y: 0,
                    delay: 0.1,
                  });
                },
              }
            );
          }
        });
      });
    };

    imagesLoaded(images, () => {
      init();
      addEvents();
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer) renderer.dispose();
    };
  }, [t]);

  return (
    <div id="slider" ref={sliderRef} style={{ width: '100%', height: '100vh' }}>
      <div className="slider-inner">
        <div id="slider-content" ref={sliderContentRef}>
          <div className="meta">{t('displacementSlider.meta.category')}</div>
          <h2 id="slide-title" ref={slideTitleRef}>
            {t('displacementSlider.slideTitles.0')}
          </h2>
          <span className="hidden" data-slide-title="0">
            {t('displacementSlider.slideTitles.0')}
          </span>
          <span className="hidden" data-slide-title="1">
            {t('displacementSlider.slideTitles.1')}
          </span>
          <span className="hidden" data-slide-title="2">
            {t('displacementSlider.slideTitles.2')}
          </span>
          <span className="hidden" data-slide-title="3">
            {t('displacementSlider.slideTitles.3')}
          </span>
          <span className="hidden" data-slide-title="4">
            {t('displacementSlider.slideTitles.4')}
          </span>
          <span className="hidden" data-slide-title="5">
            {t('displacementSlider.slideTitles.5')}
          </span>
          <div className="meta">ADSH</div>
          <div id="slide-status" ref={slideStatusRef}>
            {t('displacementSlider.status.products')}
          </div>
          <span className="hidden" data-slide-status="0">
            {t('displacementSlider.status.products')}
          </span>
          <span className="hidden" data-slide-status="1">
            {t('displacementSlider.status.products')}
          </span>
          <span className="hidden" data-slide-status="2">
            {t('displacementSlider.status.products')}
          </span>
          <span className="hidden" data-slide-status="3">
            {t('displacementSlider.status.products')}
          </span>
          <span className="hidden" data-slide-status="4">
            {t('displacementSlider.status.products')}
          </span>
          <span className="hidden" data-slide-status="5">
            {t('displacementSlider.status.products')}
          </span>
        </div>
      </div>
      <img src="/assets/Homepage - Hero.jpg" alt={t('displacementSlider.slideTitles.0')} />
      <img src="/assets/Product - Ice Cream.jpg" alt={t('displacementSlider.slideTitles.1')} />
      <img src="/assets/Product - Pastry.jpg" alt={t('displacementSlider.slideTitles.2')} />
      <img src="/assets/Product - Bakery.jpg" alt={t('displacementSlider.slideTitles.3')} />
      <img src="/assets/Product - Packaging.jpg" alt={t('displacementSlider.slideTitles.4')} />
      <img src="/assets/Product - Equipment.jpg" alt={t('displacementSlider.slideTitles.5')} />
      <div id="pagination" ref={paginationRef}>
        <button className="active" data-slide="0"></button>
        <button data-slide="1"></button>
        <button data-slide="2"></button>
        <button data-slide="3"></button>
        <button data-slide="4"></button>
        <button data-slide="5"></button>
      </div>
    </div>
  );
};

export default DisplacementSlider;