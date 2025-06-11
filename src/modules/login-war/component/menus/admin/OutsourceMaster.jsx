import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext'
import GlobalTable from '../../GlobalTable'
import { fetchData, fetchDeleteData, fetchPatchData } from '../../../../../utils/ApiHooks'
import OutsourceMasterForm from '../forms/OutsourceMasterForm'
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction'
import { Modal } from 'react-bootstrap'

const OutsourceMaster = () => {


    const [values, setValues] = useState({
        "stateId": "", "facilityTypeId": "", "date": "", "recordStatus": "1"
    })

    const [errors, setErrors] = useState({
        "stateIdErr": "", "facilityTypeIdErr": "", "dateErr": ""
    })

    const { getSteteNameDrpData, stateNameDrpDt, openPage, setOpenPage, selectedOption, setSelectedOption, getFacilityTypeDrpData, facilityTypeDrpDt, getDateDrpData, dateDrpDt, setConfirmSave, confirmSave, setShowConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [listData, setListData] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedState, setSelectedState] = useState("")
    const [selectedFacility, setSelectedFacility] = useState("")
    const [filterData, setFilterData] = useState(listData);
 

    const validate = () => {
        let isValid = true;
        if (!values?.stateId.trim()) {
            setErrors(prev => ({ ...prev, stateIdErr: "Please select state" }));
            // setOpenPage("home")
            isValid = false
        }
        if (!values?.facilityTypeId.trim()) {
            setErrors(prev => ({ ...prev, facilityTypeIdErr: "Please select facility type" }));
            isValid = false;
            // setOpenPage("home")
        }

        return isValid;
    }

    useEffect(() => {
        getSteteNameDrpData()
        getFacilityTypeDrpData()
        getDateDrpData()
    }, [])

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const storeName = row?.storeName?.toLowerCase() || "";
                const state = row?.stateName?.toLowerCase() || "";
                const testsRaised = row?.testsRaised?.toString() || "";
                const date = row?.date?.toString() || "";

                return storeName?.includes(lowercasedText) || state?.includes(lowercasedText) || testsRaised?.includes(lowercasedText) || date?.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);

    useEffect(() => {
        getListData();
    }, [values?.stateId, values?.facilityTypeId, values?.date, values?.recordStatus])

    const getListData = () => {

        //alert("called")
        const val = {
            "stateID": values?.stateId || 0,
            "facilityTypeID": values?.facilityTypeId || 0,
            "isValid": values?.recordStatus || 0,
            "date": values?.date.toString() || 0
        }

        fetchData('http://10.226.26.247:8025/api/v1/outsourceMaster/getOutsourceMappingDetails', val).then(data => {
            if (data.status == 1) {
                setListData(data.data)
            } else {
                setListData([])
            }
        })
    }

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "stateId") {
            const selectedOption = stateNameDrpDt.find(opt => opt.value.toString() === value.toString());
            const selectedStateLabel = selectedOption?.label || "";
            setSelectedState(selectedStateLabel);
        }
        if (name === "facilityTypeId") {
            const selectedOption = facilityTypeDrpDt.find(opt => opt.value.toString() === value.toString());
            const selectedFacilityLabel = selectedOption?.label || "";
            setSelectedFacility(selectedFacilityLabel);
        }

        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
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
                        checked={selectedOption[0]?.recordID === row.recordID}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Store Name',
            selector: row => row.storeName,
            sortable: true,
        },
        {
            name: 'State',
            selector: row => row.stateName,
            sortable: true,
        },
        {
            name: 'Number of Tests',
            selector: row => row.testsRaised,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date.slice(0, 10),
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

        // const val={
        //     recordID:[selectedOption[0].recordID],
        //     isActive:"0"     
        // }

        fetchPatchData(`http://10.226.26.247:8025/api/v1/outsourceMaster/updateMappingStatus?recordID=${[selectedOption[0].recordID]}&isActive=${0}`).then(data => {
            if (data) {
                ToastAlert('Data deleted successfully', 'success')
                setConfirmSave(false);
                setSelectedOption([]);
                setOpenPage("home");
                getListData();
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
            }

        })
    }

    return (
        <>
            <div className="masters mx-3 my-2">


                <div className='masters-header row'>
                    <span className='col-6'><b>{`Outsource Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
                </div>

                {(openPage === "home" || openPage === "view" || openPage === "delete") &&
                    <>
                        <div className="row">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fixed-label required-label">State</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg border-dark-subtle"
                                        name='stateId'
                                        id='stateId'
                                        placeholder={"Select Value"}
                                        options={stateNameDrpDt}
                                        value={values?.stateId}
                                        onChange={handleValueChange}
                                        errorMessage={errors?.stateIdErr}

                                    />

                                </div>
                            </div>

                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fixed-label required-label">Facility Type</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg border-dark-subtle"
                                        name='facilityTypeId'
                                        id='facilityTypeId'
                                        placeholder={"Select Value"}
                                        options={facilityTypeDrpDt}
                                        value={values?.facilityTypeId}
                                        onChange={handleValueChange}
                                        errorMessage={errors?.facilityTypeIdErr}

                                    />

                                </div>

                            </div>
                        </div>

                        <div className="row">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fixed-label required-label">Date</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg border-dark-subtle"
                                        name='date'
                                        id='date'
                                        placeholder={"Select Value"}
                                        options={dateDrpDt}
                                        value={values?.date}
                                        onChange={handleValueChange}
                                        errorMessage={errors?.dateErr}

                                    />

                                </div>

                            </div>

                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg border-dark-subtle"
                                        name='recordStatus'
                                        id='recordStatus'
                                        options={[{ label: "Active", value: "1" },
                                        { label: "Inactive", value: "0" }
                                        ]}
                                        value={values?.recordStatus}
                                        onChange={handleValueChange}

                                    />

                                </div>

                            </div>
                        </div>

                        <hr className='my-2' />

                        <div>
                            <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null}
                                onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} onValidate={validate} />
                        </div>

                        {openPage === 'view' &&
                            <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                    <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                </Modal.Header>
                                <Modal.Body className='px-2 py-1'>

                                    <div className='text-left'>
                                        <label><b>Store Name : </b></label>&nbsp;{selectedOption[0].storeName}<br />
                                        <label><b>State : </b></label>&nbsp;{selectedOption[0].stateName}<br />
                                        <label><b>Number of Tests : </b></label>&nbsp;{selectedOption[0].testsRaised}<br />
                                        <label><b>Date : </b></label>&nbsp;{selectedOption[0].date.slice(0, 10)}<br />
                                    </div>

                                    <div className='text-center mt-1'>

                                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                            <i className="fa fa-broom me-1"></i> Close
                                        </button>
                                    </div>

                                </Modal.Body>
                            </Modal>
                        }

                    </>
                }

                {(openPage === "add" || openPage === "modify") &&
                    <OutsourceMasterForm stateDtl={selectedState} facilityDtl={selectedFacility}
                        stId={values?.stateId} facilityId={values?.facilityTypeId} getListData={getListData}
                    />
                }

            </div>
        </>
    )
}

export default OutsourceMaster