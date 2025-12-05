import React, { useState, useEffect } from "react";
import "../../styles/secondaryChart.css";
import ColumnChart from "../chartsType/ColumnChart";
import { getCachedData } from "../utilities/cache";


const dataLen = 5;
const cardsData = [{
  titolo: "Immatricolati"
}, {
  titolo: "Laureati"

}, {
  titolo: "Dottori"

}, {
  titolo: "Dottorandi"

}, {
  titolo: "Professori e Ricercatori"

}];


export default function SecondaryChart({ w }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSubIndex, setCurrentSubIndex] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCachedData('/api/queries/getWomenPer', {
          cacheTTL: 5 * 60 * 1000
        });
        setData(() => {
          const temp = [];
          Object.entries(result).forEach(([, x]) => {

            // console.log(x.anno);
            temp.push({
              anno: x.anno,
              cod: x.cod,
              value: x.PercCOD,
            });

            // console.log(temp);
          });
          return temp;
        })
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : dataLen - 1));
    setCurrentSubIndex(0);
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < dataLen - 1 ? prev + 1 : 0));
    setCurrentSubIndex(0);
  }

  const getCardClass =
    (index) => {
      const diff = (index - currentIndex + dataLen) % dataLen;
      if (diff === 0) return "active";
      if (diff === dataLen - 1) return "prev";
      return "next";
    }

  // console.log(data);
  // console.log(currentSubIndex);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="secondary-containter">
      <h1>Grafici</h1>

      <div className="secondary-all-containter">

        <div className="chart-sc">
          <div className={`secondary-wrapper`}>
            {currentIndex != 0 && (
              <button className="arrow-btn arrow-btn-left" onClick={handlePrev}>
                ←
              </button>
            )}

            <div className="secondary-stack-container">
              {data &&
                data.map((x, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (currentIndex + 1 == idx) handleNext();
                      else if (currentIndex == idx + 1) handlePrev();
                    }}
                    className={`graph-card ${getCardClass(idx)} ${Math.abs(idx - currentIndex) > 1 ? "invisible" : ""
                      }`}
                  >
                    <div className="secondary-stack-index">
                      {x.value.map((y, z) => (
                        <div
                          className={`${currentSubIndex == z && "selected"}`}
                          key={z}
                          onClick={() => {
                            currentSubIndex != z && setCurrentSubIndex(z);
                          }}
                        >
                          {x.cod[z] === "06" || x.cod[z] === "09"
                            ? "ICT"
                            : x.cod[z] === "07" || x.cod[z] === "08"
                              ? "Ingegneria"
                              : x.cod[z] === "01"
                                ? " Scienze"
                                : ""}
                        </div>
                      ))}
                    </div>
                    <h3>{cardsData[idx].titolo}</h3>

                    {x.value[currentSubIndex] &&
                      w >= 900 &&
                      (idx == currentIndex ||
                        idx == currentIndex + 1 ||
                        idx + 1 == currentIndex) ? (
                      <ColumnChart
                        w={w}
                        categories={[...x.anno]}
                        data1={[...x.value[currentSubIndex]]}
                        data2={[
                          ...x.value[currentSubIndex].map((w) =>
                            (100 - w).toFixed(2)
                          ),
                        ]}
                        vertical={w >= 900 ? true : false}
                        label1={"Donne"}
                        label2={"Uomini"}
                      />
                    )
                      : (
                        w < 900 &&
                        currentIndex == idx && (
                          <ColumnChart
                            w={w}
                            categories={[...x.anno]}
                            data1={[
                              ...x.value[currentSubIndex].map((w) =>
                                (100 - w).toFixed(2)
                              ),
                            ]}
                            data2={[...x.value[currentSubIndex]]}
                            vertical={w >= 900 ? true : false}
                            label1={"Uomini"}
                            label2={"Donne"}
                          />
                        )
                      )}
                  </div>
                ))}
            </div>

            {currentIndex != dataLen - 1 && (
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
        </div>

        <div className="chart-description">
          <p>I grafici mostrano chiaramente come il divario di genere in Italia nelle discipline STEM e ICT si manifesti e si amplifichi lungo tutte le fasi della carriera accademica:
            dalle immatricolazioni ai laureati, dai dottori ai dottorandi, fino ai professori e ricercatori.
            La zona in cui il Gender Gap è maggiore sono le discipline ICT, in tutte le varie fasi della carriara accademica e sempre la materia con la situazione piu preoccupante.
            In ogni categoria, la presenza delle donne resta sempre inferiore rispetto a quella degli uomini,
            riflettendo ostacoli strutturali e culturali persistenti lungo tutto il percorso universitario e scientifico.</p>
        </div>
      </div>


    </div>
  );
}
