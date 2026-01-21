import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext'
import axios from 'axios'
import GlobalTable from '../../GlobalTable'
import DistrictMasterForm from '../forms/admin/DistrictMasterForm'
import { fetchData, fetchDeleteData, fetchPostData } from '../../../../../utils/ApiHooks'
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction'
import { Modal } from 'react-bootstrap';
import MasterReport from '../../MasterReport'
import InputDrpSelect from '../../InputDrpSelect'

const DistrictMaster = () => {

    const [values, setValues] = useState({
        "countryId": "101", "stateId": "", "recordStatus": "1"
    })

    const [listData, setListData] = useState([]);
    const { getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext)
    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave, isShowReport } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedStateName, setSelectedStateName] = useState("");
    const [filterData, setFilterData] = useState(listData);

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "stateId") {
            const selectedOption = stateNameDrpDt.find(opt => opt.value.toString() === value.toString());
            const selectedStateLabel = selectedOption?.label || "";
            setSelectedStateName(selectedStateLabel);
        }
        if (name) {
            setValues({ ...values, [name]: value });
        }
    }

    const handleMultiSelectChange = (data, name) => {
        const { value, label } = data[0];
        if (name) {
            setValues({ ...values, [name]: value });
        }
    }

    useEffect(() => {
        if (openPage === "add") {
            reset()
        }
    }, [openPage])

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {

                const distName = row?.cwhstrDistName?.toLowerCase() || "";

                return distName?.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);

    const reset = () => {
        setValues({
            "countryId": "101", "stateId": "", "recordStatus": "1"
        })
    }

    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = listData.map(listDt => listDt.cwhnumDrugTypeId);
            setSelectedOption(allIds);
        } else {
            setSelectedOption([]);
        }
    };
    useEffect(() => {
        if (stateNameDrpDt?.length === 0) {
            getSteteNameDrpData();
        }
    }, [])

    useEffect(() => {
        if (values?.recordStatus) {
            getListData(values?.recordStatus, values?.stateId);
        }

    }, [values?.stateId, values?.recordStatus])


    const getListData = async (recStatus, state) => {
        try {
            fetchData(`/api/v1/districts/getAllDistrictList?isActive=${recStatus}&stateId=${state ? state : 0}`).then((data) => {
                if (data?.status === 1) {
                    setListData(data.data);
                } else {
                    setListData([]);
                }
            });
        } catch (error) {
            setListData([]);
        }
    };

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
        const distId = selectedOption[0]?.cwhnumDistId;
        fetchPostData(`/api/v1/districts/deleteDistrict?stateId=${values?.stateId}&districtId=${distId}`).then(data => {
            if (data?.status === 1) {
                getListData(values?.recordStatus, values?.stateId);
                ToastAlert("Record Deleted Successfully", "success")
                setSelectedOption([]);
                setConfirmSave(false);
                reset();
                setOpenPage("home")
            } else {
                ToastAlert(data?.message, 'error')
                setOpenPage("home")
            }
        })

    }


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
                        checked={selectedOption[0]?.cwhnumDistId === row.cwhnumDistId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'District Name',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
    ];

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    const removeDuplicates = (options, key = 'value') => {
        return Array.from(new Map(
            options.map(item => [item[key], item])
        ).values());
    };


    return (
        <div className="masters mx-3 my-2">

            {!isShowReport && <>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`District Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
                </div>

                {(openPage === "home" || openPage === "view" || openPage === 'delete') &&
                    <>

                        <div className="row pt-2">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Country </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='countryId'
                                        id='countryId'
                                        options={[{ label: "India", value: "101" }]}
                                        value={values?.countryId}
                                        onChange={handleValueChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> State : </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='stateId'
                                        id='stateId'
                                        placeholder='Select Value'
                                        options={stateNameDrpDt}
                                        onChange={handleValueChange}
                                        value={values?.stateId}
                                    />
                                    {/* <InputDrpSelect
                                        name='stateId'
                                        id='stateId'
                                        placeholder='Select Value'
                                        options={removeDuplicates(stateNameDrpDt, 'value')}
                                        onChange={(e) => handleMultiSelectChange(e, 'stateId')}
                                        value={values?.stateId}
                                        className="aliceblue-bg border-dark-subtle"
                                        searchable={true}
                                    // multiple={true}
                                    /> */}
                                </div>
                            </div>
                        </div>

                        <div className="row pt-1">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Record Status </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='recordStatus'
                                        id='recordStatus'
                                        options={[{ label: "Active", value: "1" },
                                        { label: "Inactive", value: "0" },
                                        ]}
                                        onChange={handleValueChange}
                                        value={values?.recordStatus}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className='my-2' />

                        <div>
                            <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null}
                                onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                        </div>

                        {openPage === 'view' &&
                            <Modal show={true} onHide={onClose} size='lg' dialogClassName="dialog-min">
                                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                    <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                </Modal.Header>
                                <Modal.Body className='px-2 py-1'>

                                    <div className='text-center'>
                                        <label><b>State Name : </b></label>&nbsp;{selectedStateName}<br />
                                        <label><b>District Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrDistName}
                                    </div>

                                    <div className='text-center mt-1'>
                                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => onClose()}>
                                            <i className="fa fa-broom me-1"></i> Close
                                        </button>
                                    </div>

                                </Modal.Body>
                            </Modal>
                        }

                    </>}

                {(openPage === "add" || openPage === 'modify') &&
                    <DistrictMasterForm setValues={setValues} values={values} getListData={getListData} setSearchInput={setSearchInput} />
                }
            </>}
            {isShowReport &&
                <MasterReport title={"District Master"} column={columns} data={listData}
                    filters={[
                        { value: "India", label: "Country" },
                        { value: stateNameDrpDt?.find(dt => dt?.value == values?.stateId)?.label, label: "State" },
                        { value: values?.recordStatus == 1 ? "Active" : "InActive", label: "Record Status" }
                    ]} />

            }

        </div>
    )
}

export default DistrictMaster


