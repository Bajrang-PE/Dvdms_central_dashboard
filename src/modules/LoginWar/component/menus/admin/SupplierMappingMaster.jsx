import React, { useContext, useEffect, useState } from 'react';
import GlobalButtons from '../GlobalButtons';
import InputSelect from '../../InputSelect';
import { LoginContext } from '../../../context/LoginContext';
import { fetchData, fetchUpdateData } from '../../../utils/ApiHooks';

const SupplierMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, getSupplierNameDrpData, supplierNameDrpDt } = useContext(LoginContext);

    const [suppId, setSuppId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);

    useEffect(() => {
        if (supplierNameDrpDt?.length === 0) getSupplierNameDrpData();
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("add");
    }, []);

    useEffect(() => {
        if (stateId) {
            getStateSuppList();
            setSelectedOptions([]);
        }
        setSelectedAvailable([]);
        setSelectedSelected([]);
    }, [stateId]);

    const getStateSuppList = () => {
        fetchData('/state/getstate').then((data) => {
            if (data) {
                const drpData = Array.from(
                    new Map(
                        data.map(dt => [
                            dt.cwhnumStateId.toString(), // force string key
                            {
                                value: dt.cwhnumStateId.toString(), // ensure it's string for <option>
                                label: dt.cwhstrStateName,
                            }
                        ])
                    ).values()
                );
                setAvailableOptions(drpData);
            } else {
                setAvailableOptions([]);
            }
        });
    };

    const moveToSelected = () => {
        const itemsToMove = availableOptions.filter(opt => selectedAvailable.includes(opt.value));
        const newSelected = itemsToMove.filter(item =>
            !selectedOptions.some(selected => selected.value === item.value)
        );
        setSelectedOptions(prev => [...prev, ...newSelected]);
        setAvailableOptions(prev => prev.filter(opt => !selectedAvailable.includes(opt.value)));
        setSelectedAvailable([]);
    };

    const moveToAvailable = () => {
        const itemsToMove = selectedOptions.filter(opt => selectedSelected.includes(opt.value));
        setAvailableOptions(prev => [...prev, ...itemsToMove]);
        setSelectedOptions(prev => prev.filter(opt => !selectedSelected.includes(opt.value)));
        setSelectedSelected([]);
    };

    const reset = () => {
        setSuppId(""),
            setStateId(""),
            setAvailableOptions([]),
            setSelectedOptions([]),
            setSelectedAvailable([]),
            setSelectedSelected([])
    }

    const handleSave = () => {
        if (selectedOptions.length > 0) {
            console.log("========selectedOptions=========", selectedOptions)
            const data = {
                stateId: suppId,
                supplierId: suppId,
                mappedItems: selectedOptions.map(opt => opt.value)
            };

            fetchUpdateData("api", data); // Replace with actual endpoint
            alert("Data saved!");
            //setOpenPage("home");
        } else {
            alert("Please map at least one item.");
            //setOpenPage("home");
        }
    };

    return (

        <div className="masters mx-3 my-2">
            {/* <GlobalButtons onSave={handleSave} onClear={reset} /> */}
            <div className='text-left w-100 fw-bold p-1 heading-text'>Supplier Mapping Master</div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">Supplier Name :</label>
                    <div className="col-sm-8">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='suppId'
                            id='suppId'
                            placeholder="Select value"
                            options={supplierNameDrpDt}
                            onChange={(e) => setSuppId(e.target.value)}
                            value={suppId}
                        />
                    </div>
                </div>

                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">State Name :</label>
                    <div className="col-sm-8">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateId'
                            id='stateId'
                            placeholder="Select value"
                            options={stateNameDrpDt}
                            onChange={(e) => setStateId(e.target.value)}
                            value={stateId}
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{border:"1px solid #193fe6"}}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> State Facility Type
                    </div>
                    <div className="flex-grow-1" style={{border:"1px solid #193fe6"}}></div>
                </div>

            {/* Dual List Box */}
            <div className='d-flex justify-content-center mt-1 mb-2'>
                {/* Available List */}
                <div style={{ width: "30%" }}>
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
                            <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                {/* Buttons */}
                <div className='align-self-center mx-2'>
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

                {/* Selected List */}
                <div style={{ width: "30%" }}>
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
                            <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
            </div>

            <div className='text-center'>
                <button className='btn btn-sm new-btn-blue py-0' >
                    <i className="fa fa-save me-1"></i>
                    Save</button>
                <button className='btn btn-sm new-btn-blue py-0' >  <i className="fa fa-broom me-1"></i>Clear</button>
            </div>
        </div>
    );
};

export default SupplierMappingMaster;
