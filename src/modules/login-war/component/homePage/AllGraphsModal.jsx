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
            style={{paddingTop:"4rem"}}
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

                    {graphs.map((graph, index) => {

                        const categories = graph.data.map(x => x.name);
                        const seriesData = graph.data.map(x => x.y);

                        const options = {
                            chart: {
                                type: "column",
                                height: 300
                            },
                            title: {
                                text: graph.widgetData?.rptDisplayName
                            },
                            xAxis: {
                                categories
                            },
                            yAxis: {
                                min: 0
                            },
                            series: [
                                {
                                    name: graph.widgetData?.yAxisLabel,
                                    data: seriesData
                                }
                            ],
                            credits: {
                                enabled: false
                            }
                        };

                        return (
                            <div className="col-md-6 mb-4" key={index}>
                                <HighchartsReact
                                    highcharts={Highcharts}
                                    options={options}
                                />
                            </div>
                        );
                    })}

                </div>

            </Modal.Body>
        </Modal>
    );
};

export default AllGraphsModal;