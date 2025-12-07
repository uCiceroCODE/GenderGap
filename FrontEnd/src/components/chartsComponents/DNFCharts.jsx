import React, { useEffect, useState } from "react";
import Dropdown from "../utilities/Dropdown";
import "../../styles/dnfCharts.css";
import { getCachedData } from "../utilities/cache";
import Switch from "../utilities/Switch";
import FilterChartAll from "../chartsType/FilterChartsALL";
import FilterChartAllSingle from "../chartsType/FilterChartsALLSingle";


const options_years = [
  { value: "2017", label: "2017" },
  { value: "2018", label: "2018" },
  { value: "2019", label: "2019" },
  { value: "2020", label: "2020" },
  { value: "2021", label: "2021" },
  { value: "2022", label: "2022" },
  { value: "2023", label: "2023" },
];


const options_gender = [
  { value: "M", label: "Uomini" },
  { value: "F", label: "Donne" },
];


const options_azienda = [
  {
    label: "REPLY",
    value: "REPLY",
  },
  {
    label: "TIM",
    value: "TIM",
  },
  {
    label: "TXT E-SOLUTIONS",
    value: "TXT E-SOLUTIONS",
  },
  {
    label: "LEONARDO",
    value: "LEONARDO",
  },
  {
    label: "PRYSMIAN",
    value: "PRYSMIAN",
  },
  {
    label: "SESA",
    value: "SESA",
  },
  {
    label: "EI TOWERS",
    value: "EI TOWERS",
  },
];


const CATEGORIES_ALL = ["2017", "2018", "2019", "2020", "2021", "2022"];
const EMPTY_DATA = [0, 0, 0, 0, 0, 0];


