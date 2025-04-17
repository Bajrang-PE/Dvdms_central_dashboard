import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import InputSelect from '../../../InputSelect';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const GenericDrugMasterForm = (props) => {
    const { subGrpData, groupData, groupId } = props;
    const { openPage, selectedOption, setOpenPage, setSelectedOption, setShowConfirmSave, confirmSave, setConfirmSave, getGenericDrugListData } = useContext(LoginContext);
    const [recordStatus, setRecordStatus] = useState('1');

    const [values, setValues] = useState({
        "groupName": "", "subGroupName": "", "drugtype": "", "VEDType": "", "categoryName": "", "drugname": ""
    })
    const [errors, setErrors] = useState({
        "groupNameErr": "", "subGroupNameErr": "", "VEDTypeErr": "", "categoryNameErr": "", "drugnameErr": ""
    })

    const handleInputChange = (e) => {
        const { name, value } = e?.target;
        const errName = name + "Err";
        if (name && value) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const saveGenericDrugData = () => {
        const val = {
            "seatId": getAuthUserData('userSeatId'),
            "drugName": values?.drugname,
            "groupId": groupId,
            "subgroupId": values?.subGroupName,
            "drugTypeId": values?.drugtype,
            "drugCatCode": values?.categoryName,
            "drugVedCode": values?.VEDType,
            "isValid": recordStatus,
            "isMotherHealth": 0
        }
        fetchPostData(`api/v1/drugs`, val).then(data => {
            if (data) {
                ToastAlert('Record created successfully', 'success');
                getGenericDrugListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert('error while creating record!', "error");
            }
        })
    }

    const updateGenericDrugData = () => {
        const val = {
            "centralDrugId": selectedOption[0]?.centralDrugId,
            "seatId": getAuthUserData('userSeatId'),
            "drugName": values?.drugname,
            "groupId": groupId,
            "subgroupId": values?.subGroupName,
            "drugTypeId": values?.drugtype,
            "drugCatCode": values?.categoryName,
            "drugVedCode": values?.VEDType,
            "isValid": recordStatus,
            "isMotherHealth": 0
        }
        fetchUpdateData(`api/v1/drugs/${selectedOption[0]?.centralDrugId}`, val).then(data => {
            if (data) {
                ToastAlert('Record updated successfully', 'success');
                getGenericDrugListData();
                setOpenPage('home');
                reset();
                setConfirmSave(false);
            } else {
                ToastAlert('error while creating record!', "error");
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!groupId?.trim()) {
            setErrors(prev => ({ ...prev, "groupNameErr": "Group name is required" }));
            isValid = false;
        }
        if (!values?.subGroupName?.trim()) {
            setErrors(prev => ({ ...prev, "subGroupNameErr": "Sub group is required" }));
            isValid = false;
        }
        if (!values?.VEDType?.trim()) {
            setErrors(prev => ({ ...prev, "VEDTypeErr": "Select a value" }));
            isValid = false;
        }
        if (!values?.categoryName?.trim()) {
            setErrors(prev => ({ ...prev, "categoryNameErr": "Category name is required" }));
            isValid = false;
        }
        if (!values?.drugname?.trim()) {
            setErrors(prev => ({ ...prev, "drugnameErr": "Drug name is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateGenericDrugData();
            } else {
                saveGenericDrugData();
            }
        }
    }, [confirmSave])

    useEffect(() => {
        if (selectedOption?.length > 0) {
            setValues({
                ...values,
                "groupName": selectedOption[0]?.groupId, "subGroupName": selectedOption[0]?.subgroupId, "drugtype": selectedOption[0]?.drugTypeId, "VEDType": selectedOption[0]?.drugVedCode, "categoryName": selectedOption[0]?.drugCatCode, "drugname": selectedOption[0]?.drugName
            })
        }
    }, [selectedOption])

    const reset = () => {
        setRecordStatus('Active')
        setConfirmSave(false);
        setValues({ "groupName": "", "subGroupName": "", "drugtype": "", "VEDType": "", "categoryName": "", "drugname": "" });
        setErrors({ "groupNameErr": "", "subGroupNameErr": "", "VEDTypeErr": "", "categoryNameErr": "", "drugnameErr": "" });
    }

    const categoryOptions = [
        { value: "10", label: "P" },
        { value: "11", label: "S" },
        { value: "12", label: "T" },
        { value: "13", label: "P,S" },
        { value: "14", label: "P,T" },
        { value: "15", label: "S,T" },
        { value: "16", label: "P,S,T" }
    ];

    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Group Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <span style={{ color: "#013157" }}>{groupData?.filter(dt => dt?.value == groupId)[0]?.label || '---'}</span>
                            {errors?.groupNameErr && (
                                <div className="required-input">
                                    {errors?.groupNameErr}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Sub Group Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="subGroupName"
                                name="subGroupName"
                                placeholder="Select value"
                                options={subGrpData}
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.subGroupName}
                                onChange={handleInputChange}
                                errorMessage={errors?.subGroupNameErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Drug Type : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="drugtype"
                                name="drugtype"
                                placeholder="Select value"
                                options={[]}
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.drugtype}
                                onChange={handleInputChange}

                            />
                        </div>
                    </div>
                </div>

                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">VED Type : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="VEDType"
                                name="VEDType"
                                placeholder="Select value"
                                options={[]}
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.VEDType}
                                onChange={handleInputChange}
                                errorMessage={errors?.VEDTypeErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Drug Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="drugname"
                                name="drugname"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.drugname}
                                onChange={handleInputChange}
                                errorMessage={errors?.drugnameErr}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label fix-label required-label">
                            Category Name :
                        </label>
                        <div className="col-sm-7 align-content-center">
                            {categoryOptions.map((option) => (
                                <div className="form-check form-check-inline" key={option.value}>
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="categoryName"
                                        id={`categoryName-${option.value}`}
                                        value={option.value}
                                        onChange={handleInputChange}
                                        checked={values?.categoryName === option.value}
                                    />
                                    <label className="form-check-label" htmlFor={`categoryName-${option.value}`}>
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                            {errors?.categoryNameErr && (
                                <div className="required-input">
                                    {errors?.categoryNameErr}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default GenericDrugMasterForm
