import { useState } from "react";
import CreateDashboard from "../dashboard creator options/CreateDashboard";
import CreateTabs from "../dashboard creator options/CreateCluster";
import SavedData from "../dashboard creator options/SavedData";

export default function DashboardCreator({ toggleFunction }) {
  function goBack() {
    toggleFunction({ type: "CLOSE/ALLMAPPERS" });
  }

  return (
    <div className="dashboard__window-wrapper">
      <button className="configuration-back" onClick={goBack}>
        &larr; Back
      </button>
      <DashboardMapperContainer>
        <TabComponent />
      </DashboardMapperContainer>
    </div>
  );
}

function DashboardMapperContainer({ children }) {
  return <div className="tabs-container">{children}</div>;
}

function TabComponent() {
  const [activeTab, setActiveTab] = useState("SQL_EDITOR");

  function renderContent() {
    switch (activeTab) {
      case "SQL_EDITOR":
        return <CreateDashboard />;
      case "SET_CLUSTOR":
        return <CreateTabs />;
      case "SAVED_CHARTS":
        return <SavedData />;
      default:
        return null;
    }
  }

  return (
    <>
      <div className="tabs-header">
        <button
          className={activeTab === "SQL_EDITOR" ? "active" : ""}
          onClick={() => setActiveTab("SQL_EDITOR")}
        >
          Create Widgits
        </button>
        <button
          className={activeTab === "SET_CLUSTOR" ? "active" : ""}
          onClick={() => setActiveTab("SET_CLUSTOR")}
        >
          Create Tabs
        </button>
        <button
          className={activeTab === "SAVED_CHARTS" ? "active" : ""}
          onClick={() => setActiveTab("SAVED_CHARTS")}
        >
          View Widgits / Tabs
        </button>
      </div>
      <div className="tabs-content">{renderContent()}</div>
    </>
  );
}
