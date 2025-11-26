import React, { useState, useEffect } from 'react';
import '../styles/mainCharts.css';
import axios from 'axios';
import BarChart from './BarChart';

export default function MainCharts(){

     const [data, setData] = useState([]);
     const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/queries/getByRegion?regione=ITALIA`,
        {}
      )
      .then((response) => {
        setData(() => {
          return response.data;
        });
      })
      .catch((error) => console.error("Errore:", error))
      .finally(() => setLoading(false));
  }, []);


  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsData = [
    {}, {}, {}, {}, {},
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
  };


  const getCardClass = (index) => {
    const diff = (index - currentIndex + cardsData.length) % cardsData.length;
    if (diff === 0) return 'active';
    if (diff === cardsData.length - 1) return 'prev';
    return 'next';
  };


  if(loading)
  return (
    <div>
        Loading...
    </div>
  )

  return (
    <div className='mainchart-containter'>
      <h1>Grafici</h1>

      <div className="mainchart-wrapper">
        <button
          className="arrow-btn arrow-btn-left"
          onClick={handlePrev}
          aria-label="Precedente"
        >
          ←
        </button>

        <div className="stack-container">
          {cardsData.map((card, idx) => (
            <div
              key={idx}
              className={`graph-card ${getCardClass(idx)}`}
            >
              {data && <BarChart
              vertical={true}
        categories={["Immatricolati","Laureati", "Dottorandi", "Dottori" , "Professori"]}
        data1={[23 ,32,432,43,55]}
        label1={"uomini"}
        data2={[232 ,12,32,143,315]}
        label2={"donne"}
      />}
            </div>
          ))}
        </div>

        <button
          className="arrow-btn arrow-btn-right"
          onClick={handleNext}
          aria-label="Successivo"
        >
          →
        </button>
      </div>

      <div className="indicator">
        {cardsData.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Vai a card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

