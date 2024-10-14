import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TweenLite, Expo } from 'gsap';
import imagesLoaded from 'imagesloaded';

function DisplacementSlider() {
  const sliderRef = useRef(null);
  const sliderContentRef = useRef(null);
  const slideTitleRef = useRef(null);
  const slideStatusRef = useRef(null);
  const paginationRef = useRef(null);

  useEffect(() => {
    // Variables
    let renderer, scene, camera, material, geometry, mesh;
    let sliderImages = [];
    let isAnimating = false;
    let currentSlideIndex = 0;
    const sliderImagesAspectRatios = [];

    // Get images
    const images = Array.from(sliderRef.current.querySelectorAll('img'));

    // Initialize Three.js
    const init = () => {
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;

      renderer = new THREE.WebGLRenderer({ antialias: false });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x23272A, 1.0);
      renderer.setSize(width, height);
      sliderRef.current.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.OrthographicCamera(
        width / -2,
        width / 2,
        height / 2,
        height / -2,
        1,
        1000
      );
      camera.position.z = 1;

      const loader = new THREE.TextureLoader();
      loader.crossOrigin = '';

      images.forEach((img, index) => {
        const texture = loader.load(
          img.src + '?v=' + Date.now(),
          (tex) => {
            // On load callback
            const imgWidth = tex.image.width;
            const imgHeight = tex.image.height;
            const imgAspect = imgWidth / imgHeight;

            // Store the image aspect ratio
            sliderImagesAspectRatios[index] = imgAspect;

            // If this is the first image, set up the geometry and mesh
            if (index === 0) {
              setupMesh(imgAspect);
            }
          }
        );
        texture.magFilter = texture.minFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        sliderImages.push(texture);
      });

      const vertexShader = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
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
          dispFactor: { type: 'f', value: 0.0 },
          currentImage: { type: 't', value: sliderImages[0] },
          nextImage: { type: 't', value: sliderImages[1] },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        opacity: 1.0,
      });

      animate();
    };

    const setupMesh = (imgAspect) => {
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;
      const containerAspect = width / height;

      let meshWidth, meshHeight;

      if (containerAspect > imgAspect) {
        // Container is wider than image
        meshWidth = width;
        meshHeight = width / imgAspect;
      } else {
        // Image is wider than container
        meshWidth = height * imgAspect;
        meshHeight = height;
      }

      geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 1);
      mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);
    };

    const updateMeshForImage = (slideId) => {
      const imgAspect = sliderImagesAspectRatios[slideId];
      const width = sliderRef.current.offsetWidth;
      const height = sliderRef.current.offsetHeight;
      const containerAspect = width / height;

      let meshWidth, meshHeight;

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
      const currentSlideId = currentSlideIndex;
      updateMeshForImage(currentSlideId);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    const handleResize = () => {
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
      const pagButtons = Array.from(paginationRef.current.querySelectorAll('button'));

      pagButtons.forEach((button) => {
        button.addEventListener('click', () => {
          if (!isAnimating) {
            isAnimating = true;

            // Update active button
            const activeButton = paginationRef.current.querySelector('.active');
            if (activeButton) activeButton.classList.remove('active');
            button.classList.add('active');

            const slideId = parseInt(button.dataset.slide, 10);

            // Update material uniforms
            material.uniforms.nextImage.value = sliderImages[slideId];
            material.uniforms.nextImage.needsUpdate = true;

            TweenLite.to(material.uniforms.dispFactor, 1, {
              value: 1,
              ease: Expo.easeInOut,
              onComplete: () => {
                material.uniforms.currentImage.value = sliderImages[slideId];
                material.uniforms.currentImage.needsUpdate = true;
                material.uniforms.dispFactor.value = 0.0;
                isAnimating = false;
                currentSlideIndex = slideId;
                updateMeshForCurrentImage();
              },
            });

            // Update text content
            const nextSlideTitleElement = sliderContentRef.current.querySelector(`[data-slide-title="${slideId}"]`);
            const nextSlideStatusElement = sliderContentRef.current.querySelector(`[data-slide-status="${slideId}"]`);

            const nextSlideTitle = nextSlideTitleElement ? nextSlideTitleElement.innerHTML : '';
            const nextSlideStatus = nextSlideStatusElement ? nextSlideStatusElement.innerHTML : '';

            // Animate title
            TweenLite.fromTo(
              slideTitleRef.current,
              0.5,
              { autoAlpha: 1, y: 0 },
              {
                autoAlpha: 0,
                y: 20,
                ease: Expo.easeIn,
                onComplete: () => {
                  slideTitleRef.current.innerHTML = nextSlideTitle;
                  TweenLite.to(slideTitleRef.current, 0.5, { autoAlpha: 1, y: 0 });
                },
              }
            );

            // Animate status
            TweenLite.fromTo(
              slideStatusRef.current,
              0.5,
              { autoAlpha: 1, y: 0 },
              {
                autoAlpha: 0,
                y: 20,
                ease: Expo.easeIn,
                onComplete: () => {
                  slideStatusRef.current.innerHTML = nextSlideStatus;
                  TweenLite.to(slideStatusRef.current, 0.5, { autoAlpha: 1, y: 0, delay: 0.1 });
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

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div id="slider" ref={sliderRef} style={{ width: '100%', height: '100vh' }}>
      <div className="slider-inner">
        <div id="slider-content" ref={sliderContentRef}>
          <div className="meta">Category</div>
          <h2 id="slide-title" ref={slideTitleRef}>
          Dairy
          </h2>
          {/* Hidden titles */}
          <span className="hidden" data-slide-title="0">Dairy</span>
          <span className="hidden" data-slide-title="1">Ice Cream</span>
          <span className="hidden" data-slide-title="2">Patisserie</span>
          <span className="hidden" data-slide-title="3">Bakery</span>
          <div className="meta">ADSH</div>
          <div id="slide-status" ref={slideStatusRef}>
            Products
          </div>
          {/* Hidden statuses */}
          <span className="hidden" data-slide-status="0">Products</span>
          <span className="hidden" data-slide-status="1">Products</span>
          <span className="hidden" data-slide-status="2">Products</span>
          <span className="hidden" data-slide-status="3">Products</span>
        </div>
      </div>
      {/* Images */}
      <img src="/assets/Homepage - Hero.jpg" alt="Dairy Home" />
      <img src="/assets/Products - Hero.jpg" alt="Dairy Products" />
      <img src="/assets/About - Hero.jpg" alt="About Dairy" />
      <img src="/assets/Blog - Hero.jpg" alt="Dairy Blog" />
      {/* Pagination */}
      <div id="pagination" ref={paginationRef}>
        <button className="active" data-slide="0"></button>
        <button data-slide="1"></button>
        <button data-slide="2"></button>
        <button data-slide="3"></button>
      </div>
    </div>
  );
}

export default DisplacementSlider;
