// import React, { useEffect, useState } from "react";
// import { Menu, MenuItem, SubMenu, Sidebar } from "react-pro-sidebar";
// import { FaBars } from "react-icons/fa";
// import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import * as FaIcons from "react-icons/fa";
// import useImageWithFallback from "../../hooks/useImageWithFallback";


// const DynamicImage = React.memo(({ iconName }) => {
//     const imageSrc = useImageWithFallback(iconName);

//     return (
//         <img
//             src={imageSrc}
//             alt="menu-icon"
//             className="menu-icon-image"
//             style={{ width: '16px', height: '16px' }}
//         />
//     );
// });

// const DashSidebar = ({ data, setActiveTab, activeTab, dashboardData, setPrevKpiTab, dt, setAllDrpDtParams }) => {

//     const [collapsed, setCollapsed] = useState(true);
//     const [openSubMenu, setOpenSubMenu] = useState(null);

//     const rootTabs = data?.filter(dt => dt?.jsonData?.isTabUsedForDrillDown === "No")?.filter(tab => !tab.jsonData.parentTabId || tab.jsonData.parentTabId === "0");


//     // Fetch child tabs with memoization
//     const getChildTabs = (parentId) => {
//         return data?.filter(tab => tab.jsonData.parentTabId === String(parentId));
//     };

//     // Config from dashboardData
//     const tabFontColourHover = dashboardData?.jsonData?.tabFontColourHover || "#ffffff";
//     const tabColourHover = dashboardData?.jsonData?.tabColourHover || "#ccac7c";
//     const tabFont = dashboardData?.jsonData?.tabFont || "#ffffff";
//     const isSidebarCollapse = dashboardData?.jsonData?.isSidebarCollapse || 'Yes';

//     const getDynamicIcon = (iconName) => {
//         if (!iconName) return <FontAwesomeIcon icon={SolidIcons.faBarChart} />;

//         if (iconName?.includes("_") || iconName?.includes("-")) {
//             const formattedIconName =
//                 "fa" +
//                 iconName
//                     .replace(/-o$/, "")
//                     .replace(/^fa-/, "")
//                     .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

//             const iconKey = Object.keys(SolidIcons).find(
//                 (key) =>
//                     key.toLowerCase() === formattedIconName.toLowerCase() ||
//                     key
//                         .toLowerCase()
//                         .includes(
//                             formattedIconName.replace(/[^a-zA-Z]/g, "").toLowerCase()
//                         )
//             );

//             const IconDef = iconKey ? SolidIcons[iconKey] : SolidIcons.faBarChart;
//             return <FontAwesomeIcon icon={IconDef} />;
//         }

//         const Cmp = FaIcons[iconName] || FaBars;
//         return <Cmp />;
//     };


//     useEffect(() => {
//         if (rootTabs.length > 0) {
//             setActiveTab(rootTabs[0]);
//             setOpenSubMenu(rootTabs[0]?.id);
//         } else if (data?.length > 0) {
//             setActiveTab(data[0]);
//             setOpenSubMenu(data[0]?.id);
//         }
//     }, [data]);

//     const toggleSidebar = () => {
//         setCollapsed(prev => !prev);
//         const btn = document?.querySelector('.activeSideTab');
//         const div2 = btn?.parentElement?.parentElement;
//         if (div2) {
//             div2?.click();
//              div2.style.visibility = "visible";
//         }
//     };

//     const handleSubMenuClick = (submenu) => setOpenSubMenu(openSubMenu === submenu ? null : submenu);

//     const handleHover = (id, isHover) => {
//         const element = document.getElementById(id);

//         if (element) {
//             element.style.color = isHover ? tabFontColourHover : tabFont;
//             element.style.backgroundColor = isHover ? tabColourHover : "transparent";
//         }
//     };

//     const onMouseEnterSubmenu = (e, tabId, isHover) => {
//         const btn = document?.getElementById(`menu-tab-item${tabId}`);

//         if (collapsed) {
//             document.querySelectorAll('.ps-submenu-content')
//                 .forEach(div => {
//                     div.style.visibility = 'hidden';
//                 });
//         }

