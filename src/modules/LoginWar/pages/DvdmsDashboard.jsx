import React, { use, useEffect, useState } from 'react'
import SidebarComponent from '../component/dashboard/Sidebar'
import DashHeader from '../component/dashboard/DashHeader'

const DvdmsDashboard = () => {
    const targetTime = new Date();
    targetTime.setHours(18, 10, 0, 0);
    const [remaining, setRemaining] = useState(targetTime - Date.now());

    useEffect(() => {
        const counter = setInterval(() => {
            const timeLeft = targetTime - Date.now();
            setRemaining(timeLeft)

            if (timeLeft <= 0) {
                clearInterval(counter);
                // alert("Now Go...apply for leave! 🚀");
            }

        }, 1000);

        return () => clearInterval(counter);

    }, [targetTime])

    return (
        <div>
            <DashHeader />
            <div style={{
                display: 'flex',
                backgroundColor: "#f4f4f4",
                minHeight: "100vh"
            }}>

                <SidebarComponent />

                <main style={{ padding: "10px 20px", flex: 1 }}>
                    <h1>bajrang</h1>
                    <h2> Remaining Time : {Math.floor(remaining / 1000)}</h2>
                    <progress id="file" value={Math.floor(remaining / 1000)} max={28800}></progress>{((Math.floor(remaining / 1000) / 28800) * 100).toFixed(2)}%

                </main>
            </div>
        </div>
    )
}

export default DvdmsDashboard
