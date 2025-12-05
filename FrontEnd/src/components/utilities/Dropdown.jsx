import React from "react";
import "../../styles/dropdown.css";

function Dropdown({ state, options, title, df, setData, desc }) {
  return (
    <div className="dropdown-container">
      <label >{title}</label>
      <div className="dropdown-wrapper">
        <select
          title={title}
          name={desc}
          value={state}
          onChange={(e) => {
            setData(e.target.value);
          }}
          id={`dropdown-${desc}`}
          className="dropdown"
        >
          <option value={df}>{df}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} >
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Dropdown;
