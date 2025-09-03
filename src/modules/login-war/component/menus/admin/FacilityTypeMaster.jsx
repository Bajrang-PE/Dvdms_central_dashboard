import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import FacilityTypeMasterForm from '../forms/admin/FacilityTypeMasterForm';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import ViewPage from '../ViewPage';
import MasterReport from '../../MasterReport';

const FacilityTypeMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getFacilityTypeListData, facilityTypeListData, setConfirmSave, confirmSave, setShowConfirmSave, isShowReport } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active')
    const [filterData, setFilterData] = useState(facilityTypeListData);

    useEffect(() => {
        getFacilityTypeListData(recordStatus === "InActive" ? '0' : '1')
    }, [recordStatus])

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumZoneId === row?.cwhnumZoneId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(facilityTypeListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = facilityTypeListData.filter(row => {
                const fname = row?.cwhstrFacilityTypeName?.toLowerCase() || "";
                const sname = row?.cwhstrFacilityTypeShortName?.toLowerCase() || "";

                return fname.includes(lowercasedText) || sname.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, facilityTypeListData]);


    const deleteRecord = () => {
        fetchDeleteData(`api/v1/Facility/${selectedOption[0]?.cwhnumFacilityTypeId}`).then(data => {
            if (data?.status === 1) {
                ToastAlert("Record Deleted Successfully", "success")
                getFacilityTypeListData();
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
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumFacilityTypeId === row?.cwhnumFacilityTypeId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Facility Name',
            selector: row => row.cwhstrFacilityTypeName,
            sortable: true,
        },
        {
            name: 'Short Name',
            selector: row => row.cwhstrFacilityTypeShortName || "---",
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

                {!isShowReport &&
                    <>
                        <div className='masters-header row'>
                            <span className='col-6'><b>{`Facility Type Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                            {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length}</span>}

                        </div>
                        {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                            <div className='row pt-2'>
                                <div className='col-sm-6'>
                                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                        <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                        <div className="col-sm-7 align-content-center">
                                            <InputSelect
                                                id="recordStatus"
                                                name="recordStatus"
                                                placeholder="Select Status"
                                                options={[{ value: "Active", label: 'Active' }, { value: "InActive", label: 'InActive' }]}
                                                className="aliceblue-bg border-dark-subtle"
                                                value={recordStatus}
                                                onChange={(e) => { setRecordStatus(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className='my-2' />
                            <GlobalTable column={column} data={filterData} onDelete={handleDeleteRecord} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} searchInput={searchInput} />

                            {openPage === 'view' &&
                                <ViewPage data={[{ value: selectedOption[0]?.cwhstrFacilityTypeName, label: "Facility Type Name" }]} onClose={onClose} title={"Facility Type Master"} />
                            }
                        </>)}

                        {(openPage === "add" || openPage === 'modify') && (<>
                            <FacilityTypeMasterForm setSearchInput={setSearchInput} />
                        </>)}
                    </>}

                {isShowReport &&
                    <MasterReport title={"Facility Type Master"} column={column} data={facilityTypeListData} />
                }
            </div>
        </>
    )
}

export default FacilityTypeMaster