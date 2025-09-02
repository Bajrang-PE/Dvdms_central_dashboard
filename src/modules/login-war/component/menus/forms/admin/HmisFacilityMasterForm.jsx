import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputField from '../../../InputField'
import { LoginContext } from '../../../../context/LoginContext';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchData, fetchPostData, fetchUpdateData, fetchUpdatePostData } from '../../../../../../utils/ApiHooks';
import { formatDateHmis, getAuthUserData } from '../../../../../../utils/CommonFunction';
import InputSelect from '../../../InputSelect';


const HmisFacilityMasterForm = (props) => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption, stateNameDrpDt, facilityTypeDrpDt, setShowConfirmSave, confirmSave, setConfirmSave, getFacilityTypeDrpData } = useContext(LoginContext);
    const [recordStatus, setRecordStatus] = useState('1');
    const [errors, setErrors] = useState({
        "stateIdErr": "", "facilityTypeErr": "", "noOfFacilityErr": "", "hmisDateErr": ""
    })

    const [values, setValues] = useState({
        "stateId": "", "facilityType": "", "noOfFacility": "", "hmisDate": ""
    })

    const [stateName, setStateName] = useState('');

    // const {
    //     selectedStateName
    // } = props;


    useEffect(() => {
        getFacilityTypeDrpData()
    }, [])

    const handleValueChange = (e) => {
        const { value, name } = e.target;
        const eName = name + "Err";

        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [eName]: "" });
        }
    }

    const saveHmisFacilityData = () => {

        const val = {
            "cwhnumFacilityTypeId": values.facilityType,
            "cwhdtHmisDate": values.hmisDate,
            "cwhnumStateId": values.stateId,
            "cwhnumNoofHmisFac": values.noOfFacility,
            "seatId": getAuthUserData('userSeatId')            
        }
        fetchUpdatePostData("/api/v1/hmisFacility", val).then(data => {
            if (data?.status === 1) {
                ToastAlert("Data saved successfully", "success")
                refresh();
            } else {
                ToastAlert(data?.message, "error")
                setConfirmSave(false);
            }
        })
    }

    const updateHmisFacilityData = () => {
        // alert("111111");
        const val = {

            "cwhnumFacilityTypeId": selectedOption[0]?.cwhnumFacilityTypeId,
            "cwhdtHmisDate": selectedOption[0]?.cwhdtHmisDate,
            "cwhnumStateId": selectedOption[0]?.cwhnumStateId,
            "cwhnumNoofHmisFac": selectedOption[0]?.cwhnumNoofHmisFac,
        }
        fetchUpdateData("/api/v1/hmisFacility", val).then(data => {
            if (data?.status ===1) {
                ToastAlert("Data updated successfully", "success")
                refresh();
            } else {
                ToastAlert(data?.message, "error")
                setConfirmSave(false);
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!values?.stateId) {
            setErrors(prev => ({ ...prev, stateIdErr: "State name is required" }));
            isValid = false;
        }

        if (!values?.facilityType) {
            setErrors(prev => ({ ...prev, facilityTypeErr: "Facility Type Name is required" }));
            isValid = false;
        }

        if (!values?.noOfFacility) {
            setErrors(prev => ({ ...prev, noOfFacilityErr: "No. Of Facility is required" }));
            isValid = false;
        }

        if (!values?.hmisDate.toString().trim()) {
            setErrors(prev => ({ ...prev, hmisDateErr: "Hmis Date is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateHmisFacilityData();
            } else {
                saveHmisFacilityData();
            }
        }
    }, [confirmSave])


    useEffect(() => {
        if (selectedOption?.length > 0) {
            //setProgrammeName(selectedOption[0]?.cwhstrProgrammeName)
            setRecordStatus(selectedOption[0]?.gnumIsValid?.toString())
        }
    }, [selectedOption])

    const refresh = () => {
        //  getListData(selectedGroupId,selectedSubGroupId,selectedStatus);
        setConfirmSave(false);
        setSelectedOption([]);
        reset();
        //   setSearchInput('');
        setOpenPage("home");
    }

    const reset = () => {
        setValues({ "stateId": "", "facilityType": "", "noOfFacility": "", "hmisDate": "" });
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {

            setValues({
                ...values,
                "stateId": selectedOption[0]?.cwhnumStateId,
                "facilityType": selectedOption[0]?.cwhnumFacilityTypeId,
                "noOfFacility": selectedOption[0]?.cwhnumNoofHmisFac,
                "hmisDate": formatDateHmis(selectedOption[0]?.cwhdtHmisDate),

            });

            const stnm = stateNameDrpDt?.find(st => st?.value == selectedOption[0]?.cwhnumStateId)
            setStateName(stnm?.label || "")

        }

    }, [selectedOption, openPage])

    console.log(values, 'selectedOption')

    console.log(values)
    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                        {openPage === "add" &&
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    // type={'text'}
                                    id="stateId"
                                    name="stateId"
                                    placeholder={"Select Value"}
                                    className="aliceblue-bg border-dark-subtle"
                                    options={stateNameDrpDt}
                                    value={values?.stateId}
                                    onChange={handleValueChange}
                                    errorMessage={errors?.stateIdErr}
                                />

                            </div>
                        }
                        {openPage === "modify" &&
                            <div className="col-sm-7 align-content-center">
                                {stateName}
                            </div>
                        }

                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Facility Type : </label>
                        {openPage === "add" &&
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    type={'text'}
                                    id="facilityType"
                                    name="facilityType"
                                    placeholder={"Select Value"}
                                    className="aliceblue-bg border-dark-subtle"
                                    options={facilityTypeDrpDt}
                                    value={values?.facilityType}
                                    onChange={handleValueChange}
                                    errorMessage={errors?.facilityTypeErr}
                                />
                            </div>
                        }
                        {openPage === "modify" &&
                            <div className="col-sm-7 align-content-center">
                                {values?.facilityType}
                            </div>
                        }

                    </div>
                </div>


                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">No. Of Facility : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputField
                                    type={'text'}
                                    id="noOfFacility"
                                    name="noOfFacility"
                                    placeholder="Enter No. of facility"
                                    className="aliceblue-bg border-dark-subtle"
                                    value={values?.noOfFacility}
                                    onChange={handleValueChange}
                                    errorMessage={errors?.noOfFacilityErr}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Hmis Date : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputField
                                    type="date"
                                    id="hmisDate"
                                    name="hmisDate"
                                    className='aliceblue-bg border-dark-subtle'
                                    onChange={handleValueChange}
                                    value={values?.hmisDate}
                                //value={values?.date}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {openPage === 'modify' &&
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label fix-label">
                                Record Status :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus1"
                                        value={'1'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === "1"}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        Active
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus0"
                                        value={'0'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === '0'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        InActive
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default HmisFacilityMasterForm
