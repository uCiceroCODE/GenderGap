import React, { useState, useEffect } from "react";
import "../styles/mainCharts.css";
import axios from "axios";
import LineChart from "./charts/LineChart";


export default function MainCharts() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  
  
  const cardsData = [
    {
      titolo: "Laureati STEM | ICT",
      descrizione:
        "Questo grafico mostra l'andamento dei laureati in discipline STEM e ICT dal 2013 al 2023. La linea verde (uomini) parte da circa 127.000 nel 2013 e diminuisce gradualmente fino a circa 96.000 nel 2023, con una tendenza ribassista costante. La linea blu (donne) parte da circa 80.000 nel 2013 e scende fino a circa 64.000 nel 2023. Entrambe le linee mostrano una riduzione complessiva, anche se gli uomini mantengono sempre un numero superiore di laureati rispetto alle donne in questi settori. Questo evidenzia un calo generale di interesse verso le discipline STEM e ICT negli ultimi dieci anni.",
      trend: "decrescente",
      periodo: "2013-2023",
      genere: ["uomini", "donne"],
      osservazioni: [
        "Diminuzione costante di laureati",
        "Gap di genere persistente: gli uomini rappresentano il 60% dei laureati",
        "Riduzione di circa 26% per gli uomini e 20% per le donne",
      ],
    },
    {
      titolo: "Dottori STEM | ICT",
      descrizione:
        "Il grafico illustra il numero di dottori di ricerca (dottorati) in STEM e ICT dal 2013 al 2023. La linea verde (uomini) inizia da circa 6.000 nel 2013 e raggiunge il minimo di circa 4.900 nel 2018, per poi risalire leggermente fino a circa 5.200 nel 2023. La linea blu (donne) parte da circa 4.200 nel 2013, scende fino a circa 3.700 nel 2016, risale fino a un picco di 4.500 nel 2019 (anno evidenziato nel grafico), per poi tornare a circa 4.200 nel 2023. Il grafico mostra una stabilizzazione attorno al 2019, anno critico per l'analisi del settore.",
      trend: "variabile con stabilizzazione",
      periodo: "2013-2023",
      genere: ["uomini", "donne"],
      osservazioni: [
        "Minimo raggiunto nel 2016-2018",
        "Incremento dal 2018 al 2019",
        "Stabilità relativa dal 2019 al 2023",
        "Gap di genere moderato nel 2019",
      ],
    },
    {
      titolo: "Dottorandi STEM | ICT",
      descrizione:
        "Questo grafico rappresenta il numero di dottorandi (studenti di dottorato) in STEM e ICT dal 2013 al 2023. La linea verde (uomini) inizia da circa 28.000 nel 2013 e diminuisce drasticamente fino a raggiungere il minimo di circa 18.000 nel 2018, dopodiché rimane relativamente stabile attorno a 18.000 fino al 2023. La linea blu (donne) parte da circa 21.000 nel 2013 e scende più gradualmente fino a circa 13.000 nel 2023. Il trend generale è fortemente negativo, con una riduzione di oltre il 35% per gli uomini e circa il 38% per le donne nel decennio considerato.",
      trend: "decrescente marcato",
      periodo: "2013-2023",
      genere: ["uomini", "donne"],
      osservazioni: [
        "Calo significativo dal 2013 al 2018 per entrambi i generi",
        "Stabilizzazione dal 2018 al 2023",
        "Riduzione di circa 35-38% complessiva",
        "Gap di genere crescente nel tempo",
      ],
    },
    {
      titolo: "Laureati STEM | ICT",
      descrizione:
        "Simile al primo grafico, questo mostra l'evoluzione dei laureati STEM e ICT dal 2013 al 2023, con un focus particolare sull'anno 2019 (evidenziato da una linea tratteggiata). Nel 2019, il numero di donne laureate in STEM e ICT era di circa 102.400, mentre gli uomini erano circa 67.300. La linea verde (uomini) continua il suo trend decrescente, e la linea blu (donne) mostra anch'essa una diminuzione generale. L'anno 2019 rappresenta un punto di transizione importante dove le differenze di genere risultano più marcate.",
      trend: "decrescente",
      periodo: "2013-2023",
      genere: ["uomini", "donne"],
      osservazioni: [
        "Trend decrescente confermato",
        "Nel 2019, le donne superano gli uomini nei numeri assoluti",
        "Gap di genere inverso rispetto ai dottorandi e dottori",
        "Calo accelerato dal 2019 al 2023",
      ],
    },
    {
      titolo: "Professori e Ricercatori STEM | ICT",
      descrizione:
        "Il grafico presenta l'andamento del numero di professori e ricercatori in STEM e ICT dal 2013 al 2023. La linea verde (uomini) parte da circa 52.000 nel 2013 e diminuisce gradualmente fino a circa 40.500 nel 2023, con una riduzione complessiva di circa il 22%. La linea blu (donne) inizia da circa 31.000 nel 2013 e scende fino a circa 22.500 nel 2023, con una riduzione di circa il 27%. Entrambi i generi mostrano una contrazione nel numero di ricercatori e professori, ma il calo colpisce leggermente più le donne rispetto agli uomini. Questo riflette una diminuzione generale dei posti accademici e di ricerca nel settore STEM e ICT.",
      trend: "decrescente",
      periodo: "2013-2023",
      genere: ["uomini", "donne"],
      osservazioni: [
        "Riduzione di circa 22-27% complessiva",
        "Calo più marcato per le donne (27%)",
        "Gap di genere persistente: gli uomini circa il 64% del totale",
        "Riduzione di posti accademici nel settore",
      ],
    },
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

      <div className={`mainchart-wrapper`}>
        <button
          className="arrow-btn arrow-btn-left"
          onClick={handlePrev}
          aria-label="Precedente"
        >
          ←
        </button>
        <div className="stack-container">
          {data &&
            data.map((chart, idx) => (
              <div key={idx} className={`graph-card ${getCardClass(idx)}`}>
                <h3>{chart.text} STEM | ICT</h3>
                {
                  <LineChart
                    vertical={true}
                    categories={[
                      2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021,
                      2022, 2023,
                    ]}
                    data1={chart.donne}
                    data2={chart.uomini}
                    label1={"donne"}
                    label2={"uomini"}
                    active={idx === currentIndex ? true : false}
                  />
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

      <div className="chart-description">
        <h3>{cardsData[currentIndex].titolo}</h3>
        <p>{cardsData[currentIndex].descrizione}</p>
      </div>
    </div>
  );
}
