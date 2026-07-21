import React, { lazy, Suspense, use, useEffect, useState } from 'react'
import Loader from '../component/Loader';
import DashboardMst from '../../his-utils/pages/dashboard/DashboardMst';
// import SidebarComponent from '../component/dashboard/Sidebar'
// import DashHeader from '../component/dashboard/DashHeader'
const DashUrl = import.meta.env.VITE_MAIN_PAGE_DASH_URL;
const ModernDashHeader = lazy(() => import('../component/dashboard/ModernDashHeader'));

const DvdmsDashboard = () => {

    return (
        <>
            <div >
                <ModernDashHeader />
                  <DashboardMst
                        groupId={11600113}
                        dashboardFor={"CENTRAL DASHBOARD"}
                        isGlobal={0}
                    />
                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#f4f4f4",
                        background: "aliceblue",
                        overflow: "hidden"
                    }}
                >
                  
                    {/* <iframe
                        src={`${window.location.origin + DashUrl}`}
                        title="Demo"
                        width="100%"
                        height="100%"
                        style={{
                            border: "none",
                            display: "block"
                        }}
                    /> */}
                </div>
            </div>
        </>


    )
}

export default DvdmsDashboard

{/* <div
                    style={{
                        width: "60vw",
                        height: "65vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <img
                        src="./deskDefault.png"
                        alt=""
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                </div> */}