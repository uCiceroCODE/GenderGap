import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import "../styles/hero.css"

export default function Hero({ onScrollToStats }) {
  const canvasRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;

    // Lighting setup
    const light1 = new THREE.PointLight(0x8B5CF6, 2, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xEC4899, 1.5, 100);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Create meshes with smooth animation
    const meshes = [];
    const clock = new THREE.Clock();

    for (let i = 0; i < 15; i++) {
      const size = Math.random() * 1.5 +0.33;
      const geometry = new THREE.IcosahedronGeometry(size, 15);
      
      const hue = Math.random() * 0.3 + 0.5;
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.6),
        emissive: new THREE.Color().setHSL(hue, 0.8, 0.4),
        emissiveIntensity: 1.2,
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Better initial positioning using spherical coordinates
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.8;
      const radius = 5 + Math.random() * 4;

      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi);

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      // Store animation data
      mesh.userData = {
        basePosition: mesh.position.clone(),
        orbitSpeed: 0.2 + Math.random() * 0.2,
        orbitRadius: 1.5 + Math.random() * 1.5,
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.015
        },
        phase: Math.random() * Math.PI * 2,
        wobbleAmount: 0.3 + Math.random() * 0.3
      };

      scene.add(mesh);
      meshes.push(mesh);
    }

    // Animation loop with smooth easing
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();

      meshes.forEach((mesh, index) => {
        const data = mesh.userData;
        
        // Smooth orbital motion
        const orbitX = Math.cos(elapsedTime * data.orbitSpeed + data.phase) * data.orbitRadius;
        const orbitY = Math.sin(elapsedTime * data.orbitSpeed * 0.7 + data.phase) * data.orbitRadius * 0.6;
        const wobbleZ = Math.sin(elapsedTime * 0.5 + index) * data.wobbleAmount;

        mesh.position.x = data.basePosition.x + orbitX;
        mesh.position.y = data.basePosition.y + orbitY;
        mesh.position.z = data.basePosition.z + wobbleZ;

        // Smooth rotation
        mesh.rotation.x += data.rotationSpeed.x;
        mesh.rotation.y += data.rotationSpeed.y;

        // Gentle pulsing scale
        const pulse = 1 + Math.sin(elapsedTime * 1.5 + index) * 0.08;
        mesh.scale.set(pulse, pulse, pulse);

        // Smooth boundary wrapping (prevents objects going too far)
        if (Math.abs(mesh.position.x) > 10) {
          mesh.userData.basePosition.x *= -0.8;
        }
        if (Math.abs(mesh.position.y) > 10) {
          mesh.userData.basePosition.y *= -0.8;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      meshes.forEach(mesh => {
        mesh.geometry.dispose();
        mesh.material.dispose();
      });
    };
  }, []);

  return (
    <section id='hero' style={{ position: 'relative' }}>
      <canvas
        id='canvas-hero'
        ref={canvasRef}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 1
        }}
      />
      
      <div className='hero-content' style={{ position: 'relative', zIndex: 10 }}>
        <h1 className='hero-title'>Il Gender Gap in Italia</h1>
        <p className='hero-subtitle'>
          Analisi approfondita dei dati, tendenze e prospettive
        </p>
        <button className="cta-button" onClick={onScrollToStats}>
          Scopri i Dati
        </button>
      </div>
    </section>
  );
}
