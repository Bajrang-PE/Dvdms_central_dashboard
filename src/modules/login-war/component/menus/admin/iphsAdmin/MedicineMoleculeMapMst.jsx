import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../../InputSelect'
import { capitalizeFirstLetter, ToastAlert } from '../../../../utils/CommonFunction';
import { LoginContext } from '../../../../context/LoginContext';
import { fetchData, fetchDeleteData, fetchPatchData, fetchPostData } from '../../../../../../utils/ApiHooks';
import InputField from '../../../InputField';

const MedicineMoleculeMapMst = () => {


    const { openPage, iphsMedicineDrpData, getIphsMedicineDrpData } = useContext(LoginContext)

    const [addedToRight, setAddedToRight] = useState([]);
    const [removedFromRight, setRemovedFromRight] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);
    const [medicineId, setMedicineId] = useState("");
    const [medicineIdErr, setMedicineIdErr] = useState("");

    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);

    // Search filter
    const [leftSearch, setLeftSearch] = useState("");
    const [rightSearch, setRightSearch] = useState("");

    useEffect(() => {
        getIphsMedicineDrpData();
    }, [])

    useEffect(() => {
        if (medicineId.trim()) {
            getUnmappedList();
            getMappedList();
        } else {
            setAvailableOptions([])
            setSelectedOptions([])
        }
    }, [medicineId])

    const getUnmappedList = () => {
        fetchData(`/api/v1/IphsMoleculeDrugMst/getUnmappedMoleculeDrugs?packID=${medicineId}`).then(data => {
            if (data?.status === 200) {
                const drpData = Array.from(
                    new Map(
                        data.data.map(dt => [
                            dt.drugID.toString(), // force string key
                            {
                                value: dt.drugID.toString(), // ensure it's string for <option>
                                label: dt.moleculeName,
                            }
                        ])
                    ).values()
                );
                setAvailableOptions(drpData)
            } else {
                setAvailableOptions([]);
            }
        })
    }

    const getMappedList = () => {

        fetchData(`/api/v1/IphsMoleculeDrugMst/getMappedMoleculeDrugs?packID=${medicineId}`)
            .then((data) => {
                if (data.status === 1) {
                    const drpData = Array.from(
                        new Map(
                            data.data.map(dt => [
                                dt.drugID.toString(),
                                {
                                    value: dt.drugID.toString(),
                                    label: dt.moleculeName
                                }
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

    const handleSave = () => {
        let isValid = true;
        if (medicineId === "") {
            setMedicineIdErr("please select medicine name")
            isValid = false;
        }
        // if (stateId === "") {
        //     setStateIdErr("please select state name")
        //     isValid = false;
        // }
        if (isValid) {

            const addedToRight = selectedOptions.filter(
                item => !initialMappedOptions.some(i => i.value === item.value)
            );

            const removedFromRight = initialMappedOptions.filter(
                item => !selectedOptions.some(i => i.value === item.value)
            );

            const mappedData = addedToRight?.map(dt => ({
                "drugID": Number(dt?.value),
                "moleculeName": dt?.label,
                "packID": Number(medicineId)
            }))

            const unMappedData = removedFromRight?.map(dt => ({
                "moleculeID": Number(dt?.value),
                "packID": Number(medicineId)
            }))

            //const unMappedData = removedFromRight?.map(dt => Number(dt?.value));

            const val = {
                "iphsMoleculeMappingMstDTO": mappedData?.length > 0 ? mappedData : [],
                "iphsMoleculeUmappingMstDTO": unMappedData?.length > 0 ? unMappedData : [],
            }

            if (mappedData.length > 0 || unMappedData.length > 0) {
                fetchPostData("/api/v1/IphsMoleculeDrugMst/mapMoleculeDrug", val).then(data => {
                    if (data?.status === 1) {
                        ToastAlert("Data mapped successfully", "success")
                        reset();
                    } else {
                        ToastAlert(data.message, "error")
                    }
                })
            }
            else {
                ToastAlert("Please map at least one molecule drug name.", "warning");
            }
        }
    };

    const reset = () => {
        setMedicineId("");
        setAvailableOptions([]);
        setSelectedOptions([]);
        setSelectedAvailable([]);
        setSelectedSelected([]);
        setAddedToRight([]);
        setRemovedFromRight([]);
        setRightSearch('');
        setLeftSearch('');
    };


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`IPHS Medicine-Molecule Mapping Master`}</b></span>
                    {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>} */}
                </div>

                <div className='row col-sm-6 mt-1'>
                    <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Medicine Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="medicineId"
                            name="medicineId"
                            placeholder={"Select Value"}
                            options={iphsMedicineDrpData}
                            onChange={(e) => {
                                setMedicineId(e.target.value);
                                setMedicineIdErr("");
                                setRightSearch('');
                                setLeftSearch('');
                            }}
                            value={medicineId}
                            errorMessage={medicineIdErr}
                        />
                    </div>

                </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> IPHS State Molecule Drug Name
                    </div>
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                </div>

                {/* Dual List Box */}
                <div className='d-flex justify-content-center mt-1 mb-2'>
                    {/* Available List */}
                    <div style={{ width: "40%" }}>
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
                            {/* {availableOptions.map(opt => (
                                <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                            ))} */}

                            {availableOptions
                                ?.filter(opt => opt.label?.toLowerCase()?.includes(leftSearch?.toLowerCase()))
                                ?.map((opt,index) => (
                                    <option key={index+"bg"+opt?.value?.toString()} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))
                            }
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
                    <div style={{ width: "40%" }}>
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
                            {/* {selectedOptions.map(opt => (
                                <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                            ))} */}

                            {selectedOptions
                                ?.filter(opt => opt?.label?.toLowerCase()?.includes(rightSearch?.toLowerCase()))
                                ?.map((opt,index) => (
                                    <option key={index+"bg"+opt?.value?.toString()} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))
                            }
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
        </>
    )
}

export default MedicineMoleculeMapMst