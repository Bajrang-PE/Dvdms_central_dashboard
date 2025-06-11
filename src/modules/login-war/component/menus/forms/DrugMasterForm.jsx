import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../GlobalButtons'
import InputSelect from '../../InputSelect'
import InputField from '../../InputField'
import { LoginContext } from '../../../context/LoginContext'
import { ToastAlert } from '../../../utils/CommonFunction'
import { fetchUpdateData, fetchUpdatePostData } from '../../../../../utils/ApiHooks'

const DrugMasterForm = (props) => {

    const {
        selectedGroupName,
        selectedSubGroupName,
        selectedGroupId,
        selectedSubGroupId,
        setSearchInput,
      } = props;
      
    const { setShowConfirmSave, confirmSave, setConfirmSave, openPage, setOpenPage, selectedOption, setSelectedOption, drugTypeDrpData,getDrugTypeDrpData,
        getGenericDrugDrpData,genericDrugDrpData
    } = useContext(LoginContext)

    const [values, setValues] = useState({
        "genericDrugId": "", "drugTypeId": "", "drugName": "", "strength": "", "snomedNameId": "1"
    })

    const [errors, setErrors] = useState({
        "genericDrugIdErr": "", "drugTypeIdErr": "", "drugNameErr": "", "strengthErr": "", "snomedNameIdErr": ""
    })

    useEffect(()=>{
        getDrugTypeDrpData();
        getGenericDrugDrpData();
    },[])
 
    const getCodes = () => {
        alert("Getting Code")
    }

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";

        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [errName]: "" });
    }

    const validateSave = () => {
        let isValid = true;

        if (!values?.genericDrugId.trim()) {
            setErrors(prev => ({ ...prev, genericDrugIdErr: "Generic drug name is required" }));
            isValid = false;
        }

        if (!values?.drugTypeId.trim()) {
            setErrors(prev => ({ ...prev, drugTypeIdErr: "Drug type is required" }));
            isValid = false;
        }

        if (!values?.drugName.trim()) {
            setErrors(prev => ({ ...prev, drugNameErr: "Drug name is required" }));
            isValid = false;
        }

        if (!values?.snomedNameId.trim()) {
            setErrors(prev => ({ ...prev, snomedNameIdErr: "Snomed tag name is required" }));
            isValid = false;
        }

        if (!values?.strength.trim()) {
            setErrors(prev => ({ ...prev, strengthErr: "Strength is required" }));
            isValid = false;
        }
        if (isValid) {
            setShowConfirmSave(true)
        }

    }

  
    useEffect(() => {
        if (confirmSave) {
            saveDetail();
        }
    }, [confirmSave])


    const saveDetail = () => {


        if (openPage === "add") {
            const val = {
                cwhnumGroupId: selectedGroupId,
                cwhnumDrugId:12121212,
                cwhnumSubGroupId: selectedSubGroupId,
                cwhnumCentralDrugId: values?.genericDrugId,
                cwhnumDrugTypeId: values?.drugTypeId,
                cwhstrDrugName: values?.drugName,
                cwhstrStrengthName: values?.strength,
               // "": values?.snomedNameId,
                gnumIsvalid: "1",
                gnumSeatId: "",
            }

            fetchUpdatePostData("http://10.226.17.20:8025/api/v1/drug", val).then(data => {
                if (data) {
                    ToastAlert("Data saved successfully", "success")
                } else {
                    ToastAlert("Error", "error")
                }
            })
        }

        if (openPage === "modify") {
            const val = {
                cwhnumGroupId: selectedGroupId,
                cwhnumSubGroupId: selectedSubGroupId,
                cwhnumCentralDrugId: values?.genericDrugId,
                cwhnumDrugTypeId: values?.drugTypeId,
                cwhstrDrugName: values?.drugName,
                cwhstrStrengthName: values?.strength,
                "": values?.snomedNameId,
                gnumIsvalid: "1",
                gnumSeatId: "",
            }

            fetchUpdateData("http://10.226.17.20:8025/api/v1/drug", val).then(data => {
                if (data) {
                    ToastAlert("Data updated successfully", "success")
                } else {
                    ToastAlert("Error", "error")
                }
            })
        }

        setConfirmSave(false);
        setOpenPage("home");
        setSelectedOption([]);
        reset();
        setSearchInput('');
    }

    const reset = () => {
        setValues({ "genericDrugId": "", "drugTypeId": "", "drugName": "", "strength": "", "snomedNameId": "1" });
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {

            setValues({
                ...values, 
                "genericDrugId": selectedOption[0]?.cwhnumCentralDrugId,
                "drugTypeId": selectedOption[0]?.cwhnumDrugTypeId,
                "snomedNameId": 2,
                "drugName": selectedOption[0]?.cwhstrDrugName,
                "strength": selectedOption[0]?.cwhstrStrengthName,

            });
        }

    }, [selectedOption, openPage])

    return (
        <>
            <GlobalButtons onSave={validateSave} onClear={reset} />
            <hr className='my-2' />
            <div className="row">

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Group Name</label>
                    <div className="col-sm-8 align-content-center">
                        {selectedGroupName}
                    </div>
                </div>

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Subgroup Name</label>
                    <div className="col-sm-8 align-content-center">
                        {selectedSubGroupName}
                    </div>
                </div>

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Generic Drug Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="genericDrugId"
                            name="genericDrugId"
                            placeholder={"Select Value"}
                            options={genericDrugDrpData}
                            onChange={handleValueChange}
                            value={values?.genericDrugId}
                            errorMessage={errors?.genericDrugIdErr}
                        />

                    </div>
                </div>

            </div>


            <div className="row pt-1">

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Drug Type</label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="drugTypeId"
                            name="drugTypeId"
                            placeholder={"Select Value"}
                            options={drugTypeDrpData}
                            onChange={handleValueChange}
                            value={values?.drugTypeId}
                            errorMessage={errors?.drugTypeIdErr}
                        />

                    </div>
                </div>

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Drug Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            id="drugName"
                            name="drugName"
                            onChange={handleValueChange}
                            value={values?.drugName}
                            errorMessage={errors?.drugNameErr}
                        />

                    </div>
                </div>

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Snomed Tag Name</label>
                    <div className="col-sm-5 align-content-center">
                        <InputSelect
                            id="snomedNameId"
                            name="snomedNameId"
                            options={[{ label: "E", value: "1" }, { label: "F", value: "2" }]}
                            onChange={handleValueChange}
                            value={values?.snomedNameId}
                            errorMessage={errors?.snomedNameIdErr}
                        />

                    </div>
                    <div className="col-sm-3 align-content-center ">
                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => getCodes()}>
                            Get Codes
                        </button>
                    </div>
                </div>

            </div>


            <div className="row pt-1">

                <div className="row form-group col-sm-4">
                    <label className="col-sm-4 col-form-label fix-label required-label">Strength</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            id="strength"
                            name="strength"
                            onChange={handleValueChange}
                            value={values?.strength}
                            errorMessage={errors?.strengthErr}
                        />

                    </div>
                </div>

            </div>



        </>
    )
}

export default DrugMasterForm