export default function DNFCharts() {
  const [year, setYear] = useState("ALL");
  const [genere, setGenere] = useState("ALL");
  const [azienda, setAzienda] = useState("ALL");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPerc, setIsPerc] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setData(null);
      try {
        const result = await getCachedData(
          `/api/dnf/getData?year=${year}&genere=${genere}&azienda=${azienda}`,
          {
            cacheTTL: 5 * 60 * 1000,
          }
        );
        setData(result);
      } catch (error) {
        console.error("Errore nel caricamento dei dati:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };


    fetchData();
  }, [year, genere, azienda]);


  const safeGetArray = (value, defaultArray = []) => {
    if (!value) return defaultArray;
    return Array.isArray(value) ? value : [value];
  };


  const drawChart = () => {
    if (loading) {
      return (
        <FilterChartAll
          vertical={true}
          categories={CATEGORIES_ALL}
          data1={EMPTY_DATA}
          data2={EMPTY_DATA}
          label1="uomini"
          label2="donne"
          isPerc={isPerc}
        />
      );
    }


    if (!data) {
      return (
        <FilterChartAll
          vertical={true}
          categories={CATEGORIES_ALL}
          data1={EMPTY_DATA}
          data2={EMPTY_DATA}
          label1="uomini"
          label2="donne"
          isPerc={isPerc}
        />
      );
    }


 
    if (year.toUpperCase() === "ALL") {

      if (azienda.toUpperCase() === "ALL") {

        if (genere.toUpperCase() === "ALL" && data?.response && Array.isArray(data.response)) {
          // console.log("Case 1: Year=ALL, Azienda=ALL, Genere=ALL (multiple companies)", data);
          
          let nomi = [];
          let data1 = [];
          let pData1 = [];
          let data2 = [];
          let pData2 = [];

          data.response.forEach((x) => {
            if (x?.nome) nomi.push(x.nome);
            if (x?.n_uomini) data1.push(parseInt(x.n_uomini) || 0);
            if (x?.n_donne) data2.push(parseInt(x.n_donne) || 0);
            if (x?.p_uomini) pData1.push(parseFloat(x.p_uomini) || 0);
            if (x?.p_donne) pData2.push(parseFloat(x.p_donne) || 0);
          });

          return (
            <FilterChartAll
              vertical={true}
              categories={nomi.length > 0 ? nomi : CATEGORIES_ALL}
              data1={isPerc ? (pData1.length > 0 ? pData1 : EMPTY_DATA) : (data1.length > 0 ? data1 : EMPTY_DATA)}
              data2={isPerc ? (pData2.length > 0 ? pData2 : EMPTY_DATA) : (data2.length > 0 ? data2 : EMPTY_DATA)}
              label1="uomini"
              label2="donne"
              isPerc={isPerc}
            />
          );
        }
        else if (data?.response && Array.isArray(data.response)) {
          // console.log("Case 2: Year=ALL, Azienda=ALL, Genere=Single (multiple companies, single gender)", data);
          
          let nomi = [];
          let data1 = [];
          let pData1 = [];

          data.response.forEach((x) => {
            if (x?.nome) nomi.push(x.nome);
            if (x?.n_data) data1.push(parseInt(x.n_data) || 0);
            if (x?.p_data) pData1.push(parseFloat(x.p_data) || 0);
          });

          return (
            <FilterChartAllSingle
              vertical={true}
              categories={nomi.length > 0 ? nomi : CATEGORIES_ALL}
              data1={isPerc ? (pData1.length > 0 ? pData1 : EMPTY_DATA) : (data1.length > 0 ? data1 : EMPTY_DATA)}
              label1="uomini"
              isPerc={isPerc}
              barColor={genere === "F" ? "#00e396" : "#008ffb"}
            />
          );
        }
      }
      else {
        if (genere.toUpperCase() === "ALL" && data?.anni && Array.isArray(data.anni)) {
          // console.log("Case 3: Year=ALL, Azienda=Single, Genere=ALL (single company, multiple years)", data);
          
          const n_uomini = safeGetArray(data.n_uomini, EMPTY_DATA);
          const p_uomini = safeGetArray(data.p_uomini, EMPTY_DATA);
          const n_donne = safeGetArray(data.n_donne, EMPTY_DATA);
          const p_donne = safeGetArray(data.p_donne, EMPTY_DATA);

          return (
            <FilterChartAll
              vertical={true}
              categories={data.anni}
              data1={isPerc ? p_uomini : n_uomini}
              data2={isPerc ? p_donne : n_donne}
              label1="uomini"
              label2="donne"
              isPerc={isPerc}
            />
          );
        }
        else if (data?.anni && Array.isArray(data.anni)) {
          // console.log("Case 4: Year=ALL, Azienda=Single, Genere=Single (single company, single gender, multiple years)", data);
          
          const n_data = safeGetArray(data.n_data, EMPTY_DATA);
          const p_data = safeGetArray(data.p_data, EMPTY_DATA);

          return (
            <FilterChartAllSingle
              vertical={true}
              categories={data.anni}
              data1={isPerc ? p_data : n_data}
              label1="uomini"
              isPerc={isPerc}
              barColor={genere === "F" ? "#00e396" : "#008ffb"}
            />
          );
        }
      }
    }
    else {
      if (azienda.toUpperCase() === "ALL") {
        if (genere.toUpperCase() === "ALL" && data?.results && Array.isArray(data.results)) {
          // console.log("Case 5: Year=Single, Azienda=ALL, Genere=ALL (single year, multiple companies)", data);
          
          let nomi = [];
          let data1 = [];
          let pData1 = [];
          let data2 = [];
          let pData2 = [];

          data.results.forEach((x) => {
            if (x?.nome) nomi.push(x.nome);
            if (x?.n_uomini) data1.push(parseInt(x.n_uomini) || 0);
            if (x?.n_donne) data2.push(parseInt(x.n_donne) || 0);
            if (x?.p_uomini) pData1.push(parseFloat(x.p_uomini) || 0);
            if (x?.p_donne) pData2.push(parseFloat(x.p_donne) || 0);
          });

          return (
            <FilterChartAll
              vertical={true}
              categories={nomi.length > 0 ? nomi : CATEGORIES_ALL}
              data1={isPerc ? (pData1.length > 0 ? pData1 : EMPTY_DATA) : (data1.length > 0 ? data1 : EMPTY_DATA)}
              data2={isPerc ? (pData2.length > 0 ? pData2 : EMPTY_DATA) : (data2.length > 0 ? data2 : EMPTY_DATA)}
              label1="uomini"
              label2="donne"
              isPerc={isPerc}
            />
          );
        }
        else if (Array.isArray(data)) {
          // console.log("Case 6: Year=Single, Azienda=ALL, Genere=Single (single year, multiple companies, single gender)", data);
          
          let nomi = [];
          let data1 = [];
          let pData1 = [];

          data.forEach((x) => {
            if (x?.nome) nomi.push(x.nome);
            if (x?.n_data) data1.push(parseInt(x.n_data) || 0);
            if (x?.p_data) pData1.push(parseFloat(x.p_data) || 0);
          });


          return (
            <FilterChartAllSingle
              vertical={true}
              categories={nomi.length > 0 ? nomi : CATEGORIES_ALL}
              data1={isPerc ? (pData1.length > 0 ? pData1 : EMPTY_DATA) : (data1.length > 0 ? data1 : EMPTY_DATA)}
              label1="uomini"
              isPerc={isPerc}
              barColor={genere === "F" ? "#00e396" : "#008ffb"}
            />
          );
        }
      }
      else {
        if (genere.toUpperCase() === "ALL" && data?.results && Array.isArray(data.results) && data.results.length > 0) {
          // console.log("Case 7: Year=Single, Azienda=Single, Genere=ALL", data);
          
          const result = data.results[0];
          const n_uomini = parseFloat(result?.n_uomini) || 0;
          const p_uomini = parseFloat(result?.p_uomini) || 0;
          const n_donne = parseFloat(result?.n_donne) || 0;
          const p_donne = parseFloat(result?.p_donne) || 0;
          const nome = result?.nome || "Unknown";

          return (
            <FilterChartAll
              vertical={true}
              categories={[nome]}
              data1={isPerc ? [p_uomini] : [n_uomini]}
              data2={isPerc ? [p_donne] : [n_donne]}
              label1="uomini"
              label2="donne"
              isPerc={isPerc}
            />
          );
        }
        else if (Array.isArray(data) && data.length > 0) {
          // console.log("Case 8: Year=Single, Azienda=Single, Genere=Single", data);
          
          const item = data[0];
          const n_data = parseFloat(item?.n_data) || 0;
          const p_data = parseFloat(item?.p_data) || 0;
          const nome = item?.nome || "Unknown";

          return (
            <FilterChartAllSingle
              vertical={true}
              categories={[nome]}
              data1={isPerc ? [p_data] : [n_data]}
              label1="uomini"
              isPerc={isPerc}
              barColor={genere === "F" ? "#00e396" : "#008ffb"}
            />
          );
        }
      }
    }

    // console.warn("No matching case found, showing empty chart", { year, genere, azienda, data });
    return (
      <FilterChartAll
        vertical={true}
        categories={CATEGORIES_ALL}
        data1={EMPTY_DATA}
        data2={EMPTY_DATA}
        label1="uomini"
        label2="donne"
        isPerc={isPerc}
      />
    );
  };


  return (
    <div className="dnf-container">
      <div className="dnf-choose">
        <Dropdown
          options={options_years}
          title="Seleziona Anno:"
          df="ALL"
          setData={setYear}
          desc="dnf-year"
          state={year}
        />
        <Dropdown
          options={options_gender}
          title="Seleziona Genere:"
          df="ALL"
          setData={setGenere}
          desc="dnf-gender"
          state={genere}
        />
        <Dropdown
          options={options_azienda}
          title="Seleziona azienda:"
          df="ALL"
          setData={setAzienda}
          desc="dnf-area"
          state={azienda}
        />
        <Switch state={isPerc} setState={setIsPerc} />
      </div>


      <div className="dnf-chart">{drawChart()}

        <div className="chart-description">
        <h3>Dal seguente grafico possiamo scegliere i filrti da apllicare per vedere come è la situazione in varie aziende italiane del settore ICT</h3>
        <p>Possiamo vedere che in tutte la presenza femminile è sempre minore rispetto a quella maschile, questo ci fa capire che anche nelle aziende e non solo nelle università esiste un gap tra uomini e donne in questo settore</p>
      </div>
      </div>

      
    </div>
  );
}