import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../GlobalButtons';
import InputSelect from '../../InputSelect';
import InputField from '../../InputField';
import { LoginContext } from '../../../context/LoginContext';
import { ToastAlert } from '../../../utils/CommonFunction';
import { fetchData, fetchPostData, fetchUpdateData, fetchUpdatePostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';
import InputDrpSelect from '../../InputDrpSelect';
import MapDiseaseForDrug from '../MapDiseaseForDrug';

const DrugMasterForm = (props) => {

    const {
        selectedGroupName,
        selectedSubGroupName,
        selectedGroupId,
        selectedSubGroupId,
        setSearchInput,
        getListData,
        selectedStatus,
    } = props;

    const { setShowConfirmSave, confirmSave, setConfirmSave, openPage, setOpenPage, selectedOption, setSelectedOption, drugTypeDrpData, getDrugTypeDrpData, getGenericDrugDrpData, genericDrugDrpData, getDiseaseCategoryDrpData, diseaseCatDrpData } = useContext(LoginContext);

    const [values, setValues] = useState({
        "genericDrugId": "",
        "drugTypeId": "",
        "drugName": "",
        "strength": "",
        "snomedNameId": "1",
        "diseaseCategory": "",

        "ncdcat": "0",
        "nlemcat": "0",
        "mohfwcat": "0",
        "iphscat": "0",
        "awarecat": "0",
        "ihrmscat": "0",
        "mappedDiseases": {}
    })

    const [errors, setErrors] = useState({
        "genericDrugIdErr": "", "drugTypeIdErr": "", "drugNameErr": "", "strengthErr": "", "snomedNameIdErr": ""
    })

    const [categoryDtl, setCategoryDtl] = useState("");
    const [drugCodeDtl, setDrugCodeDtl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [drugCodeId, setDrugCodeId] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const [availableOptions, setAvailableOptions] = useState([]);

    const tabOptions = ["Drug Details", "Disease Mapping"]


    useEffect(() => {
        if (drugTypeDrpData?.length === 0) {
            getDrugTypeDrpData();
        }
        if (genericDrugDrpData?.length === 0) {
            getGenericDrugDrpData();
        }
        getDiseaseCategoryDrpData();
    }, [])


    // const getCodes = () => {
    //     alert("Getting Code")
    // }

    const handleValueChange = (e) => {

        const { name, value, type, checked } = e.target;
        const errName = name + "Err";

        if (type === "checkbox") {
            setValues({ ...values, [name]: checked ? "1" : "0" });
            setErrors({ ...errors, [errName]: "" });
        } else {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const validateSave = () => {
        let isValid = true;

        if (!values?.genericDrugId?.toString()?.trim()) {
            setErrors(prev => ({ ...prev, genericDrugIdErr: "Generic drug name is required" }));
            isValid = false;
        }

        if (!values?.drugTypeId.toString().trim()) {
            setErrors(prev => ({ ...prev, drugTypeIdErr: "Drug type is required" }));
            isValid = false;
        }

        if (!values?.drugName.trim()) {
            setErrors(prev => ({ ...prev, drugNameErr: "Drug name is required" }));
            isValid = false;
        }

        if (!values?.snomedNameId.toString().trim()) {
            setErrors(prev => ({ ...prev, snomedNameIdErr: "Snomed tag name is required" }));
            isValid = false;
        }

        if (!values?.strength.trim()) {
            setErrors(prev => ({ ...prev, strengthErr: "Strength is required" }));
            isValid = false;
        }
        if (isValid) {
            setShowConfirmSave(true)
        }else{
            setCurrentStep(1);
        }

    }

    useEffect(() => {
        if (confirmSave) {
            saveDetail();
        }
    }, [confirmSave])

    const fetchgenericDrugdetails = (drugId, isModify) => {
        if (drugId) {
            fetchData(`/api/v1/drug-mst/genericDrugCodeDetails?centralDrugId=${drugId}`).then(data => {
                if (data?.status == 1) {
                    setCategoryDtl(data?.data?.drugCatName ?? '');
                    setDrugCodeDtl(data?.data?.vedName ?? '');
                    setCategoryId(data?.data?.cwhstrDrugCategoryCode ?? '');
                    setDrugCodeId(data?.data?.cwhnumDrugVedCode ?? '');
                    // if (!isModify || changedDrug) {
                    //     setValues(prev => ({ ...prev, "drugName": data?.data?.centraldrugName, "drugTypeId": data?.data?.cwhnumDrugTypeId }));
                    // }
                }
            })
        } else {
            setCategoryDtl('');
            setDrugCodeDtl('');
            setCategoryId('');
            setDrugCodeId('');
            setValues(prev => ({ ...prev, "drugName": "", "drugTypeId": "" }));
        }
    }

    const saveDetail = () => {

        if (openPage === "add") {
            const val = {
                cwhnumGroupId: selectedGroupId,
                cwhnumSubGroupId: selectedSubGroupId,
                cwhnumCentralDrugId: values?.genericDrugId,
                cwhnumDrugTypeId: values?.drugTypeId,
                cwhstrDrugName: values?.drugName,
                cwhstrStrengthName: values?.strength,
                gnumSeatId: getAuthUserData('userSeatId'),
                cwhstrDrugCategoryCode: categoryId,
                cwhnumDrugVedCode: drugCodeId,

                "mohfwFlag": values?.mohfwcat,
                "cwhnumIsNlem2015": values?.nlemcat,
                "isNcd": values?.ncdcat,
                "cwhnumIphsDrugId": values?.iphscat,
                "isIhrms": values?.ihrmscat,
                "isAware": values?.awarecat,
                "diseaseMappings": [{ "diseaseId": 23, "categoryId": 4 }, { "diseaseId": 39, "categoryId": 6 }]
            }
            console.log('val', val)
            fetchPostData("/api/v1/drug-mst/createdrug", val).then(data => {
                console.log('data', data)
                if (data?.status === 1) {
                    ToastAlert("Data saved successfully", "success")
                    refresh();
                } else {
                    ToastAlert(data?.message, "error")
                    setConfirmSave(false);
                }
            })
        }

        if (openPage === "modify") {
            const val = {
                cwhnumDrugId: selectedOption[0]?.cwhnumDrugId,
                cwhnumCentralDrugId: values?.genericDrugId,
                cwhnumDrugTypeId: values?.drugTypeId,
                cwhstrDrugName: values?.drugName,
                cwhstrStrengthName: values?.strength,
                cwhstrDrugCategoryCode: categoryId,
                cwhnumDrugVedCode: drugCodeId,

                "mohfwFlag": values?.mohfwcat,
                "cwhnumIsNlem2015": values?.nlemcat,
                "isNcd": values?.ncdcat,
                "cwhnumIphsDrugId": values?.iphscat,
                "isIhrms": values?.ihrmscat,
                "isAware": values?.awarecat

            }
            fetchPostData("/api/v1/drug-mst/updatedrug", val).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data updated successfully", "success")
                    refresh();
                } else {
                    ToastAlert(data?.message, "error")
                    setConfirmSave(false);
                }
            })
        }

    }

    const refresh = () => {
        getListData(selectedGroupId, selectedSubGroupId, selectedStatus);
        setConfirmSave(false);
        setSelectedOption([]);
        reset();
        setSearchInput('');
        setOpenPage("home");
    }

    const reset = () => {
        setValues({
            "genericDrugId": "",
            "drugTypeId": "",
            "drugName": "",
            "strength": "",
            "snomedNameId": "all",
            "ncdcat": "0",
            "nlemcat": "0",
            "mohfwcat": "0",
            "iphscat": "0",
            "awarecat": "0",
            "ihrmscat": "0",
            "mappedDiseases": {}
        });
    }

    const getMappedDiseaseByDrug = (drugId) => {
        try {
            fetchData(`/api/v1/disease-drug-map/mappedDieaseBasedOnDrug?drugId=${drugId}`)?.then((res) => {
                if (res?.status === 1) {
                    const formattedDt = res?.data?.reduce((acc, item) => {
                        const catId = String(item.diseaseCategoryId);
                        const categoryObj = diseaseCatDrpData.find(
                            (cat) => String(cat.value || cat.id) === catId
                        );
                        const categoryName = categoryObj?.label || `Category ${catId}`;
                        if (!acc[catId]) {
                            acc[catId] = {
                                categoryName: categoryName,
                                diseases: [],
                            };
                        }

                        acc[catId].diseases.push({
                            diseaseId: item.diseaseId,
                            diseaseName: item.diseaseName,
                        });

                        return acc;
                    }, {});

                    setValues((prev) => ({
                        ...prev,
                        mappedDiseases: formattedDt,
                    }));
                } else {
                    setValues((prev) => ({
                        ...prev,
                        mappedDiseases: {},
                    }));
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            setValues({
                ...values,
                "genericDrugId": selectedOption[0]?.cwhnumCentralDrugId ?? '',
                "drugTypeId": selectedOption[0]?.cwhnumDrugTypeId,
                "snomedNameId": 2,
                "drugName": selectedOption[0]?.cwhstrDrugName,
                "strength": selectedOption[0]?.cwhstrStrengthName,

                "ncdcat": selectedOption[0]?.isNcd || "0",
                "nlemcat": selectedOption[0]?.cwhnumIsNlem2015 || "0",
                "mohfwcat": selectedOption[0]?.mohfwFlag || "0",
                "iphscat": selectedOption[0]?.cwhnumIphsDrugId || "0",
                "awarecat": selectedOption[0]?.isAware || "0",
                "ihrmscat": selectedOption[0]?.isIhrms || "0",
            });
            getMappedDiseaseByDrug(selectedOption[0]?.cwhnumDrugId)
        }

    }, [selectedOption, openPage])


    useEffect(() => {
        if (values?.genericDrugId) {
            fetchgenericDrugdetails(values?.genericDrugId?.toString(), openPage === "modify");
        }

    }, [values?.genericDrugId])


    const nextStep = () => {
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };


    return (
        <>
            <div className="row my-2">

                <div className='col-md-6'>
                    <GlobalButtons
                        onSave={validateSave}
                        onClear={reset}
                        setSearchInput={setSearchInput}
                    />
                </div>

                <div className="wizard-header col-md-6">

                    {tabOptions?.map((title, index) => {
                        const step = index + 1;
                        return (
                            <div
                                key={step}
                                className={`wizard-step-tab 
                        ${currentStep === step ? "active" : ""}
                        ${currentStep > step ? "completed" : ""}`}
                                onClick={() => setCurrentStep(step)}
                            >
                                <span>{title}</span>
                            </div>
                        );
                    })}
                </div>
            </div >
            <hr />

            {
                currentStep === 1 && (
                    <>
                        {/* Row 1: Group Name & Subgroup Name */}
                        <div className="row g-3 align-items-center mb-2">
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap">
                                    <span className="text-danger me-1">*</span>Group Name :
                                </label>

                                <div className="fw-medium text-dark">{selectedGroupName || "-"}</div>
                            </div>

                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap">
                                    <span className="text-danger me-1">*</span>Subgroup Name :
                                </label>

                                <div className="fw-medium text-dark">{selectedSubGroupName || "-"}</div>
                            </div>
                        </div>

                        {/* Row 2: Generic Drug Name, Category, Drug Code (Conditional) */}

                        <div className="row g-3 align-items-center mb-2">
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap" style={{ minWidth: "130px" }}>
                                    <span className="text-danger me-1">*</span>Generic Drug :
                                </label>

                                <div className="flex-grow-1">
                                    <InputDrpSelect
                                        id="genericDrugId"
                                        name="genericDrugId"
                                        placeholder={"Select Value"}
                                        options={genericDrugDrpData}
                                        value={values?.genericDrugId}
                                        onChange={(e) => {
                                            if (e?.length > 0) {
                                                setValues((prev) => ({
                                                    ...prev,
                                                    genericDrugId: e?.[0]?.value?.toString(),
                                                }));

                                                setErrors((prev) => ({ ...prev, genericDrugIdErr: "" }));
                                            }
                                        }}
                                        errorMessage={errors?.genericDrugIdErr}
                                    />
                                </div>
                            </div>
                            {values?.genericDrugId?.toString()?.trim() && <>
                                <div className="col-md-4 d-flex align-items-center">
                                    <label className="col-form-label fw-semibold me-2 text-nowrap">
                                        Category :
                                    </label>

                                    <div className="fw-medium text-dark">{categoryDtl || "-"}</div>
                                </div>

                                <div className="col-md-4 d-flex align-items-center">
                                    <label className="col-form-label fw-semibold me-2 text-nowrap">
                                        Drug Code :
                                    </label>

                                    <div className="fw-medium text-dark">{drugCodeDtl || "-"}</div>
                                </div>
                            </>}
                        </div>


                        {/* Row 3: Drug Type, Drug Name, Snomed Tag Name */}
                        <div className="row g-3 align-items-center mb-2">
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap" style={{ minWidth: "130px" }}>
                                    <span className="text-danger me-1">*</span>Drug Type :
                                </label>

                                <div className="flex-grow-1">
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

                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap" style={{ minWidth: "110px" }}>
                                    <span className="text-danger me-1">*</span>Drug Name :
                                </label>

                                <div className="flex-grow-1">
                                    <InputField
                                        type="text"
                                        id="drugName"
                                        name="drugName"
                                        onChange={handleValueChange}
                                        value={values?.drugName}
                                        errorMessage={errors?.drugNameErr}
                                        isSpecialChrs
                                    />
                                </div>
                            </div>

                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap" style={{ minWidth: "130px" }}>
                                    <span className="text-danger me-1">*</span>Snomed Tag :
                                </label>

                                <div className="flex-grow-1">
                                    <InputSelect
                                        id="snomedNameId"
                                        name="snomedNameId"
                                        options={[
                                            { label: "All", value: "all" },
                                            { label: "Substance", value: "substance" },
                                            { label: "Clinical drug", value: "clinical drug" },
                                        ]}
                                        onChange={handleValueChange}
                                        value={values?.snomedNameId}
                                        errorMessage={errors?.snomedNameIdErr}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 4: Strength & Drug Categories */}
                        <div className="row g-3 align-items-center mb-2">
                            <div className="col-md-4 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-2 text-nowrap" style={{ minWidth: "130px" }}>
                                    <span className="text-danger me-1">*</span>Strength :
                                </label>

                                <div className="flex-grow-1">
                                    <InputField
                                        type="text"
                                        id="strength"
                                        name="strength"
                                        onChange={handleValueChange}
                                        value={values?.strength}
                                        errorMessage={errors?.strengthErr}
                                        isSpecialChrs
                                    />
                                </div>
                            </div>

                            <div className="col-md-8 d-flex align-items-center">
                                <label className="col-form-label fw-semibold me-3 text-nowrap">
                                    <span className="text-danger me-1">*</span>Drug Category :
                                </label>

                                <div className="d-flex flex-wrap gap-3 align-items-center pt-1">
                                    {[
                                        { id: "ihrmscat", label: "IHRMS" },
                                        { id: "awarecat", label: "AWARE" },
                                        { id: "iphscat", label: "IPHS" },
                                        { id: "mohfwcat", label: "MOHFW" },
                                        { id: "nlemcat", label: "NLEM" },
                                        { id: "ncdcat", label: "NCD" },
                                    ].map((cat) => (
                                        <div className="form-check m-0 me-2" key={cat.id}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name={cat.id}
                                                id={cat.id}
                                                checked={values?.[cat.id] == "1"}
                                                onChange={handleValueChange}
                                            />

                                            <label className="form-check-label ms-1" htmlFor={cat.id}>
                                                {cat.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )
            }

            {
                currentStep === 2 && (
                    <MapDiseaseForDrug diseaseCatDrpData={diseaseCatDrpData} values={values} setValues={setValues} openPage={openPage} />
                )
            }

            <hr />

            <div className="d-flex justify-content-center">
                <button className='btn btn-sm datatable-btns py-1' onClick={prevStep} disabled={currentStep === 1}>
                    <i className="fa fa-arrow-left me-1 text-warning"></i>Previous</button>

                <button className='btn btn-sm datatable-btns py-1' onClick={nextStep} disabled={currentStep === 2}>
                    Next <i className="fa fa-arrow-right ms-1 text-warning"></i></button>
            </div>

        </>
    );
}

export default DrugMasterForm