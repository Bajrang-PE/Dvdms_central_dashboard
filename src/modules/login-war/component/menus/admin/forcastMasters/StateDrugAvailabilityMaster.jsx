import React, { useContext, useEffect, useMemo, useState } from "react";
import InputSelect from "../../../InputSelect";
import GlobalTable from "../../../GlobalTable";
import { capitalizeFirstLetter, formatDate1, ToastAlert } from "../../../../utils/CommonFunction";
import "./StateDrugAvailabilityMaster.css";
import GlobalTableModal from "../../TableModal";
import { LoginContext } from "../../../../context/LoginContext";
import { fetchData, fetchDataUnEnc, fetchPatchData, fetchPostData } from "../../../../../../utils/ApiHooks";
import MasterReport from "../../../MasterReport";
import SpinLoader from "../../../Spinner";
import DatePicker from "react-datepicker";
import InputDrpSelect from "../../../InputDrpSelect";
import TableWithAccoidion from "./TableWithAccoidion";
import InputField from "../../../InputField";
import { formatDateHmis, formatDateHmisForecast } from "../../../../../../utils/CommonFunction";

const createDynamicColumns = (data = [], firstColumns = []) => {
    if (!Array.isArray(data) || !data.length) {
        return [];
    }

    const keys = [
        ...new Set(
            data.flatMap(item => Object.keys(item))
        )
    ];

    // Keep requested columns first
    const orderedKeys = [
        ...firstColumns.filter(key => keys.includes(key)),
        ...keys.filter(key => !firstColumns.includes(key))
    ];

    return orderedKeys.map(key => ({
        name: key,
        selector: row => {
            const value = row?.[key];
            if (value === null || value === undefined || value === "") {
                return "-";
            }
            if (typeof value === "boolean") {
                return value ? "true" : "false";
            }
            return value;
        },
        sortable: true,
        wrap: true
    }));
};

