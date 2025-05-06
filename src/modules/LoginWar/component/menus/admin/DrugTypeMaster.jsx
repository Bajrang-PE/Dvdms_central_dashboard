import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../../dashboard/DashHeader'
import InputSelect from "../../InputSelect";
import GlobalTable from '../../GlobalTable';
import { LoginContext } from '../../../context/LoginContext';
import DrugTypeForm from '../forms/admin/DrugTypeForm';
import { ToastAlert } from '../../../utils/CommonFunction';
import { Modal } from 'react-bootstrap';
import { fetchData,fetchUpdateData } from '../../../../../utils/ApiHooks';

export const DrugTypeMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage } = useContext(LoginContext);

    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [drugs, setDrugs] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectAll, setSelectAll] = useState(false);


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

        // if (openPage === "view") {
        //     if (selectedOption?.length == 0) {
        //         ToastAlert('Please select a record', 'warning')
        //         setOpenPage("home");
        //     } else {
        //         handleView();
        //     }
        // }

        if (openPage === "modify") {
            if (selectedOption?.length == 0) {
                ToastAlert('Please select a record', 'warning')
                setOpenPage("home");
            }
        }

    }, [values?.recordStatus, openPage]);

    const fetchListData = async (isActive) => {

        fetchData(`/drugtype/getgruglist?isActive=${isActive}`).then((data) => {

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

    const handleDelete = async () => {

        const confirmed = window.confirm("Are you sure you want to delete this drug type?");
        
        if (selectedOption?.length > 0) {
            if(confirmed){
            const drugTypeId = String(selectedOption[0]?.cwhnumDrugTypeId)
            const response = await fetchUpdateData(`/drugtype/delete/${drugTypeId}`);
            ToastAlert('Drug Type Deleted Successfully', 'success')
            setOpenPage("home")
          
            }
        } else {
            ToastAlert('Please select a record', 'warning')
            setOpenPage("home")
           
        }
    };


    const reset = () => {
        setDrugTypeName("");
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
            {(openPage === "home" || openPage === "view") && (<>
                <div className='text-left w-100 fw-bold p-1 heading-text' >Drug Type Master</div>

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
                    <GlobalTable column={columns} data={drugs} onAdd={null} onModify={null} onDelete={handleDelete} onView={null}
                        onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </div>

                {openPage === 'view'  &&
                    <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                        <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                            <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                        </Modal.Header>
                        <Modal.Body className='px-2 py-1'>

                            <div className='text-center'>
                                <label><b>Drug Type Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrDrugTypeName}
                            </div>

                            <div className='text-center mt-1'>

                                <button className='btn cms-login-btn m-1 btn-sm' onClick={()=>setOpenPage('home')}>
                                    <i className="fa fa-broom me-1"></i> Close
                                </button>
                            </div>

                        </Modal.Body>
                    </Modal>
                }

            </>)}


            {(openPage === "add" || openPage === 'modify') &&
                <DrugTypeForm />
            }

        </div>
    )
}

export default DrugTypeMaster;

