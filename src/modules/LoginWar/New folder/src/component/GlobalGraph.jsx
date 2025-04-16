import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

const GlobalGraph = ({ title, yAxisTitle, categories, seriesData,xAxisTitle }) => {

    const colorList = [
        '#2E93fA',  // Blue
        '#66DA26',  // Green
        '#546E7A',  // Gray-Blue
        '#E91E63',  // Pink
        '#FF9800',  // Orange
        '#C2185B',  // Dark Pink
        '#7C4DFF',  // Purple
        '#009688',  // Teal
        '#D32F2F',  // Red
        '#1976D2',  // Dark Blue
        '#FBC02D',  // Yellow
        '#8BC34A',  // Light Green
        '#FF5722',  // Deep Orange
        '#795548',  // Brown
        '#607D8B',  // Blue Gray
    ];
    
    const options = {
        chart: {
            type: 'column',
        },
        title: {
            text: title,
        },
        xAxis: {
            categories: categories,
            colors: ['red','blue','green'],
            title: {
                text: xAxisTitle,
            },
            labels: {
                rotation: -45,
                step: 1
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: yAxisTitle,
            },
        },
        legend: {
            enabled: true,
            align: 'center',
            verticalAlign: 'bottom',
        },
        series: seriesData,
        colors: colorList,
        credits: {
            enabled: true,
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default GlobalGraph
    ;
