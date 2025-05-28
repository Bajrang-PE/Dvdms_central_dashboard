import React, { lazy, useContext, useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import RajasthanMap from '../../localData/mapJson/rajasthan.json';
import UpMap from '../../localData/mapJson/uttarpradesh.json';
import { fetchQueryData } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";


const MapDash = ({ widgetData }) => {
    const { theme, mainDashData, singleConfigData, paramsValues, setLoading } = useContext(HISContext);
    const [mapData, setMapData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)
    const [graphData, setGraphData] = useState([]);

    const borderReq = useMemo(() => widgetData?.isWidgetBorderRequired || '', [widgetData?.isWidgetBorderRequired]);
    const headingAlign = useMemo(() => widgetData?.widgetHeadingAlignment || '', [widgetData?.widgetHeadingAlignment]);
    const widgetHeadingColor = useMemo(() => widgetData?.widgetHeadingColor || '', [widgetData?.widgetHeadingColor]);
    const isWidgetNameVisible = useMemo(() => widgetData?.isWidgetNameVisible || '', [widgetData?.isWidgetNameVisible]);
    const isDirectDownloadRequired = useMemo(() => widgetData?.isDirectDownloadRequired || 'No', [widgetData?.isDirectDownloadRequired]);
    const widgetTopMargin = useMemo(() => widgetData.widgetTopMargin || "", [widgetData.widgetTopMargin]);
    const footerText = useMemo(() => widgetData.footerText || "", [widgetData.footerText]);
    const rptDisplayName = useMemo(() => widgetData?.rptDisplayName, [widgetData?.rptDisplayName]);
    const initialRecord = widgetData?.initialRecordNo;
    const finalRecord = widgetData?.finalRecordNo;

    const widgetLimit = useMemo(() => widgetData?.limitHTMLFromDb || '', [widgetData?.limitHTMLFromDb]);
    const mainQuery = useMemo(() => widgetData?.query && widgetData?.query?.length > 0 ? widgetData?.query[0]?.mainQuery : widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : '', [widgetData?.query, widgetData?.queryVO]);

    const rptId = useMemo(() => widgetData?.rptId, [widgetData?.rptId]);
    const modeOfQuery = useMemo(() => widgetData?.modeOfQuery, [widgetData?.modeOfQuery]);
    const procedureMode = useMemo(() => widgetData?.procedureMode, [widgetData?.procedureMode]);

    const defLimit = useMemo(() => singleConfigData?.databaseConfigVO?.setDefaultLimit || '', [singleConfigData]);
    const parsedLimit = useMemo(() => parseInt(defLimit, 10), [defLimit]);
    const safeLimit = useMemo(() => isNaN(parsedLimit) || parsedLimit <= 0 ? null : parsedLimit, [parsedLimit]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            Promise.all([
                import('highcharts/modules/map'),
                import('highcharts/modules/drilldown'),
                import('highcharts/modules/exporting'),
                import('highcharts/modules/export-data'),
                // import('highcharts/highcharts-more')
            ])
                .then(([mapModule, drilldownModule, exportingModule, exportDataModule]) => {
                    const modules = [mapModule, drilldownModule, exportingModule, exportDataModule];

                    const applyModule = (mod) => {
                        if (typeof mod === 'function') {
                            mod(Highcharts);
                        } else if (mod && typeof mod.default === 'function') {
                            mod.default(Highcharts);
                        } else {
                            console.warn('Module is not a valid Highcharts module:', mod);
                        }
                    };

                    try {
                        modules.forEach((mod, index) => {
                            applyModule(mod);
                        });
                        setIsLoaded(true);

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

    const fetchDataQry = async (query) => {
        if (!query) return;
        try {
            const data = await fetchQueryData(query, widgetData?.JNDIid);
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

    useEffect(() => {
        fetch("https://code.highcharts.com/mapdata/countries/in/in-all.geo.json")
            .then((res) => res.json())
            .then((data) => {
                setMapData(data);
            })
            .catch((err) => {
                console.error("Failed to load India map", err);
            });

    }, []);

    useEffect(() => {
        fetchDataQry(widgetData?.queryVO);
    }, [widgetData]);


    if (!isLoaded) {
        return <div>Loading Chart...</div>
    }


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
                        const hcKey = districtName?.toLowerCase().replace(/\s+/g, "-");
                        // console.log(`Generated hc-key for ${districtName}: ${hcKey}`);

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

    const getStateMatDt = async (name) => {
        if (!name) return null;

        const ftName = name.replace(/\s+/g, "").toLowerCase();

        try {
            const mapModule = await import(`../../localData/mapJson/${ftName}.json`);
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


    const stateMapData = {
        "in-rj": {
            name: "Rajasthan",
            mapData: transformMapData(RajasthanMap),
            data: [
                ["churu", 80],
                ["jhunjhunu", 60],
                ["jaipur", 90],
                ["udaipur", 50],
                ["jhalawar", 70],
            ],
        },
        "in-up": {
            name: "Uttar Pradesh",
            mapData: transformMapData(UpMap),
            data: [
                ["prayagraj", 80],
                ["varanasi", 70],
                ["gautam-buddha-nagar", 40],
                ["gorakhpur", 50],
            ]
        }
    };


    const chartOptions = {
        chart: {
            type: "map",
            map: mapData,
            events: {
                drilldown: async function (e) {
                    if (!e.seriesOptions) {
                        const chart = this;
                        const state = await getStateMatDt(e.point.name);
                        console.log(e.point.name, 'state key')

                        if (state) {
                            chart.showLoading("Loading...");
                            setTimeout(() => {
                                chart.hideLoading();
                                chart.addSeriesAsDrilldown(e.point, {
                                    type: "map",
                                    name: state.name,
                                    mapData: state.mapData,
                                    joinBy: "hc-key",
                                    data: state.data?.map(([hcKey, value, name]) => ({
                                        "hc-key": hcKey,
                                        value,
                                        name
                                    })),
                                    colorAxis: true,
                                    tooltip: {
                                        pointFormat: "{point.name}: {point.value}",
                                    },
                                });
                            }, 1000);
                        }
                    }
                },
                drillup: function () {
                    console.log("Drilling up...");
                },
            },
        },
        title: {
            text: "India Map with Drilldown",
        },
        subtitle: {
            text: "Click states to view districts",
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: "bottom",
            },
        },
        colorAxis: {
            min: 0,
            max: 100,
            minColor: "#E6E7E8",
            maxColor: "#006400",
        },
        legend: {
            enabled: false
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
                    },
                },
            },
        },
        series: [
            {
                name: "India",
                mapData: mapData,
                data: [
                    ["in-mh", 75],
                    ["in-dl", 50],
                    ["in-mp", 45],
                    ["in-rj", 40],
                    ["in-up", 60],
                ].map(([hcKey, value]) => ({
                    "hc-key": hcKey,
                    value,
                    drilldown: hcKey,
                })),
                joinBy: "hc-key",
                tooltip: {
                    pointFormat: "{point.name}: {point.value}",
                },
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
        <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>
            <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
                {isWidgetNameVisible === "Yes" &&
                    <div className={` ${isDirectDownloadRequired === 'Yes' ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{rptDisplayName}</div>
                }
            </div>

            <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
                <h4 style={{ fontWeight: "500", fontSize: "20px" }}>Query : {rptId}</h4>
                {modeOfQuery === 'Query' &&
                    <span>{mainQuery}</span>
                }
                {modeOfQuery === "Procedure" &&
                    <span>{procedureMode}</span>
                }
            </div>


            <div style={{ width: "100%", height: "auto" }}>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chartOptions}
                    constructorType="mapChart"
                />
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
