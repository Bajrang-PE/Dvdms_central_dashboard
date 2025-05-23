import React from 'react'
import DataTable from 'react-data-table-component'
import InputSelect from '../../InputSelect';

const StateCdbSyncMaster = () => {

    const column = [
        {
            name: 'Master Name',
            selector: row => row.name, sortable: true
        },
        {
            name: 'State Count',
            selector: row => row.stateCount
        },
        {
            name: 'CDB Count',
            selector: row => row.cdbCount
        },
        {
            name: 'Action',
            cell: row => <button className="btn btn-sm datatable-btns py-0">Sync</button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    const data = [
        { name: 'Drug Mapping Master', stateCount: '', cdbCount: '' },
        { name: 'Programme Mapping Master', stateCount: '', cdbCount: '' },
        { name: 'Supplier Mapping Master', stateCount: '', cdbCount: '764' },
        { name: 'Facility Type Mapping Master', stateCount: '', cdbCount: '' }
    ];

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

    return (
        <div className='masters mx-3 my-2'>
            <div className='masters-header row'>
                <span className='col-6'><b>State CDB Sync Master</b></span>
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
                data={data}
                pagination
                // pointerOnHover
                customStyles={tableCustomStyles}
                className='global-dtbl'
            />

            <div className='w-100 py-1 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
            </div>
        </div>
    )
}

export default StateCdbSyncMaster
