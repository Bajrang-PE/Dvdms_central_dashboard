import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faChartBar,
  faCog,
  faDashboard,
  faLink,
  faDatabase,
} from "@fortawesome/free-solid-svg-icons";

const SidebarComponent = ({ toggleFunction }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const tabFont = "#ffffff";

  const handleHover = (id, isHover) => {
    const element = document.getElementById(id);
    if (element) {
      element.style.color = isHover ? "#f2aa0d" : tabFont;
      element.style.backgroundColor = isHover ? "#1f4068" : "transparent";
    }
  };
  const handleClick = (type) => {
    toggleFunction({ type: type });
  };

  return (
    <Sidebar
      width="270px"
      style={{ minHeight: "100vh", color: "#ECF0F1" }}
      collapsed={collapsed}
      backgroundColor="#071b2f"
    >
      <Menu iconShape="square">
        <MenuItem className="menu-item-container">
          {!collapsed && (
            <span>
              <b>Dashboard</b>
            </span>
          )}
          <i onClick={toggleSidebar} className="fa fa-bars menu-icon-right" />
        </MenuItem>

        <b>
          <h6 className="header-devider"></h6>
        </b>

        <SubMenu
          label={!collapsed && "Analytics"}
          icon={<FontAwesomeIcon icon={faChartBar} />}
          className="submenu-tab-side"
          id={`menu-tab-item`}
          onMouseOver={() => handleHover(`menu-tab-item`, true)}
          onMouseOut={() => handleHover(`menu-tab-item`, false)}
          style={{ color: tabFont }}
          // open={true}
        >
          <MenuItem
            className="menu-tab-item"
            icon={<FontAwesomeIcon icon={faTachometerAlt} />}
            id={`menu-tab-item1`}
            onMouseOver={() => handleHover(`menu-tab-item1`, true)}
            onMouseOut={() => handleHover(`menu-tab-item1`, false)}
            style={{ color: tabFont }}
          >
            User Details
          </MenuItem>
          <MenuItem
            className="menu-tab-item"
            icon={<FontAwesomeIcon icon={faChartBar} />}
            id={`menu-tab-item2`}
            onMouseOver={() => handleHover(`menu-tab-item2`, true)}
            onMouseOut={() => handleHover(`menu-tab-item2`, false)}
            style={{ color: tabFont }}
          >
            Facility Details
          </MenuItem>
        </SubMenu>

        <SubMenu
          label={!collapsed && "Settings"}
          icon={<FontAwesomeIcon icon={faCog} />}
          className="submenu-tab-side"
          id={`menu-tab-item-settings`}
          onMouseOver={() => handleHover(`menu-tab-item-settings`, true)}
          onMouseOut={() => handleHover(`menu-tab-item-settings`, false)}
          style={{ color: tabFont }}
        >
          <MenuItem
            className="menu-tab-item"
            icon={<FontAwesomeIcon icon={faDatabase} />}
            id={`menu-tab-item-settings-1`}
            onMouseOver={() => handleHover(`menu-tab-item-settings-1`, true)}
            onMouseOut={() => handleHover(`menu-tab-item-settings-1`, false)}
            style={{ color: tabFont }}
            onClick={() => handleClick("OPEN/TABLEMAPPER")}
          >
            Configure Tables
          </MenuItem>
          <MenuItem
            className="menu-tab-item"
            icon={<FontAwesomeIcon icon={faDashboard} />}
            id={`menu-tab-item-settings-2`}
            onMouseOver={() => handleHover(`menu-tab-item-settings-2`, true)}
            onMouseOut={() => handleHover(`menu-tab-item-settings-2`, false)}
            style={{ color: tabFont }}
            onClick={() => {
              handleClick("OPEN/DASHBOARDMAPPER");
            }}
          >
            Manage Dashboards
          </MenuItem>
          <MenuItem
            className="menu-tab-item"
            icon={<FontAwesomeIcon icon={faLink} />}
            id={`menu-tab-item-settings-3`}
            onMouseOver={() => handleHover(`menu-tab-item-settings-3`, true)}
            onMouseOut={() => handleHover(`menu-tab-item-settings-3`, false)}
            style={{ color: tabFont }}
            onClick={() => handleClick("OPEN/LINKMAPPER")}
          >
            Create Links / Drilldown
          </MenuItem>
        </SubMenu>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
