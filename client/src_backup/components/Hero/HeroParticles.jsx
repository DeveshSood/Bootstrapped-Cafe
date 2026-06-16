import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * HeroParticles — Three.js floating particle canvas
 * 
 * Renders warm amber/cream/gold floating particles
 * on a transparent canvas behind the hero text.
 * Enhanced with varied sizes, colors, and breathing opacity.
 */
const HeroParticles = () => {
  const mountRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Enhanced Particles — more count, varied sizes
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount); // For breathing animation

    // Warm color palette
    const colorPalette = [
      new THREE.Color('#D4A574'), // Amber
      new THREE.Color('#F5E6D3'), // Cream
      new THREE.Color('#E8C98A'), // Soft Gold
      new THREE.Color('#C8512D'), // Terracotta (subtle accent)
      new THREE.Color('#DBC1A2'), // Warm Sand
    ];

    for (let i = 0; i < particleCount; i++) {
      // Spread particles across a wide volume
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // Varied velocities for organic movement
      velocities[i * 3] = (Math.random() - 0.5) * 0.004;
      velocities[i * 3 + 1] = Math.random() * 0.006 + 0.002;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;

      // Random size variation for depth perception
      sizes[i] = Math.random() * 5 + 1.5;

      // Random phase for breathing animation offset
      phases[i] = Math.random() * Math.PI * 2;

      // Random warm color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for varied sizes and vertex colors
    const vertexShader = `
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
        gl_FragColor = vec4(vColor, alpha * 0.4);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction (subtle parallax)
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 0.8;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.01;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.03;
      mouseY += (targetMouseY - mouseY) * 0.03;

      const posArr = geometry.attributes.position.array;
      const sizeArr = geometry.attributes.size.array;
      
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3] += velocities[i * 3];
        posArr[i * 3 + 1] += velocities[i * 3 + 1];
        posArr[i * 3 + 2] += velocities[i * 3 + 2];

        // Breathing size animation
        const breathe = Math.sin(time * 1.5 + phases[i]) * 0.3 + 1;
        sizeArr[i] = (Math.random() < 0.001 ? Math.random() * 5 + 1.5 : sizeArr[i]) * breathe;

        // Reset particles that float too far
        if (posArr[i * 3 + 1] > 6) {
          posArr[i * 3 + 1] = -6;
          posArr[i * 3] = (Math.random() - 0.5) * 14;
          posArr[i * 3 + 2] = (Math.random() - 0.5) * 8;
        }
      }
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      // Smooth camera movement following mouse
      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y += (-mouseY - camera.position.y) * 0.02;

      // Gentle rotation
      particles.rotation.y += 0.0004;
      particles.rotation.x = Math.sin(time * 0.3) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default HeroParticles;
