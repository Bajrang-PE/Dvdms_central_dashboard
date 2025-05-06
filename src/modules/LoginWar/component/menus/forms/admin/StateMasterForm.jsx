import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../InputField'
import GlobalButtons from '../../GlobalButtons'
import { LoginContext } from '../../../../context/LoginContext';
import InputSelect from '../../../InputSelect';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';

const StateMasterForm = () => {

    const { openPage, selectedOption, setOpenPage, setSelectedOption, getStateListData, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const [values, setValues] = useState({
        stateName: "", stShortName: "", zoneName: "", recStatus: "1"
    })
    const [errors, setErrors] = useState({
        stateNameErr: "", stShortNameErr: "", zoneNameErr: "", recStatusErr: ""
    })

    const handleValueChange = (e) => {
        const { value, name } = e.target;
        const errName = name + "Err";
        if (name && value) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const saveStateListData = () => {
        const { stateName, stShortName, zoneName, recStatus } = values;
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            "stateName": stateName,
            "stateShortName": stShortName,
            "zoneId": zoneName,
        }
        fetchPostData(`api/v1/State`, val).then(data => {
            if (data) {
                ToastAlert('Record created successfully', 'success');
                getStateListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert('error while creating record!', "error");
                setConfirmSave(false);
            }
        })
    }
    const updateStateListData = () => {
        const { stateName, stShortName, zoneName, recStatus } = values;
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            "stateName": stateName,
            "stateShortName": stShortName,
            "zoneId": zoneName,
            "isValid": recStatus,
            "stateId": selectedOption[0]?.stateId,
            "backgroundColor": "",
            "fontColor": "",
            "graphColor": "",
            "order": '',
            "isDataEntryState": '',
            "oldStateId": "",
            "zoneIdByNhm": "",
            "implementationAgency": "",
            "mouDate": "",
            "goLiveDate": "",
            "ninStateId": '',
            "stateGroup": '',
            "lgdCode": ''

        }
        fetchUpdateData(`api/v1/State/${selectedOption[0]?.stateId}`, val).then(data => {
            if (data) {
                ToastAlert('Record updated successfully', 'success');
                getStateListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
                setSelectedOption([])
            } else {
                ToastAlert('error while updating record!', "error");
                setConfirmSave(false);
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!values?.stateName?.trim()) {
            setErrors(prev => ({ ...prev, "stateNameErr": "State Name is required" }));
            isValid = false;
        }
        if (!values?.stShortName?.trim()) {
            setErrors(prev => ({ ...prev, "stShortNameErr": "Short Name is required" }));
            isValid = false;
        }
        if (!values?.zoneName?.trim()) {
            setErrors(prev => ({ ...prev, "zoneNameErr": "Zone Name is required" }));
            isValid = false;
        }
        if (!values?.recStatus?.trim() && openPage === 'modify') {
            setErrors(prev => ({ ...prev, "recStatusErr": "Please select record status" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateStateListData();
            } else {
                saveStateListData();
            }
        }
    }, [confirmSave])

    useEffect(() => {
        if (selectedOption?.length > 0) {
            setValues({
                ...values,
                "stateName": selectedOption[0]?.stateName, "stShortName": selectedOption[0]?.stateShortName, "zoneName": selectedOption[0]?.zoneId?.toString(), "recStatus": selectedOption[0]?.isValid?.toString()
            })
        }
    }, [selectedOption])


    const reset = () => {
        setValues({ stateName: "", stShortName: "", zoneName: "", recStatus: "1" });
        setErrors({ stateNameErr: "", stShortNameErr: "", zoneNameErr: "", recStatusErr: "" })
        setConfirmSave(false);
    }

    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">State Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="stateName"
                                name="stateName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.stateName}
                                onChange={handleValueChange}
                                errorMessage={errors?.stateNameErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">State Short Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="stShortName"
                                name="stShortName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.stShortName}
                                onChange={handleValueChange}
                                errorMessage={errors?.stShortNameErr}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Zone Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="zoneName"
                                name="zoneName"
                                placeholder="Select Status"
                                options={[{ value: "1", label: '1' }, { value: "2", label: '2' }]}
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.zoneName}
                                onChange={handleValueChange}
                                errorMessage={errors?.zoneNameErr}
                            />
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
                                            onChange={handleValueChange}
                                            checked={values?.recStatus === "1"}
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
                                            onChange={handleValueChange}
                                            checked={values?.recStatus === '0'}
                                        />
                                        <label className="form-check-label" htmlFor="dbNo">
                                            InActive
                                        </label>
                                    </div>
                                </div>
                                {errors?.recStatusErr && (
                                    <div className="required-input">
                                        {errors?.recStatusErr}
                                    </div>
                                )}
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default StateMasterForm
