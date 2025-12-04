import React, {  useState } from "react";
import "../../styles/dropdown.css";

function Dropdown({ options, title, df , setData, desc}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="dropdown-container">
      <label htmlFor="dropdown">{title}</label>
      <div className="dropdown-wrapper">
        <select
          id={"dropdown-"+{desc}}
          value={selected}
          onChange={(e) => {setSelected(e.target.value); setData(e.target.value)}}
          className="dropdown"
        >
          <option value={df} >{df}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
