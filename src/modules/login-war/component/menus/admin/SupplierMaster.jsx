import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import SupplierMasterForm from '../forms/admin/SupplierMasterForm';
import { Modal } from 'react-bootstrap';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { fetchUpdateData, fetchData } from '../../../../../utils/ApiHooks';


const SupplierMaster = () => {

    const [recordStatus, setRecordStatus] = useState("1");
    const [suppliers, setSuppliers] = useState([]);
    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [selectAll, setSelectAll] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState(suppliers);


    useEffect(() => {
        getListData(recordStatus);
    }, [recordStatus])

    useEffect(() => {
        if (!searchInput) {
            setFilterData(suppliers);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = suppliers.filter(row => {
                const paramName = row?.cwhstrSupplierName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, suppliers]);

    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            const allIds = suppliers.map(supplier => supplier.cwhnumSupplierId);
            setSelectedOption(allIds);
        } else {
            setSelectedOption([]);
        }
    };

    const getListData = (isActive) => {
        fetchData(`http://10.226.27.173:8025/api/v1/suppliers?isActive=${isActive}`).then((data) => {
            if (data && data.status === 1) {
                setSuppliers(data.data);
            } else {
                setSuppliers([])
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
            handleDelete();
        }
    }, [confirmSave])

    const handleDelete = () => {
        const suppId = String(selectedOption[0]?.cwhnumSupplierId)
        fetchUpdateData(`http://10.226.27.173:8025/api/v1/suppliers/del/${suppId}`).then(data => {
            if (data?.status === 1) {
                ToastAlert("Record Deleted Successfully", "success")
                setSelectedOption([]);
                setConfirmSave(false);
                setOpenPage("home")
                setRecordStatus(1)
                getListData(recordStatus);
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
            }
        })
    }

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={suppliers.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumSupplierId === row.cwhnumSupplierId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Supplier Name',
            selector: row => row.cwhstrSupplierName,
            sortable: true,
        },
        {
            name: 'Supplier Type',
            selector: row => row.cwhnumSupplierType,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.cwhstrAddress,
            sortable: true,
        },
        {
            name: 'Email Id',
            selector: row => row.cwhstrEmailId,
            sortable: true,
        },
        {
            name: 'Contact No.',
            selector: row => row.cwhstrContactNo,
            sortable: true,
        },
        {
            name: 'Carporate GST No.',
            selector: row => row.cwhstrCorporateMainGstno,
            sortable: true,
        },
        {
            name: 'PAN No.',
            selector: row => row.cwhstrPanNo,
            sortable: true,
        },
    ];
    console.log(selectedOption, 'selectedOption')
    console.log(suppliers, 'suppliers')
    return (
        <div className="masters mx-3 my-2">


            <div className='masters-header row'>
                <span className='col-6'><b>{`Supplier Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                {openPage === "home" && <span className='col-6 text-end'>Total Records : {suppliers?.length}</span>}
            </div>

            {(openPage === "home" || openPage === "view" || openPage === "delete") && (<>

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
                                value={recordStatus}
                                onChange={(e) => {
                                    setRecordStatus(e.target.value);
                                }}
                            />
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

                            <div className='text-left'>
                                <label><b>Supplier Type : </b></label>&nbsp;{selectedOption[0]?.cwhnumSupplierType}<br />
                                <label><b>Address : </b></label>&nbsp;{selectedOption[0]?.cwhstrAddress}<br />
                                <label><b>Email Id : </b></label>&nbsp;{selectedOption[0]?.cwhstrEmailId}<br />
                                <label><b>Contact No. : </b></label>&nbsp;{selectedOption[0]?.cwhstrContactNo}<br />
                                <label><b>Corporate GST No. : </b></label>&nbsp;{selectedOption[0]?.cwhstrCorporateMainGstno}<br />
                                <label><b>LST No. : </b></label>&nbsp;{selectedOption[0]?.cwhstrLstNo}<br />
                                <label><b>CST No.: </b></label>&nbsp;{selectedOption[0]?.cwhstrCstNo}<br />
                                <label><b>PAN No. : </b></label>&nbsp;{selectedOption[0]?.cwhstrPanNo}<br />
                                <label><b>Record Status : </b></label>&nbsp;{selectedOption[0]?.gnumIsvalid ? "Active" : "Inactive"}
                            </div>

                            <div className='text-center'>

                                <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                    <i className="fa fa-broom me-1"></i> Close
                                </button>
                            </div>

                        </Modal.Body>
                    </Modal>
                }
            </>)
            }

            {(openPage === "add" || openPage === "modify") &&
                <SupplierMasterForm getListData={getListData} recStatus={recordStatus} setRecStatus={setRecordStatus} setSearchInput={setSearchInput} />
            }

        </div>
    )
}

export default SupplierMaster