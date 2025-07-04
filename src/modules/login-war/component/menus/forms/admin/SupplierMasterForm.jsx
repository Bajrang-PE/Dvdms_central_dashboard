import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../GlobalButtons'
import InputSelect from '../../../InputSelect'
import { LoginContext } from '../../../../context/LoginContext';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchUpdateData, fetchUpdatePostData } from '../../../../../../utils/ApiHooks';
import InputField from '../../../InputField';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const SupplierMasterForm = (props) => {
    const { getListData, setSearchInput } = props;
    const { recStatus, setRecStatus } = props;
    const { getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext)
    const { openPage, setOpenPage, selectedOption, setSelectedOption, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [recordStatus, setRecordStatus] = useState("");

    const [values, setValues] = useState({
        "suppName": "", "suppType": "10", "contactNo": "", "emailId": "admin_disha", "address": "",
        "pinCode": "", "countryName": "101", "stateId": "", "corporateGst": "", "lstNo": "", "cstNo": "",
        "panNo": "D@shboard_2024", "showPan": "", "suppId": "",
    })

    const [errors, setErrors] = useState({
        "suppNameErr": "", "suppTypeErr": "", "contactNoErr": "", "emailIdErr": "", "addressErr": "",
        "pinCodeErr": "", "countryNameErr": "", "stateIdErr": "", "corporateGstErr": "", "lstNoErr": "", "cstNoErr": "",
        "panNoErr": "", "showPanErr": "", "suppIdErr": "",
    })

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    useEffect(() => {
        if (stateNameDrpDt?.length === 0) {
            getSteteNameDrpData();
        }
    }, [values?.stateId,])

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {

            if (selectedOption[0]?.cwhnumSupplierType === 'Supplier') {
                setValues(prevValues => ({ ...prevValues, suppType: "10" }));
            } else if (selectedOption[0]?.cwhnumSupplierType === 'Manufacturer') {
                setValues(prevValues => ({ ...prevValues, suppType: "11" }));
            } else if (selectedOption[0]?.cwhnumSupplierType === 'Supplier/Manufacturer') {
                setValues(prevValues => ({ ...prevValues, suppType: "12" }));
            } else { setValues(prevValues => ({ ...prevValues, suppType: "10" })); }

            setValues(prevValues => ({ ...prevValues, suppName: selectedOption[0]?.cwhstrSupplierName }));
            setValues(prevValues => ({ ...prevValues, contactNo: selectedOption[0]?.cwhstrContactNo }));
            setValues(prevValues => ({ ...prevValues, emailId: selectedOption[0]?.cwhstrEmailId }));
            setValues(prevValues => ({ ...prevValues, address: selectedOption[0]?.cwhstrAddress }));
            setValues(prevValues => ({ ...prevValues, pinCode: selectedOption[0]?.cwhnumPincode }));
            setValues(prevValues => ({ ...prevValues, countryName: selectedOption[0]?.cwhnumAddressCountryCode }));
            setValues(prevValues => ({ ...prevValues, stateId: selectedOption[0]?.cwhnumAddressStateCode }));
            setValues(prevValues => ({ ...prevValues, corporateGst: selectedOption[0]?.cwhstrCorporateMainGstno }));
            setValues(prevValues => ({ ...prevValues, lstNo: selectedOption[0]?.cwhstrLstNo }));
            setValues(prevValues => ({ ...prevValues, cstNo: selectedOption[0]?.cwhstrCstNo }));
            setValues(prevValues => ({ ...prevValues, panNo: selectedOption[0]?.cwhstrPanNo }));
            setValues(prevValues => ({ ...prevValues, suppId: selectedOption[0]?.cwhnumSupplierId }));
            setRecordStatus(selectedOption[0]?.gnumIsvalid)

        }

    }, [selectedOption, openPage])

    const handleValidation = () => {
        let isValid = true;
        if (!values?.suppName.trim()) {
            setErrors(prev => ({ ...prev, suppNameErr: "Please enter supplier name " }));
            isValid = false;
        }
        if (!values?.suppType.trim()) {
            setErrors(prev => ({ ...prev, suppTypeErr: "Please enter supplier type " }));
            isValid = false;
        }
        if (!values?.contactNo || !values?.contactNo.trim()) {
            setErrors(prev => ({ ...prev, contactNoErr: "Please enter contact no " }));
            isValid = false;
        }
        if (!values?.emailId.trim()) {
            setErrors(prev => ({ ...prev, emailIdErr: "Please enter email id " }));
            isValid = false;
        }
        if (!values?.address.trim()) {
            setErrors(prev => ({ ...prev, addressErr: "Please enter address " }));
            isValid = false;
        }
        if (!String(values?.pinCode).trim()) {
            setErrors(prev => ({ ...prev, pinCodeErr: "Please enter pincode " }));
            isValid = false;
        }
        if (!String(values?.stateId).trim()) {
            setErrors(prev => ({ ...prev, stateIdErr: "Please select state" }));
            isValid = false;
        }
        if (!values?.corporateGst.trim()) {
            setErrors(prev => ({ ...prev, corporateGstErr: "Please enter corporate gst " }));
            isValid = false;
        }
        if (!values?.lstNo.trim()) {
            setErrors(prev => ({ ...prev, lstNoErr: "Please enter lst no. " }));
            isValid = false;
        }
        if (!values?.cstNo.trim()) {
            setErrors(prev => ({ ...prev, cstNoErr: "Please enter cst no. " }));
            isValid = false;
        }
        if (!values?.panNo.trim()) {
            setErrors(prev => ({ ...prev, panNoErr: "Please enter pan no. " }));
            isValid = false;
        }


        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            save();
        }
    }, [confirmSave])


    const save = async () => {

        if (openPage === "add") {

            const data = {
                cwhstrSupplierName: values?.suppName,
                cwhnumSupplierType: values?.suppType,
                cwhstrContactNo: values?.contactNo,
                cwhstrEmailId: values?.emailId,
                cwhstrAddress: values?.address,
                cwhnumPincode: values?.pinCode,
                cwhnumAddressCountryCode: values?.countryName,
                cwhnumAddressStateCode: values?.stateId,
                cwhstrCorporateMainGstno: values?.corporateGst,
                cwhstrLstNo: values?.lstNo,
                cwhstrCstNo: values?.cstNo,
                cwhstrPanNo: values?.panNo,
                gnumSeatId: getAuthUserData('userSeatId'),
            }

            fetchUpdatePostData("http://10.226.27.173:8025/api/v1/suppliers", data).then(data => {
                if (data?.status === 1) {
                    ToastAlert('Supplier Added successfully', 'success');
                    refresh();
                } else {
                    ToastAlert('Error', 'error');
                }
            })


        } else if (openPage === "modify") {

            const data = {
                cwhstrSupplierName: values?.suppName,
                cwhnumSupplierType: values?.suppType,
                cwhstrContactNo: values?.contactNo,
                cwhstrEmailId: values?.emailId,
                cwhstrAddress: values?.address,
                cwhnumPincode: values?.pinCode,
                cwhnumAddressCountryCode: values?.countryName,   //countryId
                cwhnumAddressStateCode: values?.stateId,
                cwhstrCorporateMainGstno: values?.corporateGst,
                cwhstrLstNo: values?.lstNo,
                cwhstrCstNo: values?.cstNo,
                cwhstrPanNo: values?.panNo,
                gnumIsvalid: recordStatus,
                gnumSeatId: getAuthUserData('userSeatId'),
            }

            fetchUpdateData(`http://10.226.27.173:8025/api/v1/suppliers/${values?.suppId}`, data).then(data => {
                if (data?.status === 1) {
                    ToastAlert('Supplier updated successfully', 'success')
                    setSelectedOption([]);
                    refresh();
                } else {
                    ToastAlert('Error', 'error')
                }
            })
        }

    }

    const refresh = () => {
        setConfirmSave(false);
        setOpenPage("home")
        getListData("1")
        setRecStatus(1)
        setSearchInput("")
    }

    const reset = () => {
        setValues({
            "suppName": "", "suppType": "10", "contactNo": "", "emailId": "admin_disha", "address": "",
            "pinCode": "", "countryName": "101", "stateId": "", "corporateGst": "", "lstNo": "", "cstNo": "",
            "panNo": "D@shboard_2024", "showPan": "", "suppId": "",
        });
    }


    return (
        <div>
            <GlobalButtons onSave={handleValidation} onClear={reset} />
            <hr className='my-2' />

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label">Supplier Name :</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='suppName'
                            id='suppName'
                            onChange={handleValueChange}
                            value={values?.suppName}
                            errorMessage={errors?.suppNameErr}
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
                            errorMessage={errors?.suppTypeErr}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Contact No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='contactNo'
                            id='contactNo'
                            onChange={handleValueChange}
                            value={values?.contactNo}
                            errorMessage={errors?.contactNoErr}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Email Id : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='emailId'
                            id='emailId'
                            onChange={handleValueChange}
                            value={values?.emailId}
                            errorMessage={errors?.emailIdErr}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Address : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='address'
                            id='address'
                            onChange={handleValueChange}
                            value={values?.address}
                            errorMessage={errors?.addressErr}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Pin Code : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='pinCode'
                            id='pinCode'
                            onChange={handleValueChange}
                            value={values?.pinCode}
                            errorMessage={errors?.pinCodeErr}
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
                            errorMessage={errors?.stateIdErr}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Corporate GST : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='corporateGst'
                            id='corporateGst'
                            onChange={handleValueChange}
                            value={values?.corporateGst}
                            errorMessage={errors?.corporateGstErr}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> LST No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='lstNo'
                            id='lstNo'
                            onChange={handleValueChange}
                            value={values?.lstNo}
                            errorMessage={errors?.lstNoErr}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> CST No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='cstNo'
                            id='cstNo'
                            onChange={handleValueChange}
                            value={values?.cstNo}
                            errorMessage={errors?.cstNoErr}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> PAN No. : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type={values?.showPan ? "text" : "password"}
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='panNo'
                            id='panNo'
                            onChange={handleValueChange}
                            value={values?.panNo}
                            errorMessage={errors?.panNoErr}
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
                                    value={"1"}
                                    onChange={(e) => setRecordStatus(e.target.value)}
                                    checked={recordStatus.toString() === "1"}
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
                                    value={"0"}
                                    onChange={(e) => setRecordStatus(e.target.value)}
                                    checked={recordStatus.toString() === "0"}
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