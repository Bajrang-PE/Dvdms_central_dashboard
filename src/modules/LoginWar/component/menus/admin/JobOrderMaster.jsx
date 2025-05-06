import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import GlobalTable from '../../GlobalTable';
import InputSelect from '../../InputSelect';
import DataTable from 'react-data-table-component';

const JobOrderMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, getZoneListData, zoneListData,stateNameDrpDt ,getSteteNameDrpData} = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1');

    useEffect(() => {
        getSteteNameDrpData()
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
            name: 'Job Name',
            selector: row => row.cwhstrZoneName,
            sortable: true,
        },
        {
            name: 'Procedure Name',
            selector: row => row.cwhstrZoneShortName || "---",
            sortable: true,
        },
        {
            name: 'Job Run Id',
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="radio"
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumZoneId === row?.cwhnumZoneId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "15%"
        },
        {
            name: 'Order Id',
            selector: row => row.cwhstrZoneShortName || "---",
            sortable: true,
             width: "15%"
        }
    ]

    const tableCustomStyles = {
        headRow: {
            style: {
                color: '#ffffff',
                backgroundColor: '#05396c ',
                borderBottomColor: '#FFFFFF',
                // outline: '1px solid #FFFFFF',
            },
        },
    }

console.log(stateNameDrpDt,'stateNameDrpDt')
    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>State Job Status Master</b></span>
                </div>

                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="state"
                                    name="state"
                                    placeholder="Select value"
                                    options={[{ value: 1, label: 'Rajasthan' }]}
                                    className="aliceblue-bg border-dark-subtle"
                                // value={recordStatus}
                                // onChange={(e) => { setRecordStatus(e.target.value) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='my-2' />

                <DataTable
                    // title="User Data"
                    dense
                    striped
                    fixedHeader
                    persistTableHead={true}
                    selectableRowsHighlight
                    highlightOnHover
                    responsive
                    fixedHeaderScrollHeight='65vh'
                    columns={column}
                    data={zoneListData}
                    pagination
                    // pointerOnHover
                    customStyles={tableCustomStyles}
                    className='global-dtbl'
                />

                <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn btn-sm datatable-btns py-0' >
                        <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>
                </div>
            </div>
        </>
    )
}

export default JobOrderMaster
