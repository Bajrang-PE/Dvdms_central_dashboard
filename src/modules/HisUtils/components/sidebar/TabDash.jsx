import React, { useCallback, useContext, useEffect, useState } from 'react';
import WidgetDash from './WidgetDash';
import { HISContext } from '../../contextApi/HISContext';
import Parameters from './Parameters';
import PdfDownload from '../commons/PdfDownload';
import MapDash from './MapDash';

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


console.log('gggggggggggggggggg',allWidgetData)
    return (
        <>
            {loading ? null : (
                <div>
                    {activeTab?.jsonData?.docJsonString && (
                        <div className='help-docs'>
                            <PdfDownload docJsonString={activeTab?.jsonData?.docJsonString} />
                        </div>
                    )}

                    {activeTab?.jsonData?.allParameters && (
                        <div className='parameter-box'>
                            <Parameters params={activeTab?.jsonData?.allParameters} dashFor={activeTab?.dashboardFor} setParamsValues={handleSetParamsValues} />
                        </div>
                    )}

                    <div className='row'>
                        {presentWidgets?.length > 0 && presentWidgets.map((widget, index) => (
                            <React.Fragment key={index}>
                                {widget &&
                                    <div className={`col-sm-${presentTabs.filter(dt => dt?.rptId === widget?.rptId)[0]?.widgetWidth}`} style={{ padding: "5px 3px" }}>
                                        <WidgetDash widgetDetail={widget} />
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
