import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';

const FacilityTypeMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, getFacilityTypeDrpData, facilityTypeDrpDt } = useContext(LoginContext);

    const [facilityTypeId, setFacilityTypeId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("add");
        getFacilityTypeDrpData();
    }, []);

    useEffect(() => {
        if (stateId) {
            setSelectedOptions([]);
            getUnmappedList();
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
        fetchData(`http://10.226.17.20:8025/api/v1/facilityMap/unmappedFcility?facilityTypeId=${facilityTypeId}&stateId=${stateId}`).then(data => {
            if (data?.status === 1) {
                setAvailableOptions(data?.data)
            } else {
                // ToastAlert('Error while fetching record!', 'error')
                setAvailableOptions([])
            }
        })
    }

    const getMappedList = () => {
        fetchData(`http://10.226.17.20:8025/api/v1/facilityMap/mapped?facilityTypeId=${facilityTypeId}&stateId=${47}`).then(data => {
            if (data.status === 1) {
                setSelectedOptions(data?.data)
            } else {
                // ToastAlert('Error while fetching record!', 'error')
                setSelectedOptions([])
            }
        })
    }

    const saveFacilityMappedData = () => {
        const val = {
            "stateFacilityTypeId": 0,
            "stateId": stateId,
            "stateFacilityTypeName": "",
            "facilityTypeId": facilityTypeId,
            "seatId": getAuthUserData('userSeatId'),
            // "facilityTypeSlno": 0,
            // "order": 0
        }

        fetchPostData(`http://10.226.17.20:8025/api/v1/facilityMap/saveFacilityMap`, val).then(data => {
            if (data?.status === 1) {
                console.log(data?.data)
            } else {
                ToastAlert(data?.message, 'error')
            }
        })
    }

    const moveToSelected = () => {
        if (facilityTypeId) {
            const itemsToMove = availableOptions.filter(opt =>
                selectedAvailable.includes(String(opt.facilityTypeId))
            );
            const newSelected = itemsToMove.filter(item =>
                !selectedOptions.some(selected => selected.facilityTypeId === item.facilityTypeId)
            );
            setSelectedOptions(prev => [...prev, ...newSelected]);
            setAvailableOptions(prev => prev.filter(opt =>
                !selectedAvailable.includes(String(opt.facilityTypeId))
            ));
            setSelectedAvailable([]);
        } else {
            ToastAlert('Please select facility type!', 'warning')
        }
    };

    const moveToAvailable = () => {
        if (facilityTypeId) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.facilityTypeId))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.facilityTypeId))
            ));
            setSelectedSelected([]);
        } else {
            ToastAlert('Please select facility type!', 'warning')
        }
    };

    const reset = () => {
        setFacilityTypeId('')
        setStateId('')
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
                                    onChange={(e) => setFacilityTypeId(e.target.value)}
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
                                    onChange={(e) => setStateId(e.target.value)}
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
                            {availableOptions.map(opt => (
                                <option key={opt.facilityTypeId} value={opt.facilityTypeId}>
                                    {opt.facilityTypeName}
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
                            {selectedOptions.map(opt => (
                                <option key={opt.facilityTypeId} value={opt.facilityTypeId}>
                                    {opt.stateFacilityTypeName}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>

                {/* <hr className='my-2' /> */}
                <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn btn-sm datatable-btns py-0' >
                        <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>
                    <button className='btn btn-sm datatable-btns py-0'  >
                        <i className="fa fa-broom me-1 fs-13 text-warning"></i>Clear</button>
                </div>
            </div>
        </>
    )
}

export default FacilityTypeMappingMaster
