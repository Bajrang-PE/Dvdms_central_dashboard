import React, { lazy, Suspense, useCallback, useContext, useEffect, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';
import FooterText from '../commons/FooterText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBackward } from '@fortawesome/free-solid-svg-icons';

const PdfDownload = lazy(() => import('../commons/PdfDownload'));
const Parameters = lazy(() => import('./Parameters'));

const TabDash = React.memo(() => {
    const { allWidgetData, setLoading, loading, activeTab, setParamsValues, presentWidgets, setPresentWidgets, prevKpiTab, setActiveTab, setPrevKpiTab } = useContext(HISContext);
    const [presentTabs, setPresentTabs] = useState([]);
    const [widWithoutLinked, setWidWithoutLinked] = useState([]);

    const footerText = activeTab?.jsonData?.footerText || "";

    useEffect(() => {
        if (activeTab?.jsonData?.lstDashboardWidgetMapping?.length > 0) {
            setLoading(true)
            setParamsValues({
                tabParams: {},
                widgetParams: {},
            })
            const widgetIds = activeTab?.jsonData?.lstDashboardWidgetMapping;

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
                widget => !childWidgetIds.has(widget.rptId)
                    && !allLinkedRptIds.has(widget.rptId)
                    && widget.widgetType !== "singleQueryChild"
            );

            setWidWithoutLinked(standaloneAndParentsOnly);
            setPresentWidgets(uniqueWidgets);
            setPresentTabs(sortedWidgets);
            setLoading(false)
        } else {
            setPresentWidgets([]);
            setWidWithoutLinked([]);
            setParamsValues({
                tabParams: {},
                widgetParams: {},
            })
            setLoading(false)
        }
    }, [activeTab, allWidgetData]);

    const onPrevClick = () => {
        setActiveTab(prevKpiTab[0])
        setPrevKpiTab([])
    }

    console.log(activeTab, 'activetab')
    console.log(presentWidgets, 'presentWidgets')

    return (
        <>
            {loading ? null : (
                <div>
                    {prevKpiTab?.length > 0 &&
                        <div className=''>
                            <button className='btn btn-sm me-1 back-button-kpi' onClick={onPrevClick}>
                                <FontAwesomeIcon icon={faArrowLeft}
                                    className="me-1" />Back</button>
                        </div>
                    }
                    {(activeTab?.jsonData?.docJsonString && JSON.parse(activeTab?.jsonData?.docJsonString)?.length > 0) && (
                        <>

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
                        </>
                    )}

                    <h4 className='text-center'>{activeTab?.jsonData?.dashboardName}</h4>

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
                                        <Suspense
                                            fallback={
                                                <div className="pt-3 text-center">
                                                    Loading...
                                                </div>
                                            }
                                        >
                                            <WidgetDash widgetDetail={widget} presentWidgets={presentWidgets} presentTabs={presentTabs} />
                                        </Suspense>
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
