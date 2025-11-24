import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import "../styles/hero.css"

export default function Hero({ onScrollToStats }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Inizializza la scena Three.js
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.5,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    camera.position.z = 5;

    const figuresNumber = 8;

    // Geometry animata
    const geometries = [];
    for (let i = 0; i < figuresNumber; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 2 + 1, 15);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.6),
        wireframe: false,
        emissive: new THREE.Color().setHSL(Math.random() * 0.35 + 0.5, 0.8, 0.4),
        emissiveIntensity: 1.2
      });
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.x = (Math.random() - 0.5) * 15;
      mesh.position.y = (Math.random() - 0.5) * 15;
      mesh.position.z = Math.random() * 10 - 5;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      mesh.velocity = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
        rotX: (Math.random() - 0.5) * 0.005,
        rotY: (Math.random() - 0.5) * 0.005,
      };

      scene.add(mesh);
      geometries.push(mesh);
    }

    // Illuminazione
    const light1 = new THREE.PointLight(0x8B5CF6, 1, 100);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xEC4899, 1, 100);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Loop animazione
    let animationId;
    function animate() {
      animationId = requestAnimationFrame(animate);

      geometries.forEach(mesh => {
        mesh.position.x += mesh.velocity.x;
        mesh.position.y += mesh.velocity.y;
        mesh.position.z += mesh.velocity.z;
        mesh.rotation.x += mesh.velocity.rotX;
        mesh.rotation.y += mesh.velocity.rotY;
        if (Math.abs(mesh.position.x) > 8) mesh.velocity.x *= -1;
        if (Math.abs(mesh.position.y) > 8) mesh.velocity.y *= -1;
        if (mesh.position.z < -5 || mesh.position.z > 5) mesh.velocity.z *= -1;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup su unmount
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <section id='hero' style={{ position: 'relative' }}>
      <canvas
        id='canvas-hero'
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      <div className='hero-content' style={{ position: 'relative', zIndex: 1 }}>
        <h1 className='hero-title'>Il Divario di Genere in Italia</h1>
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
