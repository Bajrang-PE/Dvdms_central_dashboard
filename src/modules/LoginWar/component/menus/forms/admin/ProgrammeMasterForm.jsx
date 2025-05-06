import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputField from '../../../InputField'
import { LoginContext } from '../../../../context/LoginContext';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchData, fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const ProgrammeMasterForm = () => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption, getProgrammeListData, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [programmeName, setProgrammeName] = useState('');
    const [recordStatus, setRecordStatus] = useState('1');
    const [singleData, setSingleData] = useState([]);
    const [errors, setErrors] = useState({
        "programmeNameErr": ""
    })

    // const getSingleData = (id) => {
    //     fetchData(`api/v1/zones/${id}`).then(data => {
    //         if (data) {
    //             setSingleData([data]);
    //         } else {
    //             ToastAlert('Error while fetching data!', 'error')
    //         }
    //     })
    // }

    // useEffect(() => {
    //     if (selectedOption?.length > 0 && openPage === 'modify') {
    //         getSingleData(selectedOption[0]?.cwhnumZoneId)
    //     }
    // }, [selectedOption, openPage])


    const saveProgrammeData = () => {
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            // "cwhnumProgrammeId":programmeId,
            "cwhstrProgrammeName": programmeName,
            "status": "Active"
        }
        fetchPostData(`/api/v1/programmes`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record created successfully', 'success');
                setOpenPage('home');
                getProgrammeListData();
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert(data?.message, "error");
            }
        })
    }

    const updateProgrammeData = () => {
       // alert("111111");
        const val = {
            "gnumSeatid": 10001,
          //  "gnumSeatid": getAuthUserData('userSeatId'),
            "cwhstrProgrammeName": programmeName,
            "gnumIsValid": recordStatus,
            "cwhnumProgrammeId": selectedOption[0]?.cwhnumProgrammeId,
          //  "centralDrugId": selectedOption[0]?.centralDrugId,
           // "cwhstrProgrammeShortName": "",
            //"cwhnumFlagForNhm": 0,
        }
        fetchUpdateData(`api/v1/programmes`, val).then(data => {
            console.log("data :::",data);
            if (data?.status === 1) {

                ToastAlert('Record Updated Successfully', 'success');
                setOpenPage('home');
                getProgrammeListData();
               // setOpenPage('home');
                reset();
                setSelectedOption([]);
                setConfirmSave(false);
            } else {
                ToastAlert('error while updating record!', error)
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!programmeName?.trim()) {
            setErrors(prev => ({ ...prev, "programmeNameErr": "Programme name is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateProgrammeData();
            } else {
                saveProgrammeData();
            }
        }
    }, [confirmSave])


    useEffect(() => {
        if (selectedOption?.length > 0) {
            setProgrammeName(selectedOption[0]?.cwhstrProgrammeName)
            setRecordStatus(selectedOption[0]?.gnumIsValid?.toString())
        }
    }, [selectedOption])

    const reset = () => {
        setProgrammeName('');
        setRecordStatus('Active');
        setConfirmSave(false);
    }
    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Programme Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="programmename"
                                name="programmename"
                                placeholder="Enter Programme Name"
                                className="aliceblue-bg border-dark-subtle"
                                value={programmeName}
                                onChange={(e) => { setProgrammeName(e.target?.value); setErrors({ ...errors, "programmeNameErr": "" }) }}
                                errorMessage={errors?.programmeNameErr}
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

export default ProgrammeMasterForm
