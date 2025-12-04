import React from "react";
import "../../styles/dropdown.css";

function Dropdown({state, options, title, df , setData, desc, canChange = true}) {
  return (
    <div className="dropdown-container">
      <label htmlFor="dropdown">{title}</label>
      <div className="dropdown-wrapper">
        <select
          id={"dropdown-"+{desc}}
          value={state}
          onChange={(e) => {
            canChange && setData(e.target.value)}}
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
