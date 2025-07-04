import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import StateMasterForm from '../forms/admin/StateMasterForm';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import ViewPage from '../ViewPage';

const StateMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getStateListData, stateListData, setConfirmSave, confirmSave, setShowConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1')
    const [filterData, setFilterData] = useState(stateListData);
    const [country, setCountry] = useState('1');

    useEffect(() => {
        getStateListData(recordStatus ? recordStatus : '1')
    }, [recordStatus])

   
    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumStateId === row?.cwhnumStateId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(stateListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = stateListData.filter(row => {
                const paramName = row?.stateName?.toLowerCase() || "";
                const shortName = row?.stateShortName?.toLowerCase() || "";

                return paramName.includes(lowercasedText) || shortName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, stateListData]);

    const deleteRecord = () => {
        fetchDeleteData(`api/v1/State/${selectedOption[0]?.cwhnumStateId}`).then(data => {
            if (data?.status === 1) {
                ToastAlert("Record Deleted Successfully", "success")
                getStateListData();
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
                setRecordStatus('1');
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
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumStateId === row?.cwhnumStateId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'State Name',
            selector: row => row.cwhstrStateName,
            sortable: true,
        },
        {
            name: 'State Short Name',
            selector: row => row.cwhstrStateShortName,
            sortable: true,
        },
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`State Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length || 0}</span>}
                </div>

                {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label required-label">Country : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Country"
                                        options={[{ value: 1, label: 'India' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
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
                                        options={[{ value: 1, label: 'Active' }, { value: 0, label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />
                    <GlobalTable column={column} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                </>)}

                {openPage === 'view' &&
                    <ViewPage data={[{ value: 'India', label: "Country" }, { value: selectedOption[0]?.cwhstrStateName, label: "State Name" }, { value: selectedOption[0]?.cwhstrStateShortName, label: "State ShortName" }, { value: selectedOption[0]?.gnumIsValid == 1 ? "Active" : "InActive", label: "Record Status" }]} onClose={onClose} title={"State Master"} />
                }

                {(openPage === "add" || openPage === 'modify') && (<>
                    <StateMasterForm setSearchInput={setSearchInput}/>
                </>)}

            </div>
        </>
    )
}

export default StateMaster
