import React, { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';

const PdfDownload = lazy(() => import('../commons/PdfDownload'));
const Parameters = lazy(() => import('./Parameters'));

const TabDash = React.memo(({ tabData }) => {
    const { allWidgetData, setLoading, loading, activeTab, setParamsValues } = useContext(HISContext);
    const [presentWidgets, setPresentWidgets] = useState([]);
    const [presentTabs, setPresentTabs] = useState([]);

    const handleSetParamsValues = useCallback((values) => {
        setParamsValues(values);
    }, []);


    useEffect(() => {
        if (tabData?.jsonData?.lstDashboardWidgetMapping?.length > 0) {
            const widgetIds = tabData?.jsonData?.lstDashboardWidgetMapping;

            const sortedWidgets = [...widgetIds].sort((a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder));
            const availableWidgets = sortedWidgets
                .map(wid => allWidgetData.find(widget => widget?.rptId == wid?.rptId))
                .filter(widget => widget);

            let finalWidgets = [];

            sortedWidgets.forEach(wid => {
                const parentWidget = availableWidgets?.find(widget => widget?.rptId == wid?.rptId);
                if (parentWidget) {
                    finalWidgets.push(parentWidget);
                    if (parentWidget?.linkedWidgetRptId) {
                        const linkedWidgetIds = parentWidget.linkedWidgetRptId.split(',');
                        linkedWidgetIds.forEach(linkedId => {
                            const linkedWidget = availableWidgets?.find(widget => widget?.rptId == linkedId);
                            if (linkedWidget) {
                                finalWidgets.push(linkedWidget);
                            }
                        });
                    }
                }
            });

            let seen = new Set();
            let uniqueWidgets = finalWidgets.filter(widget => {
                if (!seen.has(widget.rptId)) {
                    seen.add(widget.rptId);
                    return true;
                }
                return false;
            });

            setPresentWidgets(uniqueWidgets);
            setPresentTabs(sortedWidgets)
        }
    }, [tabData, allWidgetData]);



    return (
        <>
            {loading ? null : (
                <div>
                    {activeTab?.jsonData?.docJsonString && (
                        <div className='help-docs'>
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        Loading...
                                    </div>
                                }
                            >
                            <PdfDownload docJsonString={activeTab?.jsonData?.docJsonString} />
                            </Suspense>
                        </div>
                    )}

                    {activeTab?.jsonData?.allParameters && (
                        <div className='parameter-box'>
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        Loading...
                                    </div>
                                }
                            >
                            <Parameters params={activeTab?.jsonData?.allParameters} dashFor={activeTab?.dashboardFor} setParamsValues={handleSetParamsValues} />
                            </Suspense>
                        </div>
                    )}

                    <div className='row'>
                        {presentWidgets?.length > 0 && presentWidgets.map((widget, index) => (
                            <React.Fragment key={index}>
                                {widget &&
                                    <div className={`col-sm-${presentTabs.filter(dt => dt?.rptId === widget?.rptId)[0]?.widgetWidth}`} style={{ padding: "5px 3px" }}>
                                        <Suspense
                                            fallback={
                                                <div className="pt-3 text-center">
                                                    Loading...
                                                </div>
                                            }
                                        >
                                            <WidgetDash widgetDetail={widget} />
                                        </Suspense>
                                    </div>
                                }
                            </React.Fragment>
                        ))
                        }
                    </div>
                </div>
            )}
        </>
    );
});

export default TabDash;
