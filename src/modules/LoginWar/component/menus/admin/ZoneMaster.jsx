import React, { useContext, useEffect, useState } from 'react'
import GlobalTable from '../../GlobalTable'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from '../../InputSelect';
import ZoneMasterForm from '../forms/admin/ZoneMasterForm';
import ViewPage from '../ViewPage';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';

const ZoneMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, getZoneListData, zoneListData, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('Active')
    const [filterData, setFilterData] = useState(zoneListData);

    useEffect(() => {
        getZoneListData(recordStatus === "Active" ? '1' : '0')
    }, [recordStatus])

    const handleRowSelect = (row) => {
        // setSelectedOption((prev) => {
        //     if (prev.includes(row?.cwhnumZoneId)) {
        //         return prev.filter(dt => dt?.cwhnumZoneId !== row?.cwhnumZoneId);
        //     }
        //     return [row];
        // });

        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumZoneId === row?.cwhnumZoneId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(zoneListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = zoneListData.filter(row => {
                const paramName = row?.cwhstrZoneName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, zoneListData]);

    const deleteRecord = () => {
        fetchDeleteData(`api/v1/zones/${selectedOption[0]?.cwhnumZoneId}`).then(data => {
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                getZoneListData(recordStatus);
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
            } else {
                ToastAlert('Error while deleting record!', 'error')
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

    const column = [
        {
            name: <input
                type="checkbox"
                // checked={selectAll}
                // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                className="form-check-input log-select"
                disabled
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumZoneId === row?.cwhnumZoneId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Zone Name',
            selector: row => row.cwhstrZoneName,
            sortable: true,
        },
        {
            name: 'Short Name',
            selector: row => row.cwhstrZoneShortName || "---",
            sortable: true,
        },
    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Zone Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {filterData?.length}</span>}

                </div>
                {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="recordStatus"
                                        name="recordStatus"
                                        placeholder="Select Status"
                                        options={[{ value: "Active", label: 'Active' }, { value: "InActive", label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => { setRecordStatus(e.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='my-2' />
                    <GlobalTable column={column} data={filterData} onDelete={handleDeleteRecord} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                    {openPage === 'view' &&
                        <ViewPage data={[{ value: selectedOption[0]?.cwhstrZoneName, label: "Zone Name" }]} onClose={onClose} title={"Zone Master"} />
                    }
                </>)}

                {(openPage === "add" || openPage === 'modify') && (<>
                    <ZoneMasterForm />
                </>)}
            </div>
        </>
    )
}

export default ZoneMaster
