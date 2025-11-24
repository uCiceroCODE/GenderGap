import React, { useEffect, useState } from "react";
import Map from "./Map";
import "../styles/charts.css";
import BarChart from "./BarChart";

export default function Charts() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="charts-section" className="section">
      <h2 className="section-title">Analisi Dettagliata [riempimento]</h2>
      <p className="section-subtitle">
        Confronti e tendenze nei principali indicatori del divario
      </p>

      {width > 1049 && (
        <div className="chart-container chart-container-map">
          <Map />
        </div>
      )}

      {/* Primo grafico */}
      <div className="chart-container">
        <div className="chart-title">dati esempio</div>

        {/* "height: 95.1%; background: linear-gradient(180deg, #10B981, #059669);" */}
        <div className="bar-chart">
          <div
            className="bar"
            style={{
              height: "95.1%",
              background: "linear-gradient(180deg, #10B981, #059669)",
            }}
          >
            <div className="bar-value">95.1%</div>
            <div className="bar-label">Istruzione</div>
          </div>

          <div
            className="bar"
            style={{
              height: "96.2%",
              background: "linear-gradient(180deg, #06B6D4, #0891B2)",
            }}
          >
            <div className="bar-value">96.2%</div>
            <div className="bar-label">Salute</div>
          </div>

          <div
            className="bar"
            style={{
              height: "61%",
              background: "linear-gradient(180deg, #8B5CF6, #7C3AED)",
            }}
          >
            <div className="bar-value">61%</div>
            <div className="bar-label">Economia</div>
          </div>

          <div
            className="bar"
            style={{
              height: "22.9%",
              background: "linear-gradient(180deg, #EF4444, #DC2626)",
            }}
          >
            <div className="bar-value">22.9%</div>
            <div className="bar-label">Politica</div>
          </div>
        </div>
      </div>

      {/* Secondo grafico */}
      <div className="chart-container">
        <div className="chart-title">Divario Salariale per Settore (2023)</div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Settore</th>
              <th>Salario Uomini (€/giorno)</th>
              <th>Salario Donne (€/giorno)</th>
              <th>Divario</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Finanziario e Assicurativo</td>
              <td>216,7</td>
              <td>147,3</td>
              <td className="gap-negative">-31.9%</td>
            </tr>
            <tr>
              <td>Fornitura Energia</td>
              <td>171,4</td>
              <td>145,6</td>
              <td className="gap-negative">-15.1%</td>
            </tr>
            <tr>
              <td>Manifattura</td>
              <td>119,0</td>
              <td>95,3</td>
              <td className="gap-negative">-19.9%</td>
            </tr>
            <tr>
              <td>Commercio</td>
              <td>92,3</td>
              <td>79,9</td>
              <td className="gap-negative">-13.4%</td>
            </tr>
            <tr>
              <td>Alloggio e Ristorazione</td>
              <td>65,6</td>
              <td>54,9</td>
              <td className="gap-negative">-16.3%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Terzo grafico*/}
      <div className="chart-container">
        <div className="chart-title">Tasso di Occupazione (20-64 anni)</div>
        <div className="bar-chart">
          <div
            className="bar"
            style={{
              height: "70.4%",
              background: "linear-gradient(180deg, #8B5CF6, #7C3AED)",
            }}
          >
            <div className="bar-value">70.4%</div>
            <div className="bar-label">Uomini</div>
          </div>
          <div
            className="bar"
            style={{
              height: "52.5%",
              background: "linear-gradient(180deg, #EC4899, #DB2777);",
            }}
          >
            <div className="bar-value">52.5%</div>
            <div className="bar-label">Donne</div>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <BarChart
          categories={['Immatricolati', 'Laureati', 'Dottorandi', 'Dottori', 'Professori']}
          data1={[30, 12, 56, 23, 34]} label1={"uomini"}
          data2={[93, 34, 26, 73, 14]} label2={"donne"}
        />
      </div>
    </section>
  );
}
