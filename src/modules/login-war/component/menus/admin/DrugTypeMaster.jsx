import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../../dashboard/DashHeader'
import InputSelect from "../../InputSelect";
import GlobalTable from '../../GlobalTable';
import { LoginContext } from '../../../context/LoginContext';
import DrugTypeForm from '../forms/admin/DrugTypeForm';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { Modal } from 'react-bootstrap';
import { fetchData, fetchUpdateData } from '../../../../../utils/ApiHooks';

export const DrugTypeMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);

    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState([drugs]);

    useEffect(() => {
        if (searchInput === '') {
            setFilterData(drugs)
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = drugs.filter(row => {
                const paramName = row?.cwhstrDrugTypeName?.toLowerCase() || "";
                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, drugs])


    const [errors, setErrors] = useState({
    })


    const [values, setValues] = useState({
        "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
        "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
        "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "", "isDbCredAvl": "", "stateDatabase": "", "jobForTesting": "",
        "recordStatus": "1",
    });


    useEffect(() => {
        if (values?.recordStatus) {
            fetchListData(values?.recordStatus);
        }

        if (openPage === "modify") {
            if (selectedOption?.length == 0) {
                ToastAlert('Please select a record', 'warning')
                setOpenPage("home");
            }
        }

    }, [values?.recordStatus, openPage]);

    const fetchListData = async (isActive) => {

        fetchData(`http://10.226.29.102:8025/drugtype/getgruglist?isActive=${isActive}`).then((data) => {

            if (data) {
                setDrugs(data);
            }

        })

    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = drugs.map(drug => drug.cwhnumDrugTypeId);
            setSelectedOption(allIds);
        } else {
            setSelectedOption([]);
        }
    };


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
            handleDelete();
        }
    }, [confirmSave])

    const handleDelete = () => {
        const drugTypeId = String(selectedOption[0]?.cwhnumDrugTypeId)
        fetchUpdateData(`http://10.226.29.102:8025/drugtype/delete/${drugTypeId}`).then(data => {
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                fetchListData(1);
                setSelectedOption([]);
                setConfirmSave(false);
                reset();
                setOpenPage("home")
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
            }
        })
    }



    const reset = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    // const handleView = async () => {

    //     const drugTypeId = String(selectedOption[0]?.cwhnumDrugTypeId)
    //     const response = await fetchData(`/drugtype/view/${drugTypeId}`);
    //     setOpenPage("home");
    // };

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={drugs.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumDrugTypeId === row.cwhnumDrugTypeId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Drug Name',
            selector: row => row.cwhstrDrugTypeName,
            sortable: true,
        },
    ];

    return (
        <div className="masters mx-3 my-2">

            <div className='masters-header row'>
                <span className='col-6'><b>{`Drug Type Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                {openPage === "home" && <span className='col-6 text-end'>Total Records : {drugs?.length}</span>}
            </div>

            {(openPage === "home" || openPage === "view" || openPage === 'delete') && (<>

                <div className="row mt-3">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label">Recoed Status : </label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                id="recordStatus"
                                name="recordStatus"
                                options={[{ label: "Active", value: "1" },
                                    , { label: "Inactive", value: "0" }]}
                                className="aliceblue-bg border-dark-subtle"
                                value={values?.recordStatus}
                                onChange={handleValueChange}
                            />
                            {errors.recordStatusErr &&
                                <div className="required-input">
                                    {errors?.recordStatusErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div>
                    <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} onView={null}
                        onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </div>

                {openPage === 'view' &&
                    <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                        <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                            <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                        </Modal.Header>
                        <Modal.Body className='px-2 py-1'>

                            <div className='text-center'>
                                <label><b>Drug Type Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrDrugTypeName}
                            </div>

                            <div className='text-center mt-1'>

                                <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                    <i className="fa fa-broom me-1"></i> Close
                                </button>
                            </div>

                        </Modal.Body>
                    </Modal>
                }

            </>)}


            {(openPage === "add" || openPage === 'modify') &&
                <DrugTypeForm setValues={setValues} values={values} setSearchInput={setSearchInput} />
            }

        </div>
    )
}

export default DrugTypeMaster;

