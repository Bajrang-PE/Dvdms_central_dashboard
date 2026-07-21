import React, { useContext, useEffect, useState, useCallback, Suspense, lazy } from "react";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { fetchData, fetchPostData } from "../../../../utils/HisApiHooks";
import Parameters from "../../components/sidebar/Parameters";
import './../../HisUtils.css'

const DashSidebar = lazy(() => import("../../components/sidebar/Sidebar"));
const TopBar = lazy(() => import("../../components/sidebar/TopBar"));
const TabDash = lazy(() => import("../../components/sidebar/TabDash"));

const DashboardMst = ({ groupId, dashboardFor, isGlobal }) => {
    const { activeTab, setActiveTab, theme, setTheme, mainDashData, setMainDashData, setLoading, loading, getDashConfigData, setParamsValues, setPrevKpiTab, dt, setPresentTabsDash, setAllDrpDtParams } = useContext(HISContext);

    const [searchParams] = useSearchParams();
    const [presentTabs, setPresentTabs] = useState([]);
    const [allTabIds, setAllTabIds] = useState([]);

    // const groupId = atob(searchParams.get("groupId"));
    // const dashboardFor = atob(searchParams.get("dashboardFor"));
    // const isGlobal = searchParams.get("isGlobal") || 0;


    useEffect(() => {
        const initializeDashboard = async () => {
            setLoading(true);
            try {
                await getDashConfigData();

                await new Promise(resolve => setTimeout(resolve, 500));

                if (dashboardFor && groupId) {
                    await getDashboardData(groupId, dashboardFor);
                }

            } catch (error) {
                console.error("Initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeDashboard();
    }, [dashboardFor, groupId]);

    const getDashboardData = async (groupId, dashFor) => {
        try {

            const data = await fetchData(
                `/hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst?isGlobal=${isGlobal || 0}`
            );
            // fetchData(`/hisutils/singleDashboard/${groupId}/${dashFor}/DashboardGroupingMst?isGlobal=${isGlobal || 0}`).then((data) => {
            if (data?.status === 1) {
                setMainDashData(data?.data);

                if (data?.data) {
                    const ids = data.data.jsonData.dashboardIds.split(',').map(Number) || [];
                    const themes = data.data?.jsonData?.dashboardTheme || 'Default';
                    if (ids?.length > 0) {
                        setAllTabIds(ids);
                    } else {
                        setAllTabIds([]);
                    }
                    setTheme(themes);
                }

            }
            // })

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    };


    const getAllAvailableTabs = (idArr, dashFor) => {
        try {
            const val = {
                "ids": idArr || [],
                "dashboardFor": dashFor,
                "masterName": "DashboardMst"
            };
            fetchPostData(`/hisutils/gettabsMultipleData?isGlobal=${isGlobal || 0}`, val).then((data) => {
                if (data?.status === 1) {
                    setPresentTabs(data?.data);
                    setPresentTabsDash(data?.data);
                    setLoading(false);
                } else {
                    setPresentTabs([]);
                    setPresentTabsDash([]);
                    setLoading(false);
                };
            })
        } catch (error) {
            console.error("Error fetching tabs data", error);
        }
    };

    useEffect(() => {
        if (allTabIds?.length > 0) {
            getAllAvailableTabs(allTabIds, dashboardFor);
        }
    }, [allTabIds]);

    const isTopBarLayout = mainDashData?.jsonData?.tabDisplayStyle === 'TOP';
    const parameters = mainDashData?.jsonData?.allSelectedParaList || '';

    const handleSetParamsValues = useCallback((values) => {
        setParamsValues(values);
    }, []);


    return (
        <>
            {loading ? <h1 className="text-center">Loading...</h1> : (
                <div className={`${theme === 'Dark' ? 'dark-theme' : ''}`} style={{
                    display: isTopBarLayout ? "block" : 'flex',
                    backgroundColor: "#f4f4f4",
                    minHeight: "100vh"
                }}>
                    <Suspense
                        fallback={
                            <div className="pt-3 text-center">
                                {dt('Loading')}...
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
                                dt={dt}
                                setAllDrpDtParams={setAllDrpDtParams}
                            />
                        ) : (
                            <DashSidebar
                                data={presentTabs}
                                setActiveTab={setActiveTab}
                                activeTab={activeTab}
                                dashboardData={mainDashData}
                                setPrevKpiTab={setPrevKpiTab}
                                dt={dt}
                                setAllDrpDtParams={setAllDrpDtParams}
                            />
                        )}
                    </Suspense>

                    <main style={{ flex: 1, width: isTopBarLayout ? "" : "80%" }} >
                        {parameters &&
                            <div className='parameter-box'>
                                <Suspense
                                    fallback={
                                        <div className="pt-3 text-center">
                                            {dt('Loading')}...
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
                                        {dt('Loading')}...
                                    </div>
                                }
                            >
                                <TabDash />
                            </Suspense>
                        }
                    </main>
                </div>
            )}
        </>
    );
};

export default DashboardMst;
