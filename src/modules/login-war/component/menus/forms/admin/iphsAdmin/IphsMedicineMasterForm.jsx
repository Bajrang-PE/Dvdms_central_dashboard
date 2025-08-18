import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../../InputField'
import GlobalButtons from '../../../GlobalButtons'
import { fetchPatchData, fetchPostData, fetchUpdateData } from '../../../../../../../utils/ApiHooks'
import { ToastAlert } from '../../../../../utils/CommonFunction'
import { LoginContext } from '../../../../../context/LoginContext'

const IphsMedicineMasterForm = ({ setRecord, getListData, setSearchInput }) => {

    const { confirmSave, setShowConfirmSave, openPage, setOpenPage, selectedOption, setSelectedOption, setConfirmSave } = useContext(LoginContext)


    const [values, setValues] = useState({
        "molMedicineName": "", "isDh": "", "isChc": "", "isSdh": "", "isPhc": "", "isUphc": "", "isAamshc": ""
    })

    const [errors, setErrors] = useState({
        "molMedicineNameErr": "",
    });

    const handleValueCange = (e) => {
        const { name, type, checked, value } = e.target;
        const newValue = type === "checkbox" ? (checked ? "1" : "") : value;

        setValues({ ...values, [name]: newValue });
        const errName = name + "Err";
        setErrors({ ...errors, [errName]: "" });
    }

    const handleSave = () => {
        let isValid = true;
        if (!values?.molMedicineName.trim()) {
            setErrors({ ...errors, "molMedicineNameErr": "Molecule medicine name is required" })
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }

    }

    useEffect(() => {
        if (confirmSave) {
            saveData();
        }
    }, [confirmSave])

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === "modify") {
            setValues(prev => ({ ...prev, "molMedicineName": selectedOption[0]?.moleculeName }));
        }

    }, [selectedOption, openPage])


    const saveData = () => {
        if (openPage === "add") {
            const val = {
                "moleculeName": values?.molMedicineName,
                "isDH": values?.isDh,
                "isCHC": values?.isChc,
                "isSDH": values?.isSdh,
                "isPHC": values?.isPhc,
                "isUPHC": values?.isUphc,
                "isAAMSHC": values?.isAamshc
            }

            fetchPostData("http://10.226.26.247:8025/api/v1/IphsMoleculeMedicineMaster/createMoleculeMedicine", val).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data saved successfully", "success")
                    refersh();

                } else {
                    ToastAlert(data?.message, "error")
                }
            })
        }

        if (openPage === "modify") {
            const val = {
                "moleculeName": values?.molMedicineName,
                "isDH": values?.isDh,
                "isCHC": values?.isChc,
                "isSDH": values?.isSdh,
                "isPHC": values?.isPhc,
                "isUPHC": values?.isUphc,
                "isAAMSHC": values?.isAamshc
            }

            fetchUpdateData(`http://10.226.26.247:8025/api/v1/IphsMoleculeMedicineMaster/modifyMoleculeMedicine?packID=${selectedOption[0]?.packID}`, val).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data updated successfully", "success")
                    setSelectedOption([]);
                    refersh();

                } else {
                    ToastAlert(data?.message, "error")
                }
            })

        }
    }

    const refersh = () => {
        reset();
        setOpenPage("home");
        setRecord("1");
        getListData();
        setConfirmSave(false);
        setSearchInput('');
    }

    const reset = () => {
        setValues(prev => ({
            ...prev, "molMedicineName": "", "isDh": "",
            "isChc": "", "isSdh": "", "isPhc": "", "isUphc": "", "isAamshc": ""
        }));
    }

    return (
        <>
            <div>
                <GlobalButtons onSave={handleSave} onClear={reset} />
            </div>

            <div className='row mt-2'>
                <div className='col-sm-6 row'>
                    <label className="col-sm-4 col-form-label fixed-label required-label">Molecule Medicine Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            id="molMedicineName"
                            name="molMedicineName"
                            onChange={handleValueCange}
                            value={values?.molMedicineName}
                            errorMessage={errors?.molMedicineNameErr}
                        />
                    </div>
                </div>
            </div>

            <div className='row mt-2'>
                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>DH</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isDh"
                            name="isDh"
                            onChange={handleValueCange}
                            checked={values?.isDh === "1"}
                        />
                    </div>
                </div>

                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>CHC</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isChc"
                            name="isChc"
                            onChange={handleValueCange}
                            checked={values?.isChc === "1"}
                        />
                    </div>
                </div>

                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>SDH</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isSdh"
                            name="isSdh"
                            onChange={handleValueCange}
                            checked={values?.isSdh === "1"}
                        />
                    </div>
                </div>

                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>PHC</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isPhc"
                            name="isPhc"
                            onChange={handleValueCange}
                            checked={values?.isPhc === "1"}
                        />
                    </div>
                </div>

                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>UPHC</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isUphc"
                            name="isUphc"
                            onChange={handleValueCange}
                            checked={values?.isUphc === "1"}
                        />
                    </div>
                </div>

                <div className='col-sm-2 row'>
                    <label className='col-sm-4'>AAMSHC</label>
                    <div className='col-sm-8'>
                        <input
                            type="checkBox"
                            id="isAamshc"
                            name="isAamshc"
                            onChange={handleValueCange}
                            checked={values?.isAamshc === "1"}
                        />
                    </div>
                </div>

            </div>

        </>
    )
}

export default IphsMedicineMasterForm