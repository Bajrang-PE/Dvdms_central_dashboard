import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import InputSelect from '../../../InputSelect';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { formatDateForBackend, getAuthUserData, parseBackendDate } from '../../../../../../utils/CommonFunction';
import DatePicker from 'react-datepicker';

const StateJobdetailsForm = (props) => {

    const { stateData, setSearchInput, setStatus } = props;
    const { openPage, selectedOption, setSelectedOption, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave, getStateJobDetailsListData } = useContext(LoginContext);

    const [recordStatus, setRecordStatus] = useState('1');

    const [values, setValues] = useState({
        "stateName": "", "stateDatabase": "", "jobName": "", "stateFetchQuery": "", "insertQuery": "", "preProcedureName": "", "preProcedureMode": "", "postProcedureName": "", "procedureMode": "", "jobStartTime": new Date(), "duration": "", "lastStateTime": new Date(),
    })
    const [errors, setErrors] = useState({
        "jobNameErr": "", "stateFetchQueryErr": "", "preProcedureModeErr": ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";
        if (name && value) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const saveJobDetailsData = () => {
        const val = {
            "seatID": getAuthUserData('userSeatId'),
            "fetchQuery": values?.stateFetchQuery,
            "insertQuery": values?.insertQuery,
            "jobName": values?.jobName,
            "jobStart": formatDateForBackend(values?.jobStartTime),
            "nextRunTime": "",
            "lastRunTime": "",
            "lastStateTime": formatDateForBackend(values?.lastStateTime),
            // "jobID": 0,
            "jobDuration": parseInt(values?.duration),
            "stateID": stateData[0]?.value,
            "preProcedureName": values?.preProcedureName,
            "preProcedureMode": parseInt(values?.preProcedureMode),
            "postProcedureName": values?.postProcedureName,
            "postProcedureMode": parseInt(values?.procedureMode),
            // "isActive": recordStatus
        }
        fetchPostData(`/api/v1/stateJobDetails/createNewJob`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record created successfully', 'success');
                getStateJobDetailsListData(stateData[0]?.value, recordStatus);
                setOpenPage('home');
                reset();
                setConfirmSave(false);
                setSelectedOption([]);
                setSearchInput('');
                setStatus('1');
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const updateJobDetailsData = () => {
        const val = {
            "seatID": getAuthUserData('userSeatId'),
            "fetchQuery": values?.stateFetchQuery,
            "insertQuery": values?.insertQuery,
            "jobName": values?.jobName,
            "jobStart": formatDateForBackend(values?.jobStartTime),
            "nextRunTime": "",
            "lastRunTime": "",
            "lastStateTime": formatDateForBackend(values?.lastStateTime),
            // "jobID": selectedOption[0]?.jobID,
            "jobDuration": parseInt(values?.duration) || 0,
            "stateID": stateData[0]?.value,
            "preProcedureName": values?.preProcedureName,
            "preProcedureMode": parseInt(values?.preProcedureMode),
            "postProcedureName": values?.postProcedureName,
            "postProcedureMode": parseInt(values?.procedureMode),
            "isActive": parseInt(recordStatus) || 0
        }
        fetchUpdateData(`/api/v1/stateJobDetails/updateJob?jobID=${selectedOption[0]?.jobID}&jobName=${selectedOption[0]?.jobName}`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record updated successfully', 'success');
                getStateJobDetailsListData(stateData[0]?.value, recordStatus);
                setOpenPage('home');
                reset();
                setConfirmSave(false);
                setSelectedOption([]);
                setSearchInput('');
                setStatus('1');
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;

        if (!values?.jobName?.trim()) {
            setErrors(prev => ({ ...prev, "jobNameErr": "Job name is required" }));
            isValid = false;
        }
        if (!values?.stateFetchQuery?.trim()) {
            setErrors(prev => ({ ...prev, "stateFetchQueryErr": "Fetch query is required" }));
            isValid = false;
        }

        if (!values?.preProcedureMode?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "preProcedureModeErr": "This Procedure mode is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateJobDetailsData();
            } else {
                saveJobDetailsData();
            }
        }
    }, [confirmSave])

    useEffect(() => {
        if (selectedOption?.length > 0) {
            setValues({
                ...values,
                "jobName": selectedOption[0]?.jobName,
                "stateFetchQuery": selectedOption[0]?.fetchQuery,
                "insertQuery": selectedOption[0]?.insertQuery,
                "preProcedureName": selectedOption[0]?.preProcedureName,
                "preProcedureMode": parseInt(selectedOption[0]?.preProcedureMode) || null,
                "postProcedureName": selectedOption[0]?.postProcedureName,
                "procedureMode": parseInt(selectedOption[0]?.postProcedureMode || null),
                "jobStartTime": parseBackendDate(selectedOption[0]?.jobStart),
                "duration": selectedOption[0]?.jobDuration,
                "lastStateTime": parseBackendDate(selectedOption[0]?.lastStateTime)
            })
            setRecordStatus(selectedOption[0]?.isActive == "1" ? '1' : '0')
        }
    }, [selectedOption])

    const reset = () => {
        setRecordStatus('1')
        setConfirmSave(false);
        setValues({ "stateName": "", "stateDatabase": "", "jobName": "", "stateFetchQuery": "", "insertQuery": "", "preProcedureName": "", "preProcedureMode": "", "postProcedureName": "", "procedureMode": "", "jobStartTime": new Date(), "duration": "", "lastStateTime": new Date() });
        setErrors({ "jobNameErr": "", "stateFetchQueryErr": "", "preProcedureModeErr": "" });
    }
    console.log(selectedOption, 'values')

    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>

                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">State : </label>
                        <div className="col-sm-7 align-content-center">
                            <span style={{ color: "#013157" }}>{stateData[0]?.label || '---'}</span>
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">State Database: </label>
                        <div className="col-sm-7 align-content-center">
                            <span style={{ color: "#013157" }}>{values?.stateDatabase || 'EDB'}</span>
                        </div>
                    </div>
                </div>

                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Job Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="jobName"
                                name="jobName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.jobName}
                                onChange={handleInputChange}
                                errorMessage={errors?.jobNameErr}
                            />

                        </div>
                    </div>
                </div>
            </div>
            <div className='row pt-0' style={{ paddingBottom: "1px" }}>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">State Fetch Query : </label>
                        <div className="col-sm-7 align-content-center">
                            <textarea
                                className='form-control aliceblue-bg border-dark-subtle'
                                name="stateFetchQuery"
                                id="stateFetchQuery"
                                value={values?.stateFetchQuery}
                                onChange={handleInputChange}
                            />
                            {errors?.stateFetchQueryErr && (
                                <div className="required-input">
                                    {errors?.stateFetchQueryErr}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Insert Query : </label>
                        <div className="col-sm-7 align-content-center">
                            <textarea
                                className='form-control aliceblue-bg border-dark-subtle'
                                name="insertQuery"
                                id="insertQuery"
                                value={values?.insertQuery}
                                onChange={handleInputChange}
                            >
                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Pre Procedure Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type='text'
                                id="preProcedureName"
                                name="preProcedureName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.preProcedureName}
                                onChange={handleInputChange}
                            // errorMessage={errors?.drugnameErr}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Pre Procedure Mode : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="preProcedureMode"
                                name="preProcedureMode"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.preProcedureMode}
                                onChange={handleInputChange}
                                errorMessage={errors?.preProcedureModeErr}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row pt-0'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Post Procedure Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="postProcedureName"
                                name="postProcedureName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.postProcedureName}
                                onChange={handleInputChange}
                            // errorMessage={errors?.drugnameErr}
                            />
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Procedure Mode : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="procedureMode"
                                name="procedureMode"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.procedureMode}
                                onChange={handleInputChange}
                            // errorMessage={errors?.drugnameErr}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row pt-0'>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label fix-label">Job Start Time : </label>
                        <div className="col-sm-7 align-content-center position-relative d-inline-block">
                            <DatePicker
                                name='jobStartTime'
                                selected={values?.jobStartTime}
                                onChange={(date) => {
                                    setValues({ ...values, 'jobStartTime': date });
                                    setErrors({ ...errors, 'expiryDateErr': '' })
                                }}
                                showTimeSelect
                                timeFormat="HH:mm:ss"
                                timeIntervals={1}
                                timeCaption="Time"
                                dateFormat="dd-MMM-yyyy HH:mm:ss"
                                isClearable={false}
                                placeholderText={'Select Date and Time...'}
                                autoComplete="off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                className="datepicker form-control form-control-sm aliceblue-bg border-dark-subtle"
                            // readOnly={openPageName === 'view'}
                            // minDate={effDate}
                            />
                            <span className='position-absolute top-50 end-0 translate-middle-y me-3 pointer'>
                                📅</span>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label fix-label">Last State Time : </label>
                        <div className="col-sm-7 align-content-center position-relative d-inline-block">
                            <DatePicker
                                name='lastStateTime'
                                selected={values?.lastStateTime}
                                onChange={(date) => {
                                    setValues({ ...values, 'lastStateTime': date });
                                    setErrors({ ...errors, 'expiryDateErr': '' })
                                }}
                                showTimeSelect
                                timeFormat="HH:mm:ss"
                                timeIntervals={1}
                                timeCaption="Time"
                                dateFormat="dd-MMM-yyyy HH:mm:ss"
                                isClearable={false}
                                placeholderText={'Select Date and Time...'}
                                autoComplete="off"
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                className="datepicker form-control form-control-sm aliceblue-bg border-dark-subtle"
                            // readOnly={openPageName === 'view'}
                            // minDate={effDate}
                            />
                            <span className='position-absolute top-50 end-0 translate-middle-y me-3 pointer'>
                                📅</span>
                        </div>
                    </div>

                </div>
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label fix-label">Duration : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="duration"
                                name="duration"
                                placeholder={"Select Value"}
                                className={"aliceblue-bg border-dark-subtle"}
                                options={[{ value: 24, label: "24 Hours" }]}
                                onChange={handleInputChange}
                                value={values?.duration}
                            // errorMessage={errors?.drugTypeIdErr}
                            />
                        </div>
                    </div>
                    {openPage === 'modify' &&

                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label fix-label">
                                Record Status :
                            </label>
                            <div className="col-sm-7 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus"
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
                                        id="recordStatus"
                                        value={'0'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === "0"}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        InActive
                                    </label>
                                </div>
                            </div>
                        </div>

                    }
                </div>
            </div>
        </div>
    )
}

export default StateJobdetailsForm
