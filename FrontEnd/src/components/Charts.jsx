import React, { useEffect, useState } from "react";
import Map from "./chartsComponents/Map";
import "../styles/charts.css";
import MainChart from "./chartsComponents/MainChart";

export default function Charts() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="charts-section" className="section">
      <h2 className="section-title">[riempimento]</h2>
      <p className="section-subtitle">
        Confronti e tendenze nei principali indicatori del divario
      </p>

      {width > 1049 && (
        <div className="chart-container chart-container-map">
          <div className="chart-title">
            Situzione del Digital Gender Gap negli atenei italiani
          </div>
          <Map />
        </div>
      )}

      <div className="chart-container">
        <div className="chart-title">Alcuni dati riguardanti il Gender Gap</div>
        <MainChart />
      </div>

      <div className="chart-container">
        <div className="chart-title">il Gender Gap</div>
        
      </div>
    </section>
  );
}
