import { useEffect, useState } from "react";
import Dropdown from "../Dropdown";

//prettier-ignore
export default function TableSelector({dispatcher, tables, columnsAPIData, selectedValue,}) {
  const [columnsData, setColumnsData] = useState([]);

  //prettier-ignore
  useEffect(function () {
      const columns = columnsAPIData;
      setColumnsData(!columns.tables ? [] : columns.tables);
    },
    [columnsAPIData]
  );

  function handleChange(e) {
    const currentSelectedTable = e.target.value;
    dispatcher({ type: "ADD/TABLE", payload: currentSelectedTable });

    if (currentSelectedTable === "Please Select") {
      dispatcher({ type: "COMPUTE/COLUMNS", payload: [] });
      return;
    }

    const filterColumns = columnsData.filter(
      (data) => data.tableName === currentSelectedTable
    );

    const columnsForSelectedTable =
      !filterColumns[0]?.columns || filterColumns[0].columns.length === 0
        ? "NA"
        : filterColumns[0].columns;

    dispatcher({ type: "COMPUTE/COLUMNS", payload: columnsForSelectedTable });
  }

  return (
    <>
      <div className="sql_tableSelector">
        <Dropdown
          values={tables}
          handlerFunction={(e) => handleChange(e)}
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={selectedValue}
        />
      </div>
    </>
  );
}
