import React, { useEffect, useState } from "react";
import Map from "./chartsComponents/Map";
import "../styles/charts.css";
import MainChart from "./chartsComponents/MainChart";
import SecondaryChart from "./chartsComponents/SecondaryChart";
import FilterCharts from "./chartsComponents/FilterCharts";
import DNFCharts from "./chartsComponents/DNFCharts";

export default function Charts() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="charts-section" className="section">
      <h2 className="section-title">VARI GRAFICI PER DESCRIVERE IL GENDER GAP IN ITALIA</h2>
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
        <MainChart w={width}/>
      </div>

      <div className="chart-container">
        <div className="chart-title">Confronto tra materie STEM | ICT con il maggior Gender Gap negli anni</div>
        <SecondaryChart w={width} />
        
      </div>

      {width > 720 && (
      <div className="chart-container">
        <div className="chart-title">Scegli tu cosa vedere</div>
          <FilterCharts />
      </div>)}


      {width > 720 && (
      <div className="chart-container">
        <div className="chart-title">Grafico con filtro sui dati dell'Osservatorio DNF</div>
          <DNFCharts />
      </div>)}
      
      
    </section>
  );
}
