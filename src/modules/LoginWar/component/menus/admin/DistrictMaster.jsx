import React, { useContext, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { functionalityData } from '../../../localData/HomeData';

const DistrictMaster = () => {

    const { selectedOption, setSelectedOption } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [openPage, setOpenPage] = useState('home')

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
            name: 'District Name',
            selector: row => row.title,
            sortable: true,
        },
        // {
        //     name: 'State Short Name',
        //     selector: row => row.description,
        //     sortable: true,
        // },
    ]

    return (
        < div className='masters mx-3 my-2'>
            <div className='masters-header row'>
                <span className='col-6'><b>{'District Master >>'}</b></span>
                <span className='col-6 text-end'>Total Records : 12</span>

            </div>
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
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="hintquestion"
                                name="hintquestion"
                                placeholder="Select "
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
                            {/* {errors.hintquestionErr &&
                        <div className="required-input">
                            {errors?.hintquestionErr}
                        </div>
                    } */}
                        </div>
                    </div>
                </div>
                <hr className='my-2' />
            </div>
            <GlobalTable column={column} data={functionalityData} onAdd={null} onModify={null} onDelete={null} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} />
        </div>

    )
};

export default DistrictMaster;
