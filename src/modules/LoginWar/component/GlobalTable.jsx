import React, { useContext } from 'react';
import DataTable from 'react-data-table-component';
import InputField from './InputField';
import { LoginContext } from '../context/LoginContext';


const GlobalTable = (props) => {
    const { selectedOption, setSelectedOption } = useContext(LoginContext);
    const { column, data, onDelete, onReport, setSearchInput, isShowBtn, isAdd, isModify, isDelete, isView, isReport, setOpenPage, isSearch } = props;

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


        <>
            <div className=''>
                <div className='row my-1'>
                    <div className='col-12 col-md-7 mb-1 d-flex flex-wrap'>
                        {isShowBtn &&
                            <>
                                {isAdd &&
                                    <button className='btn btn-sm datatable-btns py-0' onClick={() => {
                                        setOpenPage('add');

                                    }}>
                                        <i className="fa fa-plus me-1 fs-13 text-success"></i>Add</button>}
                                {selectedOption?.length > 0 && (<>
                                    {isModify &&
                                        <button className='btn btn-sm datatable-btns py-0' onClick={() => {
                                            setOpenPage('modify');
                                        }}>
                                            <i className="fa fa-edit me-1 fs-13 text-warning"></i>Modify</button>}
                                    {isDelete &&
                                        <button className='btn btn-sm datatable-btns py-0' onClick={onDelete}>
                                            <i className="fa fa-trash me-1 fs-13 text-danger"></i>Delete</button>}
                                    {isView &&
                                        <button className='btn btn-sm datatable-btns py-0' onClick={() => {
                                            setOpenPage('view');
                                        }}>
                                            <i className="fa fa-eye me-1 fs-13 text-info"></i>View</button>}

                                </>)}
                                {isReport &&
                                    <button className='btn btn-sm datatable-btns py-0' onClick={onReport}>
                                        <i className="fa fa-file me-1 fs-13 text-warning"></i>Report</button>}
                            </>
                        }

                    </div>
                    <div className="col-12 col-md-5 d-flex align-items-center justify-content-md-end">
                        <label className="col-form-label me-2">Search :</label>
                        <div className=''>
                            <InputField
                                type="search"
                                id="customMsgForNoData"
                                name="customMsgForNoData"
                                placeholder="Enter"
                                className="aliceblue-bg border-dark-subtle"
                                onChange={(e) => { setSearchInput(e?.target?.value); }}
                            // value={values?.customMsgForNoData}
                            />
                        </div>
                    </div>
                </div>

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
            </div>
        </>
    );
};

export default GlobalTable;
