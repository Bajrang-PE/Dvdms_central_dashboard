import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext'
import { capitalizeFirstLetter, ToastAlert } from '../../../../utils/CommonFunction';
import InputSelect from '../../../InputSelect';
import GlobalTable from '../../../GlobalTable';
import { fetchData, fetchDeleteData } from '../../../../../../utils/ApiHooks';
import InputField from '../../../InputField';
import IphsGroupMasterForm from '../../forms/admin/iphsAdmin/IphsGroupMasterForm';
import { Modal } from 'react-bootstrap';

const IphsGroupMaster = () => {

    const { openPage, setOpenPage, selectedOption, setSelectedOption, confirmSave,
        setShowConfirmSave, setConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [listData, setListData] = useState([]);
    const [filterData, setFilterData] = useState(listData);
    const [record, setRecord] = useState("1");

    useEffect(() => {
        getListData(record);
    }, [record])
console.log(listData)
    const getListData = (recordStatus) => {
        fetchData(`/api/v1/IphsGroupMaster/getAllGroups?isActive=${recordStatus}`).then(data => {
            if (data.status == 1) {
                setListData(data.data)
            } else {
                setListData([])
            }
        })
    }

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const paramName = row?.cwhstrIphsGroupName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, listData]);

    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={""}
                    //onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={listData.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumIphsGroupID === row.cwhnumIphsGroupID}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Gruop Name',
            selector: row => row.cwhstrIphsGroupName,
            sortable: true,
        },
    ];


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

        fetchDeleteData(`/api/v1/IphsGroupMaster/deleteGroups?groupIDs=${[selectedOption[0].cwhnumIphsGroupID]}`).then(data => {
            if (data) {
                ToastAlert("Data deleted successfully", "success")
                setConfirmSave(false);
                setSelectedOption([]);
                setOpenPage("home");
                getListData(1);
            } else {
                ToastAlert('Error while deleting record!', 'error')
                setOpenPage("home")
            }

        })

    }


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Iphs Group Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
                </div>

                {(openPage === "home" || openPage === "view" || openPage === "delete") &&
                    <>
                        <div className='row mt-2'>
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        id="record"
                                        name="record"
                                        options={[{ label: "Active", value: "1" },
                                        { label: "Inactive", value: "0" }]}
                                        onChange={(e) => setRecord(e.target.value)}
                                        value={record}
                                    />

                                </div>
                            </div>
                        </div>

                        <hr className='my-2' />

                        <div>
                            <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null}
                                onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                        </div>

                        {openPage === 'view' &&
                            <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                    <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                                </Modal.Header>
                                <Modal.Body className='px-2 py-1'>

                                    <div className='text-left'>
                                        <label><b>Iphs Group Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrIphsGroupName}<br />
                                    </div>

                                    <div className='text-center mt-1'>

                                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => setOpenPage('home')}>
                                            <i className="fa fa-broom me-1"></i> Close
                                        </button>
                                    </div>

                                </Modal.Body>
                            </Modal>
                        }
                    </>
                }

                {(openPage === "add" || openPage === "modify") &&
                    <IphsGroupMasterForm setRecord={setRecord} record={record} getListData={getListData} setSearchInput={setSearchInput} />

                }

            </div>
        </>
    )
}

export default IphsGroupMaster