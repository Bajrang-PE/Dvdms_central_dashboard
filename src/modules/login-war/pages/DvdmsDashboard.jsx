import { useSelector, useDispatch } from "react-redux";
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
import { closeAllMappers, openMapper } from "../../../store/uiSlice";
import DashboardHome from "../component/homePage/DashboardHome";

export default function DvdmsDashboard() {
  const dispatch = useDispatch();
  const tabToggels = useSelector((state) => state.ui);
  const primaryWindowState =
    !tabToggels.showDashboardMapper &&
    !tabToggels.showTableMapper &&
    !tabToggels.showLinkMapper;

  // Handler to pass to children
  const toggleFunction = (action) => {
    switch (action.type) {
      case "OPEN/TABLEMAPPER":
        dispatch(openMapper("table"));
        break;
      case "OPEN/DASHBOARDMAPPER":
        dispatch(openMapper("dashboard"));
        break;
      case "OPEN/LINKMAPPER":
        dispatch(openMapper("link"));
        break;
      case "CLOSE/ALLMAPPERS":
        dispatch(closeAllMappers());
        break;
      default:
        break;
    }
  };

  return (
    <>
      <DashHeader />
      <div className="landingpage">
        <SidebarComponent toggleFunction={toggleFunction} />
        <MainContainer>
          {primaryWindowState && (
            // <ConfigurationTabs toggleFunction={toggleFunction} />
            <DashboardHome />
          )}
          {tabToggels.showTableMapper && (
            <TableMapper toggleFunction={toggleFunction} />
          )}
          {tabToggels.showDashboardMapper && (
            <DashboardCreator toggleFunction={toggleFunction} />
          )}
          {tabToggels.showLinkMapper && (
            <LinkMapper toggleFunction={toggleFunction} />
          )}
        </MainContainer>
      </div>
    </>
  );
}
