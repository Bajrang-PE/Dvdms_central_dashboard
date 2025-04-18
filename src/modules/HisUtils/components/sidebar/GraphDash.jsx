import React, { useState, useEffect, useContext, useCallback, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Exporting from "highcharts/modules/exporting";
import ExportData from "highcharts/modules/export-data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileCsv, faFilePdf, faRefresh } from "@fortawesome/free-solid-svg-icons";
import Parameters from "./Parameters";
import { fetchProcedureData, fetchQueryData } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { highchartGraphOptions } from "../../localData/DropDownData";


const GraphDash = ({ widgetData }) => {
  const { theme } = useContext(HISContext);
  const [paramsValues, setParamsValues] = useState();
  const [filteredGraphOptions, setFilteredGraphOptions] = useState([]);
  const [chartType, setChartType] = useState('BAR_GRAPH');
  const [graphData, setGraphData] = useState([]);

  const is3D = widgetData.is3d === "true";
  const xAxisLabel = widgetData.xAxisLabel || "X Axis";
  const yAxisLabel = widgetData.yAxisLabel || "Y Axis";
  const showLegend = widgetData.showInLegend === "true";
  const dataLabelsEnabled = widgetData.dataLabels === "true";
  const colorList = widgetData.colorForBars ? widgetData.colorForBars.split(",") : ["red", "blue", "green"];
  const mainQuery = widgetData.queryVO?.length > 0 ? widgetData.queryVO[0]?.mainQuery : "";
  const alpha = widgetData.alpha || 15;
  const beta = widgetData.beta || 15;

  const xAxisFontSize = parseInt(widgetData?.XAxisFontSize, 10) || 10;
  const yAxisFontSize = parseInt(widgetData?.YAxisFontSize, 10) || 10;
  const annotationFontSize = parseInt(widgetData?.annotationFontSize, 10) || 12;
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'No';

  const minAxisValue = widgetData?.minValueOfAxis && widgetData?.minValueOfAxis !== '0' ? parseInt(widgetData.minValueOfAxis, 10) : undefined;
  const maxAxisValue = widgetData?.maxValueOfAxis && widgetData?.maxValueOfAxis !== '0' ? parseInt(widgetData.maxValueOfAxis, 10) : undefined;

  const isActionButtonReq = widgetData?.isActionButtonReq || "Yes";
  const labelRotation = parseInt(widgetData.rotation, 10) || 0;
  const isScrollbarRequired = widgetData.isScrollbarRequired === "Yes";
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const isDarkTheme = theme === 'Dark';


  useEffect(() => {
    const timeout = setTimeout(() => {
      Promise.all([
        import("highcharts/modules/offline-exporting"),
        import("highcharts/modules/exporting"),
        import("highcharts/modules/export-data"),
        import('highcharts/modules/no-data-to-display')
      ])
        .then(([OfflineExporting, exportingModule, exportDataModule, HighchartsNoData]) => {
          const modules = [OfflineExporting, exportingModule, exportDataModule, HighchartsNoData];

          const applyModule = (mod) => {
            if (typeof mod === 'function') {
              mod(Highcharts);
            } else if (mod && typeof mod.default === 'function') {
              mod.default(Highcharts);
            }
          };

          try {
            modules.forEach((mod, index) => {
              applyModule(mod);
            });
          } catch (error) {
            console.error('Error during module initialization:', error);
          }
        })
        .catch((error) => {
          console.error('Error loading Highcharts modules:', error);
        });
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);


  const chartTypeMapping = {
    BAR_GRAPH: "column",
    STACKED_GRAPH: "column",
    STACKED_BAR_GRAPH: "column",
    VERTICAL_BAR_GRAPH: "bar",
    VERTICAL_STACKED_BAR_GRAPH: "bar",
    PIE_CHART: "pie",
    DONUT_CHART: "pie",
    LINE_GRAPH: "line",
    AREA_GRAPH: "area",
    AREA_STACKED_GRAPH: "area",
    COLUMN_LINE_PIE_GRAPH: "column",
    DUAL_AXES_LINE_COLUMN: "column",
    BAR_RACE: "bar"
  };

  useEffect(() => {
    if (widgetData.defaultgraphType) {
      const availableGraphs = widgetData.graphChangeOptions || [];
      let opt = [];
      opt = highchartGraphOptions
        .filter(option => availableGraphs.includes(option.value))
      // .concat(highchartGraphOptions.find(option => option.value === widgetData.defaultgraphType) || []);

      if (widgetData.defaultgraphType && !availableGraphs.includes(widgetData.defaultgraphType)) {
        const defaultGraphOption = highchartGraphOptions.find(option => option.value === widgetData.defaultgraphType);
        if (defaultGraphOption) {
          opt.push(defaultGraphOption);
        }
      }

      setFilteredGraphOptions(opt)
      setChartType(widgetData.defaultgraphType)
    }
  }, [widgetData])

  const fetchDataQry = async (query) => {
    if (!query) return;
    try {
      const data = await fetchQueryData(query);
      const seriesData = [];

      if (data[0]?.column_3) {
        // Three-column data
        const categories = [...new Set(data.map(item => item.column_1))];
        const seriesNames = ['column_2', 'column_3'];

        seriesNames.forEach(seriesName => {
          seriesData.push({
            name: seriesName,
            data: categories.map(category => {
              const item = data.find(d => d.column_1 === category);
              return item ? item[seriesName] : null;
            }),
            colorByPoint: true,
          });
        });

        setGraphData({ categories, seriesData });
      } else {
        // Two-column data
        const categories = data.map(item => item.column_1);
        seriesData.push({
          name: 'column_2',
          data: data.map(item => item.column_2),
          colorByPoint: true,
        });

        setGraphData({ categories, seriesData });
      }
    } catch (error) {
      console.error("Error loading query data:", error);
    }
  };

  const fetchProcedure = async (widget) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        const data = await fetchProcedureData(widget?.procedureMode);
        console.log(data, 'bajrang1')
        setGraphData(
          data.map((item) => ({
            name: item.column_1,
            y: item.column_2,
          })));
      } catch (error) {
        console.error("Error loading query data:", error);
      }
    }
  }


  useEffect(() => {
    if (widgetData && widgetData?.modeOfQuery === "Procedure") {
      fetchProcedure(widgetData)
    } else {
      fetchDataQry(widgetData?.queryVO);
    }
  }, []);


  const exportingOptions = {
    enabled: isActionButtonReq !== "No" && isActionButtonReq !== "None",
    allowHTML: true,
    useHTML: true,
    fallbackToExportServer: false,
    libURL: "https://code.highcharts.com/modules/",
    buttons: {
      contextButton: {
        menuItems: (() => {
          switch (isActionButtonReq) {
            case "pdf":
              return ["downloadPDF"];
            case "csv":
              return ["downloadCSV"];
            case "pdfAndcsv":
              return ["downloadPDF", "downloadCSV"];
            case "advanced":
              return ["viewFullscreen", "downloadXLS", "downloadPNG", "downloadJPEG"];
            case "All":
            case "Yes":
              return ["downloadPDF", "downloadCSV", "viewFullscreen", "downloadXLS", "downloadPNG", "downloadJPEG"];
            default:
              return [];
          }
        })()
      }
    }
  };

  const options = {
    chart: {
      type: chartTypeMapping[chartType],
      height: parseInt(widgetData.graphHeight, 10) || 350,
      backgroundColor: isDarkTheme ? "#1f1f1f" : "#ffffff",
      options3d: {
        enabled: is3D,
        alpha: alpha,
        beta: beta,
        depth: 50,
      },
    },
    title: {
      text: widgetData.rptName || "",
      style: { color: isDarkTheme ? "#ffffff" : "#000000" }
    },
    xAxis: {
      categories: graphData.categories,
      type: "category",
      title: {
        text: xAxisLabel,
        style: {
          fontSize: `${xAxisFontSize}px`,
          color: isDarkTheme ? "#ffffff" : "#000000"
        },
      },
      labels: {
        rotation: labelRotation ? parseInt(labelRotation, 10) : -45,
        style: {
          fontSize: "10px",
          color: isDarkTheme ? "#ffffff" : "#000000"
        },
        step: 1,
      },
      scrollbar: {
        enabled: isScrollbarRequired,
      },
      gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
    },
    yAxis: {
      title: {
        text: yAxisLabel,
        style: {
          fontSize: `${yAxisFontSize}px`,
          color: isDarkTheme ? "#ffffff" : "#000000"
        },
      },
      labels: {
        style: {
          color: isDarkTheme ? "#ffffff" : "#000000"
        }
      },
      gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
    },
    legend: {
      enabled: showLegend,
      itemStyle: {
        color: isDarkTheme ? "#ffffff" : "#000000"
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: dataLabelsEnabled,
          style: {
            color: isDarkTheme ? "#ffffff" : "#000000"
          }
        },
        colorByPoint: chartType === "PIE_CHART" || chartType === "BAR_GRAPH",
      },
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        colors: colorList,
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.y}",
          style: { color: isDarkTheme ? "#ffffff" : "#000000" }
        },
        innerSize: chartType === "DONUT_CHART" ? "50%" : "0%",
      },
      bar: {
        colors: colorList || ["red", "blue", "green"],
      },
      column: {
        colors: colorList,
        stacking: chartType === "STACKED_BAR_GRAPH" || chartType === "STACKED_GRAPH" ? "normal" : undefined,
      },
      line: {
        marker: {
          enabled: true,
          fillColor: "red",
          lineColor: "black",
          lineWidth: 2,
          radius: 4,
        },
      },
      area: {
        stacking: chartType === "AREA_STACKED_GRAPH" ? "normal" : undefined,
      }
    },
    tooltip: {
      shared: true,
      valueSuffix: " units",
      backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.85)" : "#ffffff",
      style: {
        color: isDarkTheme ? "#ffffff" : "#000000"
      },
    },
    exporting: exportingOptions,
    series: graphData.seriesData,
    lang: {
      noData: "No data available for this graph",
    },
    noData: {
      position: {
        align: "center",
        verticalAlign: "middle",
        x: 0,
        y: 0,
      },
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: isDarkTheme ? "#ff6666" : "#ff0000",
        textAlign: "center"
      },
    },
    drilldown: {
      series: [],
      activeDataLabelStyle: {
        color: "#0022ff",
        cursor: "pointer",
        fontWeight: "bold",
        textDecoration: "none"
      },
      breadcrumbs: {
        position: {
          align: "right",
        },
        buttonTheme: {
          style: {
            color: "#006400",
          },
        },
      },
    },
  };

  // const options = {
  //   chart: {
  //     type: chartTypeMapping[chartType],
  //     height: parseInt(widgetData.graphHeight, 10) || 350,
  //     backgroundColor: isDarkTheme ? "#1f1f1f" : "#ffffff",
  //     options3d: {
  //       enabled: is3D,
  //       alpha: alpha,
  //       beta: beta,
  //       depth: 50,
  //     },
  //   },
  //   title: {
  //     text: widgetData.rptName || "",
  //     style: { color: isDarkTheme ? "#ffffff" : "#000000" }
  //   },
  //   xAxis: {
  //     type: "category",
  //     title: {
  //       text: xAxisLabel,
  //       style: {
  //         fontSize: `${xAxisFontSize}px`,
  //         color: isDarkTheme ? "#ffffff" : "#000000"
  //       },
  //     },
  //     labels: {
  //       rotation: labelRotation ? parseInt(labelRotation, 10) : -45,
  //       style: {
  //         fontSize: "10px",
  //         color: isDarkTheme ? "#ffffff" : "#000000"
  //       },
  //       step: 1,
  //     },
  //     scrollbar: {
  //       enabled: isScrollbarRequired,
  //     },
  //     gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
  //   },
  //   yAxis: {
  //     title: {
  //       text: yAxisLabel,
  //       style: {
  //         fontSize: `${yAxisFontSize}px`,
  //         color: isDarkTheme ? "#ffffff" : "#000000"
  //       },
  //     },
  //     labels: {
  //       style: {
  //         color: isDarkTheme ? "#ffffff" : "#000000"
  //       }
  //     },
  //     gridLineColor: isDarkTheme ? "#444444" : "#e6e6e6",
  //   },
  //   annotations: [{
  //     labels: [{
  //       point: { x: 0, y: 0 },
  //       text: "Annotation",
  //       style: {
  //         fontSize: `${annotationFontSize}px`,
  //         color: isDarkTheme ? "#ffffff" : "#000000"
  //       }
  //     }]
  //   }],
  //   legend: {
  //     enabled: showLegend,
  //     itemStyle: {
  //       color: isDarkTheme ? "#ffffff" : "#000000"
  //     }
  //   },
  //   plotOptions: {
  //     series: {
  //       dataLabels: {
  //         enabled: dataLabelsEnabled,
  //         style: {
  //           color: isDarkTheme ? "#ffffff" : "#000000"
  //         }
  //       },
  //       colorByPoint: chartType === "PIE_CHART" || chartType === "BAR_GRAPH",
  //     },
  //     pie: {
  //       allowPointSelect: true,
  //       cursor: "pointer",
  //       colors: colorList,
  //       dataLabels: {
  //         enabled: true,
  //         format: "<b>{point.name}</b>: {point.y}",
  //         style: { color: isDarkTheme ? "#ffffff" : "#000000" }
  //       },
  //       innerSize: chartType === "DONUT_CHART" ? "50%" : "0%",
  //     },
  //     bar: {
  //       colors: colorList,
  //     },
  //     column: {
  //       colors: colorList,
  //       stacking: chartType === "STACKED_BAR_GRAPH" || chartType === "STACKED_GRAPH" ? "normal" : undefined,
  //     },
  //     line: {
  //       marker: {
  //         enabled: true,
  //         fillColor: "red",
  //         lineColor: "black",
  //         lineWidth: 2,
  //         radius: 4,
  //       },
  //     },
  //     area: {
  //       stacking: chartType === "AREA_STACKED_GRAPH" ? "normal" : undefined,
  //     }
  //   },
  //   tooltip: {
  //     shared: true,
  //     valueSuffix: " units",
  //     backgroundColor: isDarkTheme ? "rgba(0, 0, 0, 0.85)" : "#ffffff",
  //     style: {
  //       color: isDarkTheme ? "#ffffff" : "#000000"
  //     },
  //   },
  //   exporting: exportingOptions,
  //   // series: graphData.length > 0
  //   //   ? [
  //   //     {
  //   //       type: chartTypeMapping[chartType],
  //   //       name: yAxisLabel || "Value",
  //   //       data: graphData[0]?.data,
  //   //       colorByPoint: true,
  //   //     },
  //   //   ]
  //   //   : [],
  //   series: graphData,
  //   lang: {
  //     noData: "No data available for this graph",
  //   },
  //   noData: {
  //     position: {
  //       align: "center",
  //       verticalAlign: "middle",
  //       x: 0,
  //       y: 0,
  //     },
  //     style: {
  //       fontSize: "14px",
  //       fontWeight: "bold",
  //       color: isDarkTheme ? "#ff6666" : "#ff0000",
  //       textAlign: "center"
  //     },
  //   },
  //   drilldown: {
  //     series: [],
  //     activeDataLabelStyle: {
  //       color: "#0022ff",
  //       cursor: "pointer",
  //       fontWeight: "bold",
  //       textDecoration: "none"
  //     },
  //     breadcrumbs: {
  //       position: {
  //         align: "right",
  //       },
  //       buttonTheme: {
  //         style: {
  //           color: "#006400",
  //         },
  //       },
  //     },
  //   },
  // };


  return (
    <div className={`high-chart-main ${theme === 'Dark' ? 'dark-theme' : ""}`} style={{ border: `7px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>


      <div className="row px-2 py-2 border-bottom">
        <div className="col-md-8 col-xs-7 fw-medium fs-6 pe-0">
          {widgetData?.rptDisplayName}
        </div>
        {isDirectDownloadRequired === 'Yes' &&
          <div className="col-md-4">
            <button
              type="button"
              className="small-box-btn-dwn"
              aria-expanded="false"
              data-bs-toggle="dropdown"
            >
              <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" />
            </button>
            <ul className="dropdown-menu p-2">
              <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" />Refresh Data
              </li>
            </ul>
            <button type="button" className="small-box-btn-dwn"
            >
              <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon" />
            </button>
            <button type="button" className="small-box-btn-dwn"
            >
              <FontAwesomeIcon icon={faFileCsv} className="dropdown-gear-icon" />
            </button>
          </div>
        }
      </div>

      <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
        <h4 style={{ fontWeight: "500", fontSize: "20px" }}>Query :{widgetData?.rptId}</h4>
        <span>{mainQuery}</span>
      </div>
      {paramsData && (
        <div className='parameter-box'>
          <Parameters params={paramsData} setParamsValues={setParamsValues} />
        </div>
      )}
      <div className="high-chart-box">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
      {filteredGraphOptions?.length > 0 &&
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{ marginBottom: "10px" }}
          className="form-select form-select-sm w-50 mt-1 ms-1"
        >
          {filteredGraphOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      }
      {footerText !== '' &&
        <div className="px-2 py-2">
          <span>{footerText}</span>
        </div>
      }
    </div>
  );
};


export default GraphDash;
