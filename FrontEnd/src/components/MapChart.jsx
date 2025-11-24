import React, { useState, useEffect } from 'react'
import BarChart from './BarChart';
import axios from 'axios';

const MapChart = ({ region }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    region &&
    axios.get(`http://localhost:8080/api/queries/getImmbByRegion?regione=${region ? region.name : "ITALIA"  }`, {})
    .then(response => {setData(response.data); console.log(data)})
    .catch(error => console.error('Errore:', error))
    .finally(() => setLoading(false));
  }, [region]);


    useEffect(() => {
      console.log(region);
      axios.get(`http://localhost:8080/api/queries/getImmbByRegion?regione=ITALIA`, {})
      .then(response => {setData(response.data); console.log(data)})
      .catch(error => console.error('Errore:', error))
      .finally(() => setLoading(false));
    }, [])

  
  if (loading) return <p>Caricamento...</p>;

  return (
    <div className='map-chart-container'>
      <h3 className='map-chart-header'>{region ? region.name : 'Italia'}</h3>

      {/* {region ? (
        <div className='bar-chart map-bar-chart'>
          {chartData.map((bar, index) => (
            <div 
              key={index}
              className='bar' 
              style={{ 
                height: bar.value + "%", 
                background: `linear-gradient(180deg, ${bar.color}, ${bar.color}cc)`
              }}
            >
              <div className='bar-value'>{bar.value}%</div>
              <div className='bar-label'>\ {index + 1}</div>
            </div>
          ))}
        </div>
      ) : <div className='bar-chart map-bar-chart'>
          {chartData.map((bar, index) => (
            <div 
              key={index}
              className='bar' 
              style={{ 
                height: bar.value + "%", 
                background: `linear-gradient(180deg, ${bar.color}, ${bar.color}cc)`
              }}
            >
              <div className='bar-value'>{bar.value}%</div>
              <div className='bar-label'>\ {index + 1}</div>
            </div>
          ))}
        </div>} */}

          <BarChart
          categories={['Immatricolati', 'Laureati', 'Dottorandi', 'Dottori', 'Professori']}
          data1={[]} label1={"uomini"}
          data2={[]} label2={"donne"}
        />
    </div>
  );
};

export default MapChart;
