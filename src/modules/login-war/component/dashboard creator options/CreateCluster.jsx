import React, { useEffect, useState } from "react";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";

const data = [
  { value: "Widgit1", label: "Widgit A" },
  { value: "Widgit2", label: "Widgit B" },
  { value: "Widgit3", label: "Widgit C" },
  { value: "Widgit4", label: "Widgit D" },
  { value: "Widgit5", label: "Widgit E" },
];

export default function CreateTabs() {
  //   const { setLoading } = useContext(HISContext);

  const [selected, setSelected] = useState([]);

  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();
  //   const [options, setOptions] = useState([]);

  //Sync Cluster Tables
  useEffect(
    function () {
      const clusterTables = dashboardState.clusterTables;

      //prettier-ignore
      if(!clusterTables || clusterTables.length === 0 || clusterTables.every(obj => Object.keys(obj).length === 0)){
      return;
    }

      const newValues = clusterTables.map((table) => table);

      setSelected((prev) => {
        const merged = [...new Set([...prev, ...newValues])];
        return merged;
      });
    },
    [dashboardState.clusterTables]
  );

  function handleChange(selected) {
    setSelected(selected);
  }

  async function handleSaveCluster() {}

  return (
    <div className="configuration__window-wrapper">
      <h4 className="mb-3">Drop widgits from left to right to create a Tab</h4>
      <DualListBox
        options={data}
        selected={selected}
        onChange={handleChange}
        canFilter
        filterPlaceholder="Search Widgits..."
        icons={{
          moveLeft: "<",
          moveAllLeft: "≪",
          moveRight: ">",
          moveAllRight: "≫",
        }}
        lang={{
          availableHeader: "Available Widgits",
          selectedHeader: "Mapped Widgits",
        }}
        className="custom-dual-listbox"
      />

      <button className="table_mapper-submit" onClick={handleSaveCluster}>
        Save
      </button>
    </div>
  );
}