//         const parent = btn.parentElement;
//         const div = parent.querySelector("div");
//         if (div && isHover) {
//             div.style.visibility = "visible";

//         }
//     }

//     useEffect(() => {
//         const handleOutsideClick = (event) => {
//             const sidebar = document.querySelector(".ps-sidebar-root");
//             if (sidebar && !sidebar.contains(event.target)) {
//                 if (collapsed) {
//                     document.querySelectorAll('.ps-submenu-content')
//                         .forEach(div => {
//                             div.style.visibility = 'hidden';
//                         });
//                     const btn = document?.querySelector('.activeSideTab');
//                     const div = btn.querySelector("a");
//                     const div2 = btn.querySelector('div');


//                     if (btn && div && div2?.classList?.contains("ps-open")) {
//                         div?.click();
//                     }
//                 }
//             }
//         };

//         document.addEventListener("click", handleOutsideClick);

//         return () => {
//             document.removeEventListener("click", handleOutsideClick);
//         };

//     }, [collapsed]);

//     return (
//         <Sidebar width="270px"
//             style={{
//                 minHeight: "100vh",
//                 color: "#ECF0F1",
//             }}
//             collapsed={collapsed}
//             toggled
//             backgroundColor="#071b2f"
//         >
//             <Menu iconShape="square">
//                 <MenuItem className="menu-item-container">
//                     {!collapsed && <span><b>{dt(dashboardData?.jsonData?.groupName || "Dashboard")}</b></span>}
//                     {isSidebarCollapse !== 'No' && (
//                         <FaBars onClick={() => toggleSidebar()} className="menu-icon-right" />
//                     )}
//                 </MenuItem>

//                 <b><h6 className='header-devider'></h6></b>

//                 <div className="sidemenu-scroller">
//                     {(rootTabs?.length > 0 ? rootTabs : data)?.map((tab) => {
//                         const childTabs = getChildTabs(tab.id);
//                         const isActive = activeTab?.jsonData?.dashboardId === tab?.jsonData?.dashboardId;

//                         if (childTabs.length > 0) {
//                             return (
//                                 <SubMenu
//                                     key={tab.id}
//                                     label={!collapsed && tab?.jsonData?.dashboardActualName}
//                                     icon={tab?.jsonData?.isCSSTabIconRequired === "No" ? <DynamicImage iconName={tab?.jsonData?.iconImageName} /> : getDynamicIcon(tab?.jsonData?.iconName)}
//                                     className={`submenu-tab-side ${isActive ? 'activeSideTab' : ''}`}
//                                     open={activeTab?.jsonData?.parentTabId == tab.id || openSubMenu == tab.id}
//                                     onClick={() => {
//                                         handleSubMenuClick(tab.id);
//                                         setActiveTab(tab);
//                                         setPrevKpiTab([]);
//                                         setAllDrpDtParams([]);
//                                     }}
//                                     id={`menu-tab-item${tab.id}`}
//                                     onMouseOver={(e) => { handleHover(`menu-tab-item${tab.id}`, true); onMouseEnterSubmenu(e, tab.id, true); }}
//                                     onMouseOut={(e) => { handleHover(`menu-tab-item${tab.id}`, false); onMouseEnterSubmenu(e, tab.id, true); }}
//                                     style={{ color: tabFont }}
//                                     title={tab?.jsonData?.dashboardName}
//                                 >
//                                     {childTabs.map(child => (
//                                         <MenuItem
//                                             key={child.id}
//                                             onClick={(e) => { setActiveTab(child); setPrevKpiTab([]); setAllDrpDtParams([]); onMouseEnterSubmenu(e, tab.id, false); }}
//                                             className={`menu-tab-item ${activeTab?.jsonData?.dashboardId === child?.jsonData?.dashboardId ? 'activeSideTab' : ''}`}
//                                             icon={getDynamicIcon(child?.jsonData?.iconName)}
//                                             id={`menu-tab-item${child.id}`}
//                                             onMouseOver={() => handleHover(`menu-tab-item${child.id}`, true)}
//                                             onMouseOut={() => handleHover(`menu-tab-item${child.id}`, false)}
//                                             style={{ color: tabFont }}
//                                             title={child?.jsonData?.dashboardName}
//                                         >
//                                             {child?.jsonData?.dashboardName}
//                                         </MenuItem>
//                                     ))}
//                                 </SubMenu>
//                             );
//                         }

