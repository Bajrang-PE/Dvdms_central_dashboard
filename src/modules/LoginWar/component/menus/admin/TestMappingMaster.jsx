import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext';
import { fetchData } from '../../../../../utils/ApiHooks';

const TestMappingMaster = () => {

    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, getSupplierNameDrpData, supplierNameDrpDt ,getFacilityTypeDrpData,
        facilityTypeDrpDt
    } = useContext(LoginContext);
       
        const [stateId, setStateId] = useState("");
        const [facilityTypeId, setFacilityTypeId] = useState("");
        const [istrInhouseId, setIstrInhouseId] = useState("");
        const [availableOptions, setAvailableOptions] = useState([]);
        const [selectedOptions, setSelectedOptions] = useState([]);
        const [selectedAvailable, setSelectedAvailable] = useState([]);
        const [selectedSelected, setSelectedSelected] = useState([]);



        const getStateSuppList = () => {
            fetchData('http://10.226.29.102:8025/state/getstate').then((data) => {
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
    

    useEffect(()=>{
        getSteteNameDrpData();
        getFacilityTypeDrpData();
        getStateSuppList();
    },[stateId])


    const reset = () => {
            setStateId(""),
            //setAvailableOptions([]),
            setSelectedOptions([])
           // setSelectedAvailable([]),
           // setSelectedSelected([])
    }

  return (
    <div className="masters mx-3 my-2">
        <div className="text-left w-100 fw-bold p-1 heading-text">Test Mapping Master</div>

        <div className="row"> 
            <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fix-label required-label">State</label>
                <div className="col-sm-8 align-content-center">
                    <InputSelect 
                    id="stateId"
                    name="stateId"
                    placeholder={""}
                    options={stateNameDrpDt}
                    values={stateId}

                    />

                </div>
            </div>

            <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fix-label required-label">Facility Type</label>
                <div className="col-sm-8 align-content-center">
                <InputSelect 
                    id="facilityTypeId"
                    name="facilityTypeId"
                    placeholder={""}
                    options={facilityTypeDrpDt}
                    values={facilityTypeId}

                    />

                    
                </div>
            </div>

            <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fix-label required-label">Inhouse/Outhouse</label>
                <div className="col-sm-8 align-content-center">
                <InputSelect 
                    id="istrInhouseId"
                    name="istrInhouseId"
                    placeholder={""}
                    options={[{label:"Select Value", value:"0"},
                        {label:"Inhouse",value:"1"},
                        {label:"Outhouse",value:"2"}]}
                    value={istrInhouseId}

                    />

                    
                </div>
            </div>

        </div>

        <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{border:"1px solid #193fe6"}}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> Test Mapping Master
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
                <button className='btn btn-sm new-btn-blue py-0' onClick={reset}>  <i className="fa fa-broom me-1"></i>Clear</button>
            </div>

    </div>
  )
}

export default TestMappingMaster