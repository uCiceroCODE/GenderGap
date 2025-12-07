import React, { useEffect, useState } from "react";
import Dropdown from "../utilities/Dropdown";
import "../../styles/dnfCharts.css";
import { getCachedData } from "../utilities/cache";
import Switch from "../utilities/Switch";

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

export default function DNFCharts() {
  const [year, setYear] = useState("ALL");
  const [genere, setGenere] = useState("ALL");
  const [azienda, setAzienda] = useState("ALL");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPerc, setIsPerc] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, genere, azienda]);

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
          desc="filter-gender"
          state={genere}
        />
        <Dropdown
          options={options_azienda}
          title="Seleziona azienda:"
          df="ALL"
          setData={setAzienda}
          desc="filter-area"
          state={azienda}
        />
        <Switch
          state={isPerc}
          setState={setIsPerc}
          isActive={genere != "ALL"}
        />
      </div>

      <div className="dnf-chart">{}</div>
    </div>
  );
}
