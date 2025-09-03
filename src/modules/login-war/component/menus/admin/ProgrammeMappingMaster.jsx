import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../GlobalButtons';
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';

const ProgrammeMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const confirmSaveLocaL = confirmSave;

    console.log("save", confirmSaveLocaL);

    const [programmeId, setProgrammeId] = useState("");
    const [stateId, setStateId] = useState("");
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [programmeNameList, setProgrammeNameList] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);


    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        if (programmeNameList?.length === 0) getProgrammeNameList();

        setOpenPage("add");
        //getFacilityTypeDrpData();
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
        if (stateId && programmeId) {
            getMappedList();
            getUnmappedList();
        }
    }, [stateId, programmeId])

    const getProgrammeNameList = () => {
        fetchData(`/api/v1/ProgrammeMap/all?isActive=1`).then(data => {
            console.log('data', data)
            if (data?.status === 1) {
                console.log(data?.data, 'listpname')
                const drpData = data?.data?.map((dt) => ({
                    value: dt?.cwhnumProgrammeId,
                    label: dt?.cwhstrProgrammeName
                }))

                setProgrammeNameList(drpData)
            } else {
                console.error(data?.message, 'error');
            }
        })
    }

    const getUnmappedList = () => {
        fetchData(`/api/v1/ProgrammeMap/unmap?programmeId=${programmeId}&stateId=${stateId}`).then(data => {
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.cwhnumProgrammeId,
                    label: dt?.cwhstrProgrammeName
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
        fetchData(`/api/v1/ProgrammeMap/map?programmeId=${programmeId}&stateId=${stateId}`).then(data => {
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.cwhnumStateProgrammeId,
                    label: dt?.cwhstrStateProgrammeName
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


    const saveProgrammeMappedData = () => {

        console.log("selected value", selectedOptions);

        const newMapped = selectedOptions.filter(
            item => !initialMappedOptions.some(i => i.value == item.value)
        );

        const newUnMapped = initialMappedOptions.filter(
            item => !selectedOptions.some(i => i.value == item.value)
        );

        console.log(newMapped,'m')
        console.log(newUnMapped,'u')

        const mappedData = newMapped?.length > 0 && newMapped?.map(dt => ({
         //   "cwhnumStateId": parseInt(stateId),
            "cwhnumStateProgrammeId": dt?.value,
            "cwhstrStateProgrammeName": dt?.label,
          //  "gnumSeatId": getAuthUserData('userSeatId') || 10008,
          //  "gnumIsValid": 1,
           // "cwhnumProgrammeSlno": 0,
           // "cwhnumProgrammeId": programmeId,
          //  "cwhstrProgrammeName": '',

        }))

        const unMappedData = newUnMapped?.length > 0 && newUnMapped?.map(dt => ({
          //  "cwhnumStateId": parseInt(stateId),
          //  "cwhnumProgrammeId":  programmeId,
           // "cwhstrProgrammeName": '',
           cwhnumProgrammeId: dt?.value,
         //  gdtEntryDate: 
           //gdtEntryDate: new Date().toISOString(),
           cwhstrProgrammeName: dt?.label,
        }))

        const val = {
            arrProgrammeMappedDtos: mappedData?.length > 0 ? mappedData : [],
            arrProgrammeUnMapDtos: unMappedData?.length > 0 ? unMappedData : [],
         //   gnumSeatId: getAuthUserData('userSeatId') || 10008,

            //change here
            
            gnumSeatId:  getAuthUserData('userSeatId') || 10008,
            cwhnumStateId: parseInt(stateId),
            cwhnumProgrammeId: programmeId,
        }


        fetchPostData(`/api/v1/ProgrammeMap`,val).then(data => {
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

        if (programmeId === "") {
            setErrors(prev => ({ ...prev, "programmeIdErr": "Please select programme name" }))
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
             saveProgrammeMappedData();
        }
    }, [confirmSave])


    const moveToSelected = () => {
      //  if (programmeId) {
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
    //    } else {
    //        ToastAlert('Please select programme name!', 'warning')
    //    }
    };

    const moveToAvailable = () => {
     //   if (programmeId) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.value))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.value))
            ));
            setSelectedSelected([]);
    //    } else {
   //         ToastAlert('Please select programme name!', 'warning')
     //   }
    };

   
    const reset = () => {
        setProgrammeId('');
        setStateId('');
        setInitialMappedOptions([]);
        setSelectedSelected([]);
        setSelectedAvailable([]);
        setSelectedOptions([]);
        setAvailableOptions([]);
    }
    


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
                                    options={programmeNameList}
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

export default ProgrammeMappingMaster
