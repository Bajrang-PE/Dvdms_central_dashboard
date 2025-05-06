import React from 'react'
import { Modal } from 'react-bootstrap'
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

    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: widgetData?.rptDisplayName
        },
        xAxis: {
            categories: categories,
            title: {
                text: widgetData?.xAxisLabel
            },
            labels: {
                rotation: -45,
                step: 1
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: widgetData?.yAxisLabel
            }
        },
        legend: {
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'bottom',
            },
        },
        plotOptions: {
            column: {
                colorByPoint: true,
                dataLabels: {
                    enabled: true,
                    rotation: 90, 
                    align: 'center',
                    format: '{y}', 
                    style: {
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#000'
                    }
                }
            }
        },
        series: [
            {
                name: widgetData?.yAxisLabel,
                data: seriesData,
                colors: colorList
            }
        ],
        credits: {
            enabled: false
        }
    };

    return (
        <div>
            <Modal show={true} onHide={onClose} size='lg'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <b><h4 className='datatable-header mx-3 py-1 mt-1 px-1'>{widgetData?.rptDisplayName}</h4></b>
                <Modal.Body className='px-3 py-0'>
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default GraphModal
