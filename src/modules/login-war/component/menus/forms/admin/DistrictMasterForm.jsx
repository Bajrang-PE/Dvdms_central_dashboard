import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../InputField'
import { LoginContext } from '../../../../context/LoginContext';
import InputSelect from '../../../InputSelect';
import GlobalButtons from '../../GlobalButtons';
import { ToastAlert } from '../../../../utils/CommonFunction';
import axios from 'axios';
import { getAuthUserData } from '../../../../../../utils/CommonFunction';

const DistrictMasterForm = ({ setValues, values }) => {

    const { openPage, setOpenPage, selectedOption, setSelectedOption, getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext)
    const [stateId, setStateId] = useState("");
    const [distId, setDistId] = useState("");
    const [distName, setDistName] = useState("");
    const [stateName, setStateName] = useState("");
    const [recordStatus, setRecordStatus] = useState("");

    const [distIdErr, setDistIdErr] = useState("");
    const [stateIdErr, setStateIdErr] = useState("");
    const [distNameErr, setDistNameErr] = useState("");

    useEffect(() => {
        if (stateNameDrpDt.length === 0) {
            getSteteNameDrpData();
        }
    }, [])

    const validate = () => {

        //alert("cliclkinng on save in")
        let isValid = true;
        if (!stateId?.toString()?.trim()) {
            setStateIdErr("Plese select state name")
            isValid = false;
        }

        if (!distName?.trim()) {
            setDistNameErr("District name is required")
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            handleSave();
        }
    }, [confirmSave])

    const handleSave = async () => {



        if (openPage === "add") {

            const data = {
                "gnumSeatid": getAuthUserData('userSeatId'),
                "cwhstrDistName": distName,
                "cwhnumStateId": stateId,
                "cwhstrDistShortName": distName,
                "cwhstrUsername": "deo",
                "cwhnumLgdCode": 999
            }
            const response = await axios.post("http://10.226.17.6:8025/api/v1/districts", data)
            ToastAlert('District Added Successfully', 'success');
        }
        else if (openPage === "modify") {

            const data = {
                "gnumIsvalid": recordStatus,
                "gnumSeatid": getAuthUserData('userSeatId'),
                "cwhstrDistName": distName,
                "cwhnumStateId": stateId,
                "cwhstrDistShortName": distName,
                "cwhstrUsername": "deo",
                "cwhnumLgdCode": 999,

            }


            const response = await axios.put("http://10.226.17.6:8025/api/v1/districts", data)
            console.log("===after mod======", response)
            ToastAlert('District Updated Successfully', 'success');
            setSelectedOption([])
        }
        reset();
        setOpenPage('home');
        setConfirmSave(false);
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            setDistId(selectedOption[0]?.cwhnumDistId);
            setRecordStatus(String(selectedOption[0]?.gnumIsvalid));
            setDistName(selectedOption[0]?.cwhstrDistName);
            setStateId(selectedOption[0]?.cwhnumStateId)

        }

    }, [selectedOption, openPage])


    const reset = () => {
        setValues({ ...values, "recordStatus": "1" })
    }

    return (
        <>
    
            <GlobalButtons onSave={validate} onClear={reset} />
            <hr className='my-2' />
            <div className="row mt-2">
                {openPage === "add" &&
                    <>
                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> State Name: </label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='stateId'
                                    id='stateId'
                                    placeholder='Select Value'
                                    options={stateNameDrpDt}
                                    onChange={(e) => {
                                        setStateId(e.target.value);
                                        setStateIdErr("");
                                    }
                                    }
                                    value={stateId}
                                    errorMessage={stateIdErr}
                                />
                            </div>
                        </div>

                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Distirct Name : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputField
                                    type='text'
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='distName'
                                    id='distName'
                                    placeholder='Enter district name'
                                    onChange={(e) => {
                                        setDistName(e.target.value);
                                        setDistNameErr("");
                                    }
                                    }
                                    value={distName}
                                    errorMessage={distNameErr}
                                />
                            </div>
                        </div>
                    </>
                }



                {openPage === 'modify' &&
                    <>

                        <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> State Name: </label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='stateId'
                                    id='stateId'
                                    placeholder='Select Value'
                                    options={stateNameDrpDt}
                                    onChange={(e) => {
                                        setStateId(e.target.value);
                                        setStateIdErr("");
                                    }
                                    }
                                    value={stateId}
                                    errorMessage={stateIdErr}
                                    disabled
                                />
                            </div>
                        </div>



                        <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Distirct Name : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputField
                                    type='text'
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='distName'
                                    id='distName'
                                    placeholder='Enter district name'
                                    onChange={(e) => {
                                        setDistName(e.target.value);
                                        setDistNameErr("");
                                    }
                                    }
                                    value={distName}
                                    errorMessage={distNameErr}
                                />
                            </div>
                        </div>



                        <div className="form-group col-sm-4  row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label">
                                Record Status :
                            </label>
                            <div className="col-sm-5 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recordStatus"
                                        id="recordStatus"
                                        value={1}
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
                                        value={0}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                        checked={recordStatus === "0"}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        InActive
                                    </label>
                                </div>
                            </div>
                        </div>

                    </>
                }

            </div>
        </>
    )
}

export default DistrictMasterForm