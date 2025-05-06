import React, { useEffect, useState } from 'react'
import InputSelect from '../../commons/InputSelect'
import InputField from '../../commons/InputField'
import { FaIcons } from 'react-icons/fa';
import IconPicker from '../../commons/IconPicker';

const AboutTab = (props) => {
    const { handleValueChange, handleRadioChange, radioValues, values, dashboardForDt, setValues, tabDrpData, errors } = props;

    const [tabIcon, setTabIcon] = useState('');
    const SelectedIconComponent = tabIcon ? FaIcons[tabIcon] : '';

    useEffect(() => {
        if (values?.iconName !== '') {
            setTabIcon(values?.iconName);
        } else {
            setTabIcon('');
        }
    }, [values?.iconName])

    return (
        <>
            <b><h6 className='header-devider m-0'> Tab Master</h6></b>

            {/* SECTION DEVIDER tab for*/}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0 required-label">Tab For : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                id="tabFor"
                                name="tabFor"
                                placeholder="Select value..."
                                options={dashboardForDt}
                                className="backcolorinput"
                                value={values?.tabFor}
                                onChange={handleValueChange}
                            // disabled={actionMode === 'edit' ? true : false}
                            />
                            {errors?.tabForErr &&
                                <div className="required-input">
                                    {errors?.tabForErr}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION DEVIDER tab name,parent,ellipse,css,icon */}
            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                {/* //left columns */}
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label pe-0 required-label">Tab Name (For Internal) : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabNameInternal'
                                id="tabNameInternal"
                                onChange={handleValueChange}
                                value={values?.tabNameInternal}
                            />
                            {errors?.tabNameInternalErr &&
                                <div className="required-input">
                                    {errors?.tabNameInternalErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Parent Tab : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputSelect
                                // type="text"
                                className="backcolorinput"
                                placeholder="No Parent"
                                name='parentTab'
                                id="parentTab"
                                onChange={handleValueChange}
                                value={values?.parentTab}
                                options={tabDrpData}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is Tab name in Report Required :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTabNameInReportReq"
                                    id="isTabNameInReportReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTabNameInReportReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTabNameInReportReq"
                                    id="isTabNameInReportReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTabNameInReportReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is CSS Tab Icon Required :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isCssTabIconReq"
                                    id="isCssTabIconReqYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isCssTabIconReq === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isCssTabIconReq"
                                    id="isCssTabIconReqNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isCssTabIconReq === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                {/* right columns */}
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Tab Name (For Display) : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='tabNameDisplay'
                                id="tabNameDisplay"
                                onChange={handleValueChange}
                                value={values?.tabNameDisplay}
                            />
                            {errors?.tabNameDisplayErr &&
                                <div className="required-input">
                                    {errors?.tabNameDisplayErr}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">
                            Is Tab Used For Drill Down :
                        </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTabUsedForDrill"
                                    id="isTabUsedForDrillYes"
                                    value={'Yes'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTabUsedForDrill === 'Yes'}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    Yes
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="isTabUsedForDrill"
                                    id="isTabUsedForDrillNo"
                                    value={'No'}
                                    onChange={handleRadioChange}
                                    checked={radioValues?.isTabUsedForDrill === 'No'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label pe-0">Ellipse After No. Of Character In Tab Display Name : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            <InputField
                                type="text"
                                className="backcolorinput"
                                placeholder="Enter value..."
                                name='ellipseInDisplay'
                                id="ellipseInDisplay"
                                onChange={handleValueChange}
                                value={values?.ellipseInDisplay}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label pe-0">Tab Icon Image : </label>
                        <div className="col-sm-7 ps-0 align-content-center">
                            {radioValues?.isCssTabIconReq === 'No' &&
                                <InputSelect
                                    className="backcolorinput "
                                    placeholder="Select Image"
                                    name='tabIconImage'
                                    id="tabIconImage"
                                    options={[{ value: "default", label: "Default-Image.png" }]}
                                    onChange={handleValueChange}
                                    value={values?.tabIconImage}
                                />
                            }
                            {radioValues?.isCssTabIconReq === 'Yes' &&
                                <IconPicker setTabIcon={setTabIcon} tabIcon={tabIcon} setValues={setValues} values={values} />
                                // <InputSelect
                                //     className="backcolorinput "
                                //     placeholder="Select Icon"
                                //     name='kpiTabIconImage'
                                //     id="kpiTabIconImage"
                                //     options={iconOptions}
                                //     onChange={handleChange}
                                //     value={selectedIcon}
                                //     style={{ width: "100%", padding: "5px" }}
                                // />
                            }
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AboutTab
