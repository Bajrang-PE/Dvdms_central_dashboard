import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext'
import { capitalizeFirstLetter, ToastAlert } from '../../../../utils/CommonFunction';
import InputSelect from '../../../InputSelect';
import GlobalTable from '../../../GlobalTable';
import IphsSubGroupMasterForm from '../../forms/admin/iphsAdmin/IphsSubGroupMasterForm';
import { fetchData, fetchDeleteData } from '../../../../../../utils/ApiHooks';
import { Modal } from 'react-bootstrap';

const IphsSubGroupMaster = () => {

    const { openPage, setOpenPage, iphsGroupDrpData, getIphsGroupDrpData, selectedOption, setSelectedOption, confirmSave,
        setShowConfirmSave, setConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [listData, setListData] = useState([]);
    const [filterData, setFilterData] = useState(listData);
    const [record, setRecord] = useState("1");
    const [groupId, setGroupId] = useState("");
    const [groupIdErr, setGroupIdErr] = useState("");
    const [selectedGroupName, setSelectedGroupName] = useState("");

    useEffect(() => {
        getIphsGroupDrpData();
    }, []),

        useEffect(() => {
            setSelectedOption([])
            getListData();
            const selectedGrpName = iphsGroupDrpData.find(
                (opt) => opt.value?.toString() === groupId?.toString()
            )?.label || "";
            setSelectedGroupName(selectedGrpName)
        }, [groupId, record])

    const getListData = () => {
        fetchData(`/api/v1/IphsSubGroupMaster/getSubgroupsConditionally?groupID=${(groupId || groupId === 0) ? groupId : 0}&isActive=${record}`).then(data => {
            if (data?.status === 1) {
                setListData(data.data);
            } else {
                setListData([]);
            }
        })
    }

    const validate = () => {
        let isValid = true;
        if (!groupId.trim()) {
            setGroupIdErr("Please select iphs group");
            setSelectedGroupName("")
            isValid = false
        }
        return isValid;
    }

    useEffect(() => {
        if (!searchInput) {
            setFilterData(listData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = listData.filter(row => {
                const paramName = row?.cwhstrIphsSubgroupName?.toLowerCase() || "";

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
                        checked={selectedOption[0]?.cwhnumIphsSubgroupID === row.cwhnumIphsSubgroupID}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Subgruop Name',
            selector: row => row.cwhstrIphsSubgroupName,
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
    
            fetchDeleteData(`/api/v1/IphsSubGroupMaster/deleteSubgroup?subGroupID=${selectedOption[0].cwhnumIphsSubgroupID}&isActive=0`).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data deleted successfully", "success")
                    setConfirmSave(false);
                    setSelectedOption([]);
                    setOpenPage("home");
                    setRecord("1")
                    setGroupId("")
                    getListData();
                } else {
                    ToastAlert('Error while deleting record!', 'error')
                    setOpenPage("home")
                }
    
            })
    
        }


    return (
        <div className='masters mx-3 my-2'>
            <div className='masters-header row'>
                <span className='col-6'><b>{`Iphs Subgroup Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
            </div>
            {(openPage === "home" || openPage === "view" || openPage === "delete") &&
                <>
                    <div className='row mt-2'>
                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Group</label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    id="groupId"
                                    name="groupId"
                                    placeholder={"Select Value"}
                                    options={iphsGroupDrpData}
                                    onChange={(e) => {
                                        setGroupId(e.target.value);
                                        setGroupIdErr("");
                                    }}
                                    value={groupId}
                                    errorMessage={groupIdErr}
                                />

                            </div>
                        </div>

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
                            onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} onValidate={validate} />
                    </div>

                    {openPage === 'view' &&
                        <Modal show={true} onHide={null} size='lg' dialogClassName="dialog-min">
                            <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                                <b><h5 className='mx-2 mt-1 px-1'>View Page</h5></b>
                            </Modal.Header>
                            <Modal.Body className='px-2 py-1'>

                                <div className='text-left'>
                                    <label><b>Iphs Group Name : </b></label>&nbsp;{selectedGroupName}<br />
                                    <label><b>Iphs Subgroup Name : </b></label>&nbsp;{selectedOption[0]?.cwhstrIphsSubgroupName}<br />
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
                <IphsSubGroupMasterForm setSearchInput={setSearchInput} selectedGroupName={selectedGroupName} selectedGroupId={groupId}
                    setGroupId={setGroupId} setRecord={setRecord} />
            }

        </div>
    )
}

export default IphsSubGroupMaster