import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from '../../InputSelect'
import GlobalTable from '../../GlobalTable'
import SubGroupMasterForm from '../forms/admin/SubGroupMasterForm'
import { fetchData, fetchDeleteData, fetchUpdateData } from '../../../../../utils/ApiHooks'
import { Modal } from 'react-bootstrap';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction'

const SubGroupMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [selectedGroupName, setSelectedGroupName] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const { getSteteNameDrpData, stateNameDrpDt, getGroupDrpData, groupDrpData } = useContext(LoginContext)
    const [listData, setListData] = useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState(listData);
    const [values, setValues] = useState({
        "groupId": "", "recordStatus": "1"
    })

    const [errors, setErrors] = useState({
        groupIdErr: ""
    })

    useEffect(() => {
        if (stateNameDrpDt.length === 0) {
            getGroupDrpData();
        }
    }, [])


    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const paramName = row?.cwhstrSubgroupName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);


    useEffect(() => {

        if (values?.recordStatus) {
            getAllListData(values?.recordStatus, values?.groupId);
        }

    }, [values?.recordStatus, values?.groupId])

    useEffect(() => {
        if (openPage === "add") {
            validate()
        }
    }, [openPage])

    const getAllListData = async (recStatus, grpId) => {


        if (recStatus && grpId === "") {
            fetchData(`/api/v1/subgroup/all?isActive=${recStatus}`).then((data) => {

                if (data?.status === 1 && Array.isArray(data.data)) {
                    setListData(data.data);
                } else {
                    setListData([]);
                }

            })
        }

        if (recStatus && grpId) {
            fetchData(`/api/v1/subgroup?groupId=${grpId}&isActive=${recStatus}`).then((data) => {

                if (data?.status === 1 && Array.isArray(data.data)) {
                    setListData(data.data);
                } else {
                    setListData([]);
                }
            })
        }

    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "groupId") {
            const selectOption = groupDrpData.find(opt => String(opt.value) === String(value));
            setSelectedGroupName(selectOption?.label || "");
            setSelectedGroupId(selectOption?.value || "")
        }
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = drugs.map(drug => drug.cwhnumDrugTypeId);
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
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={listData.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumSubgroupId === row.cwhnumSubgroupId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Subgroup Name',
            selector: row => row.cwhstrSubgroupName,
            sortable: true,
        },
    ];

    const validate = () => {

        if (!values?.groupId.trim()) {
            setErrors(prev => ({ ...prev, groupIdErr: "Please select value" }));
            setOpenPage("home")
        }
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
            handleDelete();
        }
    }, [confirmSave])

    const handleDelete = () => {
        const subGrpId = String(selectedOption[0]?.cwhnumSubgroupId)
        fetchDeleteData(`/api/v1/subgroup?groupId=${selectedGroupId}&subGroupId=${subGrpId}&isActive=1`).then(data => {
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                setSelectedOption([]);
                setConfirmSave(false);
                getAllListData(values?.recordStatus, values?.groupId);
                setOpenPage("home")
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
            }
        })
    }

    return (
        <div className="masters mx-3 my-2">


            <div className='masters-header row'>
                <span className='col-6'><b>{`Sub Group Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
            </div>

            {(openPage === "home" || openPage === "view" || openPage === 'delete') &&
                <>
                    <div className="row">
                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Group </label>
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


                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Record Status : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='recordStatus'
                                    id='recordStatus'
                                    options={[{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }]}
                                    value={values?.recordStatus}
                                    onChange={handleValueChange}

                                />
                            </div>
                        </div>

                        <div>
                            <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null}
                                onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                        </div>


                        {openPage === 'view' &&
                            <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                    <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                </Modal.Header>
                                <Modal.Body className='px-2 py-1'>

                                    <div className='text-center'>
                                        <label><b>Group Name : </b></label>&nbsp;{selectedGroupName}<br />
                                        <label><b>Sub Group Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrSubgroupName}
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

            {(openPage === "add" || openPage === "modify") &&
                <>
                    <SubGroupMasterForm selectedGroupName={selectedGroupName} selectedGroupId={selectedGroupId}
                        setValues={setValues} values={values} setSearchInput={setSearchInput} getAllListData={getAllListData} />
                </>
            }
        </div>
    )
}

export default SubGroupMaster