import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import GlobalGraph from '../GlobalGraph'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const GraphModal = ({ data, onClose, widgetData }) => {

    const categories = data.map(item => item.name);
    const seriesData = data.map(item => item.y);
    const colorList = [
        '#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800',
        '#C2185B', '#7C4DFF', '#009688', '#D32F2F', '#1976D2',
        '#FBC02D', '#8BC34A', '#FF5722', '#795548', '#607D8B'
    ];

    const [chartType, setChartType] = useState('column');
    const chartTypes = ['bar', 'line', 'pie', 'area', 'column', 'donut'];


    const options = {

        chart: {
            type: chartType === 'donut' ? "pie" : chartType,
            animation: true,
            height: 500
        },
        title: {
            text: widgetData?.rptName || ''
        },
        colors: colorList,
        xAxis: {
            categories,
            title: {
                text: widgetData?.xAxisLabel
            },
            labels: {
                rotation: categories?.length > 7 ? -45 : 0,
                style: {
                    fontSize: '11px'
                }
            }
        },

        yAxis: {
            min: 0,
            title: {
                text: widgetData?.yAxisLabel
            }
        },

        legend: {
            enabled: false,
            align: 'center',
            verticalAlign: 'bottom'
        },

        tooltip: {
            shared: chartType !== 'pie',
            pointFormat:
                chartType === 'pie'
                    ? '<b>{point.y}</b> ({point.percentage:.1f}%)'
                    : '<b>{point.y}</b>'

        },

        plotOptions: {
            series: {
                animation: true,
                dataLabels: {
                    enabled: true,
                    formatter() {
                        if (chartType === 'pie') {
                            return `${this.point.name}<br/>${this.y}`;
                        }
                        return this.y;
                    },
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        textOutline: 'none'
                    }
                }
            },
            column: {
                colorByPoint: true,
                borderRadius: 5
            },
            bar: {
                colorByPoint: true,
                borderRadius: 5
            },
            line: {
                marker: {
                    enabled: true,
                    radius: 4
                }
            },
            area: {
                fillOpacity: 0.35,
                marker: {
                    enabled: true,
                    radius: 3
                }
            },
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                colorByPoint: true,
                showInLegend: true,
                innerSize: chartType === "donut" ? "65%" : 0,
                dataLabels: {
                    enabled: true,
                    format:
                        '<b>{point.name}</b><br>{point.percentage:.1f}%'
                }
            }
        },

        series: [
            chartType === 'pie'
                ?
                {
                    name: widgetData?.yAxisLabel,
                    data: data.map((item, index) => ({
                        name: item.name,
                        y: item.y,
                        color: colorList[index % colorList.length]
                    }))
                }
                :
                {
                    name: widgetData?.yAxisLabel,
                    data: seriesData
                }
        ],
        credits: {
            enabled: false
        }
    };

    return (
        <div>
            <Modal show={true} onHide={onClose} size='lg' className='' style={{ paddingTop: "4rem" }}>
                <Modal.Header
                    closeButton
                    closeVariant="white"
                    className='datatable-header'
                >
                    <Modal.Title>
                        <b>{widgetData?.rptDisplayName}</b>
                    </Modal.Title>
                </Modal.Header>


                <Modal.Body className='px-3 py-0'>
                    <div className='btn-group btn-group-sm m-1'>
                        {chartTypes.map(type => (

                            <button
                                key={type}
                                className={`btn ${chartType === type ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setChartType(type)}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>

                        ))}
                    </div>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default GraphModal
