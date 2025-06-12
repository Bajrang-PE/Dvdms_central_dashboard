import React, { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';
import FooterText from '../commons/FooterText';

const PdfDownload = lazy(() => import('../commons/PdfDownload'));
const Parameters = lazy(() => import('./Parameters'));

const TabDash = React.memo(({ tabData }) => {
    const { allWidgetData, setLoading, loading, activeTab, setParamsValues, presentWidgets, setPresentWidgets } = useContext(HISContext);
    const [presentTabs, setPresentTabs] = useState([]);
    const [widWithoutLinked, setWidWithoutLinked] = useState([]);

    const footerText = tabData?.jsonData?.footerText || "";

    useEffect(() => {
        if (tabData?.jsonData?.lstDashboardWidgetMapping?.length > 0) {
            setParamsValues({
                tabParams: {},
                widgetParams: {},
            })
            const widgetIds = tabData?.jsonData?.lstDashboardWidgetMapping;

            const sortedWidgets = [...widgetIds].sort((a, b) => parseInt(a.displayOrder) - parseInt(b.displayOrder));
            const availableWidgets = sortedWidgets
                ?.map(wid => allWidgetData?.find(widget => widget?.rptId == wid?.rptId))
                ?.filter(widget => widget);

            let finalWidgets = [];

            sortedWidgets?.forEach(wid => {
                const parentWidget = availableWidgets?.find(widget => widget?.rptId == wid?.rptId);
                if (parentWidget) {
                    finalWidgets?.push(parentWidget);
                    if (parentWidget?.linkedWidgetRptId) {
                        const linkedWidgetIds = parentWidget.linkedWidgetRptId?.split(',');
                        linkedWidgetIds?.forEach(linkedId => {
                            const linkedWidget = availableWidgets?.find(widget => widget?.rptId == linkedId);
                            if (linkedWidget) {
                                finalWidgets?.push(linkedWidget);
                            }
                        });
                    }
                }
            });

            let seen = new Set();
            let uniqueWidgets = finalWidgets?.filter(widget => {
                if (!seen.has(widget.rptId)) {
                    seen.add(widget.rptId);
                    return true;
                }
                return false;
            });


            uniqueWidgets?.forEach((parent) => {
                parent.children = uniqueWidgets
                    .filter((child) => child.parentReport === parent.rptId)
                    .map((child) => child.rptId);
            });

            const childWidgetIds = new Set(
                uniqueWidgets
                    .filter(widget => uniqueWidgets.some(parent => widget.parentReport === parent.rptId))
                    .map(widget => widget.rptId)
            );
            const allLinkedRptIds = new Set(
                uniqueWidgets
                    .flatMap(widget => widget?.linkedWidgetRptId?.split(',') || [])
                    ?.map(id => id?.trim())
                    ?.filter(Boolean)
            );


            const standaloneAndParentsOnly = uniqueWidgets?.filter(
                widget => !childWidgetIds.has(widget.rptId) && !allLinkedRptIds.has(widget.rptId)
            );

            setWidWithoutLinked(standaloneAndParentsOnly);
            setPresentWidgets(uniqueWidgets);
            setPresentTabs(sortedWidgets);
        } else {
            setPresentWidgets([]);
            setWidWithoutLinked([]);
            setParamsValues({
                tabParams: {},
                widgetParams: {},
            })
        }
    }, [tabData, allWidgetData]);

    return (
        <>
            {loading ? null : (
                <div>
                    {(activeTab?.jsonData?.docJsonString && JSON.parse(activeTab?.jsonData?.docJsonString)?.length > 0) && (
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

                    <h4 className='text-center'>{tabData?.jsonData?.dashboardName}</h4>

                    {activeTab?.jsonData?.allParameters && (
                        <div className='parameter-box'>
                            <Suspense
                                fallback={
                                    <div className="pt-3 text-center">
                                        Loading...
                                    </div>
                                }
                            >
                                <Parameters params={activeTab?.jsonData?.allParameters} dashFor={activeTab?.dashboardFor} scope={'tabParams'} />
                            </Suspense>
                        </div>
                    )}

                    <div className='row'>
                        {widWithoutLinked?.length > 0 && widWithoutLinked.map((widget, index) => (
                            <React.Fragment key={index}>
                                {widget &&
                                    <>
                                        {/* <div className={`col-sm-${presentTabs.filter(dt => dt?.rptId == widget?.rptId)[0]?.widgetWidth}`}
                                            style={{
                                                padding: "5px 3px"
                                            }}> */}
                                            <Suspense
                                                fallback={
                                                    <div className="pt-3 text-center">
                                                        Loading...
                                                    </div>
                                                }
                                            >
                                                <WidgetDash widgetDetail={widget} presentWidgets={presentWidgets} presentTabs={presentTabs} />
                                            </Suspense>
                                        {/* </div> */}
                                        {/* {widget?.linkedWidgetRptId && (
                                            <div className={`col-sm-${presentTabs.filter(dt => dt?.rptId == widget?.linkedWidgetRptId)[0]?.widgetWidth}`}
                                                style={{
                                                    padding: "5px 3px"
                                                }}
                                            >
                                                <Suspense fallback={<div className="pt-3 text-center">Loading...</div>}>
                                                    <WidgetDash widgetDetail={presentWidgets?.filter(dt => dt?.rptId == widget?.linkedWidgetRptId)[0]} />
                                                </Suspense>
                                            </div>
                                        )} */}
                                    </>
                                }
                            </React.Fragment>
                        ))
                        }
                    </div>
                    <FooterText footerText={footerText} />
                </div>
            )}

        </>
    );
});

export default TabDash;
