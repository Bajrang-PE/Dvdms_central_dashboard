import React, { useCallback, useEffect, useMemo, useState } from "react";
import Charts from "./Charts";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import DragDropComponent from "./Utilities/DragDropComponent";

export default function ChartMaker() {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();

  const computedColumns = useMemo(() => {
    return dashboardState.dashboardColumns
      ? dashboardState.dashboardColumns
      : [];
  }, [dashboardState.dashboardColumns]);

  const [items, setItems] = useState(computedColumns);
  const [showChart, setShowChart] = useState(false);
  const [xAxisData, setXaxisData] = useState([]);
  const [yAxisData, setYaxisData] = useState([]);

  useEffect(() => {
    setItems(computedColumns);
  }, [computedColumns]);

  const handleDragDropChange = useCallback(({ childData, secondChildData }) => {
    setXaxisData(childData);
    setYaxisData(secondChildData);
  }, []);

  return (
    <>
      {computedColumns.length === 0 ? (
        <></>
      ) : (
        <>
          <DragDropComponent
            mainContainerName={"Columns"}
            mainContainerData={items}
            firstChildName={"X-Axis"}
            secondChildName={"Y-Axis"}
            allowMultiples={false}
            onChange={(childData, secondChildData) =>
              handleDragDropChange(childData, secondChildData)
            }
            title={"Drag & Drop Components To Create Widgits"}
          />
          <ChartControls />
          {showChart && (
            <>
              <Charts xAxis={xAxisData} yAxis={yAxisData} />
            </>
          )}
        </>
      )}
    </>
  );

  function ChartControls() {
    return (
      <div className="control_box">
        <button className="execute_button" onClick={handleChartGeneration}>
          Generate Graphs
        </button>
      </div>
    );
  }

  function handleChartGeneration() {
    if (xAxisData.length === 0 || yAxisData.length === 0) {
      ToastAlert("Please assign columns for x and y axis properly", "error");
      return;
    }
    setShowChart(true);
  }
}
