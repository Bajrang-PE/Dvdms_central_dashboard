import React, { useContext } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { capitalizeFirstLetter } from '../../../utils/CommonFunction';
import InputSelect from '../../InputSelect';

const FacilityTypeMappingMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage } = useContext(LoginContext);


    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-12'><b>{`Facility Type Mapping Master`}</b></span>
                    {/* {openPage === "home" && <span className='col-6 text-end'>Total Records : {functionalityData?.length || 0}</span>} */}
                </div>


                <div className='row pt-2'>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">Facility Type : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select Value"
                                    options={[{ value: 1, label: 'District Hospital' }]}
                                    className="aliceblue-bg border-dark-subtle"
                                // value={values?.hintquestion}
                                // onChange={handleValueChange}
                                />

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-5 col-form-label fix-label required-label">State : </label>
                            <div className="col-sm-7 align-content-center">
                                <InputSelect
                                    id="hintquestion"
                                    name="hintquestion"
                                    placeholder="Select value"
                                    options={[{ value: 1, label: 'Rajasthan' }]}
                                    className="aliceblue-bg border-dark-subtle"
                                // value={values?.hintquestion}
                                // onChange={handleValueChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center my-3">
                    <div className="flex-grow-1" style={{border:"1px solid #193fe6"}}></div>
                    <div className="px-1 text-primary fw-bold fs-13">
                        <span className="text-danger">*</span> State Facility Type
                    </div>
                    <div className="flex-grow-1" style={{border:"1px solid #193fe6"}}></div>
                </div>

                <div className='d-flex justify-content-center mt-1 mb-2'>
                    <div className='' style={{ width: "30%" }}>
                        <select className="form-select form-select-sm aliceblue-bg border-dark-subtle" id='leftRightSelect' size="8" aria-label="size 4 select example" onChange={null}>
                            {/* {availableOptions?.map((opt, index) => (
                                <option value={opt.value} key={index}>{opt.label}</option>
                            ))} */}
                        </select>
                    </div>

                    <div className='align-self-center' style={{ marginLeft: "2%", marginRight: "2%" }}>
                        <div className='d-flex justify-content-center'>
                            <button type='button' className='btn btn-outline-secondary btn-sm m-1'>
                                <i className="fa fa-caret-right"></i>
                            </button>

                        </div>

                        <div className='d-flex justify-content-center'>
                            <button type='button' className='btn btn-outline-secondary btn-sm m-1' >
                                <i className="fa fa-caret-left"></i>
                            </button>
                        </div>
                    </div>

                    <div className='' style={{ width: "30%" }}>
                        <select className="form-select form-select-sm aliceblue-bg border-dark-subtle" id='leftRightSelect1' size="8" aria-label="size 4 select example" onChange={null}>
                            {/* {selectedOptions?.map((opt, index) => (
                                <option value={opt.value} key={index}>{opt.label}</option>
                            ))} */}
                        </select>
                    </div>
                </div>

                {/* <hr className='my-2' /> */}
                <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                    </div>

                <div className='text-center'>
                    <button className='btn btn-sm datatable-btns py-0' >
                        <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>
                    <button className='btn btn-sm datatable-btns py-0'  >
                        <i className="fa fa-broom me-1 fs-13 text-warning"></i>Clear</button>
                </div>
            </div>
        </>
    )
}

export default FacilityTypeMappingMaster
