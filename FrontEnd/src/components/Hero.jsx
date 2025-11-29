import React, { useEffect } from 'react';
import "../styles/hero.css"

export default function Hero() {
  useEffect(() => {
    // Genera valori randomici per ogni sfera
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape) => {
      // Posizioni randomiche iniziali
      const randomTop = Math.random() * 80;
      const randomLeft = Math.random() * 80;
      
      // Durate randomiche
      const randomDuration = 8 + Math.random() * 12; // 8-20s
      const randomDelay = Math.random() * 5; // 0-5s
      
      // Distanze di movimento randomiche
      const randomDistance = 20 + Math.random() * 60; // 20-80px
      
      // Applica le variabili CSS
      shape.style.setProperty('--top', `${randomTop}%`);
      shape.style.setProperty('--left', `${randomLeft}%`);
      shape.style.setProperty('--duration', `${randomDuration}s`);
      shape.style.setProperty('--delay', `${randomDelay}s`);
      shape.style.setProperty('--distance', `${randomDistance}px`);
      
      // Scegli direzione randomica
      const randomDirection = Math.random();
      if (randomDirection < 0.33) {
        shape.classList.add('float-up');
      } else if (randomDirection < 0.66) {
        shape.classList.add('float-diagonal');
      } else {
        shape.classList.add('float-side');
      }
    });
  }, []);

  return (
    <section id='hero'>
      {/* Background animato */}
      <div className='animated-bg'>
        <div className='floating-shape shape-1'></div>
        <div className='floating-shape shape-2'></div>
        <div className='floating-shape shape-3'></div>
        <div className='floating-shape shape-4'></div>
        <div className='floating-shape shape-5'></div>
        <div className='floating-shape shape-6'></div>
      </div>

      {/* Grid animato */}
      <div className='animated-grid'></div>

      {/* Contenuto */}
      <div className='hero-content'>
        <h1 className='hero-title'>Il Gender Gap in Italia</h1>
        <p className='hero-subtitle'>
          Analisi approfondita dei dati, tendenze e prospettive
        </p>
        <a className="cta-a" href='#charts-section'>
          Scopri i Dati
        </a>
      </div>
    </section>
  );
}
