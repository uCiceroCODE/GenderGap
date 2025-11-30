import React, { useState, useEffect } from "react";
import "../../styles/mainChart.css";
import axios from "axios";
import ColumnChart from "../chartsType/ColumnChart";


export default function SecondaryChart() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/queries/getWomenPer`, {})
      .then((response) => {
        setData(() => {
          return response.data;
        });
      })
      .catch((error) => console.error("Errore:", error))
      .finally(() => setLoading(false));
  }, []);

  
  const dataLen = 5
  const cardsData = [
    {},{},{},{}, {}
  ];

  const handlePrev = () => {    
    setCurrentIndex((prev) => prev != 0 ? (prev - 1 + cardsData.length) % cardsData.length : prev);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev != dataLen - 1 ?  (prev + 1) % cardsData.length : prev);
  };

  const getCardClass = (index) => {
    const diff = (index - currentIndex + cardsData.length) % cardsData.length;
    if (diff === 0) return "active";
    if (diff === cardsData.length - 1) return "prev";
    return "next";
  };

  data && Object.entries(data).forEach(([chiave, valore]) =>
    { 
      console.log(chiave, valore)
    }
);
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mainchart-containter">
      <h1>Grafici</h1>

      <div className={`mainchart-wrapper`}>

        {currentIndex != 0 && <button
          className="arrow-btn arrow-btn-left"
          onClick={handlePrev}
          aria-label="Precedente"
        >
          ←
        </button>}

        <div className="stack-container">
          {data && 
           
              <div key={1} onClick={currentIndex + 1 == 1 && handleNext || currentIndex + 1 == 1 + 2 && handlePrev || (() => {}) } 
              className={`graph-card ${getCardClass(1)} ${currentIndex == 1  || currentIndex + 1 == 1 || currentIndex + 1 == 1 + 2 ? "" : "invisible"}` }>
                <h3>Text</h3>
                
                         <ColumnChart categories={[1, 2, 3, 4]} data1={[54, 23, 12, 32]} data2={[23, 34, 12, 12]} vertical={true}/>

              </div>
            }
        </div>

        {currentIndex != dataLen - 1 && <button
          className="arrow-btn arrow-btn-right"
          onClick={handleNext}
          aria-label="Successivo"
        >
          →
        </button>}
      </div>
      <div className="indicator">
        {cardsData.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Vai a card ${idx + 1}`}
          />
        ))}
      </div>

      <div className="chart-description">
        <h3>{cardsData[currentIndex].titolo}</h3>
        <p>{cardsData[currentIndex].descrizione}</p>
      </div>
    </div>
  );
}
