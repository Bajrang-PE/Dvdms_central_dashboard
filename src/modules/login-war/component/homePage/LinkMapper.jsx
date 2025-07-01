import { useState } from "react";
import CreateDrilldowns from "../dashboard creator options/CreateDrilldowns";
import CreateLinks from "../dashboard creator options/Createlinks";

export default function LinkMapper({ toggleFunction }) {
  function goBack() {
    toggleFunction({ type: "TOGGLE/LINKMAPPER" });
  }

  return (
    <div className="dashboard__window-wrapper">
      <BackButton />
      <TabComponent />
    </div>
  );

  function TabComponent() {
    const [activeTab, setActiveTab] = useState("DRILLDOWNS");

    function renderContent() {
      switch (activeTab) {
        case "DRILLDOWNS":
          return <CreateDrilldowns />;
        case "LINKS":
          return <CreateLinks />;
        default:
          return null;
      }
    }

    return (
      <>
        <div className="tabs-header">
          <button
            className={activeTab === "DRILLDOWNS" ? "active" : ""}
            onClick={() => setActiveTab("DRILLDOWNS")}
          >
            Create Drilldowns
          </button>
          <button
            className={activeTab === "LINKS" ? "active" : ""}
            onClick={() => setActiveTab("LINKS")}
          >
            Create Links
          </button>
        </div>
        <div className="tabs-content">{renderContent()}</div>
      </>
    );
  }

  function BackButton() {
    return (
      <button className="configuration-back" onClick={goBack}>
        &larr; Back
      </button>
    );
  }
}
