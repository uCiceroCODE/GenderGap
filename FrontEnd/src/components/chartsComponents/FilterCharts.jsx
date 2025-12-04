import React, { useEffect, useState } from 'react'
import Dropdown from '../utilities/Dropdown'
import "../../styles/filterCharts.css"
import axios from 'axios';
import FilterChart from '../chartsType/FilterChart';
import { getCachedData } from '../utilities/cache';

const options_years = [
    { value: "2013", label: "2013" },
    { value: "2014", label: "2014" },
    { value: "2015", label: "2015" },
    { value: "2016", label: "2016" },
    { value: "2017", label: "2017" },
    { value: "2018", label: "2018" },
    { value: "2019", label: "2019" },
    { value: "2020", label: "2020" },
    { value: "2021", label: "2021" },
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
  ];

  const options_type = [
    { value: "1", label: "Immatricolati" },
    { value: "2", label: "Laureati" },
    { value: "3", label: "Dottorandi" },
    { value: "4", label: "Dottori" },
    { value: "5", label: "Staff" },
  ];

    const options_gender = [
    { value: "M", label: "Uomini" },
    { value: "F", label: "Donne" },
  ];

  const options_regione = [
  { value: "Abruzzo", label: "Abruzzo" },
  { value: "Basilicata", label: "Basilicata" },
  { value: "Calabria", label: "Calabria" },
  { value: "Campania", label: "Campania" },
  { value: "Emilia Romagna", label: "Emilia-Romagna" },
  { value: "Friuli Venezia Giulia", label: "Friuli-Venezia Giulia" },
  { value: "Lazio", label: "Lazio" },
  { value: "Liguria", label: "Liguria" },
  { value: "Lombardia", label: "Lombardia" },
  { value: "Marche", label: "Marche" },
  { value: "Molise", label: "Molise" },
  { value: "Piemonte", label: "Piemonte" },
  { value: "Puglia", label: "Puglia" },
  { value: "Sardegna", label: "Sardegna" },
  { value: "Sicilia", label: "Sicilia" },
  { value: "Toscana", label: "Toscana" },
  { value: "Trentino Alto Adige", label: "Trentino-Alto Adige" },
  { value: "Umbria", label: "Umbria" },
//   { value: "Valle d'Aosta", label: "Valle d'Aosta" },
  { value: "Veneto", label: "Veneto" }
];


    const options_area_geo = [
    { value: "1", label: "NORD" },
    { value: "2", label: "SUD" },
    { value: "3", label: "CENTRO" },
    { value: "4", label: "ISOLE" }
  ];



export default function FilterCharts() {
  
  const [year, setYear]= useState("ALL")
  const [classe, setClasse]= useState("1")
  const [genere, setGenere]= useState("ALL")
  const [regione, setRegione]= useState("ALL")
  const [area, setArea]= useState("ALL")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getCachedData(`http://localhost:8080/api/filter/getByFilter?year=${year}&regione=${regione}&classe=${classe}&genere=${genere}`, {
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
}, [year, regione, classe, genere]);

// console.log(data);

    
return (    

    <div className='filter-container'>
    
        <div className='filter-choose'>
            <Dropdown options={options_years} title={"Seleziona Anno:"} df={'ALL'} setData={setYear} desc={'filter-year'}/>
            <Dropdown options={options_type} title={"Seleziona Classe:"} df={'ALL'} setData={setClasse} desc={'filter-class'}/>
            <Dropdown options={options_gender} title={"Seleziona Genere:"} df={'ALL'} setData={setGenere} desc={'filter-gender'}/>
            <Dropdown options={options_regione} title={"Seleziona Regione:"} df={'ALL'} setData={setRegione} desc={'filter-regione'}/>
            <Dropdown options={options_area_geo} title={"Seleziona Area Geo:"} df={'ALL'} setData={setArea} desc={'filter-area'}/>
        </div>
    
        <div className='filter-chart'>
          <FilterChart 
          vertical={true}
                categories={[1,2,3,4,5,6]}
                data1={[4,32,4,2,54,2]}
                data2={[41,2,44,22,5,2]}
                label1="text 1"
                label2="text 2"/>
        </div>
    </div>
  )
}
