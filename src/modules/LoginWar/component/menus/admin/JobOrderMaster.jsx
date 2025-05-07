import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import DataTable from 'react-data-table-component';
import { fetchData, fetchPostData } from '../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../utils/CommonFunction';

const JobOrderMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, stateNameDrpDt, getSteteNameDrpData } = useContext(LoginContext);
    const [stateId, setStateId] = useState('');
    const [jobList, setJobList] = useState([]);


    useEffect(() => {
        getSteteNameDrpData()
    }, [])

    const handleRowSelect = (row) => {
        setSelectedOption([row]);
    };

    const getJobOrderList = async (id) => {
        if (id) {
            const data = await fetchData(`/api/v1/jobOrder/${id}`);
            if (data.status === 1) {
                setJobList(data.data);

                const defaultSelected = data.data.find(job => job.cwhnumJobRunId === 1);
                if (defaultSelected) {
                    setSelectedOption([defaultSelected]);
                } else {
                    setSelectedOption([]);
                }
            } else {
                setJobList([]);
                setSelectedOption([]);
            }
        } else {
            setJobList([]);
            setSelectedOption([]);
        }
    };

    const saveJobOrderId = (id) => {
        if (!stateId || stateId == "" || stateId === null) {
            ToastAlert("Please select a state first", 'warning')
        } else if (!id || id == "" || id === null) {
            ToastAlert("No job selected", 'warning')
        } else {
            fetchPostData(`/api/v1/${stateId}/resetJobRunId?currentJobRunId=${id}`).then(data => {
                if (data.status === 1) {
                    console.log(data?.data)
                } else {
                    ToastAlert(data?.message, 'error')
                }
            })
        }
    }

    useEffect(() => {
        getJobOrderList(stateId)
    }, [stateId])

    const column = [
        {
            name: 'Job Name',
            selector: row => row.cwhstrJobName,
            sortable: true,
        },
        {
            name: 'Procedure Name',
            selector: row => row.cwhstrProcedureName || "---",
            sortable: true,
        },
        {
            name: 'Job Run Id',
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="radio"
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumJobId === row.cwhnumJobId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "15%"
        },
        {
            name: 'Order Id',
            selector: row => row.cwhnumJobOrderId || "---",
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
            },
        },
    }


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
                                    options={stateNameDrpDt}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={stateId}
                                    onChange={(e) => { setStateId(e.target.value) }}
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
                    data={jobList}
                    pagination
                    // pointerOnHover
                    customStyles={tableCustomStyles}
                    className='global-dtbl'
                />

                <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn btn-sm datatable-btns py-0' onClick={() => saveJobOrderId(selectedOption[0]?.cwhnumJobId)}>
                        <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>
                </div>
            </div>
        </>
    )
}

export default JobOrderMaster