//                         return (
//                             <MenuItem
//                                 key={tab.id}
//                                 // icon={getDynamicIcon(tab?.jsonData?.iconName)}
//                                 icon={tab?.jsonData?.isCSSTabIconRequired === "No" ?
//                                     <DynamicImage iconName={tab?.jsonData?.iconImageName} />
//                                     : getDynamicIcon(tab?.jsonData?.iconName)}
//                                 onClick={() => { setActiveTab(tab); handleSubMenuClick(''); setPrevKpiTab([]); setAllDrpDtParams([]); }}
//                                 className={`menu-tab-item ${isActive ? 'activeSideTab' : ''}`}
//                                 id={`menu-tab-item${tab.id}`}
//                                 onMouseOver={(e) => {
//                                     handleHover(`menu-tab-item${tab.id}`, true);
//                                     onMouseEnterSubmenu(e, tab.id, false);
//                                 }}
//                                 onMouseOut={(e) => {
//                                     handleHover(`menu-tab-item${tab.id}`, false);
//                                     onMouseEnterSubmenu(e, tab.id, false);
//                                 }}
//                                 style={{ color: tabFont }}
//                                 title={tab?.jsonData?.dashboardName}
//                             >
//                                 {!collapsed && tab?.jsonData?.dashboardName}
//                             </MenuItem>
//                         );
//                     })
//                     }
//                 </div>
//             </Menu>
//         </Sidebar>
//     );
// };

// export default DashSidebar;


import React, { useEffect, useMemo, useState } from "react";
import { Menu, MenuItem, SubMenu, Sidebar } from "react-pro-sidebar";
import { FaBars } from "react-icons/fa";
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as FaIcons from "react-icons/fa";
import useImageWithFallback from "../../hooks/useImageWithFallback";


const DynamicImage = React.memo(({ iconName }) => {
    const imageSrc = useImageWithFallback(iconName);

    return (
        <img
            src={imageSrc}
            alt="menu-icon"
            className="menu-icon-image"
            style={{ width: '16px', height: '16px' }}
        />
    );
});

