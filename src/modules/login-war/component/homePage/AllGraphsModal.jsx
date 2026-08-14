import React from "react";
import { Modal } from "react-bootstrap";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const AllGraphsModal = ({ show, onClose, graphs }) => {

    return (
        <Modal
            show={show}
            onHide={onClose}
            size="xl"
            centered
            style={{ paddingTop: "4rem" }}
        >
            {/* HEADER WITH GRADIENT */}
            <Modal.Header
                closeButton
                closeVariant="white"
                style={{
                    background: "linear-gradient(135deg, #00183f 0%, #0052cc 55%, #000a1a 100%)",
                    borderBottom: "none",
                    color: "#fff",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.25)"
                }}
            >
                <Modal.Title
                    style={{
                        color: "#fff",
                        fontWeight: "600"
                    }}
                >
                    All Facilities KPI
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>

                <div className="row">

                    {graphs?.map((graph, index) => {

                        const categories = graph.graphData.map(x => x.name);
                        const seriesData = graph.graphData.map(x => x.y);

                        const options = {
                            chart: {
                                type: "column",
                                height: 400
                            },
                            title: {
                                text: graph.widgetData?.rptDisplayName
                            },
                            xAxis: {
                                categories,
                                title: {
                                    text: graph?.widgetData?.xAxisLabel
                                },
                                labels: {
                                    step: 1,
                                    autoRotation: [-45],
                                    reserveSpace: true,
                                },
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: graph?.widgetData?.yAxisLabel
                                }
                            },
                            series: [
                                {
                                    name: graph.widgetData?.yAxisLabel,
                                    data: seriesData
                                }
                            ],
                            credits: {
                                enabled: false
                            },
                            legend: {
                                enabled: false,
                                align: 'center',
                                verticalAlign: 'bottom'
                            },
                        };

                        return (
                            <div className="col-md-6 mb-4" key={index}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                                <hr className='my-2' />
                            </div>
                        );
                    })}

                </div>

            </Modal.Body>
        </Modal>
    );
};

export default AllGraphsModal;