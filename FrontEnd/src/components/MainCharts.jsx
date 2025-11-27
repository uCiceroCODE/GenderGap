import React, { useState, useEffect } from "react";
import "../styles/mainCharts.css";
import axios from "axios";
import BarChart from "./BarChart";
import LineChart from "./charts/LineChart";

export default function MainCharts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/queries/getByYearICTS`, {})
      .then((response) => {
        setData(() => {
          return response.data;
        });
      })
      .catch((error) => console.error("Errore:", error))
      .finally(() => setLoading(false));
  }, []);

  console.log(data);
  

  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsData = [
    { text: "donne" },
    { text: "uomini" },
    { text: "donne" },
    { text: "uomini" },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cardsData.length) % cardsData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cardsData.length);
  };

  const getCardClass = (index) => {
    const diff = (index - currentIndex + cardsData.length) % cardsData.length;
    if (diff === 0) return "active";
    if (diff === cardsData.length - 1) return "prev";
    return "next";
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mainchart-containter">
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
            <div key={idx} className={`graph-card ${getCardClass(idx)}`}>
              <h3>{card.text}</h3>
{
             data && <LineChart vertical={true}
                categories={[
                 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023
                ]}
                data1={data.donne}
                data2={data.uomini}
                label1={"donne"}
                label2={"uomini"}
                active = {idx === currentIndex ? true : false}/>
                }
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
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Vai a card ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
