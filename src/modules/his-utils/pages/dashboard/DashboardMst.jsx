import React, { useContext, useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { fetchData, fetchPostData } from "../../../../utils/HisApiHooks";
import Parameters from "../../components/sidebar/Parameters";

const DashSidebar = lazy(() => import("../../components/sidebar/Sidebar"));
const TopBar = lazy(() => import("../../components/sidebar/TopBar"));
const TabDash = lazy(() => import("../../components/sidebar/TabDash"));

const DashboardMst = () => {
    const { getAllWidgetData, activeTab, setActiveTab, theme, setTheme, mainDashData, setMainDashData, setLoading, loading, singleConfigData, getDashConfigData, setParamsValues, setPrevKpiTab } = useContext(HISContext);

    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("groupId");
    const dashboardFor = searchParams.get("dashboardFor");
    const [presentTabs, setPresentTabs] = useState([]);

    useEffect(() => {
        if (!singleConfigData) {
            getDashConfigData();
        }
    }, [])

    const getDashboardData = useCallback((groupId, dashFor) => {
        fetchData(`hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst`)
            .then((data) => {
                if (data?.status === 1) setMainDashData(data?.data);
            });
    }, []);

    const getAllAvailableTabs = useCallback(async (idArr, dashFor) => {
        try {
            const val = {
                ids: idArr || [],
                dashboardFor: dashFor || 'CENTRAL DASHBOARD',
                masterName: "DashboardMst"
            };
            const data = await fetchPostData("hisutils/gettabsMultipleData", val);
            if (data?.status === 1) {
                setPresentTabs(data.data);
            } else {
                setPresentTabs([]);
            }
        } catch (error) {
            console.error("Error fetching tabs data", error);
        }
    }, []);


    useEffect(() => {
        if (dashboardFor && groupId) {
            setLoading(true);
            getDashboardData(groupId, dashboardFor);
            getAllWidgetData(dashboardFor);
        }
    }, [searchParams]);


    useEffect(() => {
        if (mainDashData) {
            const ids = mainDashData.jsonData.dashboardIds.split(',').map(Number) || [];
            const themes = mainDashData?.jsonData?.dashboardTheme || 'Default'
            setTheme(themes);
            getAllAvailableTabs(ids, dashboardFor).finally(() => setLoading(false));
        } else {
            setLoading(false)
        }
    }, [mainDashData]);

    const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';
    const parameters = mainDashData?.jsonData?.allSelectedParaList || '';


    const handleSetParamsValues = useCallback((values) => {
        setParamsValues(values);
    }, []);


    return (
        <>
            {loading ? null : (
                <div className={`${theme === 'Dark' ? 'dark-theme' : ''}`} style={{
                    display: isTopBarLayout ? "block" : 'flex',
                    backgroundColor: "#f4f4f4",
                    minHeight: "100vh"
                }}>
                    <Suspense
                        fallback={
                            <div className="pt-3 text-center">
                                Loading...
                            </div>
                        }
                    >
                        {isTopBarLayout ? (
                            <TopBar
                                data={presentTabs}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                dashboardData={mainDashData}
                                setPrevKpiTab={setPrevKpiTab}
                            />
                        ) : (
                            <DashSidebar
                                data={presentTabs}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                dashboardData={mainDashData}
                                setPrevKpiTab={setPrevKpiTab}
                            />
                        )}
                    </Suspense>

                    <main style={{ padding: "10px 20px", flex: 1 }}>
                        {parameters &&
                            <div className='parameter-box'>
                                <Suspense
                                    fallback={
                                        <div className="pt-3 text-center">
                                            Loading...
                                        </div>
                                    }
                                >
                                    <Parameters params={parameters} dashFor={mainDashData?.dashboardFor} setParamsValues={handleSetParamsValues} />
                                </Suspense>
                            </div>
                        }

                        {activeTab &&
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <TabDash />
                            </Suspense>
                            // : <>
                            //     <h2 className="text-danger">Internal Error!!!! </h2>
                            // </>
                        }
                    </main>
                </div>
            )}
        </>
    );
};

export default DashboardMst;