const StateDrugAvailabilityMaster = () => {

    const { getSteteNameDrpData, stateNameDrpDt, openPage, setOpenPage, isShowReport } = useContext(LoginContext);

    const [selectedState, setSelectedState] = useState("");
    const [startYear, setStartYear] = useState(new Date(2020, 0, 1));
    const [endYear, setEndYear] = useState(new Date());
    const [yearCount, setYearCount] = useState("");
    const [selectedDrug, setSelectedDrug] = useState("");
    const [yearSummary, setYearSummary] = useState([]);
    const [drugList, setDrugList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [facilityLoading, setFacilityLoading] = useState(false);
    const [impMonths, setImpMonths] = useState("10");

    // FOR FORECAST
    const [facilityTypesDrpDt, setFacilityTypesDrpDt] = useState([]);
    const [facilityTypeId, setFacilityTypeId] = useState('');
    const [forecastMonth, setForecastMonth] = useState(new Date());
    const [nextMonthsHorizon, setNextMonthsHorizon] = useState(12);
    const [trainStartDate, setTrainStartDate] = useState(new Date());
    const [forecastLoading, setForecastLoading] = useState(false);
    const [forecastData, setForecastData] = useState();


    const [viewDrugList, setViewDrugList] = useState(false);
    const [drugCountData, setDrugCountData] = useState([]);

    const [rptClm, setRptClm] = useState([]);
    const [rptData, setRptData] = useState([]);

    const currentYear = new Date().getFullYear();

    const yearCountList = [
        { value: 1, label: "For One Year" },
        { value: 2, label: "For Two Year" },
        { value: 3, label: "For Three Year" },
        { value: 4, label: "For Four Year" },
        { value: 5, label: "For Five Year" },
        { value: 6, label: "For Six Year" },
        { value: 7, label: "For Seven Year" }
    ]

    useEffect(() => {
        getSteteNameDrpData();
    }, []);

    useEffect(() => {
        if (selectedState) {
            const stY = startYear?.getFullYear();
            const enY = endYear?.getFullYear();
            getYearSummary(selectedState, stY, enY)
            setDrugList([]);
            setFacilityList([]);
            setSelectedDrug("");
        } else {
            setYearSummary([]);
            setDrugList([]);
            setFacilityList([]);
            setSelectedDrug("");
        }

    }, [selectedState, startYear, endYear])


    useEffect(() => {
        if (yearCount && yearSummary && yearSummary?.buckets?.length > 0) {
            const item = yearSummary?.buckets?.find(dt => dt?.complete_years == yearCount);
            const itemList = item?.itembrands ? item?.itembrands?.map((data) => ({
                value: data?.itembrand_id,
                label: data?.cwhstr_drugname
            })) : [];
            setDrugList(itemList);
            setFacilityList([]);
            setSelectedDrug("");
        } else {
            setDrugList([]);
            setFacilityList([]);
            setSelectedDrug("");
        }
    }, [yearCount, yearSummary])

    useEffect(() => {
        if (selectedState && selectedDrug) {
            getFacilityTypeDrpDt(selectedState);
            const stY = startYear?.getFullYear();
            const enY = endYear?.getFullYear();
            getFacilityAvailability(
                selectedState,
                selectedDrug,
                stY, enY
            );
        } else {
            setFacilityList([]);
        }

    }, [selectedDrug])

    const getYearSummary = (stateId, startY = "2020", endY = "2026") => {
        setLoading(true);
        fetchData(`/api/v1/py/analytics/itembrand-complete-year-counts?state_id=${parseInt(stateId)}&start_year=${startY}&end_year=${endY}&include_itembrand_ids=true`)?.then((res) => {
            console.log('res', res)
            if (res?.status === 1) {
                setYearSummary(res?.data);
                setSelectedDrug('');
                setLoading(false);
            } else {
                setYearSummary([]);
                setLoading(false);
                setSelectedDrug('');
            }
        })
    };

    const handleDrugCountClick = (item) => {
        if (!item?.itembrand_count || item?.itembrand_count === 0) {
            ToastAlert("Drugs not available!", 'warning');
        } else {
            setDrugCountData(item?.itembrands || [])
            setViewDrugList(true);
        }
    };

    const onClose = () => {
        setViewDrugList(false);
        setDrugCountData([]);
    }

    const getFacilityAvailability = (stateId, drugId, startY = "2020", endY = "2026") => {
        setFacilityLoading(true);
        const val = {
            "state_id": stateId,
            "itembrand_id": drugId,
            "start_year": startY,
            "end_year": endY,
            "min_months_for_imputation": parseInt(impMonths)
        }

        fetchPostData(`/api/v1/py/availability`, val)?.then((res) => {
            console.log('resfac', res)
            if (res?.status === 1) {
                setFacilityList(res?.data);
                setFacilityLoading(false);
            } else {
                setFacilityList([]);
                setFacilityLoading(false);
            }
        })
    };

    const drugListcolumn = [
        {
            name: "Item Name",
            selector: (row) => row.cwhstr_drugname,
            sortable: true,
        },
    ];

    const onClickReport = (dt, arr = []) => {
        const clms = createDynamicColumns(dt, arr);
        setRptClm(clms);
        setRptData(dt);
    }

    const getFacilityTypeDrpDt = (stateId) => {
        fetchData(`/api/v1/py/options/facilities?state_id=${stateId}`)?.then((res) => {
            console.log('facilitys', res)
            if (res?.status === 1) {
                setFacilityTypesDrpDt(res?.data?.facilities);
            } else {
                setFacilityTypesDrpDt([]);
            }
        })
    };

    const fetchForecastData = () => {

        const stY = startYear?.getFullYear();
        const enY = endYear?.getFullYear();

        const errors = [];

        if (!facilityTypeId) {
            errors.push("Forecast Facility ID");
        }

        if (!forecastMonth) {
            errors.push("Forecast Month");
        }

        if (!trainStartDate) {
            errors.push("Train Start Date");
        }

        if (!nextMonthsHorizon) {
            errors.push("Forecast Horizon");
        }

        if (errors.length > 0) {
            ToastAlert(`Please select the following fields:\n\n${errors.join("\n")}`, "warning");
            return;
        }

        setForecastLoading(true);
        const val = {
            "state_id": selectedState,
            "itembrand_id": selectedDrug,
            "start_year": stY,
            "end_year": enY,
            "min_months_for_imputation": parseInt(impMonths),
            "facility_id": parseInt(facilityTypeId),
            "forecast_month": formatDateHmisForecast(forecastMonth) || "",
            "train_start_date": formatDateHmisForecast(trainStartDate) || "",
            "ignore_forecast_year_data": false,
            "future_horizon_mode": "after_latest_available_data",
            "months_ahead": parseInt(nextMonthsHorizon),
            "use_old_logic": false,
            "include_availability_outputs": false
        }
        console.log('val', val)

        fetchPostData(`/api/v1/py/forecast`, val)?.then((res) => {
            console.log('forecast', res)
            if (res?.status === 1) {
                setForecastData(res?.data);
                setForecastLoading(false);
            } else {
                setForecastData([]);
                setForecastLoading(false);
                ToastAlert(res?.message, "error");
            }
        })
    };



    return (
        <>
            {!isShowReport &&
                <div className='masters mx-3 my-2'>
                    <div className='masters-header row'>
                        <span className='col-6'>
                            <b>{`Forecasting Through AI Modal`}</b>
                        </span>
                    </div>

                    <div className='row pt-2'>
                        <div className='col-md-6'>
                            <div className='form-group row'>
                                <label className='col-sm-4 col-form-label fix-label required-label fw-bold'>
                                    <i className="fa-solid fa-location-dot me-1 ms-0 text-info"></i>
                                    State :
                                </label>
                                <div className='col-sm-8'>
                                    <InputSelect
                                        id="state"
                                        name="state"
                                        placeholder="Select State"
                                        options={stateNameDrpDt}
                                        value={selectedState}
                                        className="aliceblue-bg border-dark-subtle"
                                        onChange={(e) => setSelectedState(parseInt(e?.target?.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row pt-2'>
                        <div className='col-md-6'>
                            <div className='form-group row'>
                                <label className="col-sm-4 col-form-label fix-label fw-bold">
                                    Year Range for Forecasting :
                                </label>

                                <div className="col-sm-8">
                                    <DatePicker
                                        selectsRange
                                        showYearPicker
                                        dateFormat="yyyy"
                                        startDate={startYear}
                                        endDate={endYear}
                                        onChange={(update) => {
                                            const [startYear, endYear] = update;
                                            setStartYear(startYear)
                                            setEndYear(endYear)
                                        }}
                                        isClearable
                                        placeholderText="Select Year Range"
                                        minDate={new Date(2000, 0, 1)}
                                        maxDate={new Date()}
                                        className="form-control aliceblue-bg border-dark-subtle"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>
                            <div className='form-group row'>
                                <label className='col-sm-4 col-form-label fix-label required-label fw-bold'>
                                    Min Months For Repair :
                                </label>
                                <div className='col-sm-8'>
                                    <InputField
                                        id="months"
                                        name="months"
                                        type="text"
                                        placeholder="Enter months"
                                        value={impMonths}
                                        className="aliceblue-bg border-dark-subtle"
                                        onChange={(e) => setImpMonths(e?.target?.value)}
                                        acceptType={"number"}
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='my-3' />

                    {selectedState && (
                        <>
                            <div className="year-summary-card mt-3">

                                <div className="d-flex justify-content-between align-items-center flex-wrap">
                                    <div className="year-summary-title">
                                        <i className="fa-solid fa-chart-column me-2"></i>
                                        {/* Drug Summary */}
                                        Year-wise Continuous Availability of Drugs
                                        <div>
                                            <span className="badge bg-info-subtle text-dark border required-label fs-13 fw-medium">
                                                <i> Click on item count to view list of available items.</i>
                                            </span>
                                        </div>
                                    </div>
                                    {!loading && yearSummary?.buckets?.length > 0 &&
                                        <div className="summary-info">
                                            <span className="badge bg-primary-subtle text-primary border me-2 mb-1">
                                                <i className="fa-solid fa-location-dot me-1"></i>
                                                {yearSummary?.cwhstr_state_name || "NA"}
                                            </span>
                                            <span className="badge bg-success-subtle text-success border me-2 mb-1">
                                                <i className="fa-solid fa-calendar-plus me-1"></i>
                                                Start: {yearSummary?.start_year || "NA"}
                                            </span>

                                            <span className="badge bg-warning-subtle text-dark border me-2 mb-1">
                                                <i className="fa-solid fa-calendar-check me-1"></i>
                                                End: {yearSummary?.end_year || "NA"}
                                            </span>
                                            <span className="badge bg-info-subtle text-dark border mb-1">
                                                <i className="fa-solid fa-pills me-1"></i>
                                                Total Drugs: {yearSummary?.total_unique_itembrands_in_1_to_7_buckets}
                                            </span>
                                        </div>
                                    }

                                </div>


                                {!loading && yearSummary?.buckets?.length > 0 ?
                                    <>
                                        <table className="year-summary-table">
                                            <tbody>
                                                <tr>
                                                    <th>Years</th>
                                                    {yearSummary?.buckets?.length > 0 && yearSummary?.buckets?.map(item => (
                                                        <td key={item?.complete_years}>{item?.complete_years}</td>
                                                    ))}
                                                </tr>

                                                <tr>
                                                    <th>Drug Counts</th>

                                                    {yearSummary?.buckets?.length > 0 && yearSummary?.buckets?.map(item => (
                                                        <td key={item.complete_years + "count"}>
                                                            <span
                                                                className="drug-count-link"
                                                                onClick={() => handleDrugCountClick(item)}
                                                            >
                                                                {item?.itembrand_count}
                                                            </span>
                                                        </td>
                                                    ))}
                                                </tr>
                                            </tbody>
                                        </table>

                                        <span className="badge bg-success-subtle text-success border mt-2 required-label">
                                            <i> {yearSummary?.no_repeat_rule || "NA"}</i>
                                        </span>
                                    </>
                                    :
                                    <>
                                        {!loading &&
                                            <span className="badge text-danger border mt-2 required-label">
                                                <i> No data Available!</i>
                                            </span>
                                        }
                                    </>
                                }

                                {loading &&
                                    <SpinLoader />
                                }
                            </div>

                            <hr className='my-3' />
                            <div className='row mt-4'>
                                <div className='col-md-6'>
                                    <div className='form-group row'>
                                        <label className='col-sm-4 col-form-label fix-label required-label fw-bold'>
                                            Select Year Count :
                                        </label>
                                        <div className='col-sm-8'>
                                            <InputSelect
                                                id="yearCount"
                                                name="yearCount"
                                                placeholder="Select year range..."
                                                value={yearCount}
                                                options={yearCountList}
                                                className="aliceblue-bg border-dark-subtle"
                                                onChange={(e) => setYearCount(e?.target?.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-group row'>
                                        <label className='col-sm-4 col-form-label fix-label required-label fw-bold'>
                                            Drug :
                                        </label>
                                        <div className='col-sm-8'>
                                            <InputDrpSelect
                                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                                id="drug"
                                                name="drug"
                                                placeholder="Select Drug"
                                                value={selectedDrug}
                                                options={drugList}
                                                onChange={(e) => {
                                                    if (e?.length > 0) {
                                                        setSelectedDrug(e?.[0]?.value?.toString());
                                                    } else {
                                                        setSelectedDrug('');
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {facilityLoading &&
                                <SpinLoader />
                            }


                            {selectedDrug && (
                                <>
                                    <hr className='my-3' />

                                    <TableWithAccoidion data={facilityList?.matrix} column={createDynamicColumns(facilityList?.matrix, ['facility_id'])} id={"collapseMatrix"} heading={"Facility-Year Matrix"} subHeading={`For each facility, it reports whether that facility has exactly 7, 6, 5, 4, 3, 2, 1, or 0 complete years. Complete year means data exists for all ${impMonths} months of that year.`} defaultOpen={true} filters={[
                                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                    ]}
                                        onClickRpt={() => onClickReport(facilityList?.matrix, ['facility_id'])}
                                    />

                                    <TableWithAccoidion data={facilityList?.eligibility} column={createDynamicColumns(facilityList?.eligibility)} id={"collapseFacility"} heading={"Model Eligibility by Facility"} subHeading={"If a facility has both complete/imputed years and sparse years, it is marked mixed: 8 strong methods run for complete/imputed years and fallback methods run for sparse years."} filters={[
                                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                    ]} onClickRpt={() => onClickReport(facilityList?.eligibility)} />

                                    <TableWithAccoidion data={facilityList?.year_method_plan} column={createDynamicColumns(facilityList?.year_method_plan)} id={"collapsyear_method_plan"} heading={"Year-wise Method Plan"} subHeading={"No year with data is left unused: complete/imputed years use the 8 strong methods; sparse years use sparse_fallback_methods; only no-data years are left out."} filters={[
                                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                    ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                    {/* <TableWithAccoidion data={facilityList?.detail} column={createDynamicColumns(facilityList?.detail)} id={"collapsDetailsYearWise"} heading={"Detailed Year-Wise Data"} subHeading={""} filters={[
                                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                    ]} onClickRpt={() => onClickReport(facilityList?.detail)} /> */}
                                </>
                            )}

                        </>
                    )}

                    <hr className='my-2' />
                    {(selectedDrug && !facilityLoading) &&
                        <div className="forecast-node">

                            {/* Header */}
                            <div className="year-summary-title">
                                <h4 className="mb-0 fw-bold">
                                    Forecast Using Stockout Adjusted Real Issue Qty
                                </h4>
                            </div>

                            {/* Form */}
                            <div className="row pt-3 g-3">

                                {/* Forecast Facility ID */}
                                <div className="col-12 col-md-6 col-xl-4">
                                    <div className="row align-items-center">

                                        <label className="col-12 col-sm-5 col-form-label fix-label required-label fw-bold">
                                            Forecast Facility ID :
                                        </label>

                                        <div className="col-12 col-sm-7">
                                            <InputSelect
                                                id="facilityTypeId"
                                                name="facilityTypeId"
                                                placeholder="Select Facility"
                                                options={facilityTypesDrpDt}
                                                value={facilityTypeId}
                                                className="aliceblue-bg border-dark-subtle w-100"
                                                onChange={(e) =>
                                                    setFacilityTypeId(parseInt(e?.target?.value))
                                                }
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* Forecast Month */}
                                <div className="col-12 col-md-6 col-xl-4">
                                    <div className="row align-items-center">

                                        <label className="col-12 col-sm-4 col-form-label fix-label required-label fw-bold">
                                            Forecast Month :
                                        </label>

                                        <div className="col-12 col-sm-8">
                                            <DatePicker
                                                name="forecastMonth"
                                                dateFormat="dd-MMM-yyyy"
                                                selected={forecastMonth}
                                                onChange={(update) => setForecastMonth(update)}
                                                isClearable
                                                placeholderText="Select Forecast Month"
                                                className="form-control aliceblue-bg border-dark-subtle w-100"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* Forecast Horizon */}
                                <div className="col-12 col-md-6 col-xl-4">
                                    <div className="row align-items-center">

                                        <label className="col-12 col-sm-4 col-form-label fix-label required-label fw-bold">
                                            Forecast Horizon :
                                        </label>

                                        <div className="col-12 col-sm-8">
                                            <InputSelect
                                                id="nextMonthsHorizon"
                                                name="nextMonthsHorizon"
                                                placeholder="Select Horizon"
                                                options={[12, 24, 36, 48].map((dt) => ({
                                                    value: dt,
                                                    label: dt
                                                }))}
                                                value={nextMonthsHorizon}
                                                className="aliceblue-bg border-dark-subtle w-100"
                                                onChange={(e) =>
                                                    setNextMonthsHorizon(parseInt(e?.target?.value))
                                                }
                                            />
                                        </div>

                                    </div>
                                </div>


                                {/* Train Start Date */}
                                <div className="col-12 col-md-6 col-xl-4">
                                    <div className="row align-items-center">

                                        <label className="col-12 col-sm-4 col-form-label fix-label required-label fw-bold">
                                            Train Start Date :
                                        </label>

                                        <div className="col-12 col-sm-8">
                                            <DatePicker
                                                name="trainStartDate"
                                                dateFormat="dd-MMM-yyyy"
                                                selected={trainStartDate}
                                                onChange={(update) => setTrainStartDate(update)}
                                                isClearable
                                                placeholderText="Select Start Date"
                                                className="form-control aliceblue-bg border-dark-subtle w-100"
                                                showYearDropdown
                                                showMonthDropdown
                                                dropdownMode="select"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Footer / Action */}
                            <div className="border-top mt-2 pt-2">
                                <div className="d-flex justify-content-center">

                                    <button
                                        type="button"
                                        className="btn btn-sm datatable-btns px-3 py-1"
                                        onClick={fetchForecastData}
                                    >
                                        <i className="fa fa-line-chart me-2 fs-13 text-warning"></i>
                                        Run Forecast
                                    </button>

                                </div>
                            </div>
                            <hr />

                            {forecastLoading &&
                                <SpinLoader />
                            }
                            {(!forecastLoading && facilityTypeId) &&
                                <div className="forecast-result">
                                    <>
                                        <div className="row">
                                            <div className="col-6 required-label">
                                                <span> Adjusted Store Month Rows : </span>
                                                <b>{forecastData?.stockout_adjustment?.total_adjusted_store_month_rows || "0"}</b>
                                            </div>
                                            <div className="col-6 required-label">
                                                <span> Total Stockout Days Applied : </span>
                                                <b>{forecastData?.stockout_adjustment?.total_stockout_days_applied || "0"}</b>
                                            </div>
                                        </div>

                                        <TableWithAccoidion data={forecastData?.monthly_data_used} column={createDynamicColumns(forecastData?.monthly_data_used)} id={"collaps_monthly_data_used"} heading={"Monthly Data Used For Forecasting"} subHeading={"This table must match your terminal output before forecast values can match."} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />


                                        <hr />
                                        <h4 className="text-primary fw-bold text-decoration-underline">Single Month Recommended Forcast</h4>
                                        <div className="required-label">Recommended Method : <b>{forecastData?.single_month_forecast?.recommended_method || "NA"}</b></div>

                                        <div className="required-label">Predicted Issue Quantity : <b>{forecastData?.single_month_forecast?.recommended_prediction || "NA"}</b></div>

                                        <span>{forecastData?.single_month_forecast?.selection_logic || ""}</span>

                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="year-summary-title">
                                                <div>
                                                    <span className="badge bg-info-subtle text-dark border required-label fs-13 fw-medium">
                                                        <i> {forecastData?.single_month_forecast?.restriction_note || ""}</i>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <TableWithAccoidion data={forecastData?.single_month_forecast?.allowed_final_candidates} column={createDynamicColumns(forecastData?.single_month_forecast?.allowed_final_candidates)} id={"collapsallowed_final_candidates"} heading={"Allowed Final Candidate Predictions"} subHeading={''} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                        <TableWithAccoidion data={forecastData?.single_month_forecast?.allowed_method_ranking} column={createDynamicColumns(forecastData?.single_month_forecast?.allowed_method_ranking)} id={"collapsallowed_method_ranking"} heading={"Allowed Method Ranking"} subHeading={''} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                        <TableWithAccoidion data={forecastData?.future_horizon?.months} column={createDynamicColumns(forecastData?.future_horizon?.months)} id={"collapsFuture_Month_Wise_Predictions"} heading={"Future Month-Wise Predictions"} subHeading={forecastData?.future_horizon?.mode_note} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                        <TableWithAccoidion data={forecastData?.future_horizon?.summary} column={createDynamicColumns(forecastData?.future_horizon?.summary)} id={"collapsFuture_Month_summary"} heading={"Consumption Forecast Summary"} subHeading={''} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                        <TableWithAccoidion data={forecastData?.future_horizon?.method_frequency} column={createDynamicColumns(forecastData?.future_horizon?.method_frequency)} id={"collapsFuture_Month_method_frequency"} heading={"Method Frequency in Next 12 Months"} subHeading={''} filters={[
                                            { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                                        ]} onClickRpt={() => onClickReport(facilityList?.year_method_plan)} />

                                    </>
                                </div>
                            }
                        </div>
                    }

                    {viewDrugList &&
                        <GlobalTableModal
                            onClose={onClose}
                            title={"Available Item's list"}
                            size={"xl"}
                            column={drugListcolumn}
                            data={drugCountData}
                        />
                    }
                </div>
            }

            {isShowReport &&
                <MasterReport title={"State Drug Availability Master"} column={rptClm} data={rptData}
                    filters={[
                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                    ]}
                    isSlNoReq={false}
                />
            }
        </>
    );
};

export default StateDrugAvailabilityMaster;