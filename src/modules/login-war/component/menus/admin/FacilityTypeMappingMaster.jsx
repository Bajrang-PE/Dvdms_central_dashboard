import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';

const FacilityTypeMappingMaster = () => {
    const { setOpenPage, getSteteNameDrpData, stateNameDrpDt, getFacilityTypeDrpData, facilityTypeDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const [facilityTypeId, setFacilityTypeId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    const [errors, setErrors] = useState({
        "facilityTypeIdErr": "", "stateIdErr": ""
    })

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("add");
        getFacilityTypeDrpData();
    }, []);

    useEffect(() => {
        if (stateId) {
            setSelectedOptions([]);
        }
        setSelectedAvailable([]);
        setSelectedSelected([]);
    }, [stateId]);

    useEffect(() => {
        if (facilityTypeId && stateId) {
            getMappedList();
            getUnmappedList();
        }
    }, [stateId, facilityTypeId])

    const getUnmappedList = () => {
        fetchData(`/api/v1/facilityMap/unmappedFcility?facilityTypeId=${facilityTypeId}&stateId=${stateId}`).then(data => {
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.facilityTypeId,
                    label: dt?.facilityTypeName
                })
                )
                setAvailableOptions(drpData);
            } else {
                setAvailableOptions([]);
            }
        })
    }

    const getMappedList = () => {
        fetchData(`/api/v1/facilityMap/mapped?facilityTypeId=${facilityTypeId}&stateId=${47}`).then(data => {
            if (data.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.stateFacilityTypeId,
                    label: dt?.stateFacilityTypeName
                })
                )
                setSelectedOptions(drpData)
                setInitialMappedOptions(drpData);
            } else {
                setSelectedOptions([])
                setInitialMappedOptions([])
            }
        })
    }

    const saveFacilityMappedData = () => {

        const newMapped = selectedOptions.filter(
            item => !initialMappedOptions.some(i => i.value === item.value)
        );

        const newUnMapped = initialMappedOptions.filter(
            item => !selectedOptions.some(i => i.value === item.value)
        );


        const mappedData = newMapped?.length > 0 && newMapped?.map(dt => ({
            // "stateId": parseInt(stateId),
            "stateFacilityTypeId": dt?.value,
            "stateFacilityTypeName": dt?.label,
            // "facilityTypeId": parseInt(facilityTypeId),
            // "seatId": getAuthUserData('userSeatId'),
            // "isValid": 1,
            // "facilityTypeSlno": 0,
            // "order": 0
        }))

        const unMappedData = newUnMapped?.length > 0 && newUnMapped?.map(dt => ({
            // "stateId": parseInt(stateId),
            "facilityTypeId": dt?.value,
            "facilityTypeName": dt?.label,
            // "combinedIdName": `${dt?.value}^1^${dt?.label}`
        }))

        const val = {
            "mapFacilityTypeDTO": mappedData?.length > 0 ? mappedData : [],
            "unmapFacilityTypeDTO": unMappedData?.length > 0 ? unMappedData : [],
            "stateId": parseInt(stateId),
            "seatId": getAuthUserData('userSeatId'),
            "stateFacilityTypeId": parseInt(facilityTypeId)
        }

        fetchPostData(`/api/v1/facilityMap/saveFacilityMap`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert("Facility type mapped successfully", 'success')
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

        if (facilityTypeId === "") {
            setErrors(prev => ({ ...prev, "facilityTypeIdErr": "Please select facility type" }))
            isValid = false;
        }
        if (stateId === "") {
            setErrors(prev => ({ ...prev, "stateIdErr": "Please select state" }))
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveFacilityMappedData();
        }
    }, [confirmSave])

    const moveToSelected = () => {
        if (facilityTypeId) {
            const itemsToMove = availableOptions.filter(opt =>
                selectedAvailable.includes(String(opt.value))
            );
            const newSelected = itemsToMove.filter(item =>
                !selectedOptions.some(selected => selected.value === item.value)
            );
            setSelectedOptions(prev => [...prev, ...newSelected]);
            setAvailableOptions(prev => prev.filter(opt =>
                !selectedAvailable.includes(String(opt.value))
            ));
            setSelectedAvailable([]);
        } else {
            ToastAlert('Please select facility type!', 'warning')
        }
    };

    const moveToAvailable = () => {
        if (facilityTypeId) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.value))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.value))
            ));
            setSelectedSelected([]);
        } else {
            ToastAlert('Please select facility type!', 'warning')
        }
    };

    const reset = () => {
        setFacilityTypeId('');
        setStateId('');
        setInitialMappedOptions();
        setSelectedSelected();
        setSelectedAvailable();
        setSelectedOptions();
        setAvailableOptions();
    }

    const refresh = () => {
        setInitialMappedOptions();
        setSelectedSelected();
        setSelectedAvailable();
        setSelectedOptions();
        setAvailableOptions();
    }


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Facility Type Mapping Master`}</b></span>
                    {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {functionalityData?.length || 0}</span>} */}
                </div>


                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Facility Type : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select Value"
                                    options={facilityTypeDrpDt}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={facilityTypeId}
                                    onChange={(e) => { setFacilityTypeId(e.target.value); refresh() }}
                                />

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select value"
                                    options={stateNameDrpDt}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={stateId}
                                    onChange={(e) => { setStateId(e.target.value); refresh(); }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> State Facility Type
                    </div>
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                </div>

                <div className='d-flex justify-content-center mt-1 mb-2'>
                    <div className='' style={{ width: "30%" }}>
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
                            {availableOptions?.length > 0 && availableOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className='align-self-center' style={{ marginLeft: "2%", marginRight: "2%" }}>
                        <div className='d-flex justify-content-center'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary btn-sm m-1'
                                onClick={moveToSelected}
                                disabled={selectedAvailable?.length === 0}
                            >
                                <i className="fa fa-caret-right"></i>
                            </button>

                        </div>

                        <div className='d-flex justify-content-center'>
                            <button
                                type='button'
                                className='btn btn-outline-secondary btn-sm m-1'
                                onClick={moveToAvailable}
                                disabled={selectedSelected?.length === 0}
                            >
                                <i className="fa fa-caret-left"></i>
                            </button>
                        </div>
                    </div>

                    <div className='' style={{ width: "30%" }}>
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
                            {selectedOptions?.length > 0 && selectedOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

                {/* <hr className='my-2' /> */}
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

export default FacilityTypeMappingMaster
