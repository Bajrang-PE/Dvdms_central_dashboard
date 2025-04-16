import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import KpiDash from './KpiDash';
import TabularDash from './TabularDash';
import GraphDash from './GraphDash';
import MapDash from './MapDash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { HISContext } from '../../contextApi/HISContext';
import { fetchQueryData } from '../../utils/commonFunction';


const WidgetDash = React.memo(({widgetDetail}) => {
    // const { widgetDetail } = props
    const { theme } = useContext(HISContext);
    const [graphData, setGraphData] = useState([]);

    // useEffect(() => {
    //     console.log(widgetDetail, 'bajrang')
    // }, [widgetDetail]) 


    return (

        <>
            {widgetDetail.reportViewed === 'KPI' && <KpiDash widgetData={widgetDetail}  />}
            {widgetDetail.reportViewed === 'Tabular' && <TabularDash widgetData={widgetDetail}  />}
            {widgetDetail.reportViewed === 'Graph' && <GraphDash widgetData={widgetDetail}  />}
            {widgetDetail.reportViewed === "Criteria_Map" &&
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <MapDash widgetData={widgetDetail} />
                </div>
            }
        </>

    )
})

export default WidgetDash
