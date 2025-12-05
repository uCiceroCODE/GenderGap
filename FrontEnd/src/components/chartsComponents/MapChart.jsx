import React, { useState, useEffect } from "react";
import BarChart from "../chartsType/BarChart";
import { getCachedData } from "../utilities/cache";
// import { millify } from 'millify';

const MapChart = ({ region, year }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCachedData(`/api/queries/getByRegion?regione=${region ? region.name : "ITALIA"
          }&year=${year
          }`, {
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
  }, [region, year]);


  return (
    <div className="map-chart-container">
      <h3 className="map-chart-header">{region ? region.name : "Italia"}</h3>
      <BarChart
        categories={["Immatricolati", "Laureati", "Professori"]}
        data1={data ? data.donne : [0, 0, 0]}
        label1={"uomini"}
        data2={data ? data.uomini : [0, 0, 0]}
        label2={"donne"}
      />
    </div>
  );
};

export default MapChart;
