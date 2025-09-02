import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';

const TestMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt,getFacilityTypeDrpData,facilityTypeDrpDt,setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

   
    const [stateId, setStateId] = useState("");
    const [facilityId, setFacilityId] = useState("");
    const [inOutFlag, setInoutFlag] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        
        if (facilityTypeDrpDt?.length === 0) getFacilityTypeDrpData();
        setOpenPage("add");
       // getFacilityTypeDrpData();
    }, []);


    useEffect(() => {
        if (stateId) {
            setSelectedOptions([]);
           // getUnmappedList();
        }
        setSelectedAvailable([]);
        setSelectedSelected([]);
    }, [stateId]);

    useEffect(() => {
        if (stateId && facilityId && inOutFlag) {
            getMappedList();
            getUnmappedList();
        }
    }, [stateId, facilityId, inOutFlag])


    

    const getUnmappedList = () => {
    
            fetchData(`/api/v1/TestMap/unmap?isActive=1&facilityTypeId=${facilityId}&stateId=${stateId}&inhouseOutsourceFlag=1`).then(data => {
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.cwhnumTestId,
                    label: dt?.cwhstrTestDesc
                })
                )
                setAvailableOptions(drpData)
            } else {
                console.error(data?.message, 'error')
                setAvailableOptions([])
            }
        })
    }

    const getMappedList = () => {
        fetchData(`/api/v1/TestMap/map?isActive=1&facilityTypeId=${facilityId}&stateId=${stateId}&inhouseOutsourceFlag=1`).then(data => {
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.cwhnumTestId,
                    label: dt?.cwhstrTestDesc
                })
                )
                setSelectedOptions(drpData)
                setInitialMappedOptions(drpData);
            } else {
                console.error(data?.message, 'error')
                setSelectedOptions([])
                setInitialMappedOptions([])
            }
        })
    }

    const saveTestMappedData = () => {

        const newMapped = selectedOptions.filter(
            item => !initialMappedOptions.some(i => i.value == item.value)
        );

        const newUnMapped = initialMappedOptions.filter(
            item => !selectedOptions.some(i => i.value == item.value)
        );

        console.log(newMapped,'m')
        console.log(newUnMapped,'u')

        const mappedData = newMapped?.length > 0 && newMapped?.map(dt => ({
            "cwhnumStateId": parseInt(stateId),
         //   "cwhnumStateFacilityTypeId": 0,
            "cwhnumCentreFacilityTypeId":  parseInt(facilityId),
            "cwhnumTestId": dt?.value,
            "cwhnumInhouseOutsourceFlag": parseInt(inOutFlag),
          //  "cwhstrTestDesc": dt?.label,
           // "gnumSeatId": getAuthUserData('userSeatId'),
            "cwhnumIsvalid": 1,
           // "cwhnumProgrammeSlno": 0,
           
          

        }))

        const unMappedData = newUnMapped?.length > 0 && newUnMapped?.map(dt => ({
          //  "cwhnumStateId": parseInt(stateId),
            "cwhnumTestId": dt?.value,
         //   "cwhstrTestDesc": dt?.label,            
            "cwhnumDh": 0,
            "cwhnumSdh": 0,
            "cwhnumChc": 0,
            "cwhnumAamphc": 0,
            "cwhnumAamshc": 0,
            "cwhnumIsvalid": 0,
         //    "cwhnumEntryUid": 0,
          //  "cwhdtEntryDate": "2025-06-30T05:34:24.275Z",
          //  "cwhnumModUid": 0,
          //  "cwhdtModDate": "2025-06-30T05:34:24.275Z",
            "cwhnumInhouseOutsourceFlag":  parseInt(inOutFlag),
            "cwhnumStateId": parseInt(stateId),
       //     "cwhnumStateFacilityTypeId": 0,
            "cwhnumCentreFacilityTypeId":parseInt(facilityId)
        }))

        const val = {
            "arrTestMappedDtos": mappedData?.length > 0 ? mappedData : [],
            "arrTestUnMapDtos": unMappedData?.length > 0 ? unMappedData : [],
          //  "gnumSeatId": getAuthUserData('userSeatId'),
        //    "cwhnumStateProgrammeId": 0,
        //    "cwhstrStateProgrammeName": "",
            "cwhnumStateId": parseInt(stateId)
        }

        fetchPostData(`/api/v1/TestMap/create`, val).then(data => {
            if (data?.status === 1) {
                console.log(data?.data)
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

        if (stateId === "") {
            setErrors(prev => ({ ...prev, "stateIdErr": "Please select state name" }))
            isValid = false;
        }
        if (facilityId === "") {
            setErrors(prev => ({ ...prev, "facilityIdErr": "Please select facility type" }))
            isValid = false;
        }//    "arrTestMappedDtos": [
   // {
        if (inOutFlag === "") {
            setErrors(prev => ({ ...prev, "inOutFlagErr": "Please select inhouse/outsource flag" }))
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveTestMappedData();
        }
    }, [confirmSave])

    const reset = () => {
        setInoutFlag('');
        setStateId('');
        setFacilityId('');
     //   setInitialMappedOptions();
     //   setSelectedSelected();
      //  setSelectedAvailable();
      //  setSelectedOptions();
      //  setAvailableOptions();
        setInitialMappedOptions([]);
        setSelectedSelected([]);
        setSelectedAvailable([]);
        setSelectedOptions([]);
        setAvailableOptions([]);
    }

    const moveToSelected = () => {
     //   if (cwhnumTestId) {
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
      //  } else {
          //  ToastAlert('Please select test name!', 'warning')
      //  }
    };


    const moveToAvailable = () => {
      //  if (cwhnumTestId) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.value))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.value))
            ));
            setSelectedSelected([]);
     //   } else {
          //  ToastAlert('Please select test name!', 'warning')
    //    }
    };


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Test Mapping Master`}</b></span>
                    {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {functionalityData?.length || 0}</span>} */}
                </div>


                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select Value"
                                    /*options={[{ value: '44', label: 'District Hospital' }]}*/
                                    options={stateNameDrpDt}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={stateId}
                                    onChange={(e) => setStateId(e.target.value)}
                                />

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Facility Type : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select value"
                                    options={facilityTypeDrpDt}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={facilityId}
                                    onChange={(e) => setFacilityId(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Inhouse/Outsource : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select Value"
                                    options={[
                                        { value: '1', label: 'Inhouse' },
                                        { value: '2', label: 'Outsource' }
                                      ]}
                                    /*options={stateNameDrpDt}*/
                                    className="aliceblue-bg border-dark-subtle"
                                    value={inOutFlag}
                                    onChange={(e) => setInoutFlag(e.target.value)}
                                />

                            </div>
                        </div>
                    </div>
                    </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> Test Facility Type
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
                             {availableOptions?.length > 0 && availableOptions?.map(opt => (
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
                            {selectedOptions?.length > 0 && selectedOptions?.map(opt => (
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
                        <button className='btn btn-sm datatable-btns py-0' onClick={reset} >
                        <i className="fa fa-broom me-1 fs-13 text-warning"></i>Clear</button>
                </div>
            </div>
        </>
    )
}

export default TestMappingMaster
