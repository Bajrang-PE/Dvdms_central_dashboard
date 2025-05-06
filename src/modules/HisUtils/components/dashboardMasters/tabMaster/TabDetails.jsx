import React from 'react'
import InputField from '../../commons/InputField'

const TabDetails = (props) => {

    const { handleValueChange, handleRadioChange, radioValues, values, errors } = props;

    return (
        <>
            <b><h6 className='header-devider my-1'>Tab Details Configuration</h6></b>
            {/* SECTION DEVIDER tab name,parent,ellipse,css,icon */}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">
                            Show Tab Name In Detail Title :
                        </label>
                        <di v className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="showTabNameInDetail"
                                    id="showTabNameInDetailYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.showTabNameInDetail === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="showTabNameInDetail"
                                    id="showTabNameInDetailNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.showTabNameInDetail === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                            {errors?.showTabNameInDetailErr &&
                                <div className="required-input">
                                    {errors?.showTabNameInDetailErr}
                                </div>
                            }
                        </di>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label pe-0 required-label">Tab Name Font Weight : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabNameFontWeight'
                                id="tabNameFontWeight"
                                onChange={handleValueChange}
                                value={values?.tabNameFontWeight}
                            />
                            {errors?.tabNameFontWeightErr &&
                                <div className="required-input">
                                    {errors?.tabNameFontWeightErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label pe-0">Tab Detail Background color : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="color"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabDetailBgColor'
                                id="tabDetailBgColor"
                                onChange={handleValueChange}
                                value={values?.tabDetailBgColor}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label pe-0">Tab Top Padding (in pixel) : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabTopPadding'
                                id="tabTopPadding"
                                onChange={handleValueChange}
                                value={values?.tabTopPadding}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label pe-0">Bottom Margin (For Tab Heading) : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='buttonMarginHeading'
                                id="buttonMarginHeading"
                                onChange={handleValueChange}
                                value={values?.buttonMarginHeading}
                            />
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Tab Name Font Size (in percentage) : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabNameFontSize'
                                id="tabNameFontSize"
                                onChange={handleValueChange}
                                value={values?.tabNameFontSize}
                            />
                            {errors?.tabNameFontSizeErr &&
                                <div className="required-input">
                                    {errors?.tabNameFontSizeErr}
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Tab Name Text Decoration : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabNameTxtDecorat'
                                id="tabNameTxtDecorat"
                                onChange={handleValueChange}
                                value={values?.tabNameTxtDecorat}
                            />
                            {errors?.tabNameTxtDecoratErr &&
                                <div className="required-input">
                                    {errors?.tabNameTxtDecoratErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Tab Detail Title Color : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="color"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabDetailTitleColor'
                                id="tabDetailTitleColor"
                                onChange={handleValueChange}
                                value={values?.tabDetailTitleColor}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Widget Maximize/Minimize :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="widgetMaxMin"
                                    id="widgetMaxMinYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetMaxMin === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="widgetMaxMin"
                                    id="widgetMaxMinNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.widgetMaxMin === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default TabDetails
