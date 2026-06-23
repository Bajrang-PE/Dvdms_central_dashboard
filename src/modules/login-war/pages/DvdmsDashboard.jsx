import React, { lazy, Suspense, use, useEffect, useState } from 'react'
import Loader from '../component/Loader';
// import SidebarComponent from '../component/dashboard/Sidebar'
// import DashHeader from '../component/dashboard/DashHeader'


const ModernDashHeader = lazy(() => import('../component/dashboard/ModernDashHeader'));

const DvdmsDashboard = () => {

    return (
        <>
            <ModernDashHeader />
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#f4f4f4",
                    minHeight: "88vh",
                    background: "aliceblue"
                }}
            >
                <div
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
                </div>
            </div>
        </>
    )
}

export default DvdmsDashboard
