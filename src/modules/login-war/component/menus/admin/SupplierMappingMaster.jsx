import React, { useContext, useEffect, useState } from 'react';
import GlobalButtons from '../GlobalButtons';
import InputSelect from '../../InputSelect';
import { LoginContext } from '../../../context/LoginContext';
import { fetchData, fetchUpdateData, fetchUpdatePostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';
import { ToastAlert } from '../../../utils/CommonFunction';

const SupplierMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, getSupplierNameDrpData, supplierNameDrpDt } = useContext(LoginContext);
    const [addedToRight, setAddedToRight] = useState([]);
    const [removedFromRight, setRemovedFromRight] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    const [suppId, setSuppId] = useState("");
    const [stateId, setStateId] = useState("");
    const [suppIdErr, setSuppIdErr] = useState("");
    const [stateIdErr, setStateIdErr] = useState("");
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
            getStateSuppUnmapList();
            getStateSuppMappedList();
            setSelectedOptions([]);
        } else {
            setAvailableOptions([]);
            setSelectedOptions([])
        }
        setSelectedAvailable([]);
        setSelectedSelected([]);
    }, [stateId, suppId]);

    const getStateSuppUnmapList = () => {

        fetchData(`http://10.226.26.247:8025/api/v1/supplierMappingMaster/getUnmappedSuppliers?stateID=${stateId || 0}`).then((data) => {
            if (data.data) {
                const drpData = Array.from(
                    new Map(
                        data.data.map(dt => [
                            dt.supplierID.toString(), // force string key
                            {
                                value: dt.supplierID.toString(), // ensure it's string for <option>
                                label: dt.supplierName,
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


    // const getStateSuppMappedList = () => {
    //  alert("getSupplierMappedList")
    //     fetchData(`http://10.226.26.247:8025/api/v1/supplierMappingMaster/getMappedSuppliers?supplierID=${suppId}&stateID=${stateId}`).then((data) => {
    //         if (data) {
    //             alert("in if")
    //             const drpData = Array.from(
    //                 new Map(
    //                     data.data.map(dt => [
    //                         dt.supplierID.toString(), // force string key
    //                         {
    //                             value: dt.supplierID.toString(), // ensure it's string for <option>
    //                             label: dt.supplierName,
    //                         }
    //                     ])
    //                 ).values()
    //             );
    //             alert("drpData"+drpData)
    //             setSelectedSelected(drpData);
    //         } else {
    //             alert("in else")
    //             setSelectedSelected([]);
    //         }
    //     });
    // };

    const getStateSuppMappedList = () => {

        fetchData(`http://10.226.26.247:8025/api/v1/supplierMappingMaster/getMappedSuppliers?supplierID=${suppId || 0}&stateID=${stateId || 0}`)
            .then((data) => {
                if (data?.data) {
                    const drpData = Array.from(
                        new Map(
                            data.data.map(dt => [
                                dt.supplierID.toString(),
                                { value: dt.supplierID.toString(), label: dt.supplierName }
                            ])
                        ).values()
                    );
                    setSelectedOptions(drpData);
                    setInitialMappedOptions(drpData); // snapshot for comparison
                } else {
                    setSelectedOptions([]);
                    setInitialMappedOptions([]);
                }
            });
    };




    // const moveToSelected = () => {
    //     const itemsToMove = availableOptions.filter(opt => selectedAvailable.includes(opt.value));
    //     const newSelected = itemsToMove.filter(item =>
    //         !selectedOptions.some(selected => selected.value === item.value)
    //     );
    //     setSelectedOptions(prev => [...prev, ...newSelected]);
    //     setAvailableOptions(prev => prev.filter(opt => !selectedAvailable.includes(opt.value)));
    //     setSelectedAvailable([]);
    // };

    const moveToSelected = () => {
        const itemsToMove = availableOptions.filter(opt => selectedAvailable.includes(opt.value));

        setSelectedOptions(prev => {
            const updated = [...prev];
            itemsToMove.forEach(item => {
                if (!updated.some(opt => opt.value === item.value)) {
                    updated.push(item);
                    setAddedToRight(prevAdded => [...prevAdded, item]); // track additions
                }
            });
            return updated;
        });

        setAvailableOptions(prev => prev.filter(opt => !selectedAvailable.includes(opt.value)));
        setSelectedAvailable([]);
    };


    // const moveToAvailable = () => {
    //     const itemsToMove = selectedOptions.filter(opt => selectedSelected.includes(opt.value));
    //     setAvailableOptions(prev => [...prev, ...itemsToMove]);
    //     setSelectedOptions(prev => prev.filter(opt => !selectedSelected.includes(opt.value)));
    //     setSelectedSelected([]);
    // };

    const moveToAvailable = () => {
        const itemsToMove = selectedOptions.filter(opt => selectedSelected.includes(opt.value));

        setAvailableOptions(prev => {
            const updated = [...prev];
            itemsToMove.forEach(item => {
                if (!updated.some(opt => opt.value === item.value)) {
                    updated.push(item);
                    setRemovedFromRight(prevRemoved => [...prevRemoved, item]); // track removals
                }
            });
            return updated;
        });

        setSelectedOptions(prev => prev.filter(opt => !selectedSelected.includes(opt.value)));
        setSelectedSelected([]);
    };

    const reset = () => {
        setSuppId("");
        setStateId("");
        setAvailableOptions([]);
        setSelectedOptions([]);
        setSelectedAvailable([]);
        setSelectedSelected([]);
        setAddedToRight([]);
        setRemovedFromRight([]);
    };

    const handleSave = () => {

        let isValid = true;

        if (suppId === "") {
            setSuppIdErr("please select supplier name")
            isValid = false;
        }
        if (stateId === "") {
            setStateIdErr("please select state name")
            isValid = false;
        }

        if (isValid) {

            const addedToRight = selectedOptions.filter(
                item => !initialMappedOptions.some(i => i.value === item.value)
            );

            const removedFromRight = initialMappedOptions.filter(
                item => !selectedOptions.some(i => i.value === item.value)
            );


            console.log("Added55555555:", addedToRight);
            console.log("Removed6666666:", removedFromRight);

            const mappedData = addedToRight?.map(dt => ({
                "stateID": stateId,
                "stateSupplierID": dt?.value,
                "seatID": 3424,
                "supplierID": suppId,
                "supplierName": dt?.label,

            }))

            const unMappedData = removedFromRight?.map(dt => ({
                "stateID": stateId,
                "supplierID": dt?.value,
                "supplierName": dt?.label,
            }))

            const val = {
                "supplierMappingMasterDTO": mappedData?.length > 0 ? mappedData : [],
                "supplierUnmappingMasterDTO": unMappedData?.length > 0 ? unMappedData : [],

            }

            console.log(mappedData, 'bbbbbbbbbbbbbbbbbbbb')

            if (selectedOptions.length > 0) {

                fetchUpdatePostData("http://10.226.26.247:8025/api/v1/supplierMappingMaster/postSupplierData", val).then(data => {
                    if (data.status == 1) {
                        ToastAlert('Data mapped successfully', 'success');
                        reset();
                    } else {
                        ToastAlert('Error', 'error')
                    }
                });
            } else {
                alert("Please map at least one supplier.");
            }
        }
    };


    return (

        <div className="masters mx-3 my-2">

            <div className='masters-header row'>
                <span className='col-6'><b>{`Supplier Mapping Master`}</b></span>
                {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>} */}
            </div>
      
            <div className="row pt-2">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">Supplier Name :</label>
                    <div className="col-sm-8">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='suppId'
                            id='suppId'
                            placeholder="Select value"
                            options={supplierNameDrpDt}
                            onChange={(e) => {
                                setSuppId(e.target.value);
                                setSuppIdErr("");
                            }
                            }
                            value={suppId}
                            errorMessage={suppIdErr}
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
                            onChange={(e) => {
                                setStateId(e.target.value);
                                setStateIdErr("");
                            }}
                            value={stateId}
                            errorMessage={stateIdErr}
                        />
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center my-3">
                <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                <div className="px-1 text-primary fw-bold fs-13">
                    <span className="text-danger">*</span> State Supplier Name
                </div>
                <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
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
            <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}></div>

            <div className='text-center'>
                <button className='btn btn-sm new-btn-blue py-0' onClick={handleSave}>
                    <i className="fa fa-save me-1"></i>
                    Save</button>
                <button className='btn btn-sm new-btn-blue py-0' onClick={reset}>  <i className="fa fa-broom me-1"></i>Clear</button>
            </div>
        </div>
    );
};

export default SupplierMappingMaster;
