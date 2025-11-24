import React from "react";
import "../styles/header.css"


export default function Header() {
  return (
    <header>

      <div className="header-content">

        <div className="logo">Gender Gap 🇮🇹</div>

        <nav>
          {/* <a dafare="scrollToSection('hero')">Home</a>
          <a dafare="scrollToSection('stats')">Statistiche</a>
          <a dafare="scrollToSection('charts-section')">Analisi</a>
          <a dafare="scrollToSection('insights')">Approfondimenti</a> */}

          <a href="#hero">Home</a>
          <a href="#stats">Statistiche</a>
          <a href="#charts-section">Analisi</a>
          <a href="#insights">Approfondimenti</a>
        </nav>

      </div>

    </header>
  );
}
