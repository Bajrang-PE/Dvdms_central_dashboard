import React, { lazy, useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import RajasthanMap from '../../localData/mapJson/rajasthan.json';
import UpMap from '../../localData/mapJson/uttarpradesh.json';


const MapDash = ({ widgetData }) => {
    const [mapData, setMapData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false)

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
        <div style={{ width: "100%", height: "600px" }}>
            <HighchartsReact
                highcharts={Highcharts}
                options={chartOptions}
                constructorType="mapChart"
            />
        </div>
    );
};

export default MapDash;
