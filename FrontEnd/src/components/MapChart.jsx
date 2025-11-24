import React, { useState, useEffect } from 'react'
import BarChart from './BarChart';
import axios from 'axios';
import { millify } from 'millify';

const MapChart = ({ region }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    region &&
    axios.get(`http://localhost:8080/api/queries/getImmbByRegion?regione=${region ? region.name : "ITALIA"  }`, {})
    .then(response => {setData(response.data);})
    .catch(error => console.error('Errore:', error))
    .finally(() => setLoading(false));
  }, [region]);


    useEffect(() => {
      console.log(region);
      axios.get(`http://localhost:8080/api/queries/getImmbByRegion?regione=ITALIA`, {})
      .then(response => {setData(response.data);})
      .catch(error => console.error('Errore:', error))
      .finally(() => setLoading(false));
    }, [])
  
  
  if (loading) return <p>Caricamento...</p>;

  return (
    <div className='map-chart-container'>
      <h3 className='map-chart-header'>{region ? region.name : 'Italia'}</h3>
          <BarChart
          categories={['Immatricolati', 'Laureati', 'Dottorandi', 'Dottori', 'Professori']}
          data1={data.donne} label1={"uomini"}
          data2={data.uomini} label2={"donne"}
        />
    </div>
  );
};

export default MapChart;
