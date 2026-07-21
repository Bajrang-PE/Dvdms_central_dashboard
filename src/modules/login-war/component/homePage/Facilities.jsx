import React, { useEffect, useState } from 'react';
import useScrollVisibility from '../../hooks/useScrollAnimation';
import { fetchQueryData, ToastAlert } from '../../utils/CommonFunction';
import GraphModal from './GraphModal';
import Loader from '../Loader';
import "./Facilities.css";
import AllGraphsModal from './AllGraphsModal';
import { fetchData } from '../../../../utils/ApiHooks';

const Facilities = () => {

    const isVisible = useScrollVisibility('facilities');

    const [graphData, setGraphData] = useState([]);
    const [showGraph, setShowGraph] = useState(false);
    const [singleWidget, setSingleWidget] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [showAllGraphs, setShowAllGraphs] = useState(false);
    const [allGraphsData, setAllGraphsData] = useState([]);

    const [kpiWidgets, setKpiWidgets] = useState([]);
    const [graphWidgets, setGraphWidgets] = useState({});

    const gradientClasses = [
        'kpi-gradient-orange',
        'kpi-gradient-purple',
        'kpi-gradient-lavender',
        'kpi-gradient-blue'
    ];

    const facilities = [
        { kpiId: 217, graphId: 233 },
        { kpiId: 218, graphId: null },
        { kpiId: 223, graphId: 235 },
        { kpiId: 220, graphId: null },
        { kpiId: 219, graphId: 236 },
        { kpiId: 222, graphId: 252 },
        { kpiId: 249, graphId: 253 },
        { kpiId: 221, graphId: 238 },
        { kpiId: 224, graphId: 251 }
    ];

    useEffect(() => {
        loadFacilities();
    }, []);

    const loadFacilities = async () => {

        setIsLoading(true);

        // try {

        //     const response = await Promise.all(

        //         facilities.map(async (item) => {
        //             const kpiRes = await fetchData(`/hisutils/DataService/${item.kpiId}/execute?isGlobal=1`);
        //             let graphRes = null;
        //             if (item.graphId) {
        //                 graphRes = await fetchData(`/hisutils/DataService/${item.graphId}/execute?isGlobal=1`);
        //             }

        //             return {
        //                 ...item,
        //                 kpiResponse: kpiRes,
        //                 graphResponse: graphRes
        //             };
        //         })

        //     );

        //     setKpiWidgets(response);
        //     const graphMap = {};
        //     response.forEach(item => {
        //         if (item.graphId) {
        //             graphMap[item.graphId] = item.graphResponse;
        //         }
        //     });
        //     setGraphWidgets(graphMap);
        // } catch (e) {
        //     console.error(e);
        // }
        setIsLoading(false);

    };

    const fetchGraphDataQry = async (graphWidget) => {

        if (!graphWidget) {
            ToastAlert("Graph not available", "warning");
            return;
        }
        if (!graphWidget?.queryVO) return;
        setIsLoading(true);
        try {

            const data = await fetchQueryData(graphWidget.queryVO);

            if (data?.status === 1) {

                const keys = Object.keys(data.data[0]);

                const graph = data.data.map(item => ({
                    name: item[keys[0]],
                    y: Number(item[keys[1]]) || 0
                }));

                setGraphData(graph);
                setSingleWidget(graphWidget);
                setShowGraph(true);
            }

        } finally {
            setIsLoading(false);
        }

    };

    const fetchAllGraphs = () => {
        setAllGraphsData();
        setShowAllGraphs(true);
    };

    const onClose = () => {
        setGraphData([]);
        setShowGraph(false);

    };

    return (

        <div className="panel-content-wrapper" id="facilities">

            <div className={`panel-header-section ${isVisible ? 'slide-in' : 'slide-out'}`}>
                <h2 className="panel-mainn-title">Online Facilities</h2>
                <div className="panel-title-line"></div>
            </div>

            <div className="row mt-4 px-2 justify-content-start">
                {kpiWidgets.length > 0 ?
                    kpiWidgets.map((item, index) => (
                        <div className="col-6 mb-3" key={item.kpiId}>
                            <div
                                className={`mini-square-kpi-card ${gradientClasses[index % gradientClasses.length]}`}
                                onClick={() => fetchGraphDataQry(item.graphResponse)}
                            >
                                <div className="mini-card-icon">
                                    <i className="fas fa-hospital-alt"></i>
                                </div>
                                <h3 className="mini-card-count">
                                    {item?.kpiResponse?.data?.COUNT ?? 0}
                                </h3>
                                <p className="mini-card-title">
                                    {item?.kpiResponse?.data?.NAME}
                                </p>
                            </div>
                        </div>
                    ))
                    :
                    <div className="col-12 text-center py-3">
                        <h6 className="text-white-50">No Facilities Available</h6>
                    </div>
                }
            </div>
            <div className="panel-action-footer mt-auto">
                <span className="info-tag-text">
                    * Values specific to DVDMS Dashboard
                </span>
                <button
                    className="btn btn-light btn-sm view-all-btn-custom"
                    onClick={fetchAllGraphs}
                >
                    View All
                </button>
            </div>

            {showGraph &&
                <GraphModal
                    data={graphData}
                    onClose={onClose}
                    widgetData={singleWidget}
                />
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

    );

};

export default Facilities;
