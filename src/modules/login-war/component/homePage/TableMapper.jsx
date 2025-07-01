import React, { useContext, useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { HISContext } from "../../../his-utils/contextApi/HISContext";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";
import Dropdown from "../dashboard creator options/Dropdown";

function TableMapper({ toggleFunction }) {
  const { setLoading } = useContext(HISContext);
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const { dispatcher, dashboardState } = useDashboard();

  useEffect(() => {
    async function loadTableNames() {
      try {
        setLoading(true);
        const response = await fetch(
          "http://10.226.26.247:8025/api/v1/getAllTableNames"
        );
        const apiData = await response.json();
        const mappedOptions = apiData.data.map((table) => ({
          value: table?.tableSchema + "." + table?.tableName,
          schema: table?.tableSchema,
          label: table?.tableName,
        }));

        dispatcher({ type: "SET/SCHEMAS", payload: apiData.data });

        setOptions(mappedOptions);
        setAllOptions(mappedOptions);
      } catch (err) {
        console.error("Cannot Fetch...", err);
      } finally {
        setLoading(false);
      }
    }

    loadTableNames();
  }, [setLoading]);

  //Sync Mapped Tables
  useEffect(
    function () {
      const mappedTables = dashboardState.mappedTables;

      //prettier-ignore
      if(!mappedTables || mappedTables.length === 0){
      return;
    }
      //const newValues = mappedTables.map((table) => table.label);

      setSelected((prev) => {
        const merged = [...new Set([...prev, ...mappedTables])];
        return merged;
      });
    },
    [dashboardState.mappedTables]
  );

  function goBack() {
    toggleFunction({ type: "TOGGLE/TABLEMAPPER" });
  }

  function handleChange(selected) {
    setSelected(selected);
  }

  function handleSchemaFilter(e) {
    const selectedSchema = e.target.value;
    const filteredOptions =
      selectedSchema === "all"
        ? allOptions
        : allOptions.filter(
            (data) => data.schema.toLowerCase() === selectedSchema.toLowerCase()
          );

    setOptions(filteredOptions);
  }

  async function handleTableMapping() {
    if (!selected || selected.length === 0) {
      ToastAlert("Please select valid tables to map", "error");
      return;
    }

    // const mappedTableArray = selected.map((name) => ({
    //   value: name,
    //   label: name,
    // }));

    dispatcher({ type: "MAP/TABLES", payload: selected });

    const columnData = await getColumnDetails(selected.slice(1));

    //Update Joining Conditions
    dispatcher({
      type: "UPDATE/JOINING-CONDITION",
      payload: columnData?.data?.suggestedJoinColumns,
    });

    //Set Column List
    dispatcher({ type: "SET/COLUMNS", payload: columnData?.data });

    ToastAlert("Mapped Tables Successfully", "success");
  }

  return (
    <div className="configuration__window-wrapper">
      <button className="configuration-back" onClick={goBack}>
        &larr; Back
      </button>
      <h4 className="configuration_heading mb-3">Map Your Tables</h4>
      <Dropdown
        values={dashboardState.schema}
        handlerFunction={handleSchemaFilter}
        dropDownName={"Select Schema"}
        isMultiselectable={true}
        multiSelectOption={"All"}
        cssClass={"configuration_select_container mb-5"}
      />
      <DualListBox
        options={options}
        selected={selected}
        onChange={handleChange}
        canFilter
        filterPlaceholder="Search tables..."
        icons={{
          moveLeft: "<",
          moveAllLeft: "≪",
          moveRight: ">",
          moveAllRight: "≫",
        }}
        lang={{
          availableHeader: "Available Tables",
          selectedHeader: "Mapped Tables",
        }}
        className="custom-dual-listbox"
      />

      <button className="table_mapper-submit" onClick={handleTableMapping}>
        Save
      </button>
    </div>
  );
}

async function getColumnDetails(tablesArray) {
  try {
    const response = await fetch(
      `http://10.226.26.247:8025/api/v1/getTableDetails?tables=${tablesArray}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch column names");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching columns:", error);
    ToastAlert("Failed to fetch column data for selected tables", "error");
  }
}

export default TableMapper;
