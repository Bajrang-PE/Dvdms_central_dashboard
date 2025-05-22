import React, { useState, useEffect, useContext, lazy } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileCsv, faFilePdf, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { highchartGraphOptions } from "../../localData/DropDownData";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { generateGraphCSV, generateGraphPDF } from "../commons/advancedPdf";

const Parameters = lazy(() => import('./Parameters'));

const GraphDash = ({ widgetData }) => {
  const { theme, paramsValues, singleConfigData } = useContext(HISContext);
  const [widParamsValues, setWidParamsValues] = useState();
  const [filteredGraphOptions, setFilteredGraphOptions] = useState([]);
  const [chartType, setChartType] = useState('BAR_GRAPH');
  const [graphData, setGraphData] = useState([]);

  const is3D = widgetData.is3d === "true";
  const xAxisLabel = widgetData.xAxisLabel || "X Axis";
  const yAxisLabel = widgetData.yAxisLabel || "Y Axis";
  const showLegend = widgetData.showInLegend === "true";
  const dataLabelsEnabled = widgetData.dataLabels === "true";
  const colorList = widgetData.colorForBars ? widgetData.colorForBars.split(",") : ["red", "blue", "green"];
  // const mainQuery = widgetData.queryVO?.length > 0 ? widgetData.queryVO[0]?.mainQuery : "";
  const mainQuery = widgetData?.query && widgetData?.query?.length > 0 ? widgetData?.query[0]?.mainQuery : widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''
  const alpha = widgetData.alpha || 15;
  const beta = widgetData.beta || 15;

  const xAxisFontSize = parseInt(widgetData?.XAxisFontSize, 10) || 10;
  const yAxisFontSize = parseInt(widgetData?.YAxisFontSize, 10) || 10;
  const annotationFontSize = parseInt(widgetData?.annotationFontSize, 10) || 12;
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequiredGraph ? widgetData?.isDirectDownloadRequiredGraph : widgetData?.isDirectDownloadRequired || 'No';

  const minAxisValue = widgetData?.minValueOfAxis && widgetData?.minValueOfAxis !== '0' ? parseInt(widgetData.minValueOfAxis, 10) : undefined;
  const maxAxisValue = widgetData?.maxValueOfAxis && widgetData?.maxValueOfAxis !== '0' ? parseInt(widgetData.maxValueOfAxis, 10) : undefined;

  const isActionButtonReq = widgetData?.isActionButtonReqGraph ? widgetData?.isActionButtonReqGraph : widgetData?.isActionButtonReq || "Yes";
  const labelRotation = parseInt(widgetData.rotation, 10) || 0;
  const isScrollbarRequired = widgetData.isScrollbarRequired === "Yes";
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const isDarkTheme = theme === 'Dark';

  //procedure
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;
  const isPaginationReq = widgetData?.isPaginationReq || "";

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;


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
      const data = await fetchQueryData(query, widgetData?.JNDIid);
      const limit = widgetLimit
        ? parseInt(widgetLimit)
        : safeLimit
          ? parseInt(safeLimit)
          : data.length;
      const limitedData = data.slice(0, limit);

      const seriesData = [];


      if (limitedData[0]?.column_3) {
        // Three-column limitedData
        const categories = [...new Set(limitedData.map(item => item.column_1))];
        const seriesNames = ['column_2', 'column_3'];

        seriesNames.forEach(seriesName => {
          seriesData.push({
            name: seriesName,
            data: categories.map(category => {
              const item = limitedData.find(d => d.column_1 === category);
              return item ? item[seriesName] : null;
            }),
            colorByPoint: true,
          });
        });

        setGraphData({ categories, seriesData });
      } else {
        // Two-column data
        const categories = limitedData.map(item => item.column_1);
        seriesData.push({
          name: 'column_2',
          data: limitedData.map(item => item.column_2),
          colorByPoint: true,
        });

        setGraphData({ categories, seriesData });
      }
    } catch (error) {
      console.error("Error loading query data:", error);
    }
  };

  console.log(widgetData, widgetData?.rptId)

  // utils/graphFormatter.js
  const formatProcedureDataForGraph = (data) => {
    if (!data || data.length === 0) return { categories: [], seriesData: [] };

    const [firstItem] = data;
    const keys = Object.keys(firstItem);

    const nameKey = keys[0];  // e.g. "State / UT"
    const valueKey = keys[1]; // e.g. "Base Rate(In INR)"

    const categories = data.map(item => item[nameKey]);
    const values = data.map(item => parseFloat(item[valueKey]) || 0);

    const seriesData = [{
      name: valueKey,
      data: values,
      colorByPoint: true
    }];

    return { categories, seriesData };
  };

  const formatParams = (paramsObj) => {
    if (typeof paramsObj !== 'object' || paramsObj === null || Array.isArray(paramsObj)) {
      return {
        paramsId: "",
        paramsValue: ""
      };
    }

    return {
      paramsId: Object.keys(paramsObj).join(','),
      paramsValue: Object.values(paramsObj).join(',')
    };
  };

  const fetchProcedure = async (widget) => {
    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        const paramVal = formatParams(paramsValues ? paramsValues : null);
        const widgetLimit = widget?.limitHTMLFromDb || ''
        const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
        const parsedLimit = parseInt(defLimit, 10);
        const safeLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit;

        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          "", //primary key
          paramVal.paramsId || "", //parameter ids
          paramVal.paramsValue || "", //parameter values
          isPaginationReq?.toString(), //is pagination required===
          initialRecord?.toString(), //initial record no.===
          finalRecord?.toString(), //final record no.===
          "", //date options
          "16-Apr-2025",//from values
          "16-Apr-2025" // to values
        ]
        const data = await fetchProcedureData(widget?.procedureMode, params, widgetData?.JNDIid);
        const limit = widgetLimit
          ? parseInt(widgetLimit)
          : safeLimit
            ? parseInt(safeLimit)
            : data?.data?.length;
        const limitedData = data?.data?.slice(0, limit);

        const formattedData = formatProcedureDataForGraph(limitedData);
        setGraphData(formattedData);
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
  }, [paramsValues]);


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
    series: graphData?.seriesData,
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
              onClick={() => generateGraphPDF(widgetData, graphData, singleConfigData?.databaseConfigVO)}
              title="PDF"
            >
              <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon" />
            </button>
            <button type="button" className="small-box-btn-dwn"
              onClick={() => generateGraphCSV(widgetData, graphData, singleConfigData?.databaseConfigVO)}
              title="CSV"
            >
              <FontAwesomeIcon icon={faFileCsv} className="dropdown-gear-icon" />
            </button>
          </div>
        }
      </div>

      <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
        <h4 style={{ fontWeight: "500", fontSize: "20px" }}>Query :</h4>
        {widgetData?.modeOfQuery === 'Query' &&
          <span>{mainQuery}</span>
        }
         {widgetData?.modeOfQuery === "Procedure" &&
          <span>{widgetData?.procedureMode}</span>
        }
      </div>
      {paramsData && (
        <div className='parameter-box'>
          <Parameters params={paramsData} setParamsValues={setWidParamsValues} />
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
