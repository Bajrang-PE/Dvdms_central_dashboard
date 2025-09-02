import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { functionalityData } from '../../../localData/HomeData';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import StateMasterForm from '../forms/admin/StateMasterForm';
//import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import { Modal } from 'react-bootstrap';
import { fetchData, fetchDeleteData } from '../../../../../utils/ApiHooks';
import ViewPage from '../ViewPage';
import HmisFacilityMasterForm from '../forms/admin/HmisFacilityMasterForm';
import { formatDateHmis } from '../../../../../utils/CommonFunction';

const HmisFacilityMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getStateListData, getSteteNameDrpData, stateNameDrpDt,getFacilityTypeDrpData,stateListData, setConfirmSave, confirmSave, setShowConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [selectAll, setSelectAll] = useState(false);
    const [recordStatus, setRecordStatus] = useState('1');
    const [stateId, setStateId] = useState("");
    const [selectedStateName, setSelectedStateName] = useState("");
    const [listData, setListData] = useState([]);
    const [filterData, setFilterData] = useState(listData);

//    const [values, setValues] = useState({
//        "groupId": "0", "subGroupId": "0", "recordStatus": "1"
//    })

    useEffect(() => {
        getStateListData(recordStatus ? recordStatus : '1')
    }, [recordStatus])

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) getSteteNameDrpData();
        setOpenPage("home");
    }, []);

    useEffect(() => {
        
        getListData(stateId, recordStatus);
    }, [stateId, recordStatus])

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "stateId") {
            const selectOptionGrp = stateNameDrpDt.find(opt => String(opt.value) === String(value));
            setSelectedStateName(selectOptionGrp?.label || "");
           // setSelectedGroupId(selectOptionGrp?.value || "")
        }
        
  //      if (name) {
   //         setValues({ ...values, [name]: value });
   //         setErrors({ ...errors, [errName]: "" });
   //     }

    }

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumFacilityTypeId === row?.cwhnumFacilityTypeId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const paramName = row?.stateName?.toLowerCase() || "";
                const shortName = row?.stateShortName?.toLowerCase() || "";

                return paramName.includes(lowercasedText) || shortName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);

    const deleteRecord = () => {
        fetchDeleteData(`/api/v1/hmisFacility?facilityTypeId=${selectedOption[0]?.cwhnumFacilityTypeId}&isActive=1`).then(data => {
            if (data?.status ===1) {
                ToastAlert('Data deleted successfully', 'success')
                setConfirmSave(false);
                setSelectedOption([]);
                setOpenPage("home");
                getListData(stateId,recordStatus);
            } else {
                ToastAlert(data?.message, 'error')
                setOpenPage("home")
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

  
     const getListData = (stateId, recordStatus) => {

        fetchData(`/api/v1/hmisFacility?stateId=${stateId}&isActive=${recordStatus}`).then((data) => {
         if (data?.status === 1 && Array.isArray(data.data)) {
            setListData(data.data)
          } else {
              setListData([])
          }

        })

    };

    const handleSelectAll = (isChecked) => {
        
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = listData.map(drug => drug.cwhnumDrugId);
            setSelectedOption(allIds);
        } else {
            setSelectedOption([]);
        }
    };

    const column = [
        {
            name: <input
                type="checkbox"
                checked={selectAll}
                 onChange={(e) => handleSelectAll(e.target.checked)}
                 disabled={listData.length === 0}
                className="form-check-input log-select"
               
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumFacilityTypeId === row?.cwhnumFacilityTypeId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Facility Type',
            selector: row => row.cwhnumFacilityTypeId,
            sortable: true,
        },
        {
            name: 'HMIS Date',
            selector: row => formatDateHmis(row.cwhdtHmisDate),
            sortable: true,
        },
        {
            name: 'No Of Facility',
            selector: row => row.cwhnumNoofHmisFac,
            sortable: true,
        },
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }


    console.log(listData,'listsdata')
    console.log(filterData,'filterData')

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Hmis Facility Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length || 0}</span>}
                </div>

                {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select State"
                                        //options={[{ value: 1, label: 'Assam' }]}
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
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Status"
                                        options={[{ value: 1, label: 'Active' }, { value: 0, label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />
                    <GlobalTable column={column} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                </>)}

                {openPage === 'view' &&
                            <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                    <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                </Modal.Header>
                                <Modal.Body className='px-2 py-1'>

                                    <div className='text-left'>
                                        {/* <label><b>Group Name : </b></label>&nbsp;{selectedGroupName}<br />
                                        <label><b>Subgroup Name : </b></label>&nbsp;{selectedSubGroupName}<br /> */}
                                        <label><b>facility Type Name: </b></label>&nbsp;{selectedOption[0]?.cwhnumFacilityTypeId}<br />
                                        <label><b>No. Of Facility : </b></label>&nbsp;{selectedOption[0]?.cwhnumNoofHmisFac}<br />
                                        <label><b>Hmis Date : </b></label>&nbsp;{selectedOption[0]?.cwhdtHmisDate}<br />
                                        
                                       
                                    </div>

                                    <div className='text-center mt-1'>

                                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                            <i className="fa fa-broom me-1"></i> Close
                                        </button>
                                    </div>

                                </Modal.Body>
                            </Modal>
                        }

                {(openPage === "add" || openPage === 'modify') && (<>
                    <HmisFacilityMasterForm selectedStateName={selectedStateName} />
                </>)}

            </div>
        </>
    )
}

export default HmisFacilityMaster
