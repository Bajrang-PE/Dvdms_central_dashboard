import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { capitalizeFirstLetter } from '../../../utils/CommonFunction';
import FacilityTypeMasterForm from '../forms/admin/FacilityTypeMasterForm';

const FacilityTypeMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, getZoneListData, zoneListData } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1')

    useEffect(() => {

    }, [recordStatus])

    const handleRowSelect = (row) => {
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumZoneId === row?.cwhnumZoneId) {
                return [];
            }
            return [row];
        });
    };

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
            name: 'Facility Name',
            selector: row => row.cwhstrZoneName,
            sortable: true,
        },
        //  {
        //      name: 'Short Name',
        //      selector: row => row.cwhstrZoneShortName || "---",
        //      sortable: true,
        //  },
    ]

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Facility Type Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {zoneListData?.length}</span>}

                </div>
                {openPage === "home" && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="recordStatus"
                                        name="recordStatus"
                                        placeholder="Select Status"
                                        options={[{ value: 1, label: 'Active' }, { value: 0, label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => { setRecordStatus(e.target.value) }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='my-2' />
                    <GlobalTable column={column} data={zoneListData} onDelete={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </>)}

                {(openPage === "add" || openPage === 'modify') && (<>
                     <FacilityTypeMasterForm />
                 </>)}
            </div>
        </>
    )
}

export default FacilityTypeMaster