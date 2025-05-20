import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import '../headers/NavbarHeader.css';
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TopBar = ({ data, setActiveTab, dashboardData }) => {
    const [openSubMenu, setOpenSubMenu] = useState(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollRef = useRef(null);

    // Memoize root tabs to avoid recalculation on every render
    const rootTabs = useMemo(() => {
        return data?.filter(tab => !tab.jsonData.parentTabId || tab.jsonData.parentTabId === "0") || [];
    }, [data]);

    // Memoize child tab lookup
    const getChildTabs = useCallback((parentId) => {
        return data?.filter(tab => tab.jsonData.parentTabId === String(parentId)) || [];
    }, [data]);

    // Memoize icon lookup
    const iconCache = useMemo(() => {
        const cache = {};
        (data || []).forEach(tab => {
            const iconName = tab?.jsonData?.iconName;
            if (iconName && !cache[iconName]) {
                let formattedIconName = "fa" + iconName.replace(/-o$/, "")
                    .replace("fa-", "")
                    .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
                let iconKey = Object.keys(SolidIcons).find(key => key.toLowerCase() === formattedIconName.toLowerCase())
                    || Object.keys(SolidIcons).find(key => key.toLowerCase().includes(formattedIconName.toLowerCase().replace(/[^a-zA-Z]/g, "")));
                cache[iconName] = iconKey ? SolidIcons[iconKey] : SolidIcons.faBarChart;
            }
        });
        return cache;
    }, [data]);

    const getDynamicIcon = (iconName) => iconCache[iconName] || SolidIcons.faBarChart;

    // Initial active tab setup — run only when `data` changes significantly
    useEffect(() => {
        if (rootTabs.length > 0) {
            setActiveTab(rootTabs[0]);
            setOpenSubMenu(rootTabs[0]?.id);
        }
    }, [rootTabs]);

    // Scroll logic
    const checkScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < (scrollWidth - clientWidth));
        }
    }, []);

    const scrollBy = (offset) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
        }
    };

    // Cleaned up scroll handlers
    const scrollLeft = () => scrollBy(-200);
    const scrollRight = () => scrollBy(200);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-header">
            <div className="container-fluid">
                <span className='topbar-brand me-4 navbar-brand logo' style={{ whiteSpace: "nowrap" }}>
                    {dashboardData?.jsonData?.groupName || "Dashboard"}
                </span>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {canScrollLeft && (
                    <button className="scroll-button left" onClick={()=>scrollLeft()}>
                        <FontAwesomeIcon icon={SolidIcons.faChevronLeft} />
                    </button>
                )}

                <div className="collapse navbar-collapse scrollable-navbar-container" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto scrollable-navbar" ref={scrollRef} onScroll={checkScroll}>
                        {rootTabs.map(tab => {
                            const childTabs = getChildTabs(tab.id);

                            return (
                                <li key={tab.id} className="nav-item dropdown">
                                    <a
                                        className="nav-link dropdownAnchor dropdown-toggle"
                                        href="#"
                                        role="button"
                                        data-bs-toggle={childTabs.length > 0 ? 'dropdown' : ''}
                                        onClick={() => {
                                            setActiveTab(tab);
                                            setOpenSubMenu(openSubMenu === tab.id ? null : tab.id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={getDynamicIcon(tab?.jsonData?.iconName)} className="me-2 dropdown-gear-icon" />
                                        {tab?.jsonData?.dashboardName}
                                    </a>
                                    {childTabs.length > 0 && (
                                        <ul className="dropdown-menu drpb-menu">
                                            {childTabs.map(child => (
                                                <li key={child.id} className="dropdown-list">
                                                    <a
                                                        className="dropdown-item"
                                                        href="#"
                                                        onClick={() => setActiveTab(child)}
                                                    >
                                                        <FontAwesomeIcon icon={getDynamicIcon(child?.jsonData?.iconName)} className="me-2 dropdown-gear-icon" />
                                                        {child?.jsonData?.dashboardName}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {canScrollRight && (
                    <button className="scroll-button right" onClick={()=>scrollRight()}>
                        <FontAwesomeIcon icon={SolidIcons.faChevronRight} />
                    </button>
                )}
            </div>
        </nav>
    );
};

export default TopBar;
