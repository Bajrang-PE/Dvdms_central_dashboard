export default function ConfigurationTabs({ toggleFunction }) {
  function handleTableToggle() {
    toggleFunction({ type: "OPEN/TABLEMAPPER" });
  }

  function handleDashboardToggle() {
    toggleFunction({ type: "OPEN/DASHBOARDMAPPER" });
  }

  function handleLinkToggle() {
    toggleFunction({ type: "OPEN/LINKMAPPER" });
  }

  return (
    <>
      <h1 className="primary__heading">Welcome to DVDMS Central Dashboard</h1>
      <div className="configuration__container">
        <MapTableOption onClick={handleTableToggle} />
        <DashBoardCreatorOption onClick={handleDashboardToggle} />
        <LinkMapperOption onClick={handleLinkToggle} />
      </div>
    </>
  );
}

function MapTableOption({ onClick }) {
  return (
    <div className="configuation__tab" onClick={onClick}>
      <img
        className="configuation__tab--logo configuation__tab--logo-table"
        src="/table icon 2.png"
        alt="DB Table Mapper"
      />
      <h4 className="configuration__tabs--text">Configure Tables</h4>
    </div>
  );
}

function DashBoardCreatorOption({ onClick }) {
  return (
    <div className="configuation__tab" onClick={onClick}>
      <img
        className="configuation__tab--logo configuation__tab--logo-dashboard"
        src="/DashboardSelectorIcon2.png"
        alt="Dashboard Mapper"
      />
      <h4 className="configuration__tabs--text">Manage Dashboards</h4>
    </div>
  );
}

function LinkMapperOption({ onClick }) {
  return (
    <div className="configuation__tab" onClick={onClick}>
      <img
        className="configuation__tab--logo configuation__tab--logo-dashboard"
        src="/link icon.png"
        alt="Dashboard Mapper"
      />
      <h4 className="configuration__tabs--text">Create Links / Drilldown</h4>
    </div>
  );
}
