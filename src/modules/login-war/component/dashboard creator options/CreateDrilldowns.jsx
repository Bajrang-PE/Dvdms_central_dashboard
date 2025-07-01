import { useMemo, useRef } from "react";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import { Editor } from "@monaco-editor/react";
import RunFunction from "./RunFunction";
import RunProcedure from "./RunProcedure";
import RadioOptions from "./RadioOptions";
import { useCallback, useContext, useEffect, useState } from "react";
import { HISContext } from "../../../his-utils/contextApi/HISContext";
import Dropdown from "./Dropdown";
import { ToastAlert } from "../../../his-utils/utils/commonFunction";
import Slider from "@mui/material/Slider";

const options = [
  { value: "freehandSQL", label: "SQL Editor" },
  { value: "runFunction", label: "Select Function" },
  { value: "runProcedure", label: "Select Procedure" },
];

export default function CreateDrilldowns() {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();
  const { setLoading } = useContext(HISContext);
  const [items, setItems] = useState([]);
  const [itemsDetail, setItemDetails] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedWidgit, setSelectedWidgit] = useState();
  //prettier-ignore
  const [selectedChildWidgitType, setSelectedChildWidgitType] = useState("Graph");
  const [pkColumn, setPkColumn] = useState("Please Select");
  const [selectedOption, setSelectedOption] = useState("no");
  const [widgitName, setWidgitName] = useState("");
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const sqlEditor = useRef(null);

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
      setItems([
        "Please Select",
        ...response.data.map((data) => data.widgitName),
      ]);
      setItemDetails(response.data);
    }

    setState();
  }, [fetchAllWidgits]);

  function handleEditorDidMount(editor) {
    sqlEditor.current = editor;
  }

  const selectedState = dashboardState.dashboardState;
  const currentlySelectedOption =
    selectedState === "" ? "freehandSQL" : selectedState;

  const ComputeActiveComponent = useMemo(() => {
    switch (currentlySelectedOption) {
      case "freehandSQL":
        return <DrillDownEditor />;
      case "runFunction":
        return <RunFunction />;
      case "runProcedure":
        return <RunProcedure />;
      default:
        return null;
    }
  }, [currentlySelectedOption]);

  async function handleLinkWidgits() {
    if (widgitName === "") {
      ToastAlert("Drilldown Name Cannot be empty", "error");
      return;
    }

    if (selectedOption === "yes" && (xAxis === "" || yAxis === "")) {
      ToastAlert("X or Y axis Cannot be empty", "error");
      return;
    }

    const sqlQuery = sqlEditor.current.getValue();
    const widgitID = itemsDetail.find(
      (data) => data.widgitName === selectedWidgit
    )?.widgitID;

    const drillDownObject = {
      pkColumn: pkColumn,
      sqlQuery: sqlQuery,
      widgitRequired: selectedOption,
      xAxis: xAxis,
      yAxis: yAxis,
    };

    const saveDataObject = {
      drilldownData: drillDownObject,
      drillDownName: widgitName,
    };

    const response = await createDrilldown(widgitID, saveDataObject);
    console.log(response);

    if (response.status == 1) {
      ToastAlert("Drilldown created!", "success");
    } else {
      ToastAlert("Something went wrong", "error");
    }
  }

  function DrillDownEditor() {
    return (
      <div className="drilldown__sql-editor">
        <h3 className="drilldown-subtitle">SQL Query For Drilldown</h3>
        <Editor
          height="200px"
          defaultLanguage="sql"
          defaultValue="SELECT * FROM users where id = ?;"
          theme="light"
          onMount={handleEditorDidMount}
        />
      </div>
    );
  }

  function DrillDownBuilder() {
    function handleParentWidgitChange(e) {
      const selectedValue = e.target.value;

      setSelectedWidgit(selectedValue);

      if (selectedValue === "Please Select") {
        setColumns(["Please Select"]);
        return;
      }

      const objectDetails = itemsDetail.find(
        (data) => data.widgitName === selectedValue
      );

      setColumns(objectDetails?.widgitData?.columns);
    }

    return (
      <div className="drilldown__builder-container">
        <div>
          <label className="drilldown__builder-label">Select Widgit</label>
          <Dropdown
            values={items}
            handlerFunction={handleParentWidgitChange}
            multiSelectOption={""}
            isMultiselectable={false}
            cssClass={"mb-1"}
            selectedValue={selectedWidgit}
          />
        </div>
        <div>
          <label className="drilldown__builder-label">Select PK Column</label>
          <Dropdown
            values={columns}
            handlerFunction={(e) => setPkColumn(e.target.value)}
            multiSelectOption={""}
            isMultiselectable={false}
            cssClass={"mb-1"}
            selectedValue={pkColumn}
          />
        </div>
      </div>
    );
  }

  function Controls() {
    return (
      <div className="control_box">
        <button className="execute_button" onClick={handleLinkWidgits}>
          Link Widgits
        </button>
      </div>
    );
  }

  function ChildWidgitSelector() {
    const handleClick = (option) => {
      setSelectedOption(option);
    };

    return (
      <div className="child__widgit-selector">
        <p className="child__widgit-selector--text">Child Widgit Required?</p>
        <div className="child__widgit-selector--toggler">
          <div
            className={`child__widgit-selector--toggler-option ${
              selectedOption === "yes" ? "yes" : ""
            }`}
            onClick={() => handleClick("yes")}
          >
            Yes
          </div>
          <div
            className={`child__widgit-selector--toggler-option ${
              selectedOption === "no" ? "no" : ""
            }`}
            onClick={() => handleClick("no")}
          >
            No
          </div>
        </div>
      </div>
    );
  }

  function ChildWidgitDetails() {
    function handleChildWidgitTypeChange(e) {
      setSelectedChildWidgitType(e.target.value);
    }
    return (
      <>
        <div className="child__widgit-selector">
          <p className="child__widgit-selector--text">Widgit Type : </p>
          <Dropdown
            values={["Graph", "KPI"]}
            handlerFunction={handleChildWidgitTypeChange}
            multiSelectOption={""}
            isMultiselectable={false}
            cssClass={"mb-1"}
            selectedValue={selectedChildWidgitType}
          />

          {selectedChildWidgitType === "Graph" && (
            <>
              <p className="child__widgit-selector--text">Graph Type : </p>
              <Dropdown
                values={["column", "bar", "line", "area", "doughnut"]}
                multiSelectOption={""}
                isMultiselectable={false}
                cssClass={"mb-1"}
                handlerFunction={(e) => setChartType(e.target.value)}
                selectedValue={chartType}
              />
            </>
          )}
        </div>
        {chartType === "doughnut" && (
          <div className="child__widgit-selector">
            <p className="child__widgit-selector--text">Inner Radius :</p>
            <Slider
              aria-label="Donut Radius"
              valueLabelDisplay="auto"
              min={0}
              max={75}
            />
          </div>
        )}
        <div className="child__widgit-selector">
          <p className="child__widgit-selector--text">X-Axis : </p>
          <input
            className="child__widgit-selector--text-input"
            type="text"
            placeholder="Enter column For X Axis"
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
          />
        </div>
        <div className="child__widgit-selector">
          <p className="child__widgit-selector--text">Y-Axis : </p>
          <input
            className="child__widgit-selector--text-input"
            type="text"
            placeholder="Enter column for Y Axis"
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
          />
        </div>
      </>
    );
  }

  function ChildWidgitNameField() {
    return (
      <div className="child__widgit-selector">
        <p className="child__widgit-selector--text">Drilldown Name : </p>
        <input
          className="child__widgit-selector--text-input"
          type="text"
          placeholder="Enter Name"
          value={widgitName}
          onChange={(e) => {
            setWidgitName(e.target.value);
          }}
        />
      </div>
    );
  }

  return (
    <>
      <DrillDownBuilder />
      <RadioOptions options={options} defaultOption={currentlySelectedOption} />
      {ComputeActiveComponent}
      <ChildWidgitSelector />
      <ChildWidgitNameField />
      {selectedOption === "yes" && <ChildWidgitDetails />}
      <Controls />
    </>
  );
}

async function createDrilldown(id, requestData) {
  // Make the POST request
  try {
    const response = await fetch(
      `http://localhost:8025/api/v1/createDrillDown?widgitID=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    return response.json();
  } catch (error) {
    return error;
  }
}
