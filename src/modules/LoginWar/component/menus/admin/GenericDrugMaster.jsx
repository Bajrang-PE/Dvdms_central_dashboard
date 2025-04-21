import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import GenericDrugMasterForm from '../forms/admin/GenericDrugMasterForm';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import ViewPage from '../ViewPage';

const GenericDrugMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getGroupDrpData, groupDrpData, getSubGroupDrpData, subGroupDrpData, getGenericDrugListData, genericDrugListData, setConfirmSave, confirmSave, setShowConfirmSave } = useContext(LoginContext);

    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1');
    const [groupId, setGroupId] = useState('');
    const [subGroupId, setSubGroupId] = useState('');
    const [filterData, setFilterData] = useState(genericDrugListData);

    useEffect(() => {
        getGenericDrugListData(groupId, subGroupId, recordStatus)
    }, [recordStatus, groupId, subGroupId])

    useEffect(() => {
        getSubGroupDrpData(groupId ? groupId : 0)
    }, [groupId])

    useEffect(() => {
        getGroupDrpData()
    }, [])

    useEffect(() => {
        if (!searchInput) {
            setFilterData(genericDrugListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = genericDrugListData.filter(row => {
                const drugName = row?.drugName?.toLowerCase() || "";
                const drugType = row?.drugTypeId?.toString() || "";
                const drugCat = row?.drugCatCode?.toString() || "";

                return drugName?.includes(lowercasedText) || drugType?.includes(lowercasedText) || drugCat?.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, genericDrugListData]);

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.centralDrugId === row?.centralDrugId) {
                return [];
            }
            return [row];
        });
    };

    const deleteRecord = () => {
        fetchDeleteData(`api/v1/drugs/${selectedOption[0]?.centralDrugId}`).then(data => {
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                getGenericDrugListData(groupId, subGroupId, recordStatus);
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

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }


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
                            checked={selectedOption.length > 0 && selectedOption[0]?.centralDrugId === row?.centralDrugId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Drug Name',
            selector: row => row.drugName,
            sortable: true,
        },
        {
            name: 'Drug Type',
            selector: row => row.drugTypeId || "---",
            sortable: true,
        },
        {
            name: 'Category Name',
            selector: row => row.drugCatCode || "---",
            sortable: true,
        }
    ]

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Generic Drug Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length}</span>}

                </div>
                {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Group : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="group"
                                        name="group"
                                        placeholder="Select value"
                                        options={groupDrpData}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={groupId}
                                        onChange={(e) => { setGroupId(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Sub Group : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="subgroup"
                                        name="subgroup"
                                        placeholder="Select value"
                                        options={subGroupDrpData}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={subGroupId}
                                        onChange={(e) => { setSubGroupId(e.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="recordStatus"
                                        name="recordStatus"
                                        placeholder="Select Status"
                                        options={[{ value: 1, label: 'Active' }, { value: 0, label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => { setRecordStatus(e.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='my-2' />
                    <GlobalTable column={column} data={filterData} onDelete={handleDeleteRecord} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={groupId ? true : false} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                    {openPage === 'view' &&
                        <ViewPage data={[{ value: selectedOption[0]?.drugName, label: "Drug Name" }, { value: selectedOption[0]?.drugTypeId, label: "Drug Type" }, { value: selectedOption[0]?.drugCatCode, label: "Category Name" }]} onClose={onClose} title={"Generic Drug Master"} />
                    }
                </>)}

                {(openPage === "add" || openPage === 'modify') && (<>
                    <GenericDrugMasterForm subGrpData={subGroupDrpData} groupData={groupDrpData} groupId={groupId} />
                </>)}
            </div>
        </>
    )
}

export default GenericDrugMaster
