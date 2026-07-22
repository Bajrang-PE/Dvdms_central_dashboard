import React, { useContext, useEffect, useMemo, useState } from "react";
import InputSelect from "../../../InputSelect";
import GlobalTable from "../../../GlobalTable";
import { capitalizeFirstLetter, ToastAlert } from "../../../../utils/CommonFunction";
import "./StateDrugAvailabilityMaster.css";
import GlobalTableModal from "../../TableModal";
import { LoginContext } from "../../../../context/LoginContext";
import { fetchData, fetchDataUnEnc } from "../../../../../../utils/ApiHooks";
import MasterReport from "../../../MasterReport";
import SpinLoader from "../../../Spinner";
import DatePicker from "react-datepicker";
import InputDrpSelect from "../../../InputDrpSelect";

const StateDrugAvailabilityMaster = () => {

    const { getSteteNameDrpData, stateNameDrpDt, openPage, setOpenPage, isShowReport } = useContext(LoginContext);

    const [searchInput, setSearchInput] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedYear, setSelectedYear] = useState("");
    const [startYear, setStartYear] = useState(new Date(2020, 0, 1));
    const [endYear, setEndYear] = useState(new Date());
    const [yearCount, setYearCount] = useState("");
    const [selectedDrug, setSelectedDrug] = useState("");
    const [yearSummary, setYearSummary] = useState([]);
    const [drugList, setDrugList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [facilityLoading, setFacilityLoading] = useState(false);

    const [viewDrugList, setViewDrugList] = useState(false);
    const [drugCountData, setDrugCountData] = useState([]);
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
            setFilterData([]);
            setSelectedDrug("");
            // setYearCount("");
        } else {
            setYearSummary([]);
            setDrugList([]);
            setFacilityList([]);
            setFilterData([]);
            setSelectedDrug("");
            // setYearCount("");
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
            setFilterData([]);
            setSelectedDrug("");
        } else {
            setDrugList([]);
            setFacilityList([]);
            setFilterData([]);
            setSelectedDrug("");
        }
    }, [yearCount, yearSummary])

    useEffect(() => {
        if (selectedState && selectedDrug) {
            const stY = startYear?.getFullYear();
            const enY = endYear?.getFullYear();
            getFacilityAvailability(
                selectedState,
                selectedDrug,
                stY, enY
            );
        } else {
            setFacilityList([]);
            setFilterData([]);
        }

    }, [selectedDrug])

    const getYearSummary = (stateId, startY = "2020", endY = "2026") => {
        setLoading(true);
        fetchData(`http://10.226.28.223:8025/py/analytics/itembrand-complete-year-counts?state_id=${parseInt(stateId)}&start_year=${startY}&end_year=${endY}&include_itembrand_ids=true`)?.then((res) => {
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
        // setOpenPage('home');
        setViewDrugList(false);
        setDrugCountData([]);
    }

    const getFacilityAvailability = (stateId, drugId, startY = "2020", endY = "2026") => {
        setFacilityLoading(true);
        fetchData(`http://10.226.28.223:8025/py/analytics/facility-complete-years-by-itembrand?state_id=${stateId}&itembrand_id=${drugId}&start_year=${startY}&end_year=${endY}`)?.then((res) => {
            console.log('resfac', res)
            if (res?.status === 1) {
                setFacilityList(res?.data?.facilities);
                setFilterData(res?.data?.facilities);
                setFacilityLoading(false);
            } else {
                setFacilityList([]);
                setFilterData([]);
                setFacilityLoading(false);
            }

        })
    };


    useEffect(() => {
        if (!searchInput) {
            setFilterData(facilityList);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = facilityList.filter(row => {
                const paramName = row?.cwhstr_facility_name?.toLowerCase() || "";
                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, facilityList]);

    const columns = useMemo(() => [
        {
            name: "Facility Type",
            selector: row => row?.cwhstr_facility_name,
            sortable: true,
            grow: 3
        },
        {
            name: "Year 1",
            center: true,
            selector: row => row?.has_1_complete_years,
            cell: row => (
                row?.has_1_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 2",
            center: true,
            selector: row => row?.has_2_complete_years,
            cell: row => (
                row?.has_2_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 3",
            center: true,
            selector: row => row?.has_3_complete_years,
            cell: row => (
                row.has_3_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 4",
            center: true,
            selector: row => row?.has_4_complete_years,
            cell: row => (
                row?.has_4_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 5",
            center: true,
            selector: row => row?.has_5_complete_years,
            cell: row => (
                row?.has_5_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 6",
            center: true,
            selector: row => row?.has_6_complete_years,
            cell: row => (
                row?.has_6_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        },
        {
            name: "Year 7",
            center: true,
            selector: row => row?.has_7_complete_years,
            cell: row => (
                row?.has_7_complete_years
                    ? <span className="status-icon success">✔</span>
                    : <span className="status-icon danger">✖</span>
            )
        }
    ], []);

    const drugListcolumn = [
        {
            name: "Item Name",
            selector: (row) => row.cwhstr_drugname,
            sortable: true,
        },
    ];

    return (
        <>
            {!isShowReport &&
                <div className='masters mx-3 my-2'>
                    <div className='masters-header row'>
                        <span className='col-6'>
                            <b>{`State Drug Availability Master >> ${capitalizeFirstLetter(openPage)}`}</b>
                        </span>
                        <span className='col-6 text-end'>
                            <i className="fa-solid fa-list-check me-1"></i>
                            Total Records : {filterData?.length || 0}
                        </span>
                    </div>

                    <div className='row pt-2'>
                        <div className='col-md-4'>
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
                        <div className='col-md-4'>
                            <div className='form-group row'>
                                <label className="col-sm-4 col-form-label fix-label fw-bold">
                                    Start Year :
                                </label>

                                <div className="col-sm-8">
                                    <DatePicker
                                        selected={startYear}
                                        onChange={(date) => {
                                            console.log('date', date)
                                            setStartYear(date);

                                            if (endYear && date > endYear) {
                                                setEndYear(null);
                                            }
                                        }}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        placeholderText="Start Year"
                                        minDate={new Date(2020, 0, 1)}
                                        maxDate={new Date(currentYear, 11, 31)}
                                        className="form-control aliceblue-bg border-dark-subtle"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group row">
                                <label className="col-sm-4 col-form-label fix-label fw-bold">
                                    End Year :
                                </label>

                                <div className="col-sm-8">
                                    <DatePicker
                                        selected={endYear}
                                        onChange={setEndYear}
                                        showYearPicker
                                        dateFormat="yyyy"
                                        placeholderText="End Year"
                                        minDate={startYear || new Date(2020, 0, 1)}
                                        maxDate={new Date(currentYear, 11, 31)}
                                        className="form-control aliceblue-bg border-dark-subtle"
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
                                        Drug Summary
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
                                            {/* <InputSelect
                                                id="drug"
                                                name="drug"
                                                placeholder="Select Drug"
                                                value={selectedDrug}
                                                options={drugList}
                                                className="aliceblue-bg border-dark-subtle"
                                                onChange={(e) => setSelectedDrug(e?.target?.value)}
                                            /> */}
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


                            {(selectedDrug || yearCount) && (
                                <>
                                    <hr className='my-3' />
                                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="year-summary-title">
                                            <i className="fa-solid fa-chart-column me-2"></i>
                                            Facility Complete Years By Item
                                            <div>
                                                <span className="badge bg-info-subtle text-dark border required-label fs-13 fw-medium">
                                                    <i> For each facility, it reports whether that facility has exactly 7, 6, 5, 4, 3, 2, 1, or 0 complete years. Complete year means data exists for all 12 months of that year.</i>
                                                </span>
                                            </div>
                                        </div>
                                        {/* <div className="summary-info">
                                            <span className="badge bg-success-subtle text-success border me-2 mb-1">
                                                <i className="fa-solid fa-calendar-plus me-1"></i>
                                                Drug name: {drugList?.find(dt => dt?.value == selectedDrug)?.label || "NA"}
                                            </span>
                                        </div> */}
                                    </div>

                                    <GlobalTable
                                        column={columns}
                                        data={filterData}
                                        setSearchInput={setSearchInput}
                                        isShowBtn={true}
                                        isAdd={false}
                                        isModify={false}
                                        isDelete={false}
                                        isView={false}
                                        isReport={true}
                                        onAdd={null}
                                        onModify={null}
                                        onDelete={null}
                                        onView={null}
                                        onReport={null}
                                        setOpenPage={() => { }}
                                    />
                                </>
                            )}
                        </>
                    )}

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
                <MasterReport title={"State Drug Availability Master"} column={columns} data={filterData}
                    filters={[
                        { value: stateNameDrpDt?.find(dt => dt?.value == selectedState)?.label, label: "State" }, { value: drugList?.find(dt => dt?.value == selectedDrug)?.label, label: "Item Name" }
                    ]}
                />
            }
        </>
    );
};

export default StateDrugAvailabilityMaster;