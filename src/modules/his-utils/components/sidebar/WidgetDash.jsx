import React, { lazy, Suspense, useContext, useEffect, useState } from 'react';
import OtherLinkDash from './OtherLinkDash';
import NewsTickerDash from './NewsTickerDash';
import { HISContext } from '../../contextApi/HISContext';
import { fetchProcedureData, fetchQueryData, formatParams, getOrderedParamValues } from '../../utils/commonFunction';
import { getAuthUserData } from '../../../../utils/CommonFunction';

const KpiDash = lazy(() => import('./KpiDash'));
const TabularDash = lazy(() => import('./TabularDash'));
const GraphDash = lazy(() => import('./GraphDash'));
const MapDash = lazy(() => import('./MapDash'));
const IframeDash = lazy(() => import('./IframeDash'));

const WidgetDash = React.memo(({ widgetDetail, presentWidgets, presentTabs, pk }) => {

    const { theme, singleConfigData, paramsValues, setLoading, isSearchQuery, setIsSearchQuery, prevKpiTab } = useContext(HISContext);

    const [widgetData, setWidgetData] = useState({});
    const [linkedWidget, setLinkedWidget] = useState();
    const [pkColumn, setPkColumn] = useState('');
    const [levelData, setLevelData] = useState([]);

    const [childWidgetDataMap, setChildWidgetDataMap] = useState({});
    const [childWidgets, setChildWidgets] = useState([]);

    const handleSetPkColumn = (val) => {
        setPkColumn(val)
    }

    useEffect(() => {
        if (pk && pk !== '') {
            handleSetPkColumn(pk)
        }
    }, [pk])


    useEffect(() => {
        if (widgetData?.widgetType === "singleQueryParent") {
            try {
                const parsed = JSON.parse(widgetData?.sqChildJsonString || '[]');
                setChildWidgets(parsed); // store the mapping
            } catch (e) {
                console.error("Invalid sqChildJsonString", e);
            }
        }
    }, [widgetData]);

    useEffect(() => {
        setWidgetData(widgetDetail);
        setLevelData([{
            'rptId': widgetDetail?.rptId,
            'rptName': widgetDetail?.rptName,
            'rptLevel': 0
        }])
    }, [widgetDetail])

    useEffect(() => {
        if (widgetData) {
            const linkedWidgetIds = widgetData?.linkedWidgetRptId
                ?.split(',')
                ?.map(id => id?.trim())
                ?.filter(Boolean) || [];
            setLinkedWidget(linkedWidgetIds)
        }

    }, [widgetData])

    const initialRecord = widgetData?.initialRecordNo;
    const finalRecord = widgetData?.finalRecordNo;
    const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;

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


    const fetchData = async (widget) => {
        try {
            const paramVal = formatParams(paramsValues || null, widgetData?.rptId || '');
            const params = [
                getAuthUserData('hospitalCode')?.toString(),
                "10001",
                pkColumn || '',
                paramVal.paramsId || '',
                paramVal.paramsValue || '',
                isPaginationReq?.toString(),
                initialRecord?.toString(),
                finalRecord?.toString(),
                '', '', ''
            ];

            if (widget?.modeOfQuery === "Procedure" && widget?.procedureMode) {
                const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid);
                return formatData(response.data || []);
            }

            if (widget?.queryVO?.length > 0) {
                const queryParams = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);
                const response = await fetchQueryData(widget?.queryVO, widget?.JNDIid, queryParams);
                return formatData(response || []);
            }

        } catch (error) {
            console.error("Error loading query data:", error);
        }
        return null;
    };

    useEffect(() => {
        if (widgetData?.widgetType !== "singleQueryParent") return;

        const fetchOnceForAll = async () => {
            const allRows = await fetchData(widgetData);
            if (!allRows || allRows.length === 0) return;

            const allCols = Object.keys(allRows[0] || {});
            const map = {};

            childWidgets.forEach(child => {
                const childId = String(child.SQCHILDWidgetId);
                const colNos = child.modeForSQCHILDColumnNo.split(',').map(n => parseInt(n.trim()) - 1);
                
                const childCols = colNos.map(index => (
                    {
                        name: allCols[index],
                        selector: row => row[allCols[index]],
                    }
                )).filter(Boolean);
                const childData = allRows.map(row => {
                    const newRow = {};
                    colNos.forEach(index => {
                        const colKey = allCols[index];
                        if (colKey) newRow[colKey] = row[colKey];
                    });
                    return newRow;
                });

                map[childId] = { columns: childCols, data: childData };
            });

            setChildWidgetDataMap(map);
        };

        fetchOnceForAll();
    }, [childWidgets]);


    const renderWidget = (data, parClm, parDt) => {
        switch (data?.reportViewed) {
            case 'KPI': return <KpiDash widgetData={data} presentTabs={presentTabs} injectedData={parDt} injectedColumns={parClm} />;
            case 'Tabular': return <TabularDash widgetData={data} setWidgetData={setWidgetData} levelData={levelData} setLevelData={setLevelData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} injectedData={parDt} injectedColumns={parClm} />;
            case 'Graph': return <GraphDash widgetData={data} setWidgetData={setWidgetData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} injectedData={parDt} injectedColumns={parClm} />;
            case 'Iframe': return <IframeDash widgetData={data} />;
            case 'Other_Link': return <OtherLinkDash widgetData={data} />;
            case 'News_Ticker': return <NewsTickerDash widgetData={data} />;
            case 'Criteria_Map': return (
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <MapDash widgetData={data} setWidgetData={setWidgetData} />
                </div>
            );
            default: return null;
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                {/* {widgetData &&
                    <div className={`col-sm-${presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetWidth}`}
                        style={{
                            padding: "5px 3px"
                        }}>
                        {widgetData?.widgetType === "singleQueryParent" ? (
                            <>
                                {(() => {
                                    let childWidgets = [];
                                    try {
                                        const parsedChildren = JSON.parse(widgetData?.sqChildJsonString || '[]');
                                        const childIds = parsedChildren.map(child => String(child.SQCHILDWidgetId)).filter(Boolean);

                                        childWidgets = childIds
                                            .map(id => presentWidgets?.find(w => String(w.rptId) === id))
                                            .filter(Boolean); 
                                    } catch (err) {
                                        console.warn("Invalid sqChildJsonString:", err);
                                    }

                                    return childWidgets.map(child => (
                                        <div key={child.rptId} className={`col-sm-${presentTabs?.find(tab => tab.rptId == child.rptId)?.widgetWidth || 12}`}
                                            style={{ padding: "5px 3px" }}
                                        >
                                            {renderWidget(child)}
                                        </div>
                                    ));
                                })()}
                            </>
                        ) : (
                            <>
                                {renderWidget(widgetData)}
                            </>
                        )}


                    </div>
                } */}

                {widgetData && (
                    <>
                        {widgetData?.widgetType === "singleQueryParent" ? (
                            childWidgets.map(child => {
                                const childId = String(child.SQCHILDWidgetId);
                                const targetWidget = presentWidgets?.find(w => w.rptId == childId);
                                const widgetInfo = childWidgetDataMap[childId];

                                return (
                                    <div
                                        key={childId}
                                        className={`col-sm-${presentTabs?.find(tab => tab.rptId == childId)?.widgetWidth || 12}`}
                                        style={{ padding: "5px 3px" }}
                                    >
                                        {renderWidget(targetWidget, widgetInfo?.columns, widgetInfo?.data,)}
                                    </div>
                                );
                            })
                        ) : (
                            <div
                                className={`col-sm-${presentTabs?.find(tab => tab.rptId == widgetData?.rptId)?.widgetWidth || 12}`}
                                style={{ padding: "5px 3px" }}
                            >
                                {renderWidget(widgetData)}
                            </div>
                        )}
                    </>
                )}

                {/* Render linked widgets if available */}
                {linkedWidget && linkedWidget.map((id) => {

                    const linked = presentWidgets?.find(w => w.rptId === id);
                    return linked ?

                        <div className={`col-sm-${presentTabs?.filter(dt => dt?.rptId == linkedWidget[0])[0]?.widgetWidth}`}
                            style={{
                                padding: "5px 3px"
                            }}
                        >
                            {renderWidget(linked)}
                        </div>
                        : null;
                })}
            </>
        </Suspense>
    );
});

export default WidgetDash;
