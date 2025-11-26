import React, { useState, useEffect } from "react";
import BarChart from "./BarChart";
import axios from "axios";
// import { millify } from 'millify';

const MapChart = ({ region }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    region &&
      axios
        .get(
          `http://localhost:8080/api/queries/getByRegion?regione=${
            region ? region.name : "ITALIA"
          }`,
          {}
        )
        .then((response) => {
          setData(() => {
            return response.data;
          });
        })
        .catch((error) => console.error("Errore:", error))
        .finally(() => setLoading(false));
  }, [region]);

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

  // console.log(millify(Math.random() * 1000000 + 10000));

  if (loading) return <p>Caricamento...</p>;

  return (
    <div className="map-chart-container">
      <h3 className="map-chart-header">{region ? region.name : "Italia"}</h3>
      <BarChart
        categories={region && region.name.toUpperCase() === "VALLE D'AOSTA" ?  ["Immatricolati","Laureati" , "Professori"] : ["Immatricolati","Laureati", "Dottorandi", "Dottori" , "Professori"]}
        data1={data.donne}
        label1={"uomini"}
        data2={data.uomini}
        label2={"donne"}
      />
    </div>
  );
};

export default MapChart;
