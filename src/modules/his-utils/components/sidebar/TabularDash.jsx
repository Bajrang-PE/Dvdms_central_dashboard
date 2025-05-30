import React, { lazy, useCallback, useContext, useEffect, useState } from "react";
import Tabular from "./Tabular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft, faCog, faFileExcel, faFilePdf, faRefresh, faSortAmountDesc } from "@fortawesome/free-solid-svg-icons";
import { fetchProcedureData, fetchQueryData, formatParams } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import InputField from "../commons/InputField";
import { generateCSV, generatePDF } from "../commons/advancedPdf";
import { getAuthUserData } from "../../../../utils/CommonFunction";

const Parameters = lazy(() => import('./Parameters'));

const TabularDash = ({ widgetData }) => {

  const { theme, singleConfigData, paramsValues, setLoading, setParamsValues, isSearchQuery, setIsSearchQuery } = useContext(HISContext);
  const [tableData, setTableData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState("state");
  const [currentData, setCurrentData] = useState('');
  const [previousData, setPreviousData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filterData, setFilterData] = useState(tableData)


  const [columns, setColumns] = useState([]);

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


  const handleBack = useCallback(() => {
    if (previousData.length > 0) {
      const lastState = previousData.pop();
      setCurrentLevel(lastState.level);
      setCurrentData(lastState.data);
      setPreviousData([...previousData]);
    }
  }, [previousData]);

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
  const generateColumns = (data, ifDrill) => {
    if (!data || data.length === 0) return [];

    const keys = Object.keys(data[0]);

    const reorderedKeys = [
      ...keys.filter(k => /state/i.test(k)),
      ...keys.filter(k => !/state/i.test(k))
    ];

    const dynamicColumns = reorderedKeys.map((key) => ({
      name: key,
      selector: row => row[key],
      sortable: true,
      wrap: true,
      cell: key.toLowerCase().includes("state")
        ? row => (
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => console.log(row)}
          >
            {row[key]?.split('##')[0]}
          </span>
        )
        : undefined
    }));

    if (ifDrill) {
      const drillColumn = {
        name: "Action",
        cell: (row) => (
          <button
            className="rounded-4 border-1"
            onClick={() => alert('bg')}
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
        const paramVal = formatParams(paramsValues ? paramsValues : null, widgetData?.rptId || '');

        const params = [
          getAuthUserData('hospitalCode')?.toString(), //hospital code===
          "10001", //user id===
          "", //primary key
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
        const generatedColumns = generateColumns(formattedData, true);
        setColumns(generatedColumns);
        setTableData(formattedData);
        setLoading(false)
       setIsSearchQuery(false)
      } catch (error) {
        console.error("Error loading query data:", error);
        setLoading(false)
      }
    } else {
      // if (!widget?.queryVO?.length > 0) return;
      try {
        const data = await fetchQueryData(widget?.query?.length > 0 ? widget?.query : widget?.queryVO, widget?.JNDIid);
        if (data?.length > 0) {
          const formattedData = formatData(data); // if you want to keep formatting consistent
          const generatedColumns = generateColumns(formattedData, true);

          setColumns(generatedColumns);
          setTableData(formattedData);
          setLoading(false)
          setIsSearchQuery(false)
        } else {
          setColumns([]);
          setTableData([]);
        }
      } catch (error) {
        console.error("Error loading query data:", error);
      }
    }
  }

  console.log(paramsValues, 'paramsValues2')

  useEffect(() => {
    if (widgetData) {
      fetchData(widgetData);
    }
  }, [widgetData,paramsValues]);

  useEffect(() => {
    if (isSearchQuery && widgetData && paramsValues) {
      fetchData(widgetData);
    }
  }, [isSearchQuery]);

  const headingAlign = widgetData?.tableHeadingAlignment === '1' ? 'center' : 'left';
  const borderReq = widgetData?.isTableBorderRequired || '';
  const headingReq = widgetData?.tableHeadingRequired === 'yes' || widgetData?.tableHeadingRequired === 'Yes';
  const headingBgClr = widgetData?.headingBackgroundColour || '#000000';
  const headingFontClr = widgetData?.headingFontColour || '#ffffff';
  const widgetHeadingColor = widgetData?.widgetHeadingColor || '#ffffff';
  const isPaginationReq = widgetData?.isPaginationReq === 'Yes' ? true : false;
  const isIndexNoReq = widgetData?.isIndexNumberRequired === 'Yes' ? true : false;
  const isDataSearchReq = widgetData?.isDataSearchReq === 'Yes' ? true : false;
  const isHeadingFixed = widgetData?.isHeadingFixed === 'Yes' ? true : false;
  const recordPerPage = widgetData?.recordPerPage || 5;
  const scrollHeight = widgetData?.scrollYValue || "500";
  const isDirectDownloadRequired = widgetData?.isDirectDownloadRequired || 'No';
  const paramsData = widgetData.selFilterIds || "";
  const footerText = widgetData.footerText || "";
  const widgetTopMargin = widgetData.widgetTopMargin || "";
  const initialRecord = widgetData?.initialRecordNo;
  const finalRecord = widgetData?.finalRecordNo;

  const widgetLimit = widgetData?.limitHTMLFromDb || ''
  const defLimit = singleConfigData?.databaseConfigVO?.setDefaultLimit || ''
  const parsedLimit = parseInt(defLimit, 10);
  const safeLimit = parsedLimit ? parsedLimit : '';

  const mainQuery = widgetData?.query && widgetData?.query?.length > 0 ? widgetData?.query[0]?.mainQuery : widgetData?.queryVO && widgetData?.queryVO?.length > 0 ? widgetData?.queryVO[0]?.mainQuery : ''

  // const columns = useMemo(() => {
  //   const srNoColumn = isIndexNoReq
  //     ? [{ name: 'Sr.No.', selector: (row, index) => index + 1 }]
  //     : [];
  //   if (currentLevel === "state") {
  //     return [

  //       ...srNoColumn,
  //       {
  //         name: "Action",
  //         cell: (row) => (
  //           <button className="rounded-4 border-1" onClick={() => handleStateClick(row.id)}>
  //             <FontAwesomeIcon icon={faSortAmountDesc} />
  //           </button>
  //         ),
  //       },
  //       { name: "State Name", selector: (row) => row.name, sortable: true },
  //     ];
  //   } else if (currentLevel === "district") {
  //     return [
  //       ...srNoColumn,
  //       {
  //         name: "Action",
  //         cell: (row) => (
  //           <button className="rounded-4 border-1" onClick={() => handleDistrictClick(row.id)}>
  //             <FontAwesomeIcon icon={faSortAmountDesc} />
  //           </button>
  //         ),
  //       },
  //       { name: "District Name", selector: (row) => row.name, sortable: true },
  //     ];
  //   } else {
  //     return [
  //       ...srNoColumn,
  //       { name: "Hospital Name", selector: (row) => row.name, sortable: true }
  //     ];
  //   }
  // }, [currentLevel, handleStateClick, handleDistrictClick]);


  return (
    <div className={`tabular-box ${theme === 'Dark' ? 'dark-theme' : ''} tabular-box-border ${borderReq === 'No' ? '' : 'tabular-box-border'}`} style={{ border: `1px solid ${theme === 'Dark' ? 'white' : 'black'}` }}>

      <div className="row px-2 py-2 border-bottom" style={{ textAlign: headingAlign, color: widgetHeadingColor }} >
        {headingReq &&
          <div className={` ${isDirectDownloadRequired === 'Yes' ? 'col-md-7' : 'col-md-12'} fw-medium fs-6`} >{widgetData?.rptDisplayName}</div>
        }
        {isDirectDownloadRequired === 'Yes' &&
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
            {currentLevel !== "state" && (
              <button className="small-box-btn-dwn" onClick={() => handleBack()}>
                <FontAwesomeIcon icon={faArrowCircleLeft} />
              </button>
            )}
          </div>
        }

      </div>
      <div className="px-2 py-2" style={{ marginTop: `${widgetTopMargin}px` }}>
        <h4 style={{ fontWeight: "500", fontSize: "20px" }}>Query : {widgetData?.rptId}</h4>
        {widgetData?.modeOfQuery === 'Query' &&
          <span>{mainQuery}</span>
        }
        {widgetData?.modeOfQuery === "Procedure" &&
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

      <Tabular
        columns={columns}
        data={widgetLimit ? filterData?.slice(0, parseInt(widgetLimit)) : safeLimit ? filterData?.slice(0, safeLimit) : filterData}
        pagination={isPaginationReq}
        recordsPerPage={recordPerPage}
        fixedHeader={isHeadingFixed}
        scrollHeight={scrollHeight}
        headingFontColor={headingFontClr || "#ffffff"}
        headingBgColor={headingBgClr || "#000000"}
        headingAlignment={headingAlign}
        recordsPerPageOptions={[recordPerPage, 10, 20, 50]}
        isTableHeadingRequired={!headingReq}
        theme={theme}
      />

      {footerText !== '' &&
        <div className="px-2 py-2">
          <span>{footerText}</span>
        </div>
      }
    </div>
  );
};
export default TabularDash;
