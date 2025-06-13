import React, { lazy, useContext, useEffect, useState } from "react";
import Tabular from "./Tabular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faCog, faFileExcel, faFilePdf, faRefresh, faSortAmountDesc, faTableCells } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData, formatParams, getOrderedParamValues, ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import { generateCSV, generatePDF } from "../commons/advancedPdf";
import { getAuthUserData } from "../../../../utils/CommonFunction";
import { useSearchParams } from "react-router-dom";

const Parameters = lazy(() => import('./Parameters'));

const TabularDash = (props) => {

  const { widgetData, setWidgetData, levelData, setLevelData, pkColumn, setPkColumn } = props;

  const { theme, singleConfigData, paramsValues, setLoading, presentWidgets, isSearchQuery, setIsSearchQuery } = useContext(HISContext);

  const [tableData, setTableData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [filterData, setFilterData] = useState(tableData)
  const [columns, setColumns] = useState([]);
  const [fetching, setFetching] = useState(false);


  const [queryParams] = useSearchParams();
  const isPrev = queryParams.get('isPreview');

  const isChildPresent = widgetData?.children && widgetData?.children?.length > 0;
  const childId = widgetData?.children?.length > 0 ? widgetData?.children[0] : '';

  useEffect(() => {
    setTableData([])
  }, [widgetData])

  //parameter search
  useEffect(() => {
    if (!searchInput) {
      setFilterData(tableData);
    } else {
      const lowercasedText = searchInput.toLowerCase();

      const newFilteredData = tableData?.length > 0 && tableData?.filter(row => {
        return Object.values(row)?.some(val =>
          val?.toString()?.toLowerCase()?.includes(lowercasedText)
        );
      });

      setFilterData(newFilteredData);
    }
  }, [searchInput, tableData]);

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

  const getFirstValue = (val) => {
    return typeof val === 'string' && val.includes('##') ? val.split('##')[0] : val;
  };

  const generateColumns = (data, ifDrill = isChildPresent) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);

    const reorderedKeys = [
      ...keys.filter(k => /state/i.test(k)),
      ...keys.filter(k => !/state/i.test(k))
    ];

    const dynamicColumns = reorderedKeys.map((key) => ({
      name: key,
      selector: row => getFirstValue(row[key]),
      sortable: true,
      wrap: true,
      cell: key.toLowerCase().includes("state")
        ? row => (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => console.log(row[key], 'bgrow')}
          >
            {getFirstValue(row[key])}
          </span>
        )
        : row => <span>{getFirstValue(row[key])}</span>
    }));

    if (ifDrill) {
      const drillColumn = {
        name: "Action",
        cell: (row) => (
          <button
            className="rounded-4 border-1"
            onClick={() => onDrillDown(row?.pkcolumn)}
          >
            <FontAwesomeIcon icon={faSortAmountDesc} />
          </button>
        )
      };
      return [drillColumn, ...dynamicColumns];
    }

    return dynamicColumns;
  };

  const fetchData = async (widget) => {

    if (widget?.modeOfQuery === "Procedure") {
      if (!widget?.procedureMode) return;
      try {
        setFetching(true)
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');

        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          pkColumn ? pkColumn?.toString() : '', //primary key
          paramVal.paramsId || "", //parameter ids
          paramVal.paramsValue || "", //parameter values
          isPaginationReq?.toString(), //is pagination required===
          initialRecord?.toString(), //initial record no.===
          finalRecord?.toString(), //final record no.===
          "", //date options
          "16-Apr-2025",//from values
          "16-Apr-2025" // to values
        ]
        const response = await fetchProcedureData(widget?.procedureMode, params, widget?.JNDIid);
        const formattedData = formatData(response.data || []);
        const generatedColumns = generateColumns(formattedData, isChildPresent);
        setColumns(generatedColumns);
        setTableData(formattedData);
        setLoading(false)
        setIsSearchQuery(false)
        setFetching(false)
      } catch (error) {
        console.error("Error loading query data:", error);
        setLoading(false)
        setFetching(false)
      }
    } else {
      if (!widget?.queryVO?.length > 0) return;
      const params = getOrderedParamValues(widget?.queryVO[0]?.mainQuery, paramsValues, widget?.rptId);

      try {
        setFetching(true)
        const data = await fetchQueryData(widget?.queryVO?.length > 0 ? widget?.queryVO : [], widget?.JNDIid, params);
        if (data?.length > 0) {
          const formattedData = formatData(data); // if you want to keep formatting consistent
          const generatedColumns = generateColumns(formattedData, isChildPresent);
          setColumns(generatedColumns);
          setTableData(formattedData);
          setLoading(false)
          setIsSearchQuery(false)
          setFetching(false)
        } else {
          setColumns([]);
          setTableData([]);
          setFetching(false)
        }
      } catch (error) {
        console.error("Error loading query data:", error);
        setFetching(false)
      }
    }
  }

  useEffect(() => {
    if (widgetData) {
      fetchData(widgetData);
    }
  }, [widgetData, paramsValues]);

  useEffect(() => {
    if (isSearchQuery && widgetData && paramsValues) {
      fetchData(widgetData);
    }
  }, [isSearchQuery]);

  const headingAlign = widgetData?.headingAlign === '1' ? 'center' : 'left';
  const headingAlignTable = widgetData?.tableHeadingAlignment === '1' ? 'center' : 'left';
  const borderReq = widgetData?.isTableBorderRequired || '';
  const headingReq = widgetData?.tableHeadingRequired === 'yes' || widgetData?.tableHeadingRequired === 'Yes';
  const headingBgClr = widgetData?.headingBackgroundColour || '#000000';
  const headingFontClr = widgetData?.headingFontColour || '#000000';
  const widgetHeadingColor = widgetData?.widgetHeadingColor || '#000000';
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
  const isIndexNoReq = widgetData?.isIndexNumberRequired === 'Yes' ? true : false;
  const isDataSearchReq = widgetData?.isDataSearchReq === 'Yes' ? true : false;
  const isHeadingFixed = widgetData?.isHeadingFixed === 'Yes' ? true : false;
  const recordPerPage = widgetData?.recordPerPage || 5;
  const scrollHeight = widgetData?.scrollYValue || "500";
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'No';
  const isActionButtonReq = widgetData?.isActionButtonReq || 'No';
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = parsedLimit ? parsedLimit : '';

  const mainQuery = widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''

  const customMessage = widgetData?.customMessage || "";


  const onDrillDown = (pkCol) => {
    if (isChildPresent && childId) {
      setPkColumn(pkCol)
      setCurrentLevel(currentLevel + 1)
      const widgetDetail = presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childId)[0]
      setWidgetData(widgetDetail)
      setLevelData(prevLevelData => [
        ...prevLevelData,
        {
          'rptId': widgetDetail?.rptId,
          'rptName': widgetDetail?.rptName,
          'rptLevel': currentLevel + 1,
          'pkclm': pkCol
        }
      ]);
    } else {
      ToastAlert('No child available', 'warning')
    }
  }


  const backToParentWidget = (id) => {
    if (levelData?.length > 1 && currentLevel !== 0) {
      let targetLevel = null;
      let widgetDetail = null;
      let pkClm = '';

      if (id) {
        const targetItem = levelData.find(dt => dt.rptId === id);
        pkClm = targetItem?.pkclm
        if (targetItem) {
          targetLevel = targetItem.rptLevel;
          widgetDetail = presentWidgets?.find(dt => dt?.rptId == id);
        }
      } else {
        targetLevel = currentLevel - 1;
        const parentItem = levelData.find(dt => dt.rptLevel === targetLevel);
        pkClm = parentItem?.pkclm
        widgetDetail = presentWidgets?.find(dt => dt?.rptId == parentItem?.rptId);
      }

      if (widgetDetail && targetLevel !== null) {
        setWidgetData(widgetDetail);
        setCurrentLevel(targetLevel);
        setPkColumn(pkClm)
        const restLevels = levelData.filter(dt => dt.rptLevel <= targetLevel);
        setLevelData(restLevels);
      }
    }
  }


  return (
    <>
      {/* {currentLevel == 0 && */}
      <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>

        <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
          {headingReq &&
            <div className={` ${isActionButtonReq === 'Yes' ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{widgetData?.rptName}</div>
          }
          {isActionButtonReq === 'Yes' &&
            <div className="col-md-5">
              <button
                type="button"
                className="small-box-btn-dwn"
                aria-expanded="false"
                data-bs-toggle="dropdown"
              >
                <FontAwesomeIcon icon={faCog} className="dropdown-gear-icon" />
              </button>
              <ul className="dropdown-menu p-2">
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => fetchData(widgetData)}>
                  <FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-2" />Refresh Data
                </li>
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generatePDF(widgetData, widgetLimit ? filterData.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData.slice(0, safeLimit) : filterData, singleConfigData?.databaseConfigVO)} title="pdf">
                  <FontAwesomeIcon icon={faFilePdf} className="dropdown-gear-icon me-2" />Download PDF
                </li>
                <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }} onClick={() => generateCSV(widgetData, widgetLimit ? filterData.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData.slice(0, safeLimit) : filterData, singleConfigData?.databaseConfigVO)}>
                  <FontAwesomeIcon icon={faFileExcel} className="dropdown-gear-icon me-2" />Download CSV
                </li>
                {/* <li className="p-1 dropdown-item text-primary" style={{ cursor: "pointer" }}>
                <FontAwesomeIcon icon={faBarChart} className="dropdown-gear-icon me-2" />Outliers
              </li> */}
              </ul>

              <button className="small-box-btn-dwn" onClick={() => generatePDF(widgetData, filterData, singleConfigData?.databaseConfigVO)} title="PDF">
                <FontAwesomeIcon icon={faFilePdf} />
              </button>

              <button className="small-box-btn-dwn" onClick={() => generateCSV(widgetData, filterData, singleConfigData?.databaseConfigVO)}>
                <FontAwesomeIcon icon={faFileExcel} />
              </button>

              {currentLevel !== 0 && (
                <>
                  <button className="small-box-btn-dwn" onClick={() => backToParentWidget()}>
                    <FontAwesomeIcon icon={faArrowCircleLeft} />
                  </button>

                  <div className="nav-item dropdown" >
                    <button className="small-box-btn-dwn nav-link" data-bs-toggle="dropdown">
                      <FontAwesomeIcon icon={faTableCells} />
                    </button>

                    <ul className="dropdown-menu dropdown-menu-start" >
                      {levelData?.length > 0 && levelData
                        ?.filter((level, index) => {
                          const maxLevel = Math.max(...levelData.map(l => l.rptLevel));
                          return level.rptLevel !== maxLevel;
                        })
                        ?.map((level, index) => (
                          <li className="dropdown-item pointer text-primary p-1" style={{ whiteSpace: "normal", wordBreak: "break-word" }} key={index} onClick={() => backToParentWidget(level?.rptId)}>
                            {level?.rptName}
                          </li>
                        ))}
                    </ul>
                  </div>
                </>
              )}

            </div>
          }

        </div>
        <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
          <h4 style={{ fontWeight: "500", fontSize: "20px" }}>Query : {widgetData?.rptId}</h4>
          {(widgetData?.modeOfQuery === 'Query' && isPrev == 1) &&
            <span>{mainQuery}</span>
          }
          {(widgetData?.modeOfQuery === "Procedure" && isPrev == 1) &&
            <span>{widgetData?.procedureMode}</span>
          }
          {isDataSearchReq &&
            <div className="d-flex align-items-center">
              <label className="col-form-label me-2">Search :</label>
              <div className=''>
                <InputField
                  type="search"
                  id="customMsgForNoData"
                  name="customMsgForNoData"
                  placeholder="Enter"
                  className={`${theme === 'Dark' ? 'backcolorinput-dark' : 'backcolorinput'}`}
                  onChange={(e) => { setSearchInput(e?.target?.value); }}
                />
              </div>
            </div>
          }
        </div>

        {paramsData && (
          <div className='parameter-box'>
            <Parameters params={paramsData} scope={'widgetParams'} widgetId={widgetData?.rptId} />
          </div>
        )}

        {fetching

          ?
          <>
            <h6 className="text-center">Data Fetching...</h6>
          </>

          :
          <Tabular
            columns={columns}
            data={widgetLimit ? filterData?.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData?.slice(0, safeLimit) : filterData}
            pagination={isPaginationReq}
            recordsPerPage={recordPerPage}
            fixedHeader={isHeadingFixed}
            scrollHeight={scrollHeight}
            headingFontColor={headingFontClr || "#ffffff"}
            headingBgColor={headingBgClr || "#000000"}
            headingAlignment={headingAlignTable}
            recordsPerPageOptions={[recordPerPage, 10, 20, 50]}
            isTableHeadingRequired={!headingReq}
            theme={theme}
            noDataComponent={<div className="text-danger fw-bold fs-13">{customMessage || "There are no records to display"}</div>}
          />

        }

        {footerText && footerText.trim() !== '' && (
          <>
            <h6 className='header-devider mt-2 mb-0'></h6>
            <div className="px-2 py-2">
              <span style={{ fontSize: '12px' }}>{footerText}</span>
            </div>
          </>
        )}

      </div>
      {/* } */}
      {/* {(childIdShow && currentLevel !== 0) &&
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              Loading...
            </div>
          }
        >
          <WidgetDash widgetDetail={presentWidgets?.length > 0 && presentWidgets?.filter(dt => dt?.rptId == childIdShow)[0]} presentWidgets={presentWidgets} />
        </Suspense>
      } */}
    </>
  );
};
export default TabularDash;
