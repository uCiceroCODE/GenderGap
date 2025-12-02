import React, { useState } from "react";
import "../../styles/dropdown.css";

function Dropdown({ options, title, df }) {
  const [selected, setSelected] = useState("");

  console.log(options);

  return (
    <div className="dropdown-container">
      <label htmlFor="dropdown">{title}</label>
      <div className="dropdown-wrapper">
        <select
          id="dropdown"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="dropdown"
        >
          <option value="">{df}</option>
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
