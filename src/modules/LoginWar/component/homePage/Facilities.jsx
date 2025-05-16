import React, { useContext, useEffect, useState } from 'react'
import { DataSeries } from '../../localData/HomeData';
import useScrollVisibility from '../../hooks/useScrollAnimation';
import { LoginContext } from '../../context/LoginContext';
import { fetchQueryData } from '../../utils/CommonFunction';
import GraphModal from './GraphModal';
import Loader from '../Loader';

const Facilities = () => {
    const { widgetData, getWidgetData } = useContext(LoginContext)
    const isVisible = useScrollVisibility('facilities');
    const [graphData, setGraphData] = useState();
    const [graphWidgets, setGraphWidgets] = useState();
    const [showGraph, setShowGraph] = useState(false);
    const [singleWidget, setSingleWidget] = useState();
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (widgetData?.length === 0) { getWidgetData() }
    }, [])

    useEffect(() => {
        if (widgetData?.length > 0) {
            const kpiList = ['806', '807', '808', '805']
            const graphList = ['813', '814', '815', '804']
            const kpidt = widgetData?.filter((wd) => graphList?.includes(wd?.rptId));
            setGraphWidgets(kpidt)
        }
    }, [widgetData])

    const fetchGraphDataQry = async (fc) => {
        if (!fc?.queryVO) return;
        setIsLoading(true)
        try {
            const data = await fetchQueryData(fc?.queryVO);
            const dtlen = Object?.keys(data[0])
            if (dtlen?.length === 3) {
                setGraphData(
                    data.map((item) => ({
                        name: item.column_2,
                        y: item.column_1,
                    })));
            } else {
                setGraphData(
                    data.map((item) => ({
                        name: item.column_1,
                        y: item.column_2,
                    })));
            }

            setSingleWidget(fc)
            setShowGraph(true)
            setIsLoading(false)
        } catch (error) {
            console.error("Error loading query data:", error);
            setIsLoading(false)
        }
    }

    const onClose = () => {
        setGraphData([]);
        setShowGraph(false);

    }

    const facilityData = [
        { title: "Warehouses", counts: 566, color: "#B71C1C" },
        { title: "District Hospitals", counts: 1220, color: "#5D7738" },
        { title: "Medical Colleges", counts: 434, color: "#3D2352" },
        { title: "Sub Centres", counts: 101419, color: "#FFCC80" },
        { title: "Urban Community Health Centres", counts: 230, color: "#2F4A7D" },
        { title: "Primary Health Centres", counts: 22980, color: "#D2B48C" },
        { title: "Community Health Centres", counts: 5674, color: "#5F9EA0" },
        { title: "Urban Primary Health Centres", counts: 5405, color: "#FB8C00" },
        { title: "Sub District Hospitals", counts: 0, color: "#2E7D32" },
        { title: "Health And Wellness Centres", counts: 14674, color: "#6495ED" },
        { title: "Ayushman Arogya Mandir Primary Health Centre", counts: 3748, color: "#EF9A9A" },
        { title: "Ayushman Arogya Mandir Sub Health Centre", counts: 29331, color: "#00897B" }
    ];

    const getCounts = (data) => {
        const total = data?.reduce((a, b) => a + b)
        return total || ''
    }

    console.log(graphWidgets,'bgbgbg')

    return (
        <div className="facility row pl-5 pr-5" style={{ padding: "10px" }} id='facilities'>
            <div className={`col-12 p-4`} >
                <div className={`${isVisible ? 'slide-in' : 'slide-out'}`}>
                    <h2 className='home-headings'>Facilities Onboarded with DVDMS Central Dashboard</h2>
                    <h5 className="border-btm"></h5>
                </div>
                <br />
            </div>

            {graphWidgets?.length > 0 && graphWidgets?.map((fc, index) => (
                <div className={`col-md-3 col-sm-4 d-flex justify-content-center ${isVisible ? 'fade-in' : 'fade-out'}`} key={index}>
                    <div className="card card-data" style={{ backgroundColor: fc?.widgetBackgroundColour || facilityData[index]?.color }}>
                        <a className="card-header data-text text-center text-decoration-none" id={`graph${index + 1}`}>
                            {/* {fc.yAxisTitle} */}
                            {fc?.rptDisplayName}
                        </a>
                        <div className="card-body p-0" style={{ alignContent: "end" }}>
                            <h4 className="data-title text-center pointer" id={`graphData${index + 1}`} onClick={() => { fetchGraphDataQry(fc) }}>
                                {/* {getCounts(fc?.Data[0]?.data)} */}
                                {fc?.linkWidget}
                            </h4>
                        </div>
                    </div>
                </div>
            ))}


            <div id="note" className="col-md-12 pl-2 mt-4" style={{color:"#000e4e"}}>
                <h6>* The counts / values may differ with other portals as
                    they are specific to facilities onboarded with DVDMS Central
                    Dashboard</h6>
            </div>
            {showGraph &&
                <GraphModal data={graphData} onClose={onClose} widgetData={singleWidget} />
            }

            {isLoading &&
                <Loader />
            }
        </div>
    )
}

export default Facilities
