import React, { useContext, useEffect, useState, useMemo, useCallback } from "react";
import DashSidebar from "../../components/sidebar/Sidebar";
import { HISContext } from "../../contextApi/HISContext";
import TabDash from "../../components/sidebar/TabDash";
import { useSearchParams } from "react-router-dom";
import TopBar from "../../components/sidebar/TopBar";
import { fetchData } from "../../../../utils/ApiHooks";

const DashboardMst = () => {
    const { getAllTabsData, getAllWidgetData, allTabsData, activeTab, setActiveTab, theme, setTheme, mainDashData, setMainDashData, setLoading, loading, singleConfigData, getDashConfigData} = useContext(HISContext);
    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("groupId");
    const dashboardFor = searchParams.get("dashboardFor");

    useEffect(() => {
        if (!singleConfigData) {
            getDashConfigData()
        }
    }, [])

    const getDashboardData = useCallback((groupId, dashFor) => {
        fetchData(`hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst`)
            .then((data) => {
                if (data) setMainDashData(data);
            });
    }, []);

    useEffect(() => {
        if (dashboardFor && groupId) {
            getAllTabsData(dashboardFor);
            getDashboardData(groupId, dashboardFor);
            getAllWidgetData(dashboardFor);
        }
    }, [searchParams]);

    const presentTabs = useMemo(() => {
        if (!mainDashData || !allTabsData?.length) return [];
        const dashboardIdsArray = mainDashData?.jsonData?.dashboardIds?.split(',').map(Number) || [];
        const themes = mainDashData?.jsonData?.dashboardTheme || 'Default'
        setTheme(themes);
        return dashboardIdsArray
            .map(id => allTabsData.find(tab => tab.id === id))
            .filter(Boolean);
    }, [allTabsData, mainDashData]);


    const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';

    // useEffect(() => {
    //     if(activeTab){
    //         console.log(activeTab, 'bajrang')
    //     }
    // }, [activeTab])

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [])

    // useEffect(() => {
    //     if (activeTab) {
    //         setLoading(true);
    //         setTimeout(() => {
    //             setLoading(false);
    //         }, 1000);
    //     }
    // }, [activeTab])



    return (
        <>
            {loading ? null : (
                <div className={`${theme === 'Dark' ? 'dark-theme' : ''}`} style={{
                    display: isTopBarLayout ? "block" : 'flex',
                    backgroundColor: "#f4f4f4",
                    minHeight: "100vh"
                }}>
                    {isTopBarLayout ? (
                        <TopBar
                            data={presentTabs}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            dashboardData={mainDashData}
                        />
                    ) : (
                        <DashSidebar
                            data={presentTabs}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                            dashboardData={mainDashData}
                        />
                    )}

                    <main style={{ padding: "10px 20px", flex: 1 }}>
                        {activeTab &&
                            <TabDash tabData={activeTab} />
                        }
                    </main>
                </div>
            )}
        </>
    );
};

export default DashboardMst;
