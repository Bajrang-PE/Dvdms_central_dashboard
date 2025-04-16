import React, { useContext } from 'react'
import InputField from '../../../InputField'
import GlobalButtons from '../../GlobalButtons'
import { LoginContext } from '../../../../context/LoginContext';

const StateMasterForm = () => {

    const { openPage } = useContext(LoginContext);

    return (
        <div>
            <GlobalButtons onSave={null}/>
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Zone Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="zonename"
                                name="zonename"
                                placeholder="Enter ZoneName"
                                className="aliceblue-bg border-dark-subtle"
                            // value={values?.hintquestion}
                            // onChange={handleValueChange}
                            />
                        </div>
                    </div>
                </div>
                {openPage === 'modify' &&
                    <div className='col-sm-6'>
                        <div className="form-group row">
                            <label className="col-sm-5 col-form-label fix-label">
                                Record Status :
                            </label>
                            <div className="col-sm-7 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus1"
                                        value={'1'}
                                    // onChange={handleRadioChange}
                                    // checked={radioValues?.isWidgetNameVisible === "Yes"}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        Active
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus0"
                                        value={'0'}
                                    // onChange={handleRadioChange}
                                    // checked={radioValues?.isWidgetNameVisible === 'No'}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        InActive
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default StateMasterForm
