import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import ViewPage from '../ViewPage';
import StateJobdetailsForm from '../forms/services/StateJobdetailsForm';

const StateJobDetailsService = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, setConfirmSave, confirmSave, setShowConfirmSave, getSteteNameDrpData, stateNameDrpDt, getStateJobDetailsListData, stateJobListData } = useContext(LoginContext);

    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1')
    const [filterData, setFilterData] = useState(stateJobListData);
    const [stateId, setStateId] = useState('');

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
    }, []);

    useEffect(() => {
        if (stateId) {
            getStateJobDetailsListData(stateId, recordStatus)
        } else {
            setFilterData([]);
        }
    }, [stateId, recordStatus])

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.jobID === row?.jobID) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(stateJobListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = stateJobListData.filter(row => {
                const paramName = row?.jobName?.toLowerCase() || "";
                const shortName = row?.jobDuration?.toLowerCase() || "";

                return paramName.includes(lowercasedText) || shortName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, stateJobListData]);

    const deleteRecord = () => {
        const val = {
            "jobID": selectedOption[0]?.jobID,
            "jobName": selectedOption[0]?.jobName
        }

        fetchDeleteData(`/api/v1/stateJobDetails/DeleteJob`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert("Record Deleted Successfully", "success")
                getStateJobDetailsListData(stateId, recordStatus);
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
            } else {
                ToastAlert(data?.message, 'error')
                setConfirmSave(false);
            }
        })
    }
    const handleDeleteRecord = () => {
        if (selectedOption?.length > 0) {
            setOpenPage('delete');
            setShowConfirmSave(true);
        } else {
            ToastAlert("Please select a record", "warning");
        }
    }

    useEffect(() => {
        if (confirmSave && openPage === 'delete') {
            deleteRecord();
        }
    }, [confirmSave])

    const column = [
        {
            name: <input
                type="checkbox"
                // checked={selectAll}
                // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                className="form-check-input log-select"
                disabled
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption.length > 0 && selectedOption[0]?.jobID === row?.jobID}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Job Name',
            selector: row => row.jobName,
            sortable: true,
        },
        {
            name: 'Job Start Time',
            selector: row => row.jobStart,
            sortable: true,
        },
        {
            name: 'Job Durations',
            selector: row => row.jobDuration,
            sortable: true,
        },
        {
            name: 'Last Job Run',
            selector: row => row.lastRunTime,
            sortable: true,
        },
        {
            name: 'Next Job Run',
            selector: row => row.nextRunTime,
            sortable: true,
        },
        {
            name: 'Last State Time',
            selector: row => row.lastStateTime,
            sortable: true,
        },
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
        setSearchInput('');
    }

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`State Job Details >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length || 0}</span>}
                </div>

                {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select value"
                                        options={stateNameDrpDt}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={stateId}
                                        onChange={(e) => setStateId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Status"
                                        options={[{ value: "1", label: 'Active' }, { value: "0", label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />

                    <GlobalTable column={column} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} searchInput={searchInput} isRun={true}/>

                </>)}

                {openPage === 'view' &&
                    <ViewPage data={[{ value: 'India', label: "Country" }, { value: selectedOption[0]?.stateName, label: "State Name" }, { value: selectedOption[0]?.stateShortName, label: "State ShortName" }, { value: selectedOption[0]?.isValid == 1 ? "Active" : "InActive", label: "Record Status" }]} onClose={onClose} title={"State Master"} />
                }

                {(openPage === "add" || openPage === 'modify') && (<>
                    <StateJobdetailsForm stateData={stateNameDrpDt?.filter(dt => dt?.value == stateId)} setSearchInput={setSearchInput} />
                </>)}

            </div>
        </>
    )
}

export default StateJobDetailsService

