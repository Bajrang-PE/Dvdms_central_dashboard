import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faChartBar, faCog } from "@fortawesome/free-solid-svg-icons";

const SidebarComponent = () => {
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

    return (
        <Sidebar width="270px" style={{ minHeight: "100vh", color: "#ECF0F1" }} collapsed={collapsed} backgroundColor="#071b2f">
            <Menu iconShape="square">
                <MenuItem className="menu-item-container">
                    {!collapsed && <span><b>Dashboard</b></span>}
                    <i onClick={toggleSidebar} className="fa fa-bars menu-icon-right" />
                </MenuItem>

                <b><h6 className="header-devider"></h6></b>

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

                <MenuItem
                    icon={<FontAwesomeIcon icon={faCog} />}
                    className="menu-tab-item"
                    id={`menu-tab-item21`}
                    onMouseOver={() => handleHover(`menu-tab-item21`, true)}
                    onMouseOut={() => handleHover(`menu-tab-item21`, false)}
                    style={{ color: tabFont }}
                >
                    {!collapsed && 'Settings'}
                </MenuItem>
            </Menu>
        </Sidebar>
    );
};

export default SidebarComponent;
