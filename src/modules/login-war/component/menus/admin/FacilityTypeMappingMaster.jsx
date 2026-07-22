import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';
import InputField from '../../InputField';

const FacilityTypeMappingMaster = () => {
    const { setOpenPage, getSteteNameDrpData, stateNameDrpDt, getFacilityTypeDrpData, facilityTypeDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const [facilityTypeId, setFacilityTypeId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    const [loading, setLoading] = useState(false);

    // Search filter
    const [leftSearch, setLeftSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");

    const [errors, setErrors] = useState({
        "facilityTypeIdErr": "", "stateIdErr": ""
    })

    useEffect(() => {
        getSteteNameDrpData();
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
        setLoading(true);
        fetchData(`/api/v1/unmapped/${stateId}/${facilityTypeId}`).then(data => {
            console.log('datau', data)
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 ? data?.data?.map((dt) => ({
                    value: dt?.facilityTypeId,
                    label: dt?.facilityTypeName
                })
                ) : [];
                setAvailableOptions(drpData);
                setLoading(false);
            } else {
                setAvailableOptions([]);
                setLoading(false);
            }
        })
    }

    const getMappedList = () => {
        fetchData(`/api/v1/mapped/${stateId}/${facilityTypeId}`).then(data => {
            console.log('datam', data)
            if (data.status === 1) {
                const drpData = data?.data?.length > 0 ? data?.data?.map((dt) => ({
                    value: dt?.cwhnumStateFacilityTypeId,
                    label: dt?.cwhnumStateFacilityTypeName,
                })
                ) : [];
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

        const mappedData = newMapped?.length > 0 && newMapped?.map((dt,index) => ({
            "cwhnumFacilityTypeId": dt?.value,
            "cwhnumStateFacilityTypeName": dt?.label,
            "cwhnumOrder": dt?.order || index
        }))

        const unMappedData = newUnMapped?.length > 0 && newUnMapped?.map(dt => ({
            "cwhnumStateFacilityTypeId": dt?.value,
            // "facilityTypeName": dt?.label,
        }))

        const val = {
            "mapFacilityTypeDTO": mappedData?.length > 0 ? mappedData : [],
            "unmapFacilityTypeDTO": unMappedData?.length > 0 ? unMappedData : [],
            "stateId": parseInt(stateId),
            "seatId": getAuthUserData('userSeatId'),
            "facilityTypeId": parseInt(facilityTypeId)
        }

        console.log('val', val)
        fetchPostData(`/api/v1/facility-type`, val).then(data => {
            console.log('datas', data)
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
        setInitialMappedOptions([]);
        setSelectedSelected();
        setSelectedAvailable();
        setSelectedOptions([]);
        setAvailableOptions([]);
        setRightSearch('');
        setLeftSearch('');
    }

    const refresh = () => {
        setInitialMappedOptions([]);
        setSelectedSelected();
        setSelectedAvailable();
        setSelectedOptions([]);
        setAvailableOptions([]);
        setRightSearch('');
        setLeftSearch('');
    }


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Facility Type Mapping Master`}</b></span>
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
                    <div className='' style={{ width: "40%" }}>
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

                    <div className='' style={{ width: "40%" }}>
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
