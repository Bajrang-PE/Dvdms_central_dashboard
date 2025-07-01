import { useState } from "react";
import Dropdown from "./Dropdown";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";

const columnsList = [];

export default function ColumnSelector({ isMultiselectable }) {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();

  const columns = dashboardState.computedColumns;

  const [dropdowns, setDropdowns] = useState([
    { id: Date.now(), selectedValue: "" },
  ]);

  const handleChange = (id, e) => {
    const value = e.target.value;

    columnsList.push(value);
    // Update local state
    setDropdowns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, selectedValue: value } : d))
    );
  };

  const addDropdown = () => {
    setDropdowns((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), selectedValue: "" },
    ]);
  };

  const removeDropdown = (idToRemove) => {
    if (dropdowns.length === 1) return;
    setDropdowns((prev) => prev.filter((d) => d.id !== idToRemove));
  };

  return (
    <>
      {dropdowns.map(({ id, selectedValue }) => (
        <div key={id} className="sql_columnSelector">
          <Dropdown
            values={columns}
            handlerFunction={(e) => handleChange(id, e)}
            isMultiselectable={isMultiselectable}
            multiSelectOption={"*"}
            cssClass={"mb-1"}
            selectedValue={selectedValue}
          />
          <button className="column_controls" onClick={addDropdown}>
            +
          </button>
          <button
            className="column_controls"
            onClick={() => removeDropdown(id)}
          >
            -
          </button>
        </div>
      ))}
    </>
  );
}
