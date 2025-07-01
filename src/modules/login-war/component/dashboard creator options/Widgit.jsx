import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import StandaloneChart from "./StandaloneChart";
import { fetchDrilldownData } from "../../utils/CommonFunction";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import SQLExecutionButton from "./SQLBuilderSelectors/SQLExecutionButton";

export default function Widgit({
  rawData,
  widgitName,
  drillDownData,
  dynamicRows,
}) {
  const containerRef = useRef(null);
  const popupRef = useRef(null);
  const [selectedChartFragment, setSelectedChartFragment] = useState("");
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [showBackButton, setShowBackButton] = useState(false);
  const [showWidgit, setShowWidgit] = useState(true);
  const { dispatcher, dashboardState } = useDashboard();

  console.log(rawData);

  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
    data: null,
  });

  //Find desired value from Drilldown
  const dataMap = useMemo(() => {
    const map = new Map();
    const key = rawData.xAxisParams[0];
    for (const row of dynamicRows) {
      map.set(row[key], row);
    }
    return map;
  }, [dynamicRows, rawData.xAxisParams]);

  // Track mouse position
  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  // On data point click, show popup using last known pointer position
  const handlePointClick = useCallback((e) => {
    setPopup({
      visible: true,
      x: mousePosRef.current.x + 10,
      y: mousePosRef.current.y + 10,
      data: e.dataPoint,
    });

    setSelectedChartFragment(e.dataPoint.label);
  }, []);

  //When user selects Drilldown
  async function handleDrilldown(e) {
    const row = dataMap.get(selectedChartFragment);
    const value = row?.[e.target.textContent];

    console.log(value);
    console.log(drillDownData);

    const params = {
      sqlQuery: drillDownData?.sqlQuery,
      parameter: String(value),
    };

    const response = await fetchDrilldownData(JSON.stringify(params));
    console.log(response);
    setPopup((prev) => ({
      ...prev,
      visible: false,
    }));
    const { columns, rows } = response.data;

    if (response.status == 0) {
      dispatcher({ type: "SET/SQLERROR", payload: response.message });
    }
    dispatcher({ type: "FETCH/COLUMNS", payload: columns });
    dispatcher({ type: "FETCH/DATA", payload: rows });
    dispatcher({
      type: "SET/CHILD-PARAMS",
      payload: {
        xAxis: Array.isArray(drillDownData?.xAxis)
          ? drillDownData.xAxis
          : [drillDownData?.xAxis],
        yAxis: Array.isArray(drillDownData?.yAxis)
          ? drillDownData.yAxis
          : [drillDownData?.yAxis],
      },
    });

    const isWidgitRequired =
      drillDownData?.widgitRequired === "yes" ? true : false;
    setShowWidgit(isWidgitRequired);

    setShowBackButton(true);
  }

  // Close popup on outside click
  useEffect(() => {
    if (!popup.visible) return;

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setPopup((prev) => ({ ...prev, visible: false }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popup.visible]);

  // Generate chart config
  const chartOptions = useMemo(() => {
    const yAxis = dashboardState.childParams.yAxis;
    const chartType = rawData.chartType;
    const xAxis = dashboardState.childParams.xAxis;
    const rows = dynamicRows;

    const dataSeries = yAxis.map((yKey) => {
      const dataPoints = rows.map((data) => ({
        label: data[xAxis[0]],
        y: data[yKey],
        click: handlePointClick,
      }));

      return {
        type: chartType,
        name: yKey,
        showInLegend: true,
        dataPoints,
      };
    });

    const config = {
      animationEnabled: true,
      title: { text: widgitName },
      data: dataSeries,
    };

    if (chartType === "doughnut") {
      config.data[0].innerRadius = rawData.innerRadius;
    }

    return config;
  }, [rawData, widgitName, dynamicRows, handlePointClick]);

  const popupStyle = {
    position: "absolute",
    borderRadius: "5px",
    top: popup.y + 10,
    left: popup.x + 10,
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: popup.visible ? 1 : 0,
    transform: popup.visible ? "scale(1)" : "scale(0.95)",
    pointerEvents: popup.visible ? "auto" : "none", // prevent invisible popup from catching clicks
  };

  function handleBack() {
    const { columns, rows } = dashboardState.parentWidgitState;
    dispatcher({ type: "FETCH/COLUMNS", payload: columns });
    dispatcher({ type: "FETCH/DATA", payload: rows });
    dispatcher({
      type: "SET/CHILD-PARAMS",
      payload: {
        xAxis: rawData?.xAxisParams,
        yAxis: rawData?.yAxisParams,
      },
    });
    setShowBackButton(false);
    setShowWidgit(true);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      {showWidgit && (
        <>
          <StandaloneChart optionsFunction={chartOptions} />

          {/* popup container  */}
          {popup.visible && (
            <div ref={popupRef} className="drilldown__popup" style={popupStyle}>
              <div className="popup_container">
                <h6 className="popup_container-heading">Drilldown By</h6>
                <p className="popup_container-link" onClick={handleDrilldown}>
                  {drillDownData.pkColumn}
                </p>
              </div>
              <button
                className="popup_close"
                onClick={() => setPopup({ ...popup, visible: false })}
              >
                X
              </button>
            </div>
          )}
        </>
      )}

      {showBackButton && (
        <SQLExecutionButton
          handlerFunction={handleBack}
          buttonText={"Back To Parent Widgit"}
        />
      )}
    </div>
  );
}
