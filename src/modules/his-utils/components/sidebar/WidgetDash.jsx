import React, { lazy, Suspense } from 'react'
import OtherLinkDash from './OtherLinkDash';
import NewsTickerDash from './NewsTickerDash';

const KpiDash = lazy(() => import('./KpiDash'));
const TabularDash = lazy(() => import('./TabularDash'));
const GraphDash = lazy(() => import('./GraphDash'));
const MapDash = lazy(() => import('./MapDash'));
const IframeDash = lazy(() => import('./IframeDash'));


const WidgetDash = React.memo(({ widgetDetail }) => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <>
                {widgetDetail?.reportViewed === 'KPI' && <KpiDash widgetData={widgetDetail} />}
                {widgetDetail?.reportViewed === 'Tabular' && <TabularDash widgetData={widgetDetail} />}
                {widgetDetail?.reportViewed === 'Graph' && <GraphDash widgetData={widgetDetail} />}
                {widgetDetail?.reportViewed === 'Iframe' &&
                    <IframeDash widgetData={widgetDetail} />
                }
                {widgetDetail?.reportViewed === 'Other_Link' &&
                    <OtherLinkDash widgetData={widgetDetail} />
                }
                {widgetDetail?.reportViewed === 'News_Ticker' &&
                    <NewsTickerDash widgetData={widgetDetail} />
                }

                {widgetDetail?.reportViewed === "Criteria_Map" &&
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <MapDash widgetData={widgetDetail} />
                    </div>
                }
            </>
        </Suspense>
    )
})

export default WidgetDash
