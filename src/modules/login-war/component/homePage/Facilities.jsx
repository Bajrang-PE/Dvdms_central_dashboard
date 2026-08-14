import React, { useContext, useEffect, useState } from 'react';
import useScrollVisibility from '../../hooks/useScrollAnimation';
import { fetchQueryData, ToastAlert } from '../../utils/CommonFunction';
import GraphModal from './GraphModal';
import Loader from '../Loader';
import "./Facilities.css";
import AllGraphsModal from './AllGraphsModal';
import { fetchPostData } from '../../../../utils/HisApiHooks';
import { LoginContext } from '../../context/LoginContext';

const Facilities = () => {

    const { setHomeItemCounts } = useContext(LoginContext);

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
        try {

            const response = await Promise.all(

                facilities.map(async (item) => {
                    const kpiRes = await fetchPostData(`/hisutils/DataService/${item.kpiId}/execute?isGlobal=1`);

                    let kpidt = {};
                    if (kpiRes?.status === 1) {
                        kpidt = {
                            name: kpiRes?.data?.dataHeading[0],
                            count: kpiRes?.data?.dataValue[0]
                        }
                    }

                    return {
                        ...item,
                        kpiResponse: kpidt,
                        graphResponse: null
                    };
                })
            );

            setKpiWidgets(response);
            setHomeItemCounts(response)
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };


    const fetchGraphDataQry = async (graphId, rptname) => {

        if (!graphId) {
            ToastAlert("Graph not available", "warning");
            return;
        }
        setIsLoading(true);
        try {

            const graphRes = await fetchPostData(`/hisutils/DataService/${graphId}/execute?isGlobal=1`);
            if (graphRes?.status === 1) {
                const keys = graphRes?.data?.dataHeading;
                const graph = graphRes?.data.dataValue
                    ?.map(item => ({
                        name: item[0],
                        y: Number(item[1]) || 0
                    }));
                setGraphData(graph);
                setSingleWidget({
                    rptDisplayName: `${rptname} availability Graph view`,
                    rptName: `${rptname} availability`,
                    xAxisLabel: `${keys[0]}`,
                    yAxisLabel: `${keys[1]} counts`
                });
                setShowGraph(true);
            }

        } finally {
            setIsLoading(false);
        }

    };

    const fetchAllGraphs = async () => {
        setIsLoading(true);

        try {
            const response = await Promise.all(
                kpiWidgets?.filter((facility) => facility?.graphId && facility?.kpiResponse?.name)?.map(async (facility) => {
                    try {
                        const graphRes = await fetchPostData(
                            `/hisutils/DataService/${facility?.graphId}/execute?isGlobal=1`
                        );
                        let graphData = [];
                        let widgetData = {};

                        if (graphRes?.status === 1) {
                            const keys = graphRes?.data?.dataHeading;
                            graphData = graphRes?.data?.dataValue?.map((row) => ({
                                name: row[0],
                                y: Number(row[1]) || 0,
                            })) || [];
                            widgetData = {
                                rptDisplayName: `${facility?.kpiResponse?.name} availability Graph view`,
                                rptName: `${facility?.kpiResponse?.name} availability`,
                                xAxisLabel: `${keys[0]}`,
                                yAxisLabel: `counts`
                            }
                        }


                        return {
                            ...facility,
                            graphData,
                            widgetData
                        };
                    } catch (err) {
                        console.error(`Error fetching graph ${facility?.graphId}`, err);

                        return {
                            ...facility,
                            graphData: [],
                        };
                    }
                })
            );

            setAllGraphsData(response);
            setShowAllGraphs(true);
        } catch (error) {
            console.error("Error fetching all graphs:", error);
        } finally {
            setIsLoading(false);
        }
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
                    kpiWidgets?.filter(dt => dt?.kpiResponse?.name)?.map((item, index) => (
                        <div className="col-6 mb-3" key={item.kpiId}>
                            <div
                                className={`mini-square-kpi-card ${gradientClasses[index % gradientClasses.length]}`}
                                onClick={() => fetchGraphDataQry(item?.graphId, item?.kpiResponse?.name)}
                            >
                                <div className="mini-card-icon">
                                    <i className="fas fa-hospital-alt"></i>
                                </div>
                                <h3 className="mini-card-count">
                                    {item?.kpiResponse?.count ?? 0}
                                </h3>
                                <p className="mini-card-title">
                                    {item?.kpiResponse?.name || "NA"}
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
