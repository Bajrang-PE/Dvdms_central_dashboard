import React, { useContext, useEffect, useState } from 'react'
import useScrollVisibility from '../../hooks/useScrollAnimation';
import { LoginContext } from '../../context/LoginContext';
import { fetchQueryData, ToastAlert } from '../../utils/CommonFunction';
import GraphModal from './GraphModal';
import Loader from '../Loader';
import "./Facilities.css";
import AllGraphsModal from './AllGraphsModal';

const Facilities = () => {
    const { widgetData, getWidgetData } = useContext(LoginContext)
    const isVisible = useScrollVisibility('facilities');
    const [graphData, setGraphData] = useState();
    const [graphWidgets, setGraphWidgets] = useState();
    const [showGraph, setShowGraph] = useState(false);
    const [singleWidget, setSingleWidget] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [showAllGraphs, setShowAllGraphs] = useState(false);
    const [allGraphsData, setAllGraphsData] = useState([]);

    // Aapke diye huye shining color gradients ki array
    const gradientClasses = [
        'kpi-gradient-orange',
        'kpi-gradient-purple',
        'kpi-gradient-lavender',
        'kpi-gradient-blue'
    ];

    useEffect(() => {
        if (widgetData?.length === 0) { getWidgetData(['813', '814', '815', '804']) }
    }, [])

    useEffect(() => {
        if (widgetData?.length > 0) {
            setGraphWidgets(widgetData)
        }
    }, [widgetData])

    const fetchGraphDataQry = async (fc) => {
        if (!fc?.queryVO) return;
        setIsLoading(true);
        try {
            const data = await fetchQueryData(fc?.queryVO);
            if (data?.status === 1) {
                const rawItem = data?.data?.[0];
                if (!rawItem) {
                    setGraphData([]);
                    setIsLoading(false);
                    return;
                }
                const keys = Object.keys(rawItem);
                const graphData = data?.data.map(item => ({
                    name: item[keys[0]],
                    y: parseFloat(item[keys[1]]) || 0
                }));
                setGraphData(graphData);
                setSingleWidget(fc);
                setShowGraph(true);
                setIsLoading(false);
            } else {
                ToastAlert(data?.message, 'error')
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error loading query data:", error);
            setIsLoading(false);
        }
    };

    const fetchAllGraphs = async () => {

        setIsLoading(true);

        try {

            const graphList = await Promise.all(

                graphWidgets.map(async (fc) => {

                    const data = await fetchQueryData(fc?.jsonData?.queryVO);

                    if (data?.status !== 1 || !data?.data?.length) {
                        return null;
                    }

                    const keys = Object.keys(data.data[0]);

                    return {
                        widgetData: fc.jsonData,
                        data: data.data.map(item => ({
                            name: item[keys[0]],
                            y: parseFloat(item[keys[1]]) || 0
                        }))
                    };
                })
            );

            setAllGraphsData(graphList.filter(Boolean));
            setShowAllGraphs(true);

        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    };

    const onClose = () => {
        setGraphData([]);
        setShowGraph(false);
    }

    return (
        <div className="panel-content-wrapper" id='facilities'>
            <div className={`panel-header-section ${isVisible ? 'slide-in' : 'slide-out'}`}>
                <h2 className="panel-mainn-title">Online Facilities</h2>
                <div className="panel-title-line"></div>
            </div>

            <div className="row mt-4 px-2 justify-content-start">
                {graphWidgets?.length > 0 ? graphWidgets?.map((fc, index) => {
                    // Index ke base par sequence me class assign hogi (0, 1, 2, 3...)
                    const assignedGradient = gradientClasses[index % gradientClasses.length];

                    return (
                        <div className="col-6 mb-3" key={index}>
                            <div
                                className={`mini-square-kpi-card ${assignedGradient}`}
                                onClick={() => { fetchGraphDataQry(fc?.jsonData) }}
                            >
                                <div className="mini-card-icon">
                                    <i className="fas fa-hospital-alt"></i>
                                </div>
                                <h3 className="mini-card-count">
                                    {fc?.jsonData?.linkWidget || "0"}+
                                </h3>
                                <p className="mini-card-title">
                                    {fc?.jsonData?.rptDisplayName}
                                </p>
                            </div>
                        </div>
                    );
                }) :
                    <div className="col-12 text-center py-3">
                        <h6 className='text-white-50'>No Facilities Available</h6>
                    </div>
                }
            </div>

            <div className="panel-action-footer mt-auto">
                <span className="info-tag-text">* Values specific to DVDMS Dashboard</span>
                {/* <button className="btn btn-light btn-sm view-all-btn-custom">View All</button> */}
                <button
                    className="btn btn-light btn-sm view-all-btn-custom"
                    onClick={fetchAllGraphs}
                >
                    View All
                </button>
            </div>

            {showGraph &&
                <GraphModal data={graphData} onClose={onClose} widgetData={singleWidget} />
            }
            {showAllGraphs &&
                <AllGraphsModal
                    show={showAllGraphs}
                    onClose={() => setShowAllGraphs(false)}
                    graphs={allGraphsData}
                />
            }

            {isLoading && <Loader />}
        </div>
    )
}

export default Facilities
