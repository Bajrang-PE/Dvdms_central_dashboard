import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect';
import { LoginContext } from '../../../context/LoginContext';
import InputField from '../../InputField';
import Select, { components } from 'react-select';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../utils/CommonFunction';
import { ComboBox } from '../../ComboBox';

const DiseaseDrugMapMaster = () => {

    const { setShowConfirmSave, confirmSave, setConfirmSave, openPage, setOpenPage, getDiseaseCategoryDrpData, diseaseCatDrpData, getAllDrugDrpData, allDrugDrpData } = useContext(LoginContext)

    const [diseaseCategory, setDiseaseCategory] = useState('');
    const [drugName, setDrugName] = useState(null);

    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    const [errors, setErrors] = useState({
        "diseaseCategoryErr": "", "drugNameErr": ""
    })

    // Search filter
    const [leftSearch, setLeftSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");

    useEffect(() => {
        getDiseaseCategoryDrpData();
        getAllDrugDrpData();
    }, [])

    const getMappedList = (drugId, cat) => {
        try {
            fetchData(`/api/v1/disease-drug-map/mapped?drugId=${drugId}&categoryId=${cat}`)?.then((res) => {
                console.log('mapped', res)
                if (res?.status === 1) {
                    const drpData = res?.data?.length > 0 ? res?.data?.map((dt) => ({
                        value: dt?.diseaseId,
                        label: dt?.diseaseName
                    })) : [];
                    setSelectedOptions(drpData)
                    setInitialMappedOptions(drpData)
                } else {
                    setSelectedOptions([])
                    setInitialMappedOptions([])
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    const getUnMappedList = (drugId, cat) => {
        try {
            fetchData(`/api/v1/disease-drug-map/unmapped?drugId=${drugId}&categoryId=${cat}`)?.then((res) => {
                console.log('unmapped', res)
                if (res?.status === 1) {
                    const drpData = res?.data?.length > 0 ? res?.data?.map((dt) => ({
                        value: dt?.diseaseId,
                        label: dt?.diseaseName
                    })
                    ) : [];
                    setAvailableOptions(drpData)
                } else {
                    setAvailableOptions([])
                }
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (drugName?.value && diseaseCategory) {
            getUnMappedList(drugName?.value, diseaseCategory);
            getMappedList(drugName?.value, diseaseCategory);
        }

    }, [drugName, diseaseCategory])


    const moveToSelected = () => {
        if (diseaseCategory) {
            const itemsToMove = availableOptions?.filter(opt =>
                selectedAvailable?.includes(String(opt.value))
            );
            const newSelected = itemsToMove?.filter(item =>
                !selectedOptions?.some(selected => selected.value == item.value)
            );
            setSelectedOptions(prev => [...prev, ...newSelected]);
            setAvailableOptions(prev => prev.filter(opt =>
                !selectedAvailable.includes(String(opt.value))
            ));
            setSelectedAvailable([]);
        } else {
            ToastAlert('Please select category!', 'warning')
        }
    };

    const moveToAvailable = () => {
        if (diseaseCategory) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.value))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.value))
            ));
            setSelectedSelected([]);
        } else {
            ToastAlert('Please select category!', 'warning')
        }
    };


    const saveDiseaseDrugMappedData = () => {

        const newMapped = selectedOptions.filter(
            item => !initialMappedOptions.some(i => i.value == item.value)
        );
        const newUnMapped = initialMappedOptions.filter(
            item => !selectedOptions?.some(i => i.value == item.value)
        );
        const mappedData = newMapped?.length > 0 ? newMapped?.map(dt => (parseInt(dt?.value))) : [];
        const unMappedData = newUnMapped?.length > 0 ? newUnMapped?.map(dt => (parseInt(dt?.value))) : [];

        const val = {
            "drugId": drugName?.value,
            "diseaseCategoryId": parseInt(diseaseCategory),
            "mappedDiseaseIds": mappedData,
            "unmappedDiseaseIds": unMappedData
        }
        console.log('val', val)
        fetchPostData(`/api/v1/disease-drug-map/save`, val).then(data => {
            console.log('datasave', data)
            if (data?.status === 1) {
                ToastAlert('Mapped successfully', 'success')
                setConfirmSave(false)
                reset();
            } else {
                ToastAlert(data?.message, 'error')
                setConfirmSave(false)
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;

        if (drugName?.value === "" || !drugName?.value) {
            setErrors(prev => ({ ...prev, "drugNameErr": "Please select drug name" }))
            isValid = false;
        }
        if (diseaseCategory === "" || !diseaseCategory) {
            setErrors(prev => ({ ...prev, "diseaseCategoryErr": "Please select disease category" }))
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveDiseaseDrugMappedData();
        }
    }, [confirmSave])

    const reset = () => {
        setConfirmSave(false);
        setInitialMappedOptions([]);
        setSelectedOptions([]);
        setAvailableOptions([]);
        setRightSearch('');
        setLeftSearch('');
        setDiseaseCategory('');
        setDrugName(null);
        setErrors({ "diseaseCategoryErr": "", "drugNameErr": "" })
    }


    const [multiValue, setMultiValue] = useState([]);
    console.log('multiValue', multiValue)

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Disease Drug Mapping Master`}</b></span>
                </div>


                <div className="row pt-2">
                    <div className="row form-group col-sm-6">
                        <label className="col-sm-4 col-form-label fix-label required-label">Drug Name :</label>
                        <div className="col-sm-8 align-content-center">
                            {/* <Select
                                id='drugName'
                                name='drugName'
                                placeholder="select value"
                                options={allDrugDrpData}
                                isMulti={false}
                                className="aliceblue-bg border-dark-subtle react-select-login"
                                value={drugName}
                                onChange={(e) => {
                                    setDrugName(e);
                                    const itemObj = allDrugDrpData?.find(dt => dt?.value == e?.value);
                                    setRightSearch('');
                                    setLeftSearch('');
                                }}
                                isSearchable={true}
                            /> */}
                            <ComboBox
                                options={allDrugDrpData}
                                value={drugName}
                                onChange={(e) => {
                                    setDrugName(e);
                                    const itemObj = allDrugDrpData?.find(dt => dt?.value == e?.value);
                                    setRightSearch('');
                                    setLeftSearch('');
                                }}
                                isMulti={false}
                                placeholder="Select multiple items..."
                                isSearchable
                                className="aliceblue-bg border-dark-subtle react-select-login"
                            />
                            {errors?.drugNameErr && (
                                <div className="required-input">
                                    {errors?.drugNameErr}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row form-group col-sm-6">
                        <label className="col-sm-4 col-form-label fix-label required-label">Disease Category :</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                id="diseaseCategory"
                                name="diseaseCategory"
                                placeholder={"Select Value"}
                                options={diseaseCatDrpData}
                                onChange={(e) => setDiseaseCategory(e?.target?.value)}
                                value={diseaseCategory}
                                errorMessage={errors?.diseaseCategoryErr}
                            />
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span>Drug Used for following Disease
                    </div>
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                </div>

                <div className='d-flex justify-content-center mt-1 mb-2'>
                    <div className='' style={{ width: "45%" }}>
                        <div className="mb-1 position-relative">
                            <InputField
                                type="search"
                                className="form-control form-control-sm aliceblue-bg border-dark-subtle"
                                placeholder="🔍 Search..."
                                value={leftSearch}
                                onChange={(e) => setLeftSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select form-select-sm aliceblue-bg border-dark-subtle"
                            size="8"
                            multiple
                            value={selectedAvailable}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setSelectedAvailable(selected);
                            }}
                        >
                            {availableOptions?.length > 0 && availableOptions
                                ?.filter(opt => opt.label?.toLowerCase()?.includes(leftSearch?.toLowerCase()))
                                ?.map((opt, index) => (
                                    <option key={index + "bg" + opt?.value?.toString()} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))
                            }
                        </select>

                    </div>

                    <div className='align-self-center' style={{ marginLeft: "2%", marginRight: "2%" }}>
                        <div className='d-flex justify-content-center'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary btn-sm m-1'
                                onClick={moveToSelected}
                                disabled={selectedAvailable.length === 0}
                            >
                                <i className="fa fa-caret-right"></i>
                            </button>

                        </div>

                        <div className='d-flex justify-content-center'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary btn-sm m-1'
                                onClick={moveToAvailable}
                                disabled={selectedSelected.length === 0}
                            >
                                <i className="fa fa-caret-left"></i>
                            </button>
                        </div>
                    </div>

                    <div className='' style={{ width: "45%" }}>
                        <div className="mb-1 position-relative">
                            <InputField
                                type="search"
                                className="form-control form-control-sm aliceblue-bg border-dark-subtle"
                                placeholder="🔍 Search ..."
                                value={rightSearch}
                                onChange={(e) => setRightSearch(e.target.value)}
                            />
                        </div>
                        <select
                            className="form-select form-select-sm aliceblue-bg border-dark-subtle"
                            size="8"
                            multiple
                            value={selectedSelected}
                            onChange={(e) => {
                                const selected = Array.from(e.target.selectedOptions, option => option.value);
                                setSelectedSelected(selected);
                            }}
                        >
                            {selectedOptions?.length > 0 && selectedOptions
                                ?.filter(opt => opt?.label?.toLowerCase()?.includes(rightSearch?.toLowerCase()))
                                ?.map((opt, index) => (
                                    <option key={index + "bg" + opt?.value?.toString()} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))
                            }
                        </select>

                    </div>
                </div>

                <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn btn-sm datatable-btns py-0' onClick={handleValidation}>
                        <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>
                    <button className='btn btn-sm datatable-btns py-0' onClick={reset}>
                        <i className="fa fa-broom me-1 fs-13 text-warning"></i>Clear</button>
                </div>
            </div>
        </>
    )
}

export default DiseaseDrugMapMaster
