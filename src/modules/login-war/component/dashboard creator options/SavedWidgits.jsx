import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { HISContext } from "../../../his-utils/contextApi/HISContext";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";
import Dropdown from "./Dropdown";
import Widgit from "./Widgit";
import TableComponent from "./TableComponent";
import { executeSqlQuery } from "../../utils/CommonFunction";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";

const defaultSelect = ["Please Select"];

export default function SavedWidgits() {
  const { setLoading } = useContext(HISContext);

  const { dispatcher, dashboardState } = useDashboard();

  const [widgits, setWidgits] = useState([]);
  const [widgitData, setWidgitData] = useState([]);
  const [showWidgit, setShowWidgit] = useState(false);
  const [selectedWidgit, setSelectedWidget] = useState();
  const [widgitDataObject, setWidgitDataObject] = useState({});
  const [drillDown, setDrilldown] = useState([]);
  const [showTable, setShowtable] = useState(false);

  //Dynamic Table Creation
  const [message, setMessage] = useState("");
  const fetchedRows = dashboardState.fetchedData;
  const fetchedColumns = dashboardState.fetchedColumns;

  //TODO Drilldown needs more clarity, some factors based on which we can decide which columns must be selected for x / y axis in child
  // is even showing graph for child necessary?? will ask someone how they really enter query for child

  const fetchAllWidgits = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8025/api/v1/fetchAllWidgits`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch column names");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching widgits:", error);
      ToastAlert("Failed to fetch widgits", "error");
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  useEffect(() => {
    async function setState() {
      const response = await fetchAllWidgits();
      setWidgits(
        defaultSelect.concat(response.data.map((data) => data.widgitName))
      );
      setWidgitData(response.data);
    }

    setState();
  }, [fetchAllWidgits]);

  const widgetMap = useMemo(() => {
    return widgitData.reduce((acc, widget) => {
      acc[widget.widgitName] = widget.widgitData;
      return acc;
    }, {});
  }, [widgitData]);

  const drillDownMap = useMemo(() => {
    return widgitData.reduce((acc, widget) => {
      acc[widget.widgitName] = widget.drilldownData;
      return acc;
    }, {});
  }, [widgitData]);

  async function handleChange(e) {
    const value = e.target.value;
    if (value === "Please Select") return;

    setSelectedWidget(value);

    setWidgitDataObject(widgetMap[value]);
    setDrilldown(drillDownMap[value]);

    const response = await executeSqlQuery(widgetMap[value].sqlQuery);
    const { columns, rows } = response.data;

    if (response.status == 0) {
      setMessage(response.message);
    }
    dispatcher({ type: "FETCH/COLUMNS", payload: columns });
    dispatcher({ type: "FETCH/DATA", payload: rows });
    dispatcher({ type: "SET/SQLERROR", payload: "" });
    dispatcher({ type: "SET/PARENT-STATE", payload: response.data });
    dispatcher({
      type: "SET/CHILD-PARAMS",
      payload: {
        xAxis: widgetMap[value]?.xAxisParams,
        yAxis: widgetMap[value]?.yAxisParams,
      },
    });
    setShowtable(true);
    setShowWidgit(true);
  }

  return (
    <>
      <div className="saved_widgits-container">
        <h4 className="saved_widgits-heading">Select Widgit To View : </h4>
        <Dropdown
          values={widgits}
          handlerFunction={handleChange}
          multiSelectOption={""}
          isMultiselectable={false}
          cssClass={"mb-1"}
          selectedValue={selectedWidgit}
        />
      </div>
      {showTable && (
        <TableComponent
          dataArray={fetchedRows}
          columnsArray={fetchedColumns}
          title={selectedWidgit}
          key={1}
          message={message}
        />
      )}
      {showWidgit && (
        <Widgit
          rawData={widgitDataObject}
          widgitName={selectedWidgit}
          drillDownData={drillDown}
          dynamicRows={fetchedRows}
        />
      )}
    </>
  );
}
