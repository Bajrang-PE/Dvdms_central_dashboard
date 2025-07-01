import { useReducer } from "react";
import SidebarComponent from "../component/dashboard/Sidebar";
import DashHeader from "../component/dashboard/DashHeader";
import "../styles/WelcomePage.css";
import "../styles/DashboardCreator.css";
import "../styles/SqlBuilder.css";
import "../styles/Charts.css";
import "../styles/SavedData.css";
import MainContainer from "../component/homePage/Maincontainer";
import ConfigurationTabs from "../component/homePage/ConfigurationTabs";
import TableMapper from "../component/homePage/TableMapper";
import DashboardCreator from "../component/homePage/DashboardCreator";
import LinkMapper from "../component/homePage/LinkMapper";

export default function DvdmsDashboard() {
  const configurationTabToggles = {
    showTableMapper: false,
    showDashboardMapper: false,
    showLinkMapper: false,
  };

  //Configures which part is rendered
  //prettier-ignore
  const [tabToggels, dispatcher] = useReducer(toggleStateReducer, configurationTabToggles);
  const primaryWindowState =
    !tabToggels.showDashboardMapper &&
    !tabToggels.showTableMapper &&
    !tabToggels.showLinkMapper;

  return (
    <>
      <DashHeader />
      <div className="landingpage">
        <SidebarComponent />
        <MainContainer>
          {primaryWindowState && (
            <ConfigurationTabs toggleFunction={dispatcher} />
          )}
          {tabToggels.showTableMapper && (
            <TableMapper toggleFunction={dispatcher} />
          )}
          {tabToggels.showDashboardMapper && (
            <DashboardCreator toggleFunction={dispatcher} />
          )}
          {tabToggels.showLinkMapper && (
            <LinkMapper toggleFunction={dispatcher} />
          )}
        </MainContainer>
      </div>
    </>
  );
}

function toggleStateReducer(state, action) {
  switch (action.type) {
    case "TOGGLE/TABLEMAPPER":
      return {
        ...state,
        showTableMapper: !state.showTableMapper,
      };
    case "TOGGLE/DASHBOARDMAPPER":
      return {
        ...state,
        showDashboardMapper: !state.showDashboardMapper,
      };
    case "TOGGLE/LINKMAPPER":
      return {
        ...state,
        showLinkMapper: !state.showLinkMapper,
      };
  }
}
