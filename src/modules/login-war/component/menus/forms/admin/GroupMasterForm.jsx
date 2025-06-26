import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const GroupMasterForm = ({ setSearchInput }) => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption, getGroupListData, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [groupName, setGroupName] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active');
    const [errors, setErrors] = useState({
        "groupNameErr": ""
    })

    const saveGroupData = () => {
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            "groupName": groupName,
            "status": "Active"
        }
        fetchPostData(`api/v1/Group`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record created successfully', 'success');
                getGroupListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const updateGroupData = () => {
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            "groupName": groupName,
            "status": recordStatus,
            "groupId": selectedOption[0]?.groupId,
            "isValid": 1,
        }
        fetchUpdateData(`api/v1/Group/${selectedOption[0]?.groupId}`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record Updated Successfully', 'success');
                getGroupListData();
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
        if (!groupName?.trim()) {
            setErrors(prev => ({ ...prev, "groupNameErr": "Group name is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateGroupData();
            } else {
                saveGroupData();
            }
        }
    }, [confirmSave])


    useEffect(() => {
        if (selectedOption?.length > 0) {
            setGroupName(selectedOption[0]?.groupName)
            setRecordStatus(selectedOption[0]?.status)
        }
    }, [selectedOption])

    const reset = () => {
        setGroupName('');
        setRecordStatus('Active');
        setConfirmSave(false);
        setSearchInput('');
    }
    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Group Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="groupName"
                                name="groupName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={groupName}
                                onChange={(e) => { setGroupName(e.target?.value); setErrors({ ...errors, "groupNameErr": "" }) }}
                                errorMessage={errors?.groupNameErr}
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

export default GroupMasterForm
