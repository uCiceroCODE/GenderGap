import React, { useEffect, useState } from "react";
import Dropdown from "../utilities/Dropdown";
import "../../styles/filterCharts.css";
import FilterChart from "../chartsType/FilterChart";
import { getCachedData } from "../utilities/cache";
import FilterChartSingle from "../chartsType/FilterChartSingle";
import FilterChartAll from "../chartsType/FiilterChartsALL";
import FilterChartAllSingle from "../chartsType/FiilterChartsALLSingle";

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
  { value: "Veneto", label: "Veneto" },
];

const options_area_geo = [
  { value: "1", label: "ICT" },
];

export default function FilterCharts() {
  const [year, setYear] = useState("ALL");
  const [classe, setClasse] = useState("ALL");
  const [genere, setGenere] = useState("ALL");
  const [regione, setRegione] = useState("ALL");
  const [settore, setSettore] = useState("ALL");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getCachedData(
          `/api/filter/getByFilter?year=${year}&regione=${regione}&classe=${classe}&genere=${genere}&settore=${settore}`,
          {
            cacheTTL: 5 * 60 * 1000,
          }
        );
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, regione, classe, genere, settore]);

  // console.log(data);

  const drawChart = () => {
    // console.log(data);

    try {
      if (!data?.data || loading) {
        return <FilterChartAll
          vertical={true}
          categories={["Immatricolati", "Laureati", "Dottorandi", "Dottori", "Prof e Ricercatori"]}
          data1={[0, 0, 0, 0]}
          data2={[0, 0, 0, 0]}
          label1="uomini"
          label2="donne" />;
      }


      if (data.filters.classe != "ALL") {
        // console.log(data.filters);

        if (data.filters.year != "ALL" && data.filters.regione == "ALL") {
          console.log(data.data);
          if (data.filters.genere != "ALL")
            return (<FilterChartSingle
              vertical={true}
              categories={[...data.data.regioni]}
              data1={data.filters.genere == "M" ? [...data.data.uomini] : [...data.data.donne]}
              label1={data.filters.genere == "M" ? "uomini" : "donne"}
              barColor={data.filters.genere == "F" ? "#00e396" : "#008ffb"}
            />)
          else {
            return (<FilterChart
              vertical={true}
              categories={[...data.data.regioni]}
              data1={[...data.data.uomini]}
              data2={[...data.data.donne]}
              label1="uomini"
              label2="donne"
            />)
          }
        }
        else {
          let category = [];
          let data1 = [];
          let data2 = [];
          let perc_data1 = [];
          let perc_data2 = [];

          data.data.map((x) => {
            if (data.filters.classe != "ALL" && data.filters.genere == "ALL") {
              category.push(x.anno);
              data1.push(x.uomini);
              data2.push(x.donne);
              perc_data1.push(x.perc_donne);
              perc_data2.push(x.perc_uomini);
            } else if (
              data.filters.classe != "ALL" && data.filters.genere != "ALL"
            ) {
              category.push(x.anno);
              data1.push(x[data.filters.genere == "M" ? "uomini" : "donne"]);
              perc_data1.push(x.perc_donne);
            }
          });

          if (data.filters.classe != "ALL" && data.filters.genere == "ALL")
            return (
              <FilterChart
                vertical={true}
                categories={[...category]}
                data1={[...data1]}
                data2={[...data2]}
                label1="uomini"
                label2="donne"
              />
            );

          if (data.filters.classe != "ALL" && data.filters.genere != "ALL")
            return (
              <FilterChartSingle
                vertical={true}
                categories={[...category]}
                data1={[...data1]}
                label1={data.filters.genere == "M" ? "uomini" : "donne"}
                barColor={data.filters.genere == "F" ? "#00e396" : "#008ffb"}
              />
            );
        }
      }

      else {
        if (data.filters.genere == 'ALL') {
          let data1 = [0, 0, 0, 0, 0]
          let data2 = [0, 0, 0, 0, 0]
          let perc_1 = [0, 0, 0, 0, 0]
          let perc_2 = [0, 0, 0, 0, 0]

          data.data.map((x) => {
            // console.log(x);
            data1[parseInt(x.type) - 1] = x.data.uomini
            data2[parseInt(x.type) - 1] = x.data.donne
            perc_1[parseInt(x.type) - 1] = x.data.perc_uomini
            perc_2[parseInt(x.type) - 1] = x.data.perc_donne
          })

          // console.log(data1, data2, perc_1, perc_2);
          if (data.filters.genere == 'ALL')
            return (<FilterChartAll
              vertical={true}
              categories={["Immatricolati", "Laureati", "Dottorandi", "Dottori", "Prof e Ricercatori"]}
              data1={data1}
              data2={data2}
              label1="uomini"
              label2="donne" />)
        }

        else {
          let data1 = [0, 0, 0, 0, 0]
          let perc_1 = [0, 0, 0, 0, 0]

          data.data.map((x) => {
            // console.log(x);
            data1[parseInt(x.type) - 1] = x.data[data.filters.genere == "M" ? "uomini" : "donne"]
            perc_1[parseInt(x.type) - 1] = x.data[data.filters.genere == "M" ? "perc_uomini" : "perc_donne"]
          })

          // console.log(data1, perc_1);
          if (data.filters.genere != 'ALL')
            return (<FilterChartAllSingle
              vertical={true}
              categories={["Immatricolati", "Laureati", "Dottorandi", "Dottori", "Prof e Ricercatori"]}
              data1={data1}
              label1={data.filters.genere == "M" ? "uomini" : "donne"}
              barColor={data.filters.genere == "F" ? "#00e396" : "#008ffb"}
            />)

        }
      }

    } catch (error) {
      console.log(error);

    }



  };


  return (
    <div className="filter-container">
      <div className="filter-choose">
        <Dropdown
          options={options_years}
          title={"Seleziona Anno:"}
          df={"ALL"}
          setData={setYear}
          desc={"filter-year"}
          state={year}
        />
        <Dropdown
          options={options_type}
          title={"Seleziona Classe:"}
          df={"ALL"}
          setData={setClasse}
          desc={"filter-class"}
          state={classe}
        />
        <Dropdown
          options={options_gender}
          title={"Seleziona Genere:"}
          df={"ALL"}
          setData={setGenere}
          desc={"filter-gender"}
          state={genere}
        />
        <Dropdown
          options={options_regione}
          title={"Seleziona Regione:"}
          df={"ALL"}
          setData={setRegione}
          desc={"filter-regione"}
          state={regione}
        />
        <Dropdown
          options={options_area_geo}
          title={"Seleziona Settore:"}
          df={"ALL"}
          setData={setSettore}
          desc={"filter-area"}
          state={settore}
        />
      </div>

      <div className="filter-chart">{drawChart()}</div>
    </div>
  );
}
