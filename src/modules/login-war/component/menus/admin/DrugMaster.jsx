import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext'
import { fetchData, fetchDeleteData, fetchPostData } from '../../../../../utils/ApiHooks';
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { Modal } from 'react-bootstrap';
import DrugMasterForm from '../forms/DrugMasterForm';
import MasterReport from '../../MasterReport';
import InputDrpSelect from '../../InputDrpSelect';

const DrugMaster = () => {

    const { selectedOption, setSelectedOption, groupDrpData, getGroupDrpData, subGroupDrpData, getSubGroupDrpData, openPage, setOpenPage, setConfirmSave, confirmSave, setShowConfirmSave, isShowReport
    } = useContext(LoginContext);

    const [values, setValues] = useState({
        "groupId": "0", "subGroupId": "0", "recordStatus": "1"
    })

    const [errors, setErrors] = useState({
        groupIdErr: "", subGroupIdErr: ""
    })

    const [listData, setListData] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [selectedGroupName, setSelectedGroupName] = useState("")
    const [selectedSubGroupName, setSelectedSubGroupName] = useState("")
    const [selectedGroupId, setSelectedGroupId] = useState("")
    const [selectedSubGroupId, setSelectedSubGroupId] = useState("")
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState(listData);


    useEffect(() => {
        getGroupDrpData();
    }, [])

    useEffect(() => {
        getSubGroupDrpData(values?.groupId);
    }, [values?.groupId])

    useEffect(() => {
        getListData(values?.groupId, values?.subGroupId, values?.recordStatus);
    }, [values?.groupId, values?.subGroupId, values?.recordStatus])

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        setSearchInput('');
        if (name === "groupId") {
            const selectOptionGrp = groupDrpData.find(opt => String(opt.value) === String(value));
            setSelectedGroupName(selectOptionGrp?.label || "");
            setSelectedGroupId(selectOptionGrp?.value || "")
        }
        if (name === "subGroupId") {
            const selectOptionSubGrp = subGroupDrpData.find(opt => String(opt.value) === String(value));
            setSelectedSubGroupName(selectOptionSubGrp?.label || "");
            setSelectedSubGroupId(selectOptionSubGrp?.value || "")
        }
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }

    }

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const paramName = row?.cwhstrDrugName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);


    useEffect(() => {
        setValues(prev => ({
            ...prev,
            subGroupId: "0"
        }));

        if (values.groupId === "") {
            setValues(prev => ({
                ...prev,
                groupId: "0"
            }));
        }
    }, [values.groupId]);

    useEffect(() => {
        if (values.subGroupId === "") {
            setValues(prev => ({
                ...prev,
                subGroupId: "0"
            }));
        }
    }, [values.subGroupId]);



    const getListData = (grpId, sbGrpId, recStatus) => {

        fetchData(`/api/v1/drug-mst/getAlldrugList?groupId=${grpId}&subGroupId=${sbGrpId}&isActive=${recStatus}`).then((data) => {
            if (data?.status === 1 && Array.isArray(data.data)) {
                //alert("Data avl")
                setListData(data.data)
            } else {
                //alert("Data not avl")
                setListData([])
            }
        })
    }

    const validate = () => {

        let isValid = true;
        if (!values?.groupId.trim() || values?.groupId === "0") {
            setErrors(prev => ({ ...prev, groupIdErr: "Please select group" }));
            setOpenPage("home")
            isValid = false
        }
        if (!values?.subGroupId.trim() || values?.subGroupId === "0") {
            setErrors(prev => ({ ...prev, subGroupIdErr: "Please select subgroup" }));
            setOpenPage("home")
            isValid = false
        }
        return isValid;
    }


    const handleSelectAll = (isChecked) => {

        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = listData.map(drug => drug.cwhnumDrugId);
            setSelectedOption(allIds);
        } else {
            setSelectedOption([]);
        }
    };

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    // checked={selectAll}
                    // onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumDrugId === row.cwhnumDrugId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Drug Name',
            selector: row => row.cwhstrDrugName,
            sortable: true,
        },
        {
            name: 'Drug Type',
            selector: row => row.drugtypeName,
            sortable: true,
        },
        {
            name: 'Drug Code',
            selector: row => row.drugCatName,
            sortable: true,
        },
        {
            name: 'Unit',
            selector: row => row.cwhstrStrengthName,
            sortable: true,
        },
    ];

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
            handleDelete();
        }
    }, [confirmSave])

    const handleDelete = () => {

        fetchPostData(`/api/v1/drug-mst/deletedrug?drugId=${selectedOption[0]?.cwhnumDrugId}`).then(data => {
            if (data?.status === 1) {
                ToastAlert('Data deleted successfully', 'success')
                setConfirmSave(false);
                setSelectedOption([]);
                setOpenPage("home");
                getListData(values?.groupId, values?.subGroupId, values?.recordStatus);
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
                setConfirmSave(false);
            }

        })

    }


    return (
        <>
            <div className="masters mx-3 my-2">
                {!isShowReport &&
                    <div className='masters-header row'>
                        <span className='col-6'><b>{`Drug Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                        {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length}</span>}
                    </div>
                }
                {(openPage === "home" || openPage === "view" || openPage === 'delete') && !isShowReport &&
                    <>
                        <div className="row pt-2">

                            <div className="form-group col-sm-4 row pt-1">
                                <label className="col-sm-4 col-form-label fix-label required-label">Group</label>

                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='groupId'
                                        id='groupId'
                                        placeholder={"Select Value"}
                                        options={groupDrpData}
                                        value={values?.groupId}
                                        onChange={handleValueChange}
                                        errorMessage={errors?.groupIdErr}
                                    />
                                </div>
                            </div>

                            <div className="form-group col-sm-4 row">
                                <label className="col-sm-4 col-form-label fix-label required-label">Subgroup</label>
                                <div className="col-sm-8 align-content-center">
                                    {/* <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='subGroupId'
                                        id='subGroupId'
                                        placeholder={"Select Value"}
                                        options={subGroupDrpData}
                                        value={values?.subGroupId}
                                        onChange={handleValueChange}
                                        errorMessage={errors?.subGroupIdErr}
                                    /> */}
                                    <InputDrpSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='subGroupId'
                                        id='subGroupId'
                                        placeholder={"Select Value"}
                                        options={subGroupDrpData}
                                        value={values?.subGroupId}
                                        onChange={(e) => {
                                            if (e?.length > 0) {
                                                setValues(prev => ({ ...prev, "subGroupId": e?.[0]?.value?.toString() }));
                                                const selectOptionSubGrp = subGroupDrpData.find(opt => String(opt.value) === String(e?.[0]?.value));
                                                setSelectedSubGroupName(selectOptionSubGrp?.label || "");
                                                setSelectedSubGroupId(selectOptionSubGrp?.value || "")
                                                setErrors(prev => ({ ...prev, subGroupIdErr: "" }));
                                                setSearchInput('');
                                            }
                                        }}
                                        errorMessage={errors?.subGroupIdErr}
                                    />
                                </div>

                            </div>

                            <div className="form-group col-sm-4 row">
                                <label className="col-sm-4 col-form-label fix-label required-label">Record Status</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='recordStatus'
                                        id='recordStatus'
                                        options={[{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }]}
                                        value={values?.recordStatus}
                                        onChange={handleValueChange}
                                    //   errorMessage={errors?.groupIdErr}
                                    />
                                </div>
                            </div>

                            <div>
                                <GlobalTable column={columns} data={filterData} onDelete={handleDeleteRecord}
                                    onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} onValidate={validate} searchInput={searchInput} />
                            </div>


                            {openPage === 'view' &&
                                <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                                    <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                        <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                    </Modal.Header>
                                    <Modal.Body className='px-2 py-1'>

                                        <div className='text-center'>
                                            <label><b>Group Name : </b></label>&nbsp;{selectedGroupName}<br />
                                            <label><b>Subgroup Name : </b></label>&nbsp;{selectedSubGroupName}<br />
                                            <label><b>Drug Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrDrugName}<br />
                                            <label><b>Drug Type Name : </b></label>&nbsp;{selectedOption[0]?.cwhnumDrugTypeId}<br />
                                            <label><b>Drug Code : </b></label>&nbsp;{selectedOption[0]?.cwhnumDrugId}<br />
                                            <label><b>Unit : </b></label>&nbsp;{selectedOption[0]?.cwhstrStrengthName}
                                            {/* //<label><b>Sub Group Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrSubgroupName}<br/> */}
                                        </div>

                                        <div className='text-center mt-1'>

                                            <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                                <i className="fa fa-broom me-1"></i> Close
                                            </button>
                                        </div>

                                    </Modal.Body>
                                </Modal>
                            }

                        </div>
                    </>}

                {
                    (openPage === "add" || openPage === "modify") && !isShowReport &&
                    <DrugMasterForm selectedGroupName={selectedGroupName} selectedSubGroupName={selectedSubGroupName}
                        selectedGroupId={selectedGroupId} selectedSubGroupId={selectedSubGroupId} setSearchInput={setSearchInput}
                        getListData={getListData} selectedStatus={values?.recordStatus} />
                }

                {isShowReport &&
                    <MasterReport title={"Drug Master"} column={columns} data={listData} filters={[
                        { value: groupDrpData?.find(dt => dt?.value == values?.groupId)?.label, label: "Group" },
                        { value: subGroupDrpData?.find(dt => dt?.value == values?.subGroupId)?.label, label: "SubGroup" },
                        { value: values?.recordStatus == 1 ? "Active" : "InActive", label: "Record Status" },
                    ]} />
                }
            </div>
        </>
    )
}

export default DrugMaster