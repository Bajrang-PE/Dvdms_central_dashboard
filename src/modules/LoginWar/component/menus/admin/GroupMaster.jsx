import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import ViewPage from '../ViewPage';
import GroupMasterForm from '../forms/admin/GroupMasterForm';

const GroupMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave, getGroupListData,groupListData } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active')
    const [filterData, setFilterData] = useState(groupListData);

    useEffect(() => {
        getGroupListData(recordStatus === "Active" ? '1' : '0')
    }, [recordStatus])

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.groupId === row?.groupId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(groupListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = groupListData.filter(row => {
                const paramName = row?.groupName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, groupListData]);

    const deleteRecord = () => {
        fetchDeleteData(`api/v1/Group/${selectedOption[0]?.groupId}`).then(data => {
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                getGroupListData();
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
            } else {
                ToastAlert('Error while deleting record!', 'error')
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
                            checked={selectedOption.length > 0 && selectedOption[0]?.groupId === row?.groupId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Group Name',
            selector: row => row.groupName,
            sortable: true,
        }
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Group Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
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
                    <GlobalTable column={column} data={filterData} onDelete={handleDeleteRecord} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                    {openPage === 'view' &&
                        <ViewPage data={[{ value: selectedOption[0]?.groupName, label: "Group Name" }]} onClose={onClose} title={"Group Master"} />
                    }
                </>)}

                {(openPage === "add" || openPage === 'modify') && (<>
                    <GroupMasterForm />
                </>)}
            </div>
        </>
    )
}

export default GroupMaster
