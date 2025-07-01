import { useState } from "react";
import Slider from "@mui/material/Slider";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";
import saveDashboardData from "../../utils/CommonFunction";
import StandaloneChart from "./StandaloneChart";

export default function Charts({ xAxis, yAxis }) {
  const [chartType, setChartType] = useState("column");
  const [donutInnerRadius, setDonutInnerRadius] = useState(0);

  const { dispatcher, dashboardState } = useDashboard();

  if (xAxis.length === 0 || !xAxis || !yAxis || yAxis.length === 0) {
    return <h2>Your chart Will be displayed here</h2>;
  }

  const rawData = dashboardState.fetchedData;
  const columns = dashboardState.fetchedColumns;

  const generateChartData = () => {
    // For each yAxis key, generate a separate dataset
    const dataSeries = yAxis.map((yKey) => {
      const dataPoints = rawData.map((data) => ({
        label: data[xAxis[0]], // Use the first xAxis value
        y: data[yKey], // Dynamic y-axis field
      }));

      return {
        type: chartType === "donut" ? "doughnut" : chartType,
        name: yKey, // Use yAxis key as legend name
        showInLegend: true,
        dataPoints: dataPoints,
      };
    });

    const baseChart = {
      animationEnabled: true,
      title: { text: "Custom Dashboard" },
      data: dataSeries,
    };

    if (chartType === "donut") {
      baseChart.data[0].innerRadius = donutInnerRadius;
    }

    return baseChart;
  };

  const handleChange = (event, newValue) => {
    setDonutInnerRadius(newValue);
  };

  return (
    <div className="charts__container">
      <div className="charts__container--selector">
        {/*prettier-ignore*/}
        <label className="charts__container--selector-label">Chart Type:</label>
        {/*prettier-ignore*/}
        <select className="charts__container--selector-picker" value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="column">Column</option>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="doughnut">Pie</option>
        </select>
      </div>

      {chartType === "donut" && (
        <div className="donut__chart--radius-controls">
          <h4 className="donut__chart--radius-controls-heading">
            Inner Radius
          </h4>
          <Slider
            value={donutInnerRadius}
            onChange={handleChange}
            aria-label="Donut Radius"
            valueLabelDisplay="auto"
            min={0}
            max={75}
          />
        </div>
      )}
      <StandaloneChart optionsFunction={generateChartData()} />
      <SaveWidget />
    </div>
  );

  function SaveWidget() {
    const [widgitName, setWidgitName] = useState("");

    async function handleSaveWidget() {
      if (widgitName === "") {
        ToastAlert("Widgit Name is mandatory for saving the widgit", "error");
        return;
      }

      const finalJsonObject = {
        rows: rawData,
        columns: columns.map((col) => col.key),
        xAxisParams: xAxis,
        yAxisParams: yAxis,
        chartType: chartType,
        sqlQuery: dashboardState.sqlQuery,
        innerRadius: donutInnerRadius,
      };

      const saveDataObject = {
        strName: widgitName,
        strType: "Widgit",
        drilldownID: "",
        drilldownNames: "",
        linkedData: {},
        ltJson: finalJsonObject,
      };

      const responded = await saveDashboardData(saveDataObject);
      console.log(responded);

      if (responded && responded.status == 1) {
        ToastAlert("Widget Saved Successfully !", "successs");
      } else {
        ToastAlert("Something went wrong.." + responded, "error");
      }
    }

    function createNewWidget() {
      dispatcher({ type: "SET/SQLQUERY", payload: "" });
      dispatcher({ type: "FETCH/COLUMNS", payload: [] });
      dispatcher({ type: "FETCH/DATA", payload: [] });
      dispatcher({ type: "SET/SQLERROR", payload: "" });
      //prettier-ignore
      dispatcher({type: "SET/DASHBOARD-COLUMNS", payload: []});

      // Scroll to top after state updates
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }

    return (
      <>
        <div className="widget__detail-container">
          <label className="widget_details-label" htmlFor="hostnameField">
            Widget Name :
          </label>
          <input
            type="text"
            placeholder="Enter Widget Name.."
            id="hostnameField"
            className="widget_details-field"
            onChange={(e) => setWidgitName(e.target.value)}
            value={widgitName}
            required="true"
          />
        </div>
        <div className="control_box">
          <button className="execute_button" onClick={handleSaveWidget}>
            Save Widgit
          </button>
          <button className="clear_button" onClick={createNewWidget}>
            Reset
          </button>
        </div>
      </>
    );
  }
}
