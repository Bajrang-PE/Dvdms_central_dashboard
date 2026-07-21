import React, { useState } from "react";
import ReactECharts from "echarts-for-react";
import ApacheGaugeChart from "./ApacheGaugeChart";
import ApacheThreeDChart from "./ApacheThreeDChart";

const ApacheGenChart = (props) => {

    const { widgetData, data, chartType, yAxisLabel, xAxisLabel, colorList } = props;

    const graphStyleObject = widgetData?.graphStyleObject || {};


    // Resolve dynamic series color palette array cleanly
    const dynamicColors = graphStyleObject?.seriesColors || colorList || [];

    const formatChartData = (data = []) => {

        if (!Array.isArray(data)) {
            return {
                categories: [],
                values: []
            };
        }

        const first = data?.[0];

        if (!first) {
            return {
                categories: [],
                values: []
            };
        }

        const keys = Object.keys(first);
        const valueKey = keys.find(key =>
            data.some(row => !isNaN(Number(row?.[key])))
        );

        const categoryKey = keys.find(
            key => key !== valueKey
        );

        return {
            categories: data.map(
                row => row?.[categoryKey] ?? "-"
            ),
            values: data.map(
                row => Number(row?.[valueKey]) || 0
            ),
            categoryKey,
            valueKey
        };
    };


    const buildChartOption = ({
        type,
        xAxisLabel,
        yAxisLabel,
        categories = [],
        values = [],
        categoryKey = "",
        valueKey = ""
    }) => {

        const commonGrid = {
            left: "8%",
            right: "5%",
            top: "10%",
            bottom: "18%",
            containLabel: true
        };

        const commonTooltip = {
            trigger: "axis",
            backgroundColor: graphStyleObject?.tooltipBackgroundColor || "rgba(50,50,50,0.7)",
            textStyle: {
                color: graphStyleObject?.tooltipTextColor || "#fff"
            }
        };

        // Determine dynamic layout data label rotation angles safely
        const labelRotationValue = graphStyleObject?.dataLabelRotation !== undefined 
            ? parseInt(graphStyleObject.dataLabelRotation, 10) 
            : 0;

        switch (type) {
            case "LINE":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    grid: commonGrid,
                    tooltip: commonTooltip,
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.xAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            interval: 0,
                            // rotate: 90,
                            textStyle: {
                                color: graphStyleObject?.xAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) - 2 : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },

                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.yAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            textStyle: {
                                color: graphStyleObject?.yAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },

                    series: [
                        {
                            type: "line",
                            smooth: true,
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: dynamicColors[index % dynamicColors.length]
                                }
                            })),
                            label: {
                                show: graphStyleObject?.showDataLabels !== undefined ? graphStyleObject.showDataLabels : true,
                                position: "top",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "auto",
                                rotate: -labelRotationValue // <-- ROTATION APPLIED HERE
                            },
                            lineStyle: {
                                width: 3,
                                color: dynamicColors[0]
                            }
                        }
                    ]
                };

            case "BAR":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    grid: commonGrid,
                    tooltip: commonTooltip,
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    xAxis: {
                        type: "value",
                        name: xAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.xAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            textStyle: {
                                color: graphStyleObject?.xAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    yAxis: {
                        type: "category",
                        data: categories,
                        name: yAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 70,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.yAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            rotate: graphStyleObject?.labelRotation !== undefined ? parseInt(graphStyleObject.labelRotation, 10) : (categories.length > 10 ? 30 : 0),
                            textStyle: {
                                color: graphStyleObject?.yAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) - 2 : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    series: [
                        {
                            type: "bar",
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: dynamicColors[index % dynamicColors.length]
                                }
                            })),
                            label: {
                                show: graphStyleObject?.showDataLabels !== undefined ? graphStyleObject.showDataLabels : true,
                                position: "right",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "auto",
                                rotate: 0 // <-- ROTATION APPLIED HERE
                            },
                            barMaxWidth: 50
                        }
                    ]
                };

            case "COLUMN":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    grid: commonGrid,
                    tooltip: commonTooltip,
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.xAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: graphStyleObject?.labelRotation !== undefined ? parseInt(graphStyleObject.labelRotation, 10) : (categories.length > 10 ? 30 : 0),
                            textStyle: {
                                color: graphStyleObject?.xAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) - 2 : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.yAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            textStyle: {
                                color: graphStyleObject?.yAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    series: [
                        {
                            type: "bar",
                            data: values?.map((value, index) => ({
                                value,
                                itemStyle: {
                                    color: dynamicColors[index % dynamicColors.length]
                                }
                            })),
                            label: {
                                show: graphStyleObject?.showDataLabels !== undefined ? graphStyleObject.showDataLabels : true,
                                position: "top",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "auto",
                                rotate: -labelRotationValue // <-- ROTATION APPLIED HERE
                            },
                            barMaxWidth: 60
                        }
                    ]
                };

            case "AREA":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    grid: commonGrid,
                    tooltip: commonTooltip,
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    xAxis: {
                        type: "category",
                        data: categories,
                        name: xAxisLabel || categoryKey,
                        nameLocation: "middle",
                        nameGap: 35,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.xAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            interval: 0,
                            rotate: graphStyleObject?.labelRotation !== undefined ? parseInt(graphStyleObject.labelRotation, 10) : (categories.length > 10 ? 30 : 0),
                            textStyle: {
                                color: graphStyleObject?.xAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.xAxisFontSize ? parseInt(graphStyleObject.xAxisFontSize, 10) - 2 : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    yAxis: {
                        type: "value",
                        name: yAxisLabel || valueKey,
                        nameLocation: "middle",
                        nameGap: 50,
                        nameTextStyle: {
                            fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 14,
                            fontWeight: "bold",
                            color: graphStyleObject?.yAxisTitleColor || "#333"
                        },
                        axisLabel: {
                            textStyle: {
                                color: graphStyleObject?.yAxisLabelColor || "#333",
                                fontSize: graphStyleObject?.yAxisFontSize ? parseInt(graphStyleObject.yAxisFontSize, 10) : 12
                            }
                        },
                        splitLine: {
                            show: true,
                            lineStyle: { color: graphStyleObject?.gridLineColor || "#e6e6e6" }
                        }
                    },
                    series: [
                        {
                            type: "line",
                            smooth: true,
                            areaStyle: {},
                            data: values,
                            label: {
                                show: graphStyleObject?.showDataLabels !== undefined ? graphStyleObject.showDataLabels : true,
                                position: "top",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "auto",
                                rotate: -labelRotationValue // <-- ROTATION APPLIED HERE
                            },
                            lineStyle: {
                                width: 3,
                                color: dynamicColors[0]
                            }
                        }
                    ]
                };

            case "PIE":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    title: {
                        show: graphStyleObject?.titleColor ? true : false,
                        textStyle: { color: graphStyleObject?.titleColor }
                    },
                    tooltip: {
                        trigger: "item",
                        backgroundColor: graphStyleObject?.tooltipBackgroundColor || "rgba(50,50,50,0.7)",
                        textStyle: { color: graphStyleObject?.tooltipTextColor || "#fff" }
                    },
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        bottom: 0,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    series: [
                        {
                            type: "pie",
                            radius: "65%",
                            data: categories.map((name, i) => ({
                                name,
                                value: values[i]
                            })),
                            label: {
                                show: true,
                                formatter: "{b}\n{c}",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "#333"
                            },
                            emphasis: {
                                scale: true,
                                scaleSize: 10
                            }
                        }
                    ]
                };

            case "DONUT":
                return {
                    backgroundColor: graphStyleObject?.backgroundColor || "transparent",
                    color: dynamicColors,
                    tooltip: {
                        trigger: "item",
                        backgroundColor: graphStyleObject?.tooltipBackgroundColor || "rgba(50,50,50,0.7)",
                        textStyle: { color: graphStyleObject?.tooltipTextColor || "#fff" }
                    },
                    legend: {
                        show: graphStyleObject?.legendVisible !== undefined ? graphStyleObject.legendVisible : true,
                        bottom: 0,
                        textStyle: { color: graphStyleObject?.legendColor || "#333" }
                    },
                    series: [
                        {
                            type: "pie",
                            radius: ["45%", "70%"],
                            data: categories.map((name, i) => ({
                                name,
                                value: values[i]
                            })),
                            label: {
                                show: true,
                                formatter: "{b}\n{c}",
                                fontWeight: "bold",
                                color: graphStyleObject?.dataLabelColor || "#333"
                            },
                            emphasis: {
                                scale: true,
                                scaleSize: 10
                            }
                        }
                    ]
                };

            default:
                return {
                    title: {
                        text: "No Chart Data",
                        left: "center",
                        textStyle: { color: graphStyleObject?.titleColor || "#333" }
                    }
                };
        }
    };

    // Decide which chart to render
    if (chartType === "3D_BAR") {
        return <ApacheThreeDChart type="bar3D" widgetData={widgetData} gdata={data?.originalData || []} />;
    }

    if (chartType === "GAUGE") {
        return <ApacheGaugeChart widgetData={widgetData} gdata={data?.originalData || []} />;
    }

    const formatted = formatChartData(data?.originalData);

    // fallback (normal charts)
    const option = buildChartOption({
        type: chartType,
        xAxisLabel: xAxisLabel,
        yAxisLabel: yAxisLabel,
        ...formatted
    });

    return (
        <ReactECharts
            option={option}
            style={{ height: parseInt(widgetData?.graphHeight, 10) || 400 }}
            notMerge={true}
            lazyUpdate={true}
        />
    );
};

export default ApacheGenChart;