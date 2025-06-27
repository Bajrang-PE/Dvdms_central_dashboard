import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../GlobalButtons';
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData } from '../../../../../utils/ApiHooks';

const ProgrammeMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext);

    const [programmeId, setProgrammeId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("add");
        //getFacilityTypeDrpData();
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
        if (stateId && programmeId) {
            getMappedList();
        }
    }, [stateId, programmeId])

    const getUnmappedList = () => {
        fetchData(`api/v1/unmappedFclty/${stateId}`).then(data => {
            if (data) {
                setAvailableOptions(data)
            } else {
                ToastAlert('Error while fetching record!', 'error')
            }
        })
    }

    const getMappedList = () => {
        fetchData(`api/v1/mapped/${facilityTypeId}/${stateId}`).then(data => {
            if (data) {
                setSelectedOptions(data)
            } else {
                ToastAlert('Error while fetching record!', 'error')
            }
        })
    }

    const moveToSelected = () => {
        if (programmeId) {
            const itemsToMove = availableOptions.filter(opt =>
                selectedAvailable.includes(String(opt.programmeId))
            );
            const newSelected = itemsToMove.filter(item =>
                !selectedOptions.some(selected => selected.programmeId === item.programmeId)
            );
            setSelectedOptions(prev => [...prev, ...newSelected]);
            setAvailableOptions(prev => prev.filter(opt =>
                !selectedAvailable.includes(String(opt.programmeId))
            ));
            setSelectedAvailable([]);
        } else {
            ToastAlert('Please select programme name!', 'warning')
        }
    };

    const moveToAvailable = () => {
        if (programmeId) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.programmeId))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.programmeId))
            ));
            setSelectedSelected([]);
        } else {
            ToastAlert('Please select programme name!', 'warning')
        }
    };


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Programme Mapping Master`}</b></span>
                    {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {functionalityData?.length || 0}</span>} */}
                </div>


                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Programme Name : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select Value"
                                    options={[{ value: '44', label: 'District Hospital' }]}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={programmeId}
                                    onChange={(e) => setProgrammeId(e.target.value)}
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
                        <span className="text-danger">*</span> State Programme Name
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
                                    {opt.facilityTypeName}
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

export default ProgrammeMappingMaster
