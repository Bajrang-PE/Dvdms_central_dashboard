import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../component/dashboard/DashHeader'
import { fetchPostData } from '../../../utils/ApiHooks'
import { getAuthUserData, sanitizeInput, validateInput } from '../../../utils/CommonFunction'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { ToastAlert } from '../utils/CommonFunction'
import { LoginContext } from '../context/LoginContext'

import ModernDashHeader from '../component/dashboard/ModernDashHeader'

const ChangeDvdmsPass = () => {
    const { setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [isShowOldPassword, setIsShowOldPassword] = useState(false);
    const [isShowNewPassword, setIsShowNewPassword] = useState(false);
    const [isShowCnfPassword, setIsShowCnfPassword] = useState(false);
    const [values, setValues] = useState({
        "oldPassword": "", "newPassword": "", "confirmPassword": ""
    })

    const [errors, setErrors] = useState({
        "oldPasswordErr": "", "newPasswordErr": "", "confirmPasswordErr": ""
    })

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + 'Err';
        if (name) {
            setValues({ ...values, [name]: value })
            setErrors({ ...errors, [errName]: "" })
        }
    }

    const callApiForChangePass = () => {
        const val = {
            "userId": getAuthUserData('userId'),
            "currentPassword": values?.oldPassword,
            "username": getAuthUserData('username'),
            "newPassword": values?.newPassword,
        }
        console.log('val', val)
        fetchPostData("/api/v1/change-password", val).then(data => {
            console.log('data', data)
            if (data?.status === 1) {
                ToastAlert('Password Changed Successfully', 'success');
                setConfirmSave(false);
            } else {
                ToastAlert(data.message, 'error');
                setConfirmSave(false);
            }
        })

    }

    const saveChangePassword = (e) => {
        e?.preventDefault();
        let isValid = true;

        if (!values?.oldPassword?.trim()) {
            setErrors(prev => ({ ...prev, "oldPasswordErr": "Old password is required" }));
            isValid = false;
        }
        if (!values?.newPassword?.trim()) {
            setErrors(prev => ({ ...prev, "newPasswordErr": "New password is required" }));
            isValid = false;
        }
        if (!values?.confirmPassword?.trim()) {
            setErrors(prev => ({ ...prev, "confirmPasswordErr": "Confirm password is required" }));
            isValid = false;
        }
        if (values?.newPassword?.trim() && values?.confirmPassword?.trim() && values?.newPassword !== values?.confirmPassword) {
            setErrors(prev => ({ ...prev, "confirmPasswordErr": "Confirm password and new password should be same" }));
            isValid = false;
        }

        if (!validateInput(values?.newPassword) || !validateInput(values?.oldPassword)) {
            ToastAlert('html like tags and formulas start with =, are not allowed!', 'warning')
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            callApiForChangePass();
        }
    }, [confirmSave])

    const reset = () => {
        setValues({ "oldPassword": "", "newPassword": "", "confirmPassword": "" });
        setErrors({ "oldPasswordErr": "", "newPasswordErr": "", "confirmPasswordErr": "" });
    }

    return (
        <>
            {/* <DashHeader /> */}
            <ModernDashHeader/>
            <div className='text-center w-100 fw-bold p-1 heading-text' >Change Password Details</div>
            <div className='container change-pass-container'>
                <div className='form-card m-auto p-2' style={{ borderBottom: "2px solid #000e4e" }}>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label">Old Password : </label>
                        <div className="col-sm-8 align-content-center">
                            <div className="input-group input-group-sm">
                                <input
                                    type={isShowOldPassword ? 'text' : 'password'}
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    placeholder="Old Password"
                                    name='oldPassword'
                                    id='oldPassword'
                                    onChange={handleValueChange}
                                    value={values?.oldPassword}
                                />
                                <span className="input-group-text aliceblue-bg pointer" id="basic-addon1"
                                    onClick={() => setIsShowOldPassword(!isShowOldPassword)}>
                                    <FontAwesomeIcon icon={isShowOldPassword ? faEye : faEyeSlash} className="dropdown-gear-icon me-1" />
                                </span>
                            </div>
                            {errors?.oldPasswordErr &&
                                <div className="required-input">
                                    {errors?.oldPasswordErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label">New Password : </label>
                        <div className="col-sm-8 align-content-center">
                            <div className="input-group input-group-sm">
                                <input
                                    type={isShowNewPassword ? 'text' : 'password'}
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    placeholder="New Password"
                                    name='newPassword'
                                    id='newPassword'
                                    onChange={handleValueChange}
                                    value={values?.newPassword}
                                />
                                <span className="input-group-text aliceblue-bg pointer" id="basic-addon1"
                                    onClick={() => setIsShowNewPassword(!isShowNewPassword)}>
                                    <FontAwesomeIcon icon={isShowNewPassword ? faEye : faEyeSlash} className="dropdown-gear-icon me-1" />
                                </span>
                            </div>
                            {errors?.newPasswordErr &&
                                <div className="required-input">
                                    {errors?.newPasswordErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label">Confirm Password : </label>
                        <div className="col-sm-8 align-content-center">
                            <div className="input-group input-group-sm">
                                <input
                                    type={isShowCnfPassword ? 'text' : 'password'}
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    placeholder="Confirm Password"
                                    name='confirmPassword'
                                    id='confirmPassword'
                                    onChange={handleValueChange}
                                    value={values?.confirmPassword}
                                />
                                <span className="input-group-text aliceblue-bg pointer" id="basic-addon1"
                                    onClick={() => setIsShowCnfPassword(!isShowCnfPassword)}>
                                    <FontAwesomeIcon icon={isShowCnfPassword ? faEye : faEyeSlash} className="dropdown-gear-icon me-1" />
                                </span>
                            </div>
                            {errors?.confirmPasswordErr &&
                                <div className="required-input">
                                    {errors?.confirmPasswordErr}
                                </div>
                            }
                        </div>
                    </div>

                    <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                    </div>

                    <div className='text-center'>
                        <button className='btn btn-sm new-btn-blue py-0' onClick={(e) => saveChangePassword(e)}>
                            <i className="fa fa-save me-1"></i>
                            Save</button>
                        <button className='btn btn-sm new-btn-blue py-0' onClick={() => reset()}>  <i className="fa fa-broom me-1"></i>Clear</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangeDvdmsPass
