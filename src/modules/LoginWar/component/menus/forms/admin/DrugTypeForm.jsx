import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../InputField'
import GlobalButtons from '../../GlobalButtons'
import { LoginContext } from '../../../../context/LoginContext';
import { ToastAlert } from '../../../../utils/CommonFunction';
import { fetchUpdateData,fetchUpdatePostData } from '../../../../../../utils/ApiHooks';

const DrugTypeForm = () => {

    const { openPage, selectedOption } = useContext(LoginContext);
    const [drugTypeName, setDrugTypeName] = useState("");
    const [recordStatus, setRecordStatus] = useState("");
    const [drugTypeNameErr, setDrugTypeNameErr] = useState("");
    const [cwhnumDrugTypeId, setCwhnumDrugTypeId] = useState("");


    const save = async (e) => {

        if (openPage === 'add') {
            e.preventDefault();
            let isValid = true
            if (!drugTypeName.trim()) {
                alert("Please enter Drug Type Name")
                isValid = false;
            }
            if (isValid) {
                const data = {
                    cwhstrDrugTypeName: drugTypeName,
                    gnumSeatId: 11111
                }
                const response = fetchUpdatePostData("/drugtype/addDrug", data);
                ToastAlert('Drug Type Added successfully', 'success')
                reset();

            }
        }

        if (openPage === 'modify') {
            e.preventDefault();
            let isValid = true
            if (!drugTypeName.trim()) {
                ToastAlert("Please enter Drug Type Name",'warning')
                isValid = false;
            }
            if (isValid) {
                const data = {
                    cwhstrDrugTypeName: drugTypeName,
                    gnumSeatId: 11111,
                    gnumIsvalid: recordStatus,
                    cwhnumDrugTypeId:cwhnumDrugTypeId,
                    gdtEntryDate: '2025-04-09T11:16:04.569Z'

                }
                const response = await fetchUpdateData(`/drugtype/modify/${cwhnumDrugTypeId}`, data);
                ToastAlert('Data updated successfully', 'success')
                reset();
            }
        }

    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            setDrugTypeName(selectedOption[0]?.cwhstrDrugTypeName);
            setRecordStatus(String(selectedOption[0]?.gnumIsvalid));
            setCwhnumDrugTypeId(selectedOption[0]?.cwhnumDrugTypeId);

        }

    }, [selectedOption, openPage])

    const reset = () => {
        setDrugTypeName("");
    }

    return (
        <div>
            <div className='text-left w-100 fw-bold p-1 heading-text' >Drug Type Master &gt;&gt; Add</div>
            <GlobalButtons onSave={save}  />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6 row'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label"> Drug Type Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                name='drugTypeName'
                                id='drugTypeName'
                                onChange={(e) => {
                                    setDrugTypeName(e.target.value);
                                    setDrugTypeNameErr("");
                                }}
                                value={drugTypeName}
                                placeholder="Enter Drug Type Name"
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
        </div>
    )
}

export default DrugTypeForm