const DashSidebar = ({ data, setActiveTab, activeTab, dashboardData, setPrevKpiTab, dt, setAllDrpDtParams }) => {

    const [collapsed, setCollapsed] = useState(true);
    // Updated to Array: Allows multiple menu levels to stay open simultaneously 
    const [openSubMenus, setOpenSubMenus] = useState([]);


    // const rootTabs = data?.filter(dt => dt?.jsonData?.isTabUsedForDrillDown === "No")?.filter(tab => !tab.jsonData.parentTabId || tab.jsonData.parentTabId === "0");

    const rootTabs = useMemo(() => {
        if (!data?.length) return [];

        const allTabIds = new Set(
            data?.map(tab => String(tab?.id))
        );
        return data?.filter(tab => {
            const json = tab.jsonData;
            if (json?.isTabUsedForDrillDown !== "No") {
                return false;
            }
            const parentId = String(json?.parentTabId || "0");
            if (parentId === "0") {
                return true;
            }
            return !allTabIds?.has(parentId);
        });
    }, [data]);


    // Fetch child tabs with memoization
    const getChildTabs = (parentId) => {
        return data?.filter(tab => tab.jsonData.parentTabId === String(parentId));
    };


    // Config from dashboardData
    const tabFontColourHover = dashboardData?.jsonData?.tabFontColourHover || "#ffffff";
    const tabColourHover = dashboardData?.jsonData?.tabColourHover || "#ccac7c";
    const tabFont = dashboardData?.jsonData?.tabFont || "#ffffff";
    const isSidebarCollapse = dashboardData?.jsonData?.isSidebarCollapse || 'Yes';

    const getDynamicIcon = (iconName) => {
        if (!iconName) return <FontAwesomeIcon icon={SolidIcons.faBarChart} />;

        if (iconName?.includes("_") || iconName?.includes("-")) {
            const formattedIconName =
                "fa" +
                iconName
                    .replace(/-o$/, "")
                    .replace(/^fa-/, "")
                    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

            const iconKey = Object.keys(SolidIcons).find(
                (key) =>
                    key.toLowerCase() === formattedIconName.toLowerCase() ||
                    key
                        .toLowerCase()
                        .includes(
                            formattedIconName.replace(/[^a-zA-Z]/g, "").toLowerCase()
                        )
            );

            const IconDef = iconKey ? SolidIcons[iconKey] : SolidIcons.faBarChart;
            return <FontAwesomeIcon icon={IconDef} />;
        }

        const Cmp = FaIcons[iconName] || FaBars;
        return <Cmp />;
    };

    useEffect(() => {
        if (rootTabs && rootTabs.length > 0) {
            setActiveTab(rootTabs[0]);
            setOpenSubMenus([rootTabs[0]?.id]);
        } else if (data?.length > 0) {
            setActiveTab(data[0]);
            setOpenSubMenus([data[0]?.id]);
        }
    }, [data]);

    const toggleSidebar = () => {
        setCollapsed(prev => !prev);
        document.querySelectorAll('.ps-submenu-content.ps-open')
            .forEach(div => {
                div.style.visibility = 'visible';
            });
    };

    // Toggle menu items in the array without closing parents
    const handleSubMenuClick = (submenuId) => {
        setOpenSubMenus(prev => {
            if (prev.includes(submenuId)) {
                return prev.filter(id => id !== submenuId);
            } else {
                return [...prev, submenuId];
            }
        });
    };

    const handleHover = (id, isHover) => {
        const element = document.getElementById(id);
        if (element) {
            element.style.color = isHover ? tabFontColourHover : tabFont;
            // element.style.backgroundColor = isHover ? tabColourHover : "transparent";
            element.style.setProperty(
                "background-color",
                isHover ? tabColourHover : "transparent",
                "important"
            );
        }
    };

    const onMouseEnterSubmenu = (e, tabId, isHover, dpt) => {
        const btn = document?.getElementById(`menu-tab-item${tabId}`);

        if (collapsed && dpt < 1) {
            document.querySelectorAll('.ps-submenu-content')
                .forEach(div => {
                    // FIX: Make sure we don't hide the parent container of the submenu we are hovering!
                    div.style.visibility = 'hidden';
                });
        }

        const parent = btn?.parentElement;
        const div = parent?.querySelector("div");
        const divs = parent?.querySelectorAll(
            ".ps-submenu-content.ps-open"
        );
        if (divs && isHover && div) {
            div.style.visibility = "visible";
            divs?.forEach(div => {
                div.style.visibility = "visible";
            });
        }
    }

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const sidebar = document.querySelector(".ps-sidebar-root");
            if (sidebar && !sidebar.contains(event.target)) {
                if (collapsed) {
                    document.querySelectorAll('.ps-submenu-content')
                        .forEach(div => {
                            div.style.visibility = 'hidden';
                        });
                    const btn = document?.querySelector('.activeSideTab');
                    const div = btn?.querySelector("a");
                    const div2 = btn?.querySelector('div');

                    if (btn && div && div2?.classList?.contains("ps-open")) {
                        div?.click();
                    }
                }
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [collapsed]);


    // Recursive Tree Function (Now with depth tracking for left-padding)
    const renderMenuItems = (tabsList, depth = 0, isRoot, stage) => {
        return tabsList?.map((tab) => {
            const childTabs = getChildTabs(tab.id);
            const isActive = activeTab?.jsonData?.dashboardId === tab?.jsonData?.dashboardId;

            // FIX: Padding logic increments by 15px per depth-level when expanded
            const textPadding = depth > 0 ? `${(depth - 1) * 15}px` : '0px';
            const showText = !collapsed || depth > 0

            if (childTabs && childTabs.length > 0) {
                return (
                    <SubMenu
                        key={tab.id}
                        label={(!collapsed || showText) && tab?.jsonData?.dashboardActualName}
                        icon={tab?.jsonData?.isCSSTabIconRequired === "No" ? <DynamicImage iconName={tab?.jsonData?.iconImageName} /> : getDynamicIcon(tab?.jsonData?.iconName)}
                        className={`submenu-tab-side ${isActive ? 'activeSideTab' : ''}`}
                        open={activeTab?.jsonData?.parentTabId == tab.id || openSubMenus.includes(tab.id)}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSubMenuClick(tab.id);
                            setActiveTab(tab);
                            setPrevKpiTab([]);
                            setAllDrpDtParams([]);
                        }}
                        id={`menu-tab-item${tab.id}`}
                        onMouseOver={(e) => {
                            handleHover(`menu-tab-item${tab.id}`, true);
                            onMouseEnterSubmenu(e, tab.id, true, depth);
                        }}
                        onMouseOut={(e) => { handleHover(`menu-tab-item${tab.id}`, false); onMouseEnterSubmenu(e, tab.id, true, depth); }}
                        style={{ color: tabFont, backgroundColor: "transparent" }}
                        title={tab?.jsonData?.dashboardName}
                    >
                        {/* Recurse with depth + 1 for deeper padding */}
                        {renderMenuItems(childTabs, depth + 1, false)}
                    </SubMenu>
                );
            }

            return (
                <MenuItem
                    key={tab.id}
                    icon={tab?.jsonData?.isCSSTabIconRequired === "No" ?
                        <DynamicImage iconName={tab?.jsonData?.iconImageName} />
                        : getDynamicIcon(tab?.jsonData?.iconName)}
                    onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab);
                        setPrevKpiTab([]);
                        setAllDrpDtParams([]);
                        onMouseEnterSubmenu(e, tab.id, false, 0);
                    }}
                    className={`menu-tab-item ${isActive ? 'activeSideTab' : ''}`}
                    id={`menu-tab-item${tab.id}`}
                    onMouseOver={(e) => {
                        handleHover(`menu-tab-item${tab.id}`, true);
                        if (isRoot) {
                            onMouseEnterSubmenu(e, tab.id, false, depth);
                        } else if (depth > 1) {
                            onMouseEnterSubmenu(e, tab.id, true);
                        }
                    }}
                    onMouseOut={(e) => {
                        handleHover(`menu-tab-item${tab.id}`, false);
                        if (isRoot) {
                            onMouseEnterSubmenu(e, tab.id, false, depth);
                        } else if (depth > 1) {
                            onMouseEnterSubmenu(e, tab.id, true);
                        }
                    }}
                    style={{ color: tabFont, marginLeft: textPadding, backgroundColor: "transparent" }}
                    title={tab?.jsonData?.dashboardName}
                >

                    <span>
                        {/* {tab?.jsonData?.dashboardName} */}
                        {(!collapsed || showText) && tab?.jsonData?.dashboardName}
                    </span>
                </MenuItem>
            );
        });
    };

    return (
        <Sidebar width="270px"
            style={{
                minHeight: "100vh",
                color: "#ECF0F1",
            }}
            collapsed={collapsed}
            toggled
            backgroundColor="#071b2f"
        >
            <Menu iconShape="square">
                <MenuItem className="menu-item-container">
                    {!collapsed && <span><b>{dt(dashboardData?.jsonData?.groupName || "Dashboard")}</b></span>}
                    {/* {isSidebarCollapse !== 'No' && ( */}
                    <FaBars onClick={() => toggleSidebar()} className="menu-icon-right" />
                    {/* )} */}
                </MenuItem>

                <b><h6 className='header-devider'></h6></b>

                <div className="sidemenu-scroller">
                    {renderMenuItems(rootTabs?.length > 0 ? rootTabs : data, 0, true)}
                </div>
            </Menu>
        </Sidebar>
    );
};

export default DashSidebar;