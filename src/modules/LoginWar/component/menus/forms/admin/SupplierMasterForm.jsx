import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputSelect from '../../../InputSelect'
import { LoginContext } from '../../../../context/LoginContext';
import { fetchUpdatePostData } from '../../../../utils/ApiHooks';
import { ToastAlert } from '../../../../utils/CommonFunction';

const SupplierMasterForm = () => {

    const { getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext)
    const { openPage, selectedOption } = useContext(LoginContext);
     const [recordStatus, setRecordStatus] = useState("1");

    const [values, setValues] = useState({
        "suppName": "","suppType": "10", "contactNo": "", "emailId": "admin_disha", "address": "",
        "pinCode": "", "countryName": "101", "stateId": "", "corporateGst": "", "lstNo": "", "cstNo": "",
        "panNo": "D@shboard_2024", "showPan": "",
    })

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
        }
    }

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) {
            getSteteNameDrpData();
        }
    }, [values?.stateId,])

     useEffect(() => {
            if (selectedOption?.length > 0 && openPage === 'modify') {
                setValues(prevValues => ({...prevValues,suppName: selectedOption[0]?.cwhstrSupplierName}));
                setValues(prevValues => ({...prevValues,suppType: selectedOption[0]?.cwhnumSupplierType}));
                setValues(prevValues => ({...prevValues,contactNo: selectedOption[0]?.cwhstrContactNo}));
                setValues(prevValues => ({...prevValues,emailId: selectedOption[0]?.cwhstrEmailId}));
                setValues(prevValues => ({...prevValues,address: selectedOption[0]?.cwhstrAddress}));
                setValues(prevValues => ({...prevValues,pinCode: selectedOption[0]?.cwhnumPincode}));
                setValues(prevValues => ({...prevValues,countryName: selectedOption[0]?.cwhnumAddressCountryCode}));
                setValues(prevValues => ({...prevValues,stateId: selectedOption[0]?.cwhnumAddressStateCode}));
                setValues(prevValues => ({...prevValues,corporateGst: selectedOption[0]?.cwhstrCorporateMainGstno}));
                setValues(prevValues => ({...prevValues,lstNo: selectedOption[0]?.cwhstrLstNo}));
                setValues(prevValues => ({...prevValues,cstNo: selectedOption[0]?.cwhstrCstNo}));
                setValues(prevValues => ({...prevValues,panNo: selectedOption[0]?.cwhstrPanNo}));    
                
            }
    
        }, [selectedOption, openPage])

    const save = ()=>{

       
        const data = {
            cwhstrSupplierName:values?.suppName,
            cwhnumSupplierType:values?.suppType,
            cwhstrContactNo:values?.contactNo,
            cwhstrEmailId:values?.emailId,
            cwhstrAddress:values?.address,
            cwhnumPincode:values?.pinCode,
            cwhnumAddressCountryCode:values?.countryName,
            cwhnumAddressStateCode:values?.stateId,
            cwhstrCorporateMainGstno:values?.corporateGst,
            cwhstrLstNo:values?.lstNo,
            cwhstrCstNo:values?.cstNo,
            cwhstrPanNo:values?.panNo,
            gnumIsvalid:1,
            gnumSeatId:11111,
        }

        const response= fetchUpdatePostData("/suppliers",data)
        ToastAlert('Supplier Added successfully', 'success')
        reset();
        
    }

    const reset = () => {
        setValues({
            "suppName": "", "suppName": "", "suppType": "10", "contactNo": "", "emailId": "admin_disha", "address": "",
            "pinCode": "", "countryName": "101", "stateId": "", "corporateGst": "", "lstNo": "", "cstNo": "",
            "panNo": "D@shboard_2024", "showPan": ""
        });
    }


    return (
        <div>
            { openPage === "add" &&
            <div className='text-left w-100 fw-bold p-1 heading-text' >Supplier Master &gt;&gt; Add</div>
            }
            { openPage === "modify" &&
            <div className='text-left w-100 fw-bold p-1 heading-text' >Supplier Master &gt;&gt; Modify</div>
            }
            <GlobalButtons onSave={save} onClear={reset}/>
            <hr className='my-2' />

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label">Supplier Name :</label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='suppName'
                            id='suppName'
                            onChange={handleValueChange}
                            value={values?.suppName}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Supplier Type : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='suppType'
                            id='suppType'
                            options={[{ label: "Supplier", value: "10" },
                                      { label: "Manufacturer", value: "11" },
                                      { label: "Supplier/Manufacturer", value: "12" }
                                    ]}
                            onChange={handleValueChange}
                            value={values?.suppType}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Contact No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='contactNo'
                            id='contactNo'
                            onChange={handleValueChange}
                            value={values?.contactNo}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Email Id : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='emailId'
                            id='emailId'
                            onChange={handleValueChange}
                            value={values?.emailId}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Address : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='address'
                            id='address'
                            onChange={handleValueChange}
                            value={values?.address}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Pin Code : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='pinCode'
                            id='pinCode'
                            onChange={handleValueChange}
                            value={values?.pinCode}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Country Name : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='countryName'
                            id='countryName'
                            options={[{ label: "India", value: "101" }]}
                            value={values?.countryName}
                            onChange={handleValueChange}
                            
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> State : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateId'
                            id='stateId'
                            placeholder='Select Value'
                            options={stateNameDrpDt}
                            onChange={handleValueChange}
                            value={values?.stateId}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Corporate GST : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='corporateGst'
                            id='corporateGst'
                            onChange={handleValueChange}
                            value={values?.corporateGst}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> LST No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='lstNo'
                            id='lstNo'
                            onChange={handleValueChange}
                            value={values?.lstNo}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> CST No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='cstNo'
                            id='cstNo'
                            onChange={handleValueChange}
                            value={values?.cstNo}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> PAN No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type={values?.showPan ? "text" : "password"}
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='panNo'
                            id='panNo'
                            onChange={handleValueChange}
                            value={values?.panNo}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>

                </div>
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>  
                    <div className="col-sm-8 d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            name="panNo"
                            id="panNo"
                            checked={values?.showPan || false}
                            onChange={(e) => handleValueChange({ target: { name: 'showPan', value: e.target.checked } })}
                        />&nbsp;&nbsp; <label>Show PAN No.</label> 
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
                                        id="recordStatus"
                                        value={'1'}
                                        onChange={(e) => setRecordStatus(e.target.value)} 
                                        checked={recordStatus === "1"}
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
                                        id="recordStatus"
                                        value={'0'}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                       checked={recordStatus === "0"}
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
    )
}

export default SupplierMasterForm