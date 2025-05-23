import React from 'react'
import InputField from '../../commons/InputField'
import InputSelect from '../../commons/InputSelect'
import { parameterAlignment } from '../../../localData/DropDownData';

const FooterDetails = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values } = props;
    return (
        <>

            <b><h6 className='header-devider'>Footer Details</h6></b>

            {/* SECTION DEVIDER */}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Footer Alignment : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="footerAlignment"
                                name="footerAlignment"
                                placeholder="Select value..."
                                options={parameterAlignment}
                                className="backcolorinput"
                                value={values?.footerAlignment}
                                onChange={handleValueChange}
                            // disabled={actionMode === 'edit' ? true : false}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is Legend Collapes :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendCollapes"
                                    id="isLegendCollapesYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendCollapes === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendCollapes"
                                    id="isLegendCollapesNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendCollapes === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Footer Query : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder="Enter value..."
                                name="footerQuery"
                                id='footerQuery'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.footerQuery}
                            ></textarea>
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is Marquee Required :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isMarqueeReq"
                                    id="isMarqueeReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isMarqueeReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isMarqueeReq"
                                    id="isMarqueeReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isMarqueeReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is Legend Border Required :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendBorderReq"
                                    id="isLegendBorderReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendBorderReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isLegendBorderReq"
                                    id="isLegendBorderReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isLegendBorderReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Footer Text : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <textarea
                                className="form-control backcolorinput"
                                placeholder="Enter value..."
                                name="footerText"
                                id='footerText'
                                rows="2"
                                onChange={handleValueChange}
                                value={values?.footerText}
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <b>Footer by WebService Details:</b>
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Webservice Reference Name : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="webRefName"
                                name="webRefName"
                                placeholder="Select value..."
                                options={[{value:'1',label:'Localhost'}]}
                                className="backcolorinput"
                                value={values?.webRefName}
                                onChange={handleValueChange}
                            // disabled={actionMode === 'edit' ? true : false}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Webservice Name : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type='text'
                                id="webServiceName"
                                name="webServiceName"
                                placeholder="Enter "
                                className="backcolorinput"
                                onChange={handleValueChange}
                                value={values?.webServiceName}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default FooterDetails
