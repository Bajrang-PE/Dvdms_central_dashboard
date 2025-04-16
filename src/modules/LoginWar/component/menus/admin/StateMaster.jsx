import React, { useContext, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { functionalityData } from '../../../localData/HomeData';
import { capitalizeFirstLetter } from '../../../utils/CommonFunction';
import StateMasterForm from '../forms/admin/StateMasterForm';

const StateMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');

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
                            checked={''}
                            onChange={(e) => { setSelectedOption([row]) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'State Name',
            selector: row => row.title,
            sortable: true,
        },
        {
            name: 'State Short Name',
            selector: row => row.description,
            sortable: true,
        },
    ]

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`State Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {functionalityData?.length || 0}</span>}
                </div>

                {openPage === "home" && (<>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label required-label">Country : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Country"
                                        options={[{ value: 1, label: 'India' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                    // value={values?.hintquestion}
                                    // onChange={handleValueChange}
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
                                        options={[{ value: 1, label: 'Active' }, { value: 2, label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                    // value={values?.hintquestion}
                                    // onChange={handleValueChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />
                    <GlobalTable column={column} data={functionalityData} onAdd={null} onModify={null} onDelete={null} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                </>)}

                {(openPage === "add" || openPage === 'modify') && (<>
                    <StateMasterForm />
                </>)}

            </div>
        </>
    )
}

export default StateMaster
