import React, { lazy, Suspense, useEffect, useState } from 'react';
import OtherLinkDash from './OtherLinkDash';
import NewsTickerDash from './NewsTickerDash';

const KpiDash = lazy(() => import('./KpiDash'));
const TabularDash = lazy(() => import('./TabularDash'));
const GraphDash = lazy(() => import('./GraphDash'));
const MapDash = lazy(() => import('./MapDash'));
const IframeDash = lazy(() => import('./IframeDash'));

const WidgetDash = React.memo(({ widgetDetail, presentWidgets, presentTabs, pk }) => {

    const [widgetData, setWidgetData] = useState({});
    const [linkedWidget, setLinkedWidget] = useState();
    const [pkColumn, setPkColumn] = useState('');
    const [levelData, setLevelData] = useState([]);

    const handleSetPkColumn = (val) => {
        setPkColumn(val)
    }

    useEffect(() => {
        if (pk && pk !== '') {
            handleSetPkColumn(pk)
        }
    }, [pk])

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


    const renderWidget = (data) => {
        switch (data?.reportViewed) {
            case 'KPI': return <KpiDash widgetData={data} presentTabs={presentTabs} />;
            case 'Tabular': return <TabularDash widgetData={data} setWidgetData={setWidgetData} levelData={levelData} setLevelData={setLevelData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} />;
            case 'Graph': return <GraphDash widgetData={data} setWidgetData={setWidgetData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} />;
            case 'Iframe': return <IframeDash widgetData={data} />;
            case 'Other_Link': return <OtherLinkDash widgetData={data} />;
            case 'News_Ticker': return <NewsTickerDash widgetData={data} />;
            case 'Criteria_Map': return (
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <MapDash widgetData={data} setWidgetData={setWidgetData} pkColumn={pkColumn} setPkColumn={handleSetPkColumn} levelData={levelData} setLevelData={setLevelData}/>
                </div>
            );
            default: return null;
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                {widgetData &&
                    <div className={`col-sm-${presentTabs?.filter(dt => dt?.rptId == widgetData?.rptId)[0]?.widgetWidth}`}
                        style={{
                            padding: "5px 3px"
                        }}>
                        {/* {widgetData?.widgetType === "singleQueryParent" ?

                        <h1>Hi BG</h1>
                        :
                        <> */}
                        {renderWidget(widgetData)}
                        {/* </>
                    } */}

                    </div>
                }
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
