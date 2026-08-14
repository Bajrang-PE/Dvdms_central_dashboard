import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import ViewPage from '../ViewPage';
import MasterReport from '../../MasterReport';
import { fetchData, fetchDeleteData } from '../../../../../utils/ApiHooks';
import DiseaseMasterForm from '../forms/admin/DiseaseMasterForm';

const DiseaseMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getDiseaseCategoryDrpData, diseaseCatDrpData, setConfirmSave, confirmSave, setShowConfirmSave, isShowReport } = useContext(LoginContext);

    const [diseaseCategory, setDiseaseCategory] = useState('');
    const [activeStatus, setActiveStatus] = useState('1');
    const [diseaseListData, setDiseaseListData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [catError, setCatError] = useState("")


    useEffect(() => {
        getDiseaseCategoryDrpData();
    }, [])

    useEffect(() => {
        getDiseaseListData(diseaseCategory, activeStatus);
    }, [diseaseCategory, activeStatus])

    const getDiseaseListData = (cat, status) => {
        try {
            fetchData(`/api/v1/disease/list?diseaseCategoryId=${cat || ""}&isValid=${status || "1"}`)?.then((data) => {
                console.log('data', data)
                if (data?.status === 1) {
                    setDiseaseListData(data?.data);
                    setFilterData(data?.data);
                } else {
                    setDiseaseListData([]);
                    setFilterData([]);
                }
            })
        } catch (error) {
            console.error(error);
        }
    }


    useEffect(() => {
        if (!searchInput) {
            setFilterData(diseaseListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = diseaseListData.filter(row => {

                const diseaseName = row?.diseaseName?.toLowerCase() || "";
                const category = row?.diseaseCategoryName?.toLowerCase() || "";
                const remarks = row?.remark?.toLowerCase() || "";

                return diseaseName?.includes(lowercasedText) || category?.includes(lowercasedText) || remarks?.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, diseaseListData]);

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.diseaseId === row?.diseaseId) {
                return [];
            }
            return [row];
        });
    };

    const column = [
        {
            name: <input
                type="checkbox"
                className="form-check-input log-select"
                disabled
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption.length > 0 && selectedOption[0]?.diseaseId === row?.diseaseId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Disease Name',
            selector: row => row.diseaseName,
            sortable: true,
        },
        {
            name: 'Disease Category',
            selector: row => row.diseaseCategoryName || "---",
            sortable: true,
        },
        {
            name: 'Remarks',
            selector: row => row.remark || "---",
            sortable: true,
        },
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    const validate = () => {
        let isValid = true;
        if (!diseaseCategory || diseaseCategory === "") {
            setCatError("Please select Category first");
            isValid = false
        }

        return isValid;
    }

    const deleteRecord = () => {
        fetchDeleteData(`/api/v1/disease/delete?diseaseId=${selectedOption[0]?.diseaseId}`).then(data => {
            if (data?.status === 1) {
                ToastAlert("Record Deleted Successfully", "success")
                getDiseaseListData(diseaseCategory, activeStatus);
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
                setActiveStatus('1');
            } else {
                ToastAlert(data?.message, 'error')
                setConfirmSave(false);
            }
        })
    }

    const handleDeleteRecord = () => {
        if (selectedOption?.length > 0) {
            setOpenPage('delete');
            setShowConfirmSave(true);
        } else {
            ToastAlert("Please select a record", "warning");
        }
    }

    useEffect(() => {
        if (confirmSave && openPage === 'delete') {
            deleteRecord();
        }
    }, [confirmSave])



    return (
        <div className="masters mx-3 my-2">

            {!isShowReport && <>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Disease Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {diseaseListData?.length}</span>}
                </div>

                {(openPage === "home" || openPage === "view" || openPage === 'delete') &&
                    <>

                        <div className="row pt-2">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Disease Category : </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='diseaseCategory'
                                        id='diseaseCategory'
                                        placeholder='Select Category'
                                        options={diseaseCatDrpData}
                                        onChange={(e) => { setDiseaseCategory(e?.target?.value); setCatError(""); }}
                                        value={diseaseCategory}
                                        errorMessage={catError}
                                    />
                                </div>
                            </div>
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Disease Status </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='activeStatus'
                                        id='activeStatus'
                                        options={[{ label: "Active", value: "1" },
                                        { label: "Inactive", value: "0" },
                                        ]}
                                        onChange={(e) => {
                                            setActiveStatus(e?.target?.value);
                                        }}
                                        value={activeStatus}
                                    />
                                </div>
                            </div>
                        </div>

                        <hr className='my-2' />

                        <GlobalTable column={column} data={filterData} onDelete={handleDeleteRecord} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={activeStatus === "1" ? true : false} isView={true} isReport={true} setOpenPage={setOpenPage} searchInput={searchInput} onValidate={validate} />

                        {openPage === 'view' &&
                            <ViewPage data={[
                                { value: selectedOption[0]?.diseaseName, label: "Disease Name" },
                                { value: selectedOption[0]?.diseaseCategoryName, label: "Disease Category" },
                                { value: selectedOption[0]?.isValid == 1 ? "Active" : "InActive", label: "Status" }
                            ]} onClose={onClose} title={"Disease Master"} />
                        }

                    </>}

                {(openPage === "add" || openPage === 'modify') &&
                    <DiseaseMasterForm getListData={getDiseaseListData} setSearchInput={setSearchInput} category={diseaseCatDrpData?.find(dt => dt?.value == diseaseCategory)} />
                }
            </>}
            {isShowReport &&
                <MasterReport title={"Disease Master"} column={column} data={filterData}
                    filters={[
                        { value: diseaseCatDrpData?.find(dt => dt?.value == diseaseCategory)?.label || "All", label: "Category Name" },
                        { value: activeStatus === "1" ? "Active" : "InActive", label: "Status" },]} />
            }

        </div>
    )
}

export default DiseaseMaster
