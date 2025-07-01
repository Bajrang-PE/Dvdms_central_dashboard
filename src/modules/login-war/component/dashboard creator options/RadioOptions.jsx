import { useState } from "react";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";

export default function RadioOptions({ options, defaultOption }) {
  const [selected, setSelected] = useState(defaultOption);
  const { dispatcher, dashboardState } = useDashboard();

  function handleChange(value) {
    let dispatchEvent = "";
    switch (value) {
      case "freehandSQL":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "freehandSQL" };
        break;
      case "sqlBuilder":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "sqlBuilder" };
        break;
      case "runFunction":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "runFunction" };
        break;
      case "runProcedure":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "runProcedure" };
        break;
      case "viewWidgits":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "viewWidgits" };
        break;

      case "viewTabs":
        dispatchEvent = { type: "SET/DASHBOARD", payload: "viewTabs" };
        break;

      default:
        dispatchEvent = { type: "Unbound", payload: "Unbound" };
    }

    setSelected(value);
    dispatcher(dispatchEvent);
  }

  return (
    <div className="radio-group">
      {options.map((opt) => (
        <label key={opt.value} className="radio-label">
          <input
            type="radio"
            name="customRadio"
            value={opt.value}
            checked={selected === opt.value}
            onChange={() => handleChange(opt.value)}
          />
          <span className="custom-radio"></span>
          {opt.label}
        </label>
      ))}
    </div>
  );
}
