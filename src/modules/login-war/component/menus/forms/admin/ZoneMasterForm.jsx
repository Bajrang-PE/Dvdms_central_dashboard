import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputField from '../../../InputField'
import { LoginContext } from '../../../../context/LoginContext';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchData, fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';

const ZoneMasterForm = ({setSearchInput}) => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption, getZoneListData, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [zoneName, setZoneName] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active');
    const [singleData, setSingleData] = useState([]);
    const [errors, setErrors] = useState({
        "zoneNameErr": ""
    })

    const getSingleData = (id) => {
        fetchData(`/api/v1/zones/${id}`).then(data => {
            if (data?.status ===1 ) {
                setSingleData([data?.data]);
            } else {
                ToastAlert('Error while fetching data!', 'error')
            }
        })
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            getSingleData(selectedOption[0]?.cwhnumZoneId)
        }
    }, [selectedOption, openPage])


    const saveZoneData = () => {
        const val = {
            "gnumSeatid": 10001,
            "cwhstrZoneName": zoneName,
            "status": "Active"
        }
        fetchPostData(`/api/v1/zones`, val).then(data => {
            if (data?.status ===1) {
                ToastAlert('Record added successfully', 'success');
                getZoneListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const updateZoneData = () => {
        const val = {
            "gnumSeatid": 10001,
            "cwhstrZoneName": zoneName,
            "status": recordStatus,
            "cwhnumZoneId": selectedOption[0]?.cwhnumZoneId,
            "cwhstrZoneShortName": "",
            "cwhnumFlagForNhm": 0,
        }
        fetchUpdateData(`/api/v1/zones/${selectedOption[0]?.cwhnumZoneId}`, val).then(data => {
            if (data?.status ===1) {
                ToastAlert('Record Updated Successfully', 'success');
                getZoneListData();
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
        if (!zoneName?.trim()) {
            setErrors(prev => ({ ...prev, "zoneNameErr": "Zone name is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateZoneData();
            } else {
                saveZoneData();
            }
        }
    }, [confirmSave])


    useEffect(() => {
        if (singleData?.length > 0) {
            setZoneName(singleData[0]?.cwhstrZoneName)
            setRecordStatus(singleData[0]?.status)
        }
    }, [singleData])

    const reset = () => {
        setZoneName('');
        setRecordStatus('Active');
        setConfirmSave(false);
        setSearchInput('')
    }
    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset}/>
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Zone Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="zonename"
                                name="zonename"
                                placeholder="Enter ZoneName"
                                className="aliceblue-bg border-dark-subtle"
                                value={zoneName}
                                onChange={(e) => { setZoneName(e.target?.value); setErrors({ ...errors, "zoneNameErr": "" }) }}
                                errorMessage={errors?.zoneNameErr}
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
                                        value={'Inactive'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === 'Inactive'}
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

export default ZoneMasterForm
