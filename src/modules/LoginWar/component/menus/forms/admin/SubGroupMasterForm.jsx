import React, { useState, useEffect, useContext } from 'react'
import InputField from '../../../InputField'
import GlobalButtons from '../../GlobalButtons'
import { LoginContext } from '../../../../context/LoginContext'
import axios from 'axios'
import { ToastAlert } from '../../../../utils/CommonFunction'

const SubGroupMasterForm = ({ selectedGroupName, selectedGroupId ,getData}) => {
    const { openPage, setOpenPage, selectedOption, getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext)
    const [subGroupName, setSubGroupName] = useState("")
    const [groupName, setGroupName] = useState("")
    const [groupId, setGroupId] = useState("")
    const [subGroupNameErr, setSubGroupNameErr] = useState("")   

    useEffect(() => {
        setGroupId(selectedGroupId || "")
        setGroupName(selectedGroupName || "")
    }, [selectedGroupId, selectedGroupName])

    const saveValidate = () => {
        let isValid = true;
        if (!subGroupName?.trim()) {
            setSubGroupNameErr("Plese enter subgroup name")
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveDetails();
        }
    }, [confirmSave])

    const saveDetails =async()=>{
        // const data = {
        //     "gnumSeatid": 11111,
        //     "cwhnumDistId": 555, // it will gen auto 
        //     "cwhstrDistName": distName,
        //     "cwhnumStateId": stateId,
        //     "cwhstrDistShortName": distName,
        //     "cwhstrUsername": "deo",
        //     "cwhnumLgdCode": 999
        // }
        // const response = await axios.post("http://10.226.17.20:8025/api/v1/districts", data)
        ToastAlert('District Added Successfully', 'success');
        setOpenPage('home');
        getData()
        reset();
        setConfirmSave(false);
    }

    const reset=()=>{
          setSubGroupName("");
    }

    return (
        <>
            <GlobalButtons onSave={saveValidate} onClear={reset} />
            <div className="row">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Group Name : </label>
                    <div className="col-sm-8 align-content-center">
                        <span className="form-control-plaintext">{groupName || "-"}</span>
                    </div>
                </div>

                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Subgroup name : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='subGroupName'
                            id='subGroupName'
                            value={subGroupName}
                            onChange={(e) => {
                                setSubGroupName(e.target.value),
                                    setSubGroupNameErr("")
                            }}
                            errorMessage={subGroupNameErr}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SubGroupMasterForm
