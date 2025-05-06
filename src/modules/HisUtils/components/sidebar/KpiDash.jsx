import { faDownload, faMedkit } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import React, { useContext, useEffect, useState } from 'react'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { HISContext } from '../../contextApi/HISContext';
import { useLocation } from 'react-router-dom';
import { fetchProcedureData, fetchQueryData } from '../../utils/commonFunction';

const KpiDash = ({ widgetData }) => {
    const { setActiveTab, allTabsData, setLoading } = useContext(HISContext);
    const [kpiData, setKpiData] = useState([]);
    console.log(widgetData,'widgte')
    const fetchData = async (widget) => {
        if (widget?.modeOfQuery === "Procedure") {
            if (!widget?.procedureMode) return;
            try {
                const data = await fetchProcedureData(widget?.procedureMode);
                setKpiData(
                    data?.length > 0 && data?.map((item) => ({
                        name: item.column_1,
                        y: item.column_2,
                    })));
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        } else {
            if (!widget?.queryVO?.length > 0) return;
            try {
                const data = await fetchQueryData(widget?.queryVO);
                setKpiData(
                    data?.length > 0 && data?.map((item) => ({
                        name: item.column_1,
                        y: item.column_2,
                    })));
            } catch (error) {
                console.error("Error loading query data:", error);
            }
        }
    }

    useEffect(() => {
        if (widgetData) {
            fetchData(widgetData);
        }
    }, []);


    const getDynamicIcon = (iconName) => {
        if (!iconName) return SolidIcons.faMedkit;

        let formattedIconName = "fa" + iconName
            .replace("fa-", "")
            .replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        let iconKey = Object.keys(SolidIcons).find(key => key.toLowerCase() === formattedIconName.toLowerCase());
        if (!iconKey) {
            iconKey = Object.keys(SolidIcons).find(key => key.toLowerCase().includes(formattedIconName.toLowerCase().replace(/[^a-zA-Z]/g, "")));
        }
        return iconKey ? SolidIcons[iconKey] : SolidIcons.faMedkit;
    };

    const onHover = (e) => {
        e.currentTarget.style.backgroundColor = widgetData?.widgetHoverBackground || widgetData?.widgetBackgroundColour
    }
    const onMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = widgetData?.widgetBackgroundColour
    }

    const onKpiClickDetails = (id) => {
        const tabdt = allTabsData?.filter(tab => tab?.jsonData?.dashboardId === id)
        setActiveTab(tabdt[0])
        // console.log(, 'ids')
    }

    return (
        <div className='small-box-kpi' style={{
            backgroundColor: widgetData?.widgetBackgroundColour,
            height: "150px",
            color: widgetData?.widgetFontColour,
            borderWidth: widgetData?.kpiBorderWidth,
            borderColor: widgetData?.kpiBorderColor,
            borderStyle: 'solid',
            boxShadow: widgetData?.isWidgetShadowRequired === 'Yes' ? '5px 5px 10px rgba(0,0,0,0.2)' : 'none',
        }} onMouseEnter={onHover} onMouseLeave={onMouseLeave}>

            {widgetData?.downloadDataFromKPI === 'Yes' && (
                <div>
                    <button
                        aria-expanded="false"
                        data-bs-toggle="dropdown"
                        type="button"
                        className="small-box-btn-dwn dropdown-toggle"
                    // style={{ marginTop: '5px', marginRight: '10px', float: 'right', zIndex: 1040 }}
                    >
                        <FontAwesomeIcon icon={faDownload} className="me-2 dropdown-gear-icon" />
                    </button>

                    <ul className="dropdown-menu" style={{ position: 'absolute', left: '50px', top: '0', margin: '2px 100px 0px' }}>
                        <li>
                            <a
                                className="text-decoration-none"
                                style={{ cursor: 'pointer', color: '#000000', textShadow: 'none' }}
                            // id={`KPI_PDF_${widgetData.rptId}`} 
                            // onClick={() => downloadWidgetDataWithoutHTML(widgetData.rptId, 'PDF')}
                            >
                                <i className="fa fa-file-pdf"></i> &nbsp; Download PDF
                            </a>
                        </li>
                        <li>
                            <a
                                className="text-decoration-none"
                                style={{ cursor: 'pointer', color: '#000000', textShadow: 'none' }}
                            // id={`KPI_Excel_${widgetData.rptId}`} 
                            // onClick={() => downloadWidgetDataWithoutHTML(widgetData.rptId, 'EXCEL')}
                            >
                                <i className="fa fa-file-excel"></i> &nbsp; Download Excel
                            </a>
                        </li>
                    </ul>
                </div>
            )}
            <div className="kpi-details-box">
                <p className="sweet">
                    <b>{widgetData?.rptId}:{widgetData?.rptName}</b>
                </p>
                <h4 style={{ marginTop: "5px" }}>State : Rajasthan</h4>
                <div style={{ borderBottom: "1px solid #525252", marginTop: "5px", marginBottom: "5px" }}></div>
                <span className="sweet"><b>Value : 4 Lakh</b></span>

                {(widgetData?.onClickOfKPITabId !== '0' && widgetData?.onClickOfKPITabId !== '') &&
                    <div className='small-box-kpi-link-dtl' style={{ color: widgetData?.kpiLinkFontColor }} onClick={() => onKpiClickDetails(widgetData?.onClickOfKPITabId)}>
                        <span>{widgetData?.linkTab || 'Click For Details'}</span>
                        <b><FontAwesomeIcon icon={faSearch} /></b>
                    </div>
                }
            </div>
            {widgetData?.iconType !== 'NOICON' &&
                <div className="small-box-icon kpi-icon-img">
                    {widgetData?.iconType === 'IMAGE' ?
                        <img src="https://uatcdash.dcservices.in/HISUtilities/dashboard/images/Icon_images/default-icon.png" alt="image" className='dropdown-gear-icon' />
                        :
                        <FontAwesomeIcon icon={getDynamicIcon(widgetData?.iconName)} color={widgetData?.widgetIconColour} />
                    }
                    {/* <i className='fa fa-balance-scale'></i> */}
                </div>
            }
            <a href="#" className="small-box-footer" style={{ display: 'none' }}>
                More info <i className="fa fa-search"></i>
            </a>
        </div>
    )
}

export default KpiDash
