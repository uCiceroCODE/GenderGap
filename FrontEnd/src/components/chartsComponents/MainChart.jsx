import React, { useState, useEffect } from "react";
import "../../styles/mainChart.css";

import LineChart from "../chartsType/LineChart";
import { getCachedData } from "../utilities/cache";


const dataLen = 5;

const cardsData = [
  {
    titolo: "Immatricolati STEM | ICT",
    descrizione:
      "Il grafico evidenzia che, tra il 2013 e il 2023, gli uomini rappresentano sempre la maggioranza delle nuove immatricolazioni in corsi STEM e ICT, con valori spesso anche multipli rispetto a quelli femminili; questo indica che il divario digitale di genere nasce già all’ingresso dei percorsi universitari tecnico‑scientifici."
  },
  {
    titolo: "Laureati STEM | ICT",
    descrizione:
      "Tra il 2013 e il 2023 il numero di laureati in STEM e ICT diminuisce sia per uomini sia per donne, ma il divario rimane costante: gli uomini restano nettamente più numerosi, segnalando che il digital gender gap non si chiude lungo il percorso di studi, ma si consolida dall’immatricolazione al conseguimento del titolo.",
  },
  {
    titolo: "Dottorandi STEM | ICT",
    descrizione:
      "Nel dottorato il grafico conferma una forte prevalenza maschile: le donne sono sistematicamente meno presenti nei percorsi avanzati di ricerca STEM e ICT, indicando che l’accesso femminile alle posizioni di alta formazione nel digitale è ancora limitato e selettivo.",
  },
  {
    titolo: "Dottori STEM | ICT",
    descrizione:
      "Il numero di dottori in discipline STEM e ICT mostra un gender gap persistente: gli uomini superano stabilmente le donne, suggerendo che le barriere di genere non solo ostacolano l’ingresso ai dottorati, ma riducono anche la probabilità che le donne portino a termine questi percorsi altamente qualificanti nel digitale.",
  },
  {
    titolo: "Professori e Ricercatori STEM | ICT",
    descrizione:
      "Nel grafico su professori e ricercatori in ambito STEM e ICT emerge il divario più marcato: gli uomini sono maggiori rispetto al numero delle donne, segno che il digital gender gap si traduce in una grave sotto‑rappresentazione femminile nelle posizioni di potere scientifico e accademico, con un impatto diretto su innovazione, governance e modelli di ruolo nel settore tecnologico.",
  },
];


export default function MainChart({ w }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCachedData('/api/queries/getByYearICTS', {
          cacheTTL: 5 * 60 * 1000
        });
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  const handlePrev = () => {
    setCurrentIndex((prev) => prev > 0 ? prev - 1 : dataLen - 1);
  }

  const handleNext = () => {
    setCurrentIndex((prev) => prev < dataLen - 1 ? prev + 1 : 0);
  };



  const getCardClass = ((index) => {
    const diff = (index - currentIndex + dataLen) % dataLen;
    if (diff === 0) return "active";
    if (diff === dataLen - 1) return "prev";
    return "next";
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mainchart-containter" >
      <h1>Grafici</h1>

      <div className="mainchart-wrapper">
        {currentIndex > 0 && (
          <button
            className="arrow-btn arrow-btn-left"
            onClick={handlePrev}
          >
            ←
          </button>
        )}

        <div className="stack-container">
          {data.map((chart, idx) => (
            <div
              key={idx}
              onClick={(() => {
                if (currentIndex + 1 == idx)
                  handleNext()
                else if (currentIndex == idx + 1)
                  handlePrev()
              })}
              className={`graph-card ${getCardClass(idx)} ${Math.abs(idx - currentIndex) > 1 ? "invisible" : ""
                }`}

            >
              <h3>{chart.text} STEM | ICT</h3>

              {w >= 900 && (idx == currentIndex || idx == currentIndex + 1 || idx + 1 == currentIndex) ?
                <LineChart
                  vertical={true}
                  categories={idx === 4 ? [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] : [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]}
                  data1={chart.uomini}
                  data2={chart.donne}
                  label1="uomini"
                  label2="donne"
                  active={idx === currentIndex}
                />
                : (w < 900 && currentIndex == idx) && <LineChart
                  vertical={true}
                  categories={idx === 4 ? [2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024] : [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]}
                  data1={chart.uomini}
                  data2={chart.donne}
                  label1="uomini"
                  label2="donne"
                  active={idx === currentIndex}
                />
              }
            </div>
          ))}
        </div>

        {currentIndex < dataLen - 1 && (
          <button
            className="arrow-btn arrow-btn-right"
            onClick={handleNext}
            aria-label="Successivo"
          >
            →
          </button>
        )}
      </div>

      <div className="indicator">
        {cardsData.map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx === currentIndex ? "active" : ""}`}
            onClick={() => {
              setCurrentIndex(idx);
            }}
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
