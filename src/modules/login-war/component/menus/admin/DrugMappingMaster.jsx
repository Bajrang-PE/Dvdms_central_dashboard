import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import Select from 'react-select'
import { CustomListWindow, getAuthUserData } from '../../../../../utils/CommonFunction';
// import debounce from 'lodash.debounce';

const DrugMappingMaster = () => {
    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const [itemCategory, setItemCategory] = useState("");
    const [itemName, setItemName] = useState(null);
    const [stateId, setStateId] = useState("");
    const [itemNameList, setItemNameList] = useState([]);
    const [drugItemObject, setDrugItemObject] = useState(null);

    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedSelected, setSelectedSelected] = useState([]);
    const [initialMappedOptions, setInitialMappedOptions] = useState([]);

    const [errors, setErrors] = useState({
        "itemNameErr": "", "stateIdErr": ""
    })

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("add");
    }, []);

    useEffect(() => {
        setSelectedOptions([]);
        setAvailableOptions([]);
        setSelectedAvailable([]);
        setSelectedSelected([]);
    }, [stateId]);

    useEffect(() => {
        if (stateId && itemName) {

            getMappedList();
            getUnmappedList();
        }
    }, [stateId, itemName])


    const getItemNameList = (selectedValue) => {
        let url = '';

        switch (selectedValue) {
            case "1":
                url = `/api/v1/drug-mst/fetchDrugs`;
                break;
            case "2":
                url = `/api/v1/drug-mst/fetchReagentDrugs`;
                break;
            case "3":
                url = `/api/v1/drug-mst/fetchDetailedDrugs`;
                break;
            default:
                setItemNameList([]);
                setItemName({});
                return;
        }

        fetchData(url).then(data => {
            console.log('data', data)
            if (data?.status === 1) {
                const options = data?.data?.map(item => ({
                    value: item.cwhnumDrugId,
                    label: item.cwhstrDrugName,
                }));

                setItemNameList(data?.data);
            } else {
                setItemNameList([]);
                setItemName({});
            }
        });
    };


    const getUnmappedList = () => {
        fetchData(`/api/v1/mapDrug/UnmapDrug?stateId=${stateId}`).then(data => {
            console.log('data', data)
            if (data?.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.cwhnumDrugId,
                    label: dt?.cwhstrDrugName
                })
                )
                setAvailableOptions(drpData);
            } else {
                // ToastAlert('Error while fetching record!', 'error')
                setAvailableOptions([])
            }
        })
    }

    const getMappedList = () => {
        fetchData(`/api/v1/mapDrug/MappedDrug?drugId=${itemName?.value}&stateId=${stateId}`).then(data => {
            console.log('data', data)
            if (data.status === 1) {
                const drpData = data?.data?.length > 0 && data?.data?.map((dt) => ({
                    value: dt?.stateDrugId,
                    label: dt?.stateDrugName
                })
                )
                setSelectedOptions(drpData)
                setInitialMappedOptions(drpData)
            } else {
                // ToastAlert('Error while fetching record!', 'error')
                setSelectedOptions([])
                setInitialMappedOptions([])
            }
        })
    }

    const saveDrugMappedData = () => {

        const newMapped = selectedOptions.filter(
            item => !initialMappedOptions.some(i => i.value === item.value)
        );

        const newUnMapped = initialMappedOptions.filter(
            item => !selectedOptions.some(i => i.value === item.value)
        );

        const mappedData = newMapped?.length > 0 && newMapped?.map(dt => ({
            "stateDrugId": parseInt(dt?.value),
            "stateId": parseInt(stateId),
            "seatId": getAuthUserData('userSeatId'),
            "isValid": 1,
            "stateDrugIdTxt": "",
            "stateDrugName": dt?.label,
            "drugId": parseInt(itemName?.value),
            "drugSlno": 0,
            "mappedCorrectly": 0,
            "itemCategoryId": 0,
            "isEdl": 0,
            "reagentId": 0
        }))

        const unMappedData = newUnMapped?.length > 0 && newUnMapped?.map(dt => ({
            "cwhnumDrugIdTxt": "",
            "cwhstrDrugName": dt?.label,
            "cwhnumClassCode": 0,
            "cwhnumStateId": parseInt(dt?.value),
            "cwhnumDrugId": parseInt(itemName?.value),
            "iphsName": "",
            "iphsCode": 0,
            "cwhnumStateItemCategoryId": 0,
            "cwhnumIsEdl": 0,
            "idWithFlag": ""
        }))

        const val = {
            "arrdrugMappedDtos": mappedData,
            "arrdrugUnMapDtos": unMappedData,
            "seatId": getAuthUserData('userSeatId'),
            "stateId": parseInt(stateId)
        }

        fetchPostData(`/api/v1/mapDrug/saveMappedDrugs`, val).then(data => {
            if (data?.status === 1) {
                ToastAlert('Mapped successfully', 'success')
                setConfirmSave(false)
            } else {
                ToastAlert(data?.message, 'error')
                setConfirmSave(false)
            }
        })
    }

    const handleValidation = () => {
        let isValid = true;

        if (itemName?.value === "") {
            setErrors(prev => ({ ...prev, "itemNameErr": "Please select Item name" }))
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
            saveDrugMappedData();
        }
    }, [confirmSave])

    const moveToSelected = () => {
        if (itemCategory) {
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
            ToastAlert('Please select drug!', 'warning')
        }
    };

    const moveToAvailable = () => {
        if (itemCategory) {
            const itemsToMove = selectedOptions.filter(opt =>
                selectedSelected.includes(String(opt.value))
            );
            setAvailableOptions(prev => [...prev, ...itemsToMove]);
            setSelectedOptions(prev => prev.filter(opt =>
                !selectedSelected.includes(String(opt.value))
            ));
            setSelectedSelected([]);
        } else {
            ToastAlert('Please select drug!', 'warning')
        }
    };

    const reset = () => {
        setItemName({});
        setStateId('')
        setInitialMappedOptions([]);
        setConfirmSave(false);
        setInitialMappedOptions([]);
        setSelectedOptions([]);
        setAvailableOptions([]);
    }

    const mapCategoryOptions = [
        { value: "1", label: "Drugs" },
        { value: "2", label: "Diagnostics Reagents and Kits" },
        { value: "3", label: "All" }
    ];


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Drug Mapping Master`}</b></span>
                </div>

                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Item Category : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="itemCategory"
                                    name="itemCategory"
                                    placeholder="Select Value"
                                    options={mapCategoryOptions}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={itemCategory}
                                    onChange={(e) => { setItemCategory(e.target.value); getItemNameList(e.target.value); setItemName(''); setDrugItemObject(null) }}

                                />
                            </div>
                        </div>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Item Name : </label>
                            <div className="col-sm-7 align-content-center">
                                <Select
                                    id='itemName'
                                    name='itemName'
                                    options={itemNameList?.map(item => ({
                                        value: item.cwhnumDrugId,
                                        label: item.cwhstrDrugName,
                                    }))}
                                    // options={filteredOptions}
                                    // onInputChange={debouncedInputChange}
                                    isMulti={false}
                                    className="aliceblue-bg border-dark-subtle react-select-login"
                                    value={itemName}
                                    onChange={(e) => {
                                        setItemName(e);
                                        const itemObj = itemNameList?.find(dt => dt?.cwhnumDrugId == e?.value);
                                        setDrugItemObject(itemObj)
                                    }}
                                    isSearchable={true}
                                    isDisabled={itemNameList?.length > 0 ? false : true}
                                    placeholder="select value"
                                    components={{ MenuList: CustomListWindow }}
                                />
                            </div>
                        </div>
                        {(itemCategory != "2" && itemName && drugItemObject) &&
                            <>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Generic Drug Name : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.centraldrugName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Group : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.groupName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Subgroup : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.subGroupName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Drug Type : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.drugtypeName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Category : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.drugCatName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">VED : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.vedName || "---"}
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-5 col-form-label fix-label">Strength : </label>
                                    <div className="col-sm-7 align-content-center">
                                        {drugItemObject?.cwhstrStrengthName || "---"}
                                    </div>
                                </div>
                            </>
                        }
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
                        <span className="text-danger">*</span> State Drug Name
                    </div>
                    <div className="flex-grow-1" style={{ border: "1px solid #193fe6" }}></div>
                </div>

                <div className='d-flex justify-content-center mt-1 mb-2'>
                    <div className='' style={{ width: "45%" }}>
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

                    <div className='' style={{ width: "45%" }}>
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

export default DrugMappingMaster
