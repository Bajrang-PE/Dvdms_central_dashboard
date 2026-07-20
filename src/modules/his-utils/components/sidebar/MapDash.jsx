import React, { lazy, useContext, useEffect, useMemo, useState } from "react";
import Highcharts, { height } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { fetchProcedureData, fetchQueryData, formatDateFullYear, formatParams, getOrderedParamValues, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { useSearchParams } from "react-router-dom";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faArrowRight, faArrowRightFromBracket, faChevronRight, faSortAmountDesc, faTableCells } from "@fortawesome/free-solid-svg-icons";
import Tabular from "./Tabular";
import Parameters from "./Parameters";

import "highcharts/modules/map";
import "highcharts/modules/exporting";
import "highcharts/modules/export-data";
import 'highcharts/modules/drilldown';
import { ArrowCircleLeftbtnSvg, TableCellsbtnSvg } from "../../utils/commonSVG";
import { jwtDecode } from "jwt-decode";
import './DashNewMap.css';


const MapDash = ({ widgetData, setWidgetData, pkColumn, setPkColumn, levelData, setLevelData, isLayoutWithPreview, presentTabs }) => {
    const { theme, setSearchScope, singleConfigData, paramsValues, isSearchQuery, setIsSearchQuery, presentWidgets, searchScope, dt, allDrpDtParams, setAllDrpDtParams, activeTab } = useContext(HISContext);
    const [mapData, setMapData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [stateName, setStateName] = useState([]);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [widgetParams, setWidgetParams] = useState([]);
    const [widParamsValues, setWidParamsValues] = useState();
    const [searchInput, setSearchInput] = useState('');
    const [test, setTest] = useState();

    const [queryParams] = useSearchParams();
    const isPrev = queryParams.get('isPreview');
    const isGlobal = queryParams.get("isGlobal") || 0;

    const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
    const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';

    const borderReq = useMemo(() => widgetData?.isWidgetBorderRequired || '', [widgetData?.isWidgetBorderRequired]);
    const headingAlign = useMemo(() => widgetData?.widgetHeadingAlignment || '', [widgetData?.widgetHeadingAlignment]);
    const widgetHeadingColor = useMemo(() => widgetData?.widgetHeadingColor || '', [widgetData?.widgetHeadingColor]);
    const isWidgetNameVisible = useMemo(() => widgetData?.isWidgetNameVisible || 'Yes', [widgetData?.isWidgetNameVisible]);
    const isDirectDownloadRequired = useMemo(() => widgetData?.isDirectDownloadRequired || 'No', [widgetData?.isDirectDownloadRequired]);
    const widgetTopMargin = useMemo(() => widgetData.widgetTopMargin || "", [widgetData.widgetTopMargin]);
    const footerText = useMemo(() => widgetData.footerText || "", [widgetData.footerText]);
    const rptDisplayName = useMemo(() => widgetData?.rptDisplayName, [widgetData?.rptDisplayName]);
    const initialRecord = widgetData?.initialRecordNo;
    const finalRecord = widgetData?.finalRecordNo;

    const widgetLimit = useMemo(() => widgetData?.limitHTMLFromDb || '', [widgetData?.limitHTMLFromDb]);
    const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''

    const rptId = useMemo(() => widgetData?.rptId, [widgetData?.rptId]);
    const modeOfQuery = useMemo(() => widgetData?.modeOfQuery, [widgetData?.modeOfQuery]);
    const procedureMode = useMemo(() => widgetData?.procedureMode, [widgetData?.procedureMode]);

    const defLimit = useMemo(() => singleConfigData?.databaseConfigVO?.setDefaultLimit || '', [singleConfigData]);
    const parsedLimit = useMemo(() => parseInt(defLimit, 10), [defLimit]);
    const safeLimit = useMemo(() => isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit, [parsedLimit]);
    const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
    const paramsData = widgetData.selFilterIds || "";
    const parameterOption = widgetData?.parameterOptions || "2";
    const widheight = presentTabs?.length > 0 && presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetHeight;



    useEffect(() => {
        const loadMap = async () => {
            if (levelData && levelData?.length > 1) {
                const stateName = levelData[levelData.length - 1];
                if (stateName?.name) {
                    setStateName(stateName?.name)
                    const name = stateName?.name?.toLowerCase().replace(/\s+/g, "");
                    const mapdt = await getStateMatDt(name);
                    setMapData(mapdt?.mapData)
                }
            } else {
                const mapdt = await getStateMatDt('india2', true);
                setMapData(mapdt?.mapData);

                // fetch("https://code.highcharts.com/mapdata/countries/in/in-all.geo.json")
                //     .then((res) => res.json())
                //     .then((data) => {
                //         setMapData(data);
                //         setStateName("");
                //     })
                //     .catch((err) => {
                //         console.error("Failed to load India map", err);
                //     });
            }
        };
        loadMap();
    }, [widgetData])


    const formatData = (rawData = []) => {
        return rawData.map((item) => {
            const formattedItem = {};
            Object.entries(item).forEach(([key, value]) => {

                const formattedKey = key.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

                formattedItem[formattedKey] = formattedKey.includes("State") ? value : value;
            });
            return formattedItem;
        });
    };


    const getFirstValue = (val) => {
        return typeof val === 'string' && val.includes('##') ? val.split('##')[0] : val;
    };


    const getUserIdFromToken = (id) => {
        const token = sessionStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            if (decoded) {
                return decoded?.userDetail?.[id] || ""
            }
            return "";
        }
    }


    const generateColumns = (data, ifDrill = isChildPresent) => {
        if (!data || data.length === 0) return [];

        const keys = Object.keys(data[0]).filter(key => key !== 'pkcolumn');

        const reorderedKeys = [
            ...keys.filter(k => /^sno$/i.test(k)),
            // ...keys.filter(k => /state/i.test(k)),
            ...keys.filter(k => !/^sno$/i.test(k))
        ];

        const dynamicColumns = reorderedKeys.map((key) => ({
            name: key,
            selector: row => getFirstValue(row[key]),
            sortable: true,
            wrap: true,
            width: /^sno$/i.test(key) ? '8%' : undefined,
            cell: (row) => {
                const value = row[key];
                const displayValue = getFirstValue(value);

                return typeof value === 'string' && value.includes("##") ? (
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                    // onClick={() => openPopUpWidget(value)}
                    >
                        {displayValue}
                    </span>
                ) : (
                    <span>{displayValue}</span>
                );
            }
        }));

        if (ifDrill) {
            const drillColumn = {
                name: "Action",
                cell: (row) => (
                    <button className="drilldown-btn btn-sm" onClick={() => {
                        const nameVal = row.state_name || row.State || row.district || row.District;
                        onDrillDown(row.pkcolumn, nameVal?.toLowerCase().replace(/\s+/g, ""));
                    }}>
                        <FontAwesomeIcon icon={faSortAmountDesc} />
                    </button>
                )
            };
            return [drillColumn, ...dynamicColumns];
        }
        return dynamicColumns;
    };

    const fetchData = async (widget) => {

        if (widget?.modeOfQuery === "Procedure") {
            if (!widget?.procedureMode) return;
            try {
                const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');

                const params = [
                    getUserIdFromToken('HOSPITAL_CODE')?.toString() || "998", //hospital code===
                    getUserIdFromToken("USER_ID")?.toString() || "10001", //user id===
                    pkColumn ? pkColumn?.toString() : '', //primary key
                    paramVal.paramsId || "", //parameter ids
                    paramVal.paramsValue || "", //parameter values
                    isPaginationReq?.toString(), //is pagination required===
                    initialRecord?.toString(), //initial record no.===
                    finalRecord?.toString(), //final record no.===
                    "", //date options
                    formatDateFullYear(new Date()),//from values
                    formatDateFullYear(new Date()) // to values
                ]
                const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid, null, isGlobal);
                const formattedData = formatData(response.data || []);
                const generatedColumns = generateColumns(formattedData, isChildPresent);
                setColumns(generatedColumns);
                setTableData(formattedData);
                setFilterData(formattedData);
                setIsSearchQuery(false)
                setSearchScope({ scope: "", id: "" })
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        } else {
            if (!widget?.queryVO?.length > 0) return;

            const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);

            try {
                const data = await fetchQueryData(widget?.queryVO?.length > 0 ? widget?.queryVO : [], widget?.JNDIid, params, null, isGlobal);
                if (data?.length > 0) {
                    let filteredData = data;

                    if (widget?.isQuerychild && widget?.isQuerychild === "1") {
                        const columnIndexes = widget?.columnIndexesParent || [];
                        const keys = Object.keys(data[0]);
                        filteredData = data.map(row => {
                            const filteredRow = {};
                            columnIndexes.forEach(idx => {
                                const key = keys[idx];
                                if (key) filteredRow[key] = row[key];
                            });
                            return filteredRow;
                        });
                    }
                    const formattedData = formatData(filteredData);
                    const generatedColumns = generateColumns(formattedData, isChildPresent);
                    setColumns(generatedColumns);
                    setTableData(formattedData);
                    setFilterData(formattedData);
                    setIsSearchQuery(false)
                    setSearchScope({ scope: "", id: "" })
                } else {
                    setColumns([]);
                    setTableData([]);
                    setFilterData([]);
                }
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        }
    }

    useEffect(() => {
        const loadDefaultMap = async () => {
            try {
                const mapdt = await getStateMatDt('india2');
                if (mapdt?.mapData) {
                    setMapData(mapdt.mapData);
                }
            } catch (err) {
                console.error("Failed to load initial India map data", err);
            }
        };
        loadDefaultMap();
        // fetch("https://code.highcharts.com/mapdata/countries/in/in-all.geo.json")
        //     .then((res) => res.json())
        //     .then((data) => {
        //         setMapData(data);
        //     })
        //     .catch((err) => {
        //         console.error("Failed to load India map", err);
        //     });

    }, []);


    useEffect(() => {
        if (widgetData && !isSearchQuery) {
            fetchData(widgetData);
        }
    }, [widgetData, paramsValues]);

    useEffect(() => {
        if (isSearchQuery && searchScope?.scope === "widgetParams" && searchScope?.id == widgetData?.rptId) {
            fetchData(widgetData);
        } else if (isSearchQuery && searchScope?.scope !== "" && searchScope?.scope !== "widgetParams") {
            fetchData(widgetData);
        }
    }, [isSearchQuery]);

    const transformMapData = (mapData) => {
        if (!mapData?.objects) return mapData;

        const stateKey = Object.keys(mapData.objects)[0];
        if (!stateKey || !mapData.objects[stateKey]?.geometries) return mapData;

        return {
            ...mapData,
            objects: {
                [stateKey]: {
                    ...mapData.objects[stateKey],
                    geometries: mapData.objects[stateKey].geometries.map((geo) => {
                        const districtName = geo.properties.district || geo.properties.name || geo.properties.district_name;
                        // const hcKey = districtName?.toLowerCase().replace(/\s+/g, "-");
                        const hcKey = districtName ? districtName.toLowerCase().replace(/\s+/g, "") : "unknown";

                        return {
                            ...geo,
                            properties: {
                                ...geo.properties,
                                "hc-key": hcKey,
                                name: districtName,
                            },
                        };
                    }),
                },
            },
        };
    };

    const getStateMatDt = async (name, isRoot) => {
        if (!name) return null;

        const ftName = name.replace(/\s+/g, "").toLowerCase();

        try {
            const mapModule = await import(`../../localData/mapJson/${name}.json`);
            const mapData = transformMapData(mapModule.default);

            return {
                name: name,
                mapData: mapData,
                data: []
            };
        } catch (error) {
            console.error(`Error loading map for ${name}:`, error);
            return null;
        }
    };


    const onDrillDown = (pkCol, name) => {
        if (isChildPresent && childId) {
            setPkColumn(pkCol)
            setCurrentLevel(currentLevel + 1)
            const widgetDetail = presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childId)[0]
            setWidgetData(widgetDetail)
            setLevelData(prevLevelData => [
                ...prevLevelData,
                {
                    'rptId': widgetDetail?.rptId,
                    'rptName': widgetDetail?.rptName,
                    'rptLevel': currentLevel + 1,
                    'pkclm': pkCol,
                    'name': name
                }
            ]);
        } else {
            ToastAlert('No child available', 'warning')
        }
    }

    // CHANGED: Build map series cleanly using consistent keys from map properties
    const mapSeriesData = useMemo(() => {
        return tableData.map((dt) => {
            const isDistrictLevel = levelData?.length > 1;
            // Map JSON properties usually use capitalized/exact match naming conventions
            const pointName = isDistrictLevel ? (dt?.district || dt?.District) : (dt?.state_name || dt?.State);
            const pointValue = isDistrictLevel ? dt?.edl_district_count : dt?.count;

            return {
                name: pointName,
                id: pointName,
                "woe-name": pointName,
                value: Number(pointValue) || 0,
                drilldown: isChildPresent ? pointName : null
            };
        });
    }, [tableData, levelData, isChildPresent]);


    const chartOptions = useMemo(() => {
        if (!mapData) return null;

        // Calculate maximum threshold safely outside option injection
        const maxVal = Math.max(...tableData.map(d => levelData?.length > 1 ? (Number(d?.edl_district_count) || 0) : (Number(d?.count) || 0)), 1);

        return {

            chart: {
                type: "map",
                map: mapData,
                height: 400,
                backgroundColor: "#9fcaf8",
                spacing: [10, 1, 10, 1],
                borderRadius: 5,
                style: {
                    fontFamily: "Inter, Roboto, sans-serif"
                },
                events: {
                    drilldown: function (e) {
                        if (!e.seriesOptions) {
                            const chart = this;
                            if (e?.point && e.point.name && isChildPresent) {
                                chart.showLoading("Loading...");
                                const matchRow = tableData.find(item => (item.state_name || item.State) === e.point.name);
                                const pkCol = matchRow ? matchRow.pkcolumn : null;
                                setTimeout(() => {
                                    onDrillDown(pkCol, e.point.name);
                                    chart.hideLoading();
                                }, 100);
                            } else {
                                ToastAlert('Child Not Found!', 'warning');
                            }
                        }
                    },
                    drillup: function () {
                        console.log("Drilling up...");
                    },
                },
            },
            title: "",

            // title: {
            //     text: levelData?.length > 1 ? `${stateName} - District Level Map` : "India Map with Drilldown",
            // },
            // subtitle: {
            //     text: levelData?.length > 1 ? "Viewing districts data" : "Click states to view districts",
            // },
            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: "bottom",
                },
            },
            colorAxis: {
                min: 1,
                max: maxVal,
                stops: [
                    [0, '#E6E7E8'],
                    [0.5, '#66bb66'],
                    [1, '#006400']
                ]
            },
            legend: {
                enabled: false,
                layout: 'horizontal',
                align: 'bottom'
            },
            plotOptions: {
                map: {
                    states: {
                        hover: {
                            color: "#EEDD66",
                        },
                    },
                    allAreas: true,
                    nullColor: "#F0F0F0",
                    dataLabels: {
                        enabled: true,
                        format: "{point.name}",
                        style: {
                            fontWeight: "bold",
                            color: "black",
                            textOutline: "none"
                        },
                    },
                },
            },
            tooltip: {
                headerFormat: '<span style="font-size: 11px; color: #666; font-family: Inter, Roboto, sans-serif;"><span style="color: #1900ff; font-size: 10px; margin-right: 2px;">●</span>{series.name}</span><br/>',
                pointFormat: `
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 4px; font-family: Inter, Roboto, sans-serif;">
                    <span style="color:{point.color}; font-size: 14px;">●</span>
                    <b style="color: #333; font-size: 13px;">{point.name}:</b> 
                    <span style="color: #ff5e00; font-weight: bold; font-size: 13px;">{point.value}</span>
                </div>
            `,
                useHTML: true,
                backgroundColor: "#ffffff",
                borderRadius: 6,
                shadow: true,
                style: {
                    borderColor: "#d5f7bf",
                    padding: "8px"
                }
            },
            series: [
                {
                    name: "India",
                    mapData: mapData,
                    data: mapSeriesData,
                    joinBy: "name",
                },
            ],
            exporting: {
                enabled: true,
                buttons: {
                    contextButton: {
                        menuItems: [
                            "viewFullscreen",
                            "printChart",
                            "separator",
                            "downloadPNG",
                            "downloadJPEG",
                            "downloadPDF",
                            "downloadSVG",
                            "separator",
                            "downloadCSV",
                            "downloadXLS",
                        ],
                    },
                },
                filename: "india-map",
            },
            drilldown: {
                series: [],
                activeDataLabelStyle: {
                    color: "#061ad6",
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "none",
                    textOutline: "none"
                },
                breadcrumbs: {
                    position: {
                        align: "right",
                    },
                    buttonTheme: {
                        style: {
                            color: "#006400",
                            textOutline: "none"
                        },
                    }
                },
            },

            credits: {
                enabled: false
            }
        }
    }, [tableData, levelData, mapData]);

    const backToParentWidget = (id) => {
        if (levelData?.length > 1 && currentLevel !== 0) {
            let targetLevel = null;
            let widgetDetail = null;
            let pkClm = '';

            if (id) {
                const targetItem = levelData.find(dt => dt.rptId === id);
                pkClm = targetItem?.pkclm
                if (targetItem) {
                    targetLevel = targetItem.rptLevel;
                    widgetDetail = presentWidgets?.find(dt => dt?.rptId == id);
                }
            } else {
                targetLevel = currentLevel - 1;
                const parentItem = levelData.find(dt => dt.rptLevel === targetLevel);
                pkClm = parentItem?.pkclm
                widgetDetail = presentWidgets?.find(dt => dt?.rptId == parentItem?.rptId);
            }

            if (widgetDetail && targetLevel !== null) {
                setWidgetData(widgetDetail);
                setCurrentLevel(targetLevel);
                setPkColumn(pkClm)
                const restLevels = levelData.filter(dt => dt.rptLevel <= targetLevel);
                setLevelData(restLevels);
                setMapData(null)
            }
        }
    }

    useEffect(() => {
        if (searchInput) {
            const lowercasedText = searchInput?.toLowerCase() || "";
            const filteredData = lowercasedText
                ? filterData?.filter(row =>
                    Object.values(row).some(val =>
                        val?.toString()?.toLowerCase()?.includes(lowercasedText)
                    )
                )
                : filterData;

            setTableData(filteredData);
        } else {
            setTableData(filterData);
        }
    }, [searchInput])


    return (
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`}
            style={{
                height: isLayoutWithPreview ? '100%' : widheight && widheight != '0' ? `${widheight}px` : '650px',
                border: `1px solid ${theme === 'Dark' ? 'white' : '#e8e4e4'}`,
                marginTop: `${widgetTopMargin}px`,
                padding: "10px"
            }}>

            <div className="dashboard-header" >
                {isWidgetNameVisible === "Yes" &&
                    <div className={` ${isDirectDownloadRequired === 'Yes' ? 'col-md-8' : 'col-md-12'} fw-medium fs-6`} style={{ textAlign: headingAlign, color: widgetHeadingColor }}>{dt(rptDisplayName)}</div>
                }

                <div className={`${isWidgetNameVisible === "Yes" ? "col-md-4 pe-0 ps-0" : "col-md-12 pe-0 ps-0"}`}>
                    {currentLevel !== 0 && (
                        <>
                            <span className="small-box-btn-dwn" onClick={() => backToParentWidget()} title="Back">
                                <ArrowCircleLeftbtnSvg />
                            </span>
                            <div className="nav-item dropdown" >
                                <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown" title="Prev Widgets">
                                    <TableCellsbtnSvg />
                                </button>

                                <ul className="dropdown-menu dropdown-menu-start" >
                                    {levelData?.length > 0 && levelData
                                        ?.filter((level, index) => {
                                            const maxLevel = Math.max(...levelData?.map(l => l.rptLevel));
                                            return level.rptLevel !== maxLevel;
                                        })
                                        ?.map((level, index) => (
                                            <li className="dropdown-item pointer text-primary p-1" style={{ whiteSpace: "normal", wordBreak: "break-word" }} key={index} onClick={() => backToParentWidget(level?.rptId)}>
                                                {level?.rptName}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {isPrev == 1 &&
                <div className="dashboard-subtitle">
                    <div className="query-badge"><b>Query : </b>
                        {(modeOfQuery === 'Query') &&
                            <span> {mainQuery}</span>
                        }
                        {(modeOfQuery === "Procedure") &&
                            <span> {procedureMode}</span>
                        }
                    </div>
                </div>
            }

            {paramsData && (
                <div className='parameter-box py-1'>
                    <Parameters params={paramsData} setParamsValues={setWidParamsValues} scope={'widgetParams'} widgetId={widgetData?.rptId} setWidgetParams={setWidgetParams} setAllDrpDtParams={setAllDrpDtParams} hideOptions={parameterOption} />
                </div>
            )}

            <div className="dashboard-content">
                <div className="map-card">
                    <div className="card-header-custom">
                        <div>
                            <h6 className="mb-0 pb-0">{levelData?.length > 1 ? `🗺️ ${stateName} Analytics Map` : `🗺️ India Analytics Map`}</h6>

                            <span className="ps-4">
                                Click on any map to drill down
                            </span>
                        </div>
                        <div className="map-actions">
                            {currentLevel !== 0 && (
                                <>
                                    <button className="toolbar-btn" onClick={() => backToParentWidget()}
                                        title="Back"
                                    >
                                        <ArrowCircleLeftbtnSvg />
                                    </button>
                                    <div className="dropdown">
                                        <button className="toolbar-btn" data-bs-toggle="dropdown" title="Previous Widgets">
                                            <TableCellsbtnSvg />
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end">
                                            {levelData
                                                ?.filter(level => {
                                                    const max = Math.max(...levelData.map(dt => dt.rptLevel));
                                                    return level.rptLevel !== max;
                                                })
                                                ?.map((level, index) => (
                                                    <li key={index} className="dropdown-item" onClick={() => backToParentWidget(level.rptId)}
                                                    >
                                                        {level.rptName}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                    <div className="map-body">
                        <div className="map-breadcrumb">
                            {['India', 'Rajasthan', 'Jhalawar'].map((item, index, arr) => (
                                <React.Fragment key={item}>
                                    <span
                                        className={`breadcrumb-item ${index === arr.length - 1 ? "active" : ""
                                            }`}
                                    >
                                        {item}
                                    </span>

                                    {index !== arr.length - 1 && (
                                        <span className="breadcrumb-separator">
                                            <FontAwesomeIcon icon={faChevronRight} size="xs"/>
                                        </span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                        {chartOptions ? (
                            <HighchartsReact highcharts={Highcharts} constructorType="mapChart" options={chartOptions} />
                        ) : (
                            <div className="map-loader">
                                Loading Map...
                            </div>
                        )}
                    </div>
                </div>
                <div className="table-card">
                    <div className="card-header-custom">
                        <div>
                            <h6 className="mb-1 pb-0">📊 Analytics Table</h6>
                            <span className="ps-4">
                                {tableData.length} Records
                            </span>
                        </div>
                        <div className="table-toolbar-right">
                            <input
                                className="table-search"
                                type="search"
                                placeholder="🔍 Search state..."
                                onChange={(e) => { setSearchInput(e?.target?.value); }}
                            />
                            {/* <button className="export-btn">
                                ⬇ Export
                            </button> */}
                        </div>
                    </div>
                    <div className="table-body">
                        <Tabular
                            columns={columns}
                            data={tableData}
                            pagination={true}
                            headingFontColor={"#1fa504"}
                            headingBgColor={"#ffffff"}
                            headingAlignment={'center'}
                            recordsPerPageOptions={[10, 20, 50]}
                            theme={theme}
                            noDataComponent={<div className="text-danger fw-bold fs-13">{dt("There are no records to display")}</div>}
                            mainHeaders={[]}
                            sortConfig={[]}
                            allData={filterData}
                            limit={widgetLimit ? widgetLimit : safeLimit ? safeLimit : ''}
                        />
                    </div>
                </div>
            </div>

            {footerText && footerText.trim() !== '' && (
                <>
                    <h6 className='header-devider mt-2 mb-0'></h6>
                    <div className="px-2 py-2">
                        <span style={{ fontSize: '12px' }}>{footerText}</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default MapDash;
