import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import InputSelect from '../../../InputSelect';
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';
import { categoryOptions, vedOptions } from '../../../../localData/HomeData';

const GenericDrugMasterForm = (props) => {

    const { subGrpData, groupData, groupId, setSearchInput } = props;
    const { openPage, selectedOption, setOpenPage, setSelectedOption, setShowConfirmSave, confirmSave, setConfirmSave, getGenericDrugListData, drugTypeDrpData, getDrugTypeDrpData } = useContext(LoginContext);
    const [recordStatus, setRecordStatus] = useState('1');

    const [values, setValues] = useState({
        "groupName": "", "subGroupName": "", "drugtype": "", "VEDType": "", "categoryName": "10", "drugname": ""
    })
    const [errors, setErrors] = useState({
        "groupNameErr": "", "subGroupNameErr": "", "VEDTypeErr": "", "categoryNameErr": "", "drugnameErr": ""
    })

    useEffect(() => {
        getDrugTypeDrpData()
    }, [])

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
            "gnumSeatId": getAuthUserData('userSeatId'),
            "cwhstrCentraldrugName": values?.drugname,
            "cwhnumGroupId": groupId,
            "cwhnumSubgroupId": values?.subGroupName,
            "cwhnumDrugTypeId": values?.drugtype,
            "cwhstrDrugCatCode": values?.categoryName,
            "cwhnumDrugVedCode": values?.VEDType,
            "gnumIsValid": recordStatus,
            "isMotherHealth": 0
        }
        fetchPostData(`api/v1/drugs`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record created successfully', 'success');
                getGenericDrugListData(groupId, values?.subGroupName, recordStatus);
                setOpenPage('home');
                reset();
                setConfirmSave(false);
                setSelectedOption([])

            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const updateGenericDrugData = () => {
        const val = {
            "cwhnumCentralDrugId": selectedOption[0]?.cwhnumCentralDrugId,
            "gnumSeatId": getAuthUserData('userSeatId'),
            "cwhstrCentraldrugName": values?.drugname,
            "cwhnumGroupId": groupId,
            "cwhnumSubgroupId": values?.subGroupName,
            "cwhnumDrugTypeId": values?.drugtype,
            "cwhstrDrugCatCode": values?.categoryName,
            "cwhnumDrugVedCode": values?.VEDType,
            "gnumIsValid": recordStatus,
            "isMotherHealth": 0
        }
        fetchUpdateData(`api/v1/drugs/${selectedOption[0]?.cwhnumCentralDrugId}`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Record updated successfully', 'success');
                getGenericDrugListData(groupId, values?.subGroupName, recordStatus);
                setOpenPage('home');
                reset();
                setConfirmSave(false);
                setSelectedOption([])
            } else {
                ToastAlert(data?.message, "error");
                setConfirmSave(false);
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;
        if (!groupId?.trim()) {
            setErrors(prev => ({ ...prev, "groupNameErr": "Group name is required" }));
            isValid = false;
        }
        if (!values?.subGroupName?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "subGroupNameErr": "Sub group is required" }));
            isValid = false;
        }
        if (!values?.VEDType?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "VEDTypeErr": "Please select a value" }));
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
                "groupName": selectedOption[0]?.cwhnumGroupId, "subGroupName": selectedOption[0]?.cwhnumSubgroupId, "drugtype": selectedOption[0]?.cwhnumDrugTypeId, "VEDType": selectedOption[0]?.cwhnumDrugVedCode, "categoryName": selectedOption[0]?.cwhstrDrugCatCode, "drugname": selectedOption[0]?.cwhstrCentraldrugName
            })
        }
    }, [selectedOption])

    const reset = () => {
        setRecordStatus('1')
        setConfirmSave(false);
        setValues({ "groupName": "", "subGroupName": "", "drugtype": "", "VEDType": "", "categoryName": "10", "drugname": "" });
        setErrors({ "groupNameErr": "", "subGroupNameErr": "", "VEDTypeErr": "", "categoryNameErr": "", "drugnameErr": "" });
        setSearchInput('')
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
                                options={drugTypeDrpData}
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
                                options={vedOptions}
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
