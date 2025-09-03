import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const FacilityTypeMasterForm = ({setSearchInput}) => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption, getFacilityTypeListData, setShowConfirmSave, confirmSave,setConfirmSave } = useContext(LoginContext);
    const [facilityName, setFacilityName] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active');
    const [errors, setErrors] = useState({
        "facilityNameErr": ""
    })

    const saveFacilityTypeData = () => {
        const val = {
            "gnumSeatId": getAuthUserData('userSeatId'),
            "cwhstrFacilityTypeName": facilityName,
            "status": "Active"
        }
        fetchPostData(`/api/v1/Facility/create`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record created successfully', 'success');
                getFacilityTypeListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const updateFacilityTypeData = () => {
        const val = {
            "gnumSeatId": getAuthUserData('userSeatId'),
            "cwhstrFacilityTypeName": facilityName,
            "status": recordStatus,
            "cwhnumFacilityTypeId": selectedOption[0]?.cwhnumFacilityTypeId,
            "cwhstrFacilityTypeShortName": "",
            "cwhnumNinFacilityTypeId": 0,
            "cwhnumOrder": 0,
        }
        fetchUpdateData(`/api/v1/Facility/${selectedOption[0]?.cwhnumFacilityTypeId}`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record Updated Successfully', 'success');
                getFacilityTypeListData();
                setOpenPage('home');
                reset();
                setSelectedOption([]);
                setConfirmSave(false);
            } else {
                ToastAlert(data?.message, "error")
                setConfirmSave(false);
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!facilityName?.trim()) {
            setErrors(prev => ({ ...prev, "facilityNameErr": "Facility Name is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateFacilityTypeData();
            } else {
                saveFacilityTypeData();
            }
        }
    }, [confirmSave])

    useEffect(() => {
        if (selectedOption?.length > 0) {
            setFacilityName(selectedOption[0]?.cwhstrFacilityTypeName)
            setRecordStatus(selectedOption[0]?.status)
        }
    }, [selectedOption])

    const reset = () => {
        setFacilityName('');
        setRecordStatus('Active')
        setConfirmSave(false);
        setSearchInput(false);
    }

    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Facility Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="facilityName"
                                name="facilityName"
                                placeholder="Enter facilityName"
                                className="aliceblue-bg border-dark-subtle"
                                value={facilityName}
                                onChange={(e) => { setFacilityName(e.target?.value); setErrors({ ...errors, "facilityNameErr": "" }) }}
                                errorMessage={errors?.facilityNameErr}
                            />
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
                                        value={'Active'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === "Active"}
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
                                        value={'InActive'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === 'InActive'}
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

export default FacilityTypeMasterForm
