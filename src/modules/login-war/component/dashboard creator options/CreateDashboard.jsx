import { useMemo, useState } from "react";
import TableComponent from "./TableComponent";
import QueryLog from "./QueryLog";
import useDashboard from "../../../his-utils/contextApi/useDashboardHook";
import CanvasJSReact from "@canvasjs/react-charts";
import RadioOptions from "./RadioOptions";
import FreehandSQLEditor from "./FreehandSQLEditor";
import SQLBuilderTool from "./SQLBuilderTool";
import RunFunction from "./RunFunction";
import RunProcedure from "./RunProcedure";
import ChartMaker from "./ChartMaker";

const { CanvasJSChart } = CanvasJSReact;

//Dashboard Tools Options
const options = [
  { value: "freehandSQL", label: "Free Hand SQL" },
  { value: "sqlBuilder", label: "SQL Builder Tool" },
  { value: "runFunction", label: "Run Predefined Function" },
  { value: "runProcedure", label: "Run Predefined Procedure" },
];

//dummy data
const columnsArrayDummy = [
  // { label: "#", key: "id" },
  // { label: "Name", key: "name" },
  // { label: "Occupation", key: "role" },
  // { label: "City", key: "city" },
  // { label: "Address", key: "address" },
  // { label: "Gender", key: "gender" },
  // { label: "Age", key: "age" },
  // { label: "Nationality", key: "nationality" },
  // { label: "Hobby", key: "hobby" },
  // { label: "Blood Group", key: "bloodGrp" },
];

const dataArrayDummy = [
  // {
  //   id: 1,
  //   name: "Alice",
  //   role: "Developer",
  //   city: "Manhattan",
  //   address: "11/B Street",
  //   gender: "Female",
  //   age: "28",
  //   nationality: "American",
  //   hobby: "Reading",
  //   bloodGrp: "A+",
  // },
  // {
  //   id: 2,
  //   name: "Bob",
  //   role: "Designer",
  //   city: "Brooklyn",
  //   address: "22/A Avenue",
  //   gender: "Male",
  //   age: "31",
  //   nationality: "American",
  //   hobby: "Sketching",
  //   bloodGrp: "B+",
  // },
];

export default function CreateDashboard() {
  //eslint-disable-next-line
  const { dispatcher, dashboardState } = useDashboard();

  const columnsArray =
    dashboardState.fetchedColumns.length === 0
      ? columnsArrayDummy
      : dashboardState.fetchedColumns;

  const dataArray =
    dashboardState.fetchedData.length === 0
      ? dataArrayDummy
      : dashboardState.fetchedData;

  const message =
    dashboardState.sqlError.length !== 0 ? dashboardState.sqlError : "";

  const selectedState = dashboardState.dashboardState;

  //prettier-ignore
  const currentlySelectedOption =
    selectedState === "" ? "createDrilldown" : selectedState;

  const ComputeActiveComponent = useMemo(() => {
    switch (currentlySelectedOption) {
      case "freehandSQL":
        return <FreehandSQLEditor />;
      case "sqlBuilder":
        return <SQLBuilderTool />;
      case "runFunction":
        return <RunFunction isExecuteButtonRequired={true} />;
      case "runProcedure":
        return <RunProcedure isExecuteButtonRequired={true} />;
      default:
        return null;
    }
  }, [currentlySelectedOption]);

  return (
    <>
      <RadioOptions options={options} defaultOption={currentlySelectedOption} />
      {ComputeActiveComponent}
      <TabComponent
        tableData={dataArray}
        tableColumns={columnsArray}
        message={message}
      />
    </>
  );
}

function TabComponent({ tableData, tableColumns, message }) {
  const [activeTab, setActiveTab] = useState("SQL_RESULT");

  function renderContent() {
    switch (activeTab) {
      case "SQL_RESULT":
        return (
          <>
            <TableComponent
              dataArray={tableData}
              columnsArray={tableColumns}
              key={1}
              title={
                tableColumns.length === 0
                  ? "Query execution results will be displayed here"
                  : "Custom Dashboard"
              }
              message={message}
            />
            <ChartMaker />
          </>
        );
      case "QUERY_HISTORY":
        return <QueryLog key={2} />;
      default:
        return null;
    }
  }

  return (
    <div className="sqltabs-container">
      <div className="tabs-header--sql">
        <button
          className={activeTab === "SQL_RESULT" ? "active-sql" : ""}
          onClick={() => setActiveTab("SQL_RESULT")}
        >
          Query Result
        </button>
        <button
          className={activeTab === "QUERY_HISTORY" ? "active-sql" : ""}
          onClick={() => setActiveTab("QUERY_HISTORY")}
        >
          Previous Queries
        </button>
      </div>
      <div className="tabs-content--sql">{renderContent()}</div>
    </div>
  );
}
