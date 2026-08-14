import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputSelect from '../../../InputSelect'
import InputField from '../../../InputField'
import { LoginContext } from '../../../../context/LoginContext'
import { fetchPostData, fetchUpdateData } from '../../../../../../utils/ApiHooks'
import { ToastAlert } from '../../../../utils/CommonFunction'

const DiseaseMasterForm = (props) => {
    const { getListData, setSearchInput, category } = props;

    const { openPage, setOpenPage, selectedOption, setSelectedOption, setShowConfirmSave, confirmSave, setConfirmSave, diseaseCatDrpData } = useContext(LoginContext)

    const [recordStatus, setRecordStatus] = useState("1");
    const [values, setValues] = useState({ "category": "", "diseaseName": "", "remarks": "", "diseaseId": 0 })
    const [errors, setErrors] = useState({ "categoryErr": "", "diseaseNameErr": "", "recordStatusErr": "" })

    const handleInputChange = (e) => {
        const { name, value } = e?.target;
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...values, [name]: "" });
        }
    }

    useEffect(() => {
        if (selectedOption?.length > 0) {
            setValues({
                ...values,
                "category": selectedOption[0]?.diseaseCategoryId,
                "diseaseName": selectedOption[0]?.diseaseName,
                "remarks": selectedOption[0]?.remark || "",
                "diseaseId": selectedOption[0]?.diseaseId || 0,
            });
            setRecordStatus(selectedOption[0]?.isValid?.toString() || "1");
        }
    }, [selectedOption])

    const addDiseaseRecord = () => {
        try {
            const val = {
                "diseaseName": values?.diseaseName,
                "diseaseCategoryId": category?.value || "",
                "isValid": recordStatus || 1,
                "remark": values?.remarks
            }

            fetchPostData("/api/v1/disease/save", val)?.then((res) => {
                if (res?.status === 1) {
                    ToastAlert("Record Saved successfully", 'success');
                    getListData(category?.value, recordStatus);
                    setOpenPage('home');
                    reset();
                    setConfirmSave(false);
                    setSelectedOption([])
                } else {
                    setConfirmSave(false);
                    ToastAlert(res?.message, "error");
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    const updateDiseaseRecord = () => {
        try {
            const val = {
                "diseaseId": values?.diseaseId || 0,
                "diseaseName": values?.diseaseName,
                "diseaseCategoryId": category?.value || "",
                "isValid": recordStatus || 1,
                "remark": values?.remarks
            }

            fetchPostData("/api/v1/disease/update", val)?.then((res) => {
                 if (res?.status === 1) {
                    ToastAlert("Record updated successfully", 'success');
                    getListData(category?.value, recordStatus);
                    setOpenPage('home');
                    reset();
                    setConfirmSave(false);
                    setSelectedOption([])
                } else {
                    setConfirmSave(false);
                    ToastAlert(res?.message, "error");
                }
            })
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (confirmSave) {
            if (openPage === 'modify') {
                updateDiseaseRecord();
            } else {
                addDiseaseRecord();
            }
        }
    }, [confirmSave])

    const handleValidation = () => {
        let isValid = true;
        if (!values?.diseaseName?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "diseaseNameErr": "disease name is required" }));
            isValid = false;
        }
        if (!category?.label?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "categoryErr": "category is required" }));
            isValid = false;
        }
        if (!recordStatus?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, "recordStatusErr": "Please select disease status" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }



    const reset = () => {
        setValues({ "category": "", "diseaseName": "", "remarks": "" });
        setErrors({ "categoryErr": "", "diseaseNameErr": "", "recordStatusErr": "" });
        setRecordStatus('1');
    }

    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} setSearchInput={setSearchInput} />
            <hr className='my-2' />

            <div className="pt-2">
                <div className="row mb-2">
                    <div className="col-12">
                        <div className="form-group row align-items-center">
                            <label className="col-sm-2 col-form-label fix-label required-label">
                                Disease Category :
                            </label>
                            <div className="col-sm-10">
                                <span style={{ color: "#025049" }}>
                                    {category?.label || "NA"}
                                </span>
                                {errors?.categoryErr && (
                                    <div className="required-input">
                                        {errors?.categoryErr}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-sm-6">
                        <div className="form-group row align-items-center">
                            <label className="col-sm-4 col-form-label fix-label required-label">
                                Disease Name :
                            </label>
                            <div className="col-sm-8">
                                <InputField
                                    type="text"
                                    id="diseaseName"
                                    name="diseaseName"
                                    placeholder="Enter value"
                                    className="aliceblue-bg border-dark-subtle"
                                    value={values?.diseaseName}
                                    onChange={handleInputChange}
                                    errorMessage={errors?.diseaseNameErr}
                                    isSpecialChrs
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-sm-6">
                        <div className="form-group row align-items-center">
                            <label className="col-sm-4 col-form-label fix-label required-label">
                                Disease Status :
                            </label>
                            <div className="col-sm-8">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatusActive"
                                        value="1"
                                        onChange={(e) => {
                                            setRecordStatus(e.target.value);
                                            setErrors({ ...values, "recordStatusErr": "" });
                                        }}
                                        checked={recordStatus === "1"}
                                    />
                                    <label className="form-check-label" htmlFor="recordStatusActive">
                                        Active
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatusInactive"
                                        value="0"
                                        onChange={(e) => {
                                            setRecordStatus(e.target.value);
                                            setErrors({ ...values, "recordStatusErr": "" });
                                        }}
                                        checked={recordStatus === "0"}
                                    />
                                    <label className="form-check-label" htmlFor="recordStatusInactive">
                                        InActive
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-12">
                        <div className="form-group row">
                            <label className="col-sm-2 col-form-label fix-label">
                                Remarks :
                            </label>
                            <div className="col-sm-10">
                                <textarea
                                    id="remarks"
                                    name="remarks"
                                    rows={3}
                                    placeholder="Enter disease remark..."
                                    className="form-control aliceblue-bg border-dark-subtle"
                                    value={values?.remarks}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiseaseMasterForm
