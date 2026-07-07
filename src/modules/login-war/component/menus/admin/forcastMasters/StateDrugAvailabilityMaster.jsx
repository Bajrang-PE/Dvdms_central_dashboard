import React, { useContext, useEffect, useMemo, useState } from "react";
import InputSelect from "../../../InputSelect";
import GlobalTable from "../../../GlobalTable";
import { capitalizeFirstLetter, ToastAlert } from "../../../../utils/CommonFunction";
import "./StateDrugAvailabilityMaster.css";
import GlobalTableModal from "../../TableModal";
import { LoginContext } from "../../../../context/LoginContext";
import { fetchData } from "../../../../../../utils/ApiHooks";
import MasterReport from "../../../MasterReport";

const StateDrugAvailabilityMaster = () => {

    const { getSteteNameDrpData, stateNameDrpDt, openPage, setOpenPage, isShowReport } = useContext(LoginContext)

    const [searchInput, setSearchInput] = useState("");
    const [selectedState, setSelectedState] = useState("12");
    const [selectedYear, setSelectedYear] = useState("");
    const [selectedDrug, setSelectedDrug] = useState("");
    const [yearSummary, setYearSummary] = useState([]);
    const [drugList, setDrugList] = useState([]);
    const [facilityList, setFacilityList] = useState([]);
    const [filterData, setFilterData] = useState([]);

    const [viewDrugList, setViewDrugList] = useState(false);
    const [drugCountData, setDrugCountData] = useState([]);

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
    }, []);

    useEffect(() => {
        if (selectedState) {
            getYearSummary(selectedState)
        } else {
            setYearSummary([])
        }

    }, [selectedState])

    useEffect(() => {
        if (selectedState && selectedDrug) {
            getFacilityAvailability(
                selectedState,
                selectedYear,
                selectedDrug
            );
        } else {
            setFacilityList([]);
            setFilterData([]);
        }

    }, [selectedState, selectedDrug, selectedYear])

    // const handleStateChange = (e) => {
    //     const stateId = e.target.value;
    //     setSelectedState(stateId);

    //     setSelectedYear("");
    //     setSelectedDrug("");
    //     setDrugList([]);
    //     setFacilityList([]);
    //     setFilterData([]);
    //     getYearSummary(stateId);
    // };

    const getYearSummary = (stateId) => {
        fetchData("http://10.226.28.223:8000/analytics/itembrand-complete-year-counts?state_id=12&start_year=2020&end_year=2026&include_itembrand_ids=true")?.then((res) => {
            console.log('res', res)
            setYearSummary(res);
        })
    };

    const handleDrugCountClick = (item) => {
        console.log('item', item)
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

    const handleYearChange = (e) => {
        const year = e.target.value;
        setSelectedYear(year);
        setSelectedDrug("");
        getDrugList(selectedState, year);
    };

    const getDrugList = (stateId, year) => {
        setDrugList([
            {
                value: 1,
                label: "Paracetamol 500 mg"
            },
            {
                value: 2,
                label: "Amoxicillin"
            },
            {
                value: 3,
                label: "Pantoprazole"
            },
            {
                value: 4,
                label: "Ibuprofen"
            },
            {
                value: 5,
                label: "ORS Packet"
            }
        ]);
    };


    const getFacilityAvailability = (stateId, year, drugId) => {
        fetchData("http://10.226.28.223:8000/analytics/facility-complete-years-by-itembrand?state_id=12&itembrand_id=100712&start_year=2020&end_year=2026")?.then((res) => {
            console.log('resfac', res)
            setFacilityList(res?.facilities);
            setFilterData(res?.facilities);
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
                                        onChange={(e) => setSelectedState(e?.target?.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='my-3' />

                    {selectedState && yearSummary?.buckets?.length > 0 && (
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
                                            Total Drugs: {yearSummary?.total_unique_itembrands_in_1_to_7_buckets || "NA"}
                                        </span>

                                    </div>
                                </div>



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
                            </div>

                            <hr className='my-3' />

                            <div className='row mt-4'>
                                <div className='col-md-6'>
                                    <div className='form-group row'>
                                        <label className='col-sm-4 col-form-label fix-label fw-bold'>
                                            <i className="fa-solid fa-calendar-days me-1 text-danger-emphasis"></i>
                                            Year :
                                        </label>
                                        <div className='col-sm-8'>
                                            <InputSelect
                                                id="year"
                                                name="year"
                                                placeholder="Select Year"
                                                value={selectedYear}
                                                options={[{ value: 2025, label: "2025" }]}
                                                className="aliceblue-bg border-dark-subtle"
                                                onChange={handleYearChange}
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
                                            <InputSelect
                                                id="drug"
                                                name="drug"
                                                placeholder="Select Drug"
                                                value={selectedDrug}
                                                options={drugList}
                                                className="aliceblue-bg border-dark-subtle"
                                                onChange={(e) => setSelectedDrug(e?.target?.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedDrug && (
                                <>
                                    <hr className='my-3' />

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