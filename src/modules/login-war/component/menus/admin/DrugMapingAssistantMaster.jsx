import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from "../../InputSelect";
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../utils/CommonFunction';
import Loader from '../../Loader';

export const DrugMappingAssistantMaster = () => {

    const { selectedOption, setSelectedOption, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave, isShowReport, stateNameDrpDt, getSteteNameDrpData } = useContext(LoginContext);
    //const [openPage] = useState("home");
    // const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [mappingData, setMappingData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [isPending, setIsPending] = useState(false);

    const [values, setValues] = useState({
        "stateId": "",
        matchingPercentage: "90",
    });

    const [errors, setErrors] = useState({
    });

    const matchingPercentageOptions = [
        { label: ">= 90%", value: "90" },
        { label: ">= 80%", value: "80" },
        { label: ">= 70%", value: "70" },
        { label: ">= 60%", value: "60" },
        { label: ">= 50%", value: "50" }
    ];

    const gnumSeatId = getAuthUserData('userSeatId');

    useEffect(() => {
        if (values.stateId && values.matchingPercentage) {
            fetchMappingData();
        } else {
            setMappingData([]);
        }
    }, [values.stateId, values.matchingPercentage])

    const fetchMappingData = async () => {

        if (!values.stateId) {
            ToastAlert("Please select State", "warning");
            return;
        }

        setIsPending(true);
        fetchData(
            `/api/v1/drug-mapping-assistant/list?stateId=${values.stateId}&matchingPercentage=${values.matchingPercentage}`
        ).then(data => {
            if (data && data?.status === 1) {
                setMappingData(data.data);
                setIsPending(false);
            } else {
                setMappingData([]);
                setIsPending(false);
            }
            setSelectedRows([]);
            setSelectAll(false);
        });
    };
    console.log('mappingData', mappingData)

    const handleRowSelection = (row) => {

        const exists = selectedRows.some(
             item =>
                    item.unmapStateDrugId === row.unmapStateDrugId &&
                    item.centreDrugId === row.centreDrugId
        );

        if (exists) {
            setSelectedRows(
                selectedRows.filter(
                    item =>
             !(
                item.unmapStateDrugId === row.unmapStateDrugId &&
                item.centreDrugId === row.centreDrugId
             )
                )
            );

        } else {

            setSelectedRows([...selectedRows, row]);

        }
    };

    const handleSelectAll = (checked) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedRows([...mappingData]);
        } else {
            setSelectedRows([]);
        }
    };


    const handleMap = () => {
        if (selectedRows.length === 0) {
            ToastAlert("Please select records", "warning");
            return;
        }
        const payload = selectedRows.map(row => ({
            stateId: values.stateId,
            seatId: gnumSeatId,

            unmapStateDrugId: row.unmapStateDrugId,
            centreDrugId: row.centreDrugId,

            stateUnmappedDrug: row.stateUnmappedDrug,

            cwhnumStateItemCategoryId: row.cwhnumStateItemCategoryId,
            cwhnumIsEdl: row.cwhnumIsEdl
        }));

        console.log("Mapping Payload", payload);

        fetchPostData("/api/v1/drug-mapping-assistant/map", payload)
            .then(data => {
                console.log('data', data)
                if (data) {

                    ToastAlert(
                        "Drugs mapped successfully",
                        "success"
                    );

                    fetchMappingData();

                } else {

                    ToastAlert(
                        data?.message || "Mapping failed",
                        "error"
                    );
                }
            });
    };

    useEffect(() => {
        getSteteNameDrpData();
    }, []);

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    console.log('selectedRows', selectedRows)
    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) =>
                        handleSelectAll(e.target.checked)
                    }
                />
            ),
            cell: row => (
                <input
                    type="checkbox"
                    checked={
                        selectedRows.some(
                            item =>
                                item.unmapStateDrugId === row.unmapStateDrugId &&
                                item.centreDrugId === row.centreDrugId
                        )
                    }
                    onChange={() => handleRowSelection(row)}
                />
            ),
            width: "6%"
        },
        {
            name: "State Unmapped Drug",
            selector: row => row.stateUnmappedDrug,
            sortable: true
        },
        {
            name: "Centre Drug Name",
            selector: row => row.centreDrugName,
            sortable: true
        },
        {
            name: "Similarity %",
            selector: row => row.similarityValue,
            sortable: true,
            width: "12%"
        }
    ];


    const onClose = () => {
        //setOpenPage('home');
        setSelectedOption([]);
    }

    return (
        <div className="masters mx-3 my-2">

            {isPending &&
                <Loader />
            }

            <div className='masters-header row'>
                <span className='col-6'>
                    <b>Drug Mapping Assistant Master</b>
                </span>

                <span className='col-6 text-end'>
                    Total Records : {mappingData?.length || 0}
                </span>
            </div>

            <div className="row mt-3">

                <div className="form-group col-md-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">
                        State :
                    </label>

                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="stateId"
                            name="stateId"
                            options={stateNameDrpDt}
                            value={values?.stateId}
                            onChange={handleValueChange}
                            placeholder={"Select value"}
                        />

                        {errors?.strStateIdErr &&
                            <div className="required-input">
                                {errors.strStateIdErr}
                            </div>
                        }
                    </div>
                </div>

                <div className="form-group col-md-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">
                        Matching Percentage :
                    </label>

                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="matchingPercentage"
                            name="matchingPercentage"
                            options={matchingPercentageOptions}
                            value={values?.matchingPercentage}
                            onChange={handleValueChange}
                        />

                        {errors?.matchingPercentageErr &&
                            <div className="required-input">
                                {errors.matchingPercentageErr}
                            </div>
                        }
                    </div>
                </div>

            </div>

            {/* <div className="text-center mt-3">

                <button
                    type="button"
                    className="btn cms-login-btn btn-sm"
                    onClick={fetchMappingData}
                >
                    <i className="fa fa-search me-1"></i>
                    Search
                </button>

            </div> */}

            {/* <hr className="my-3" /> */}

            <GlobalTable
                column={columns}
                data={mappingData}
                setSearchInput={setSearchInput}
                searchInput={searchInput}
                isShowBtn={false}
            />

            <div className="text-center mt-4 mb-3">
                <button
                    type="button"
                    className="btn cms-login-btn"
                    disabled={selectedRows.length === 0}
                    onClick={handleMap}
                >
                    <i className="fa fa-link me-2"></i>
                    Map  ({selectedRows.length})
                </button>
            </div>

        </div>
    )



}

export default DrugMappingAssistantMaster;

