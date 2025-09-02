import React, { useState, useEffect, useContext } from 'react'
import InputField from '../../../InputField'
import GlobalButtons from '../../GlobalButtons'
import { LoginContext } from '../../../../context/LoginContext'
import axios from 'axios'
import { ToastAlert } from '../../../../utils/CommonFunction'
import { getAuthUserData } from '../../../../../../utils/CommonFunction'

const SubGroupMasterForm = ({ selectedGroupName, selectedGroupId ,setValues, values, setSearchInput, getAllListData}) => {
    const { openPage, setOpenPage, selectedOption,setSelectedOption, getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext)
    const [subGroupName, setSubGroupName] = useState("")
    const [groupName, setGroupName] = useState("")
    const [groupId, setGroupId] = useState("")
    const [subGroupNameErr, setSubGroupNameErr] = useState("")   
    const [recordStatus, setRecordStatus] = useState("")   

    useEffect(() => {
        setGroupId(selectedGroupId || "")
        setGroupName(selectedGroupName || "")
    }, [selectedGroupId, selectedGroupName])

    const saveValidate = () => {
        let isValid = true;
        if (!subGroupName?.trim()) {
            setSubGroupNameErr("Please enter subgroup name")
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
    


     useEffect(() => {
            if (selectedOption?.length > 0 && openPage === 'modify') {     
                setRecordStatus((selectedOption[0]?.gnumIsValid).toString());
                setSubGroupName(selectedOption[0]?.cwhstrSubgroupName);
                setGroupId(selectedOption[0]?.cwhnumGroupId)
            }
    
        }, [selectedOption, openPage])


    const saveDetails =async()=>{

        if(openPage === "add"){
        const data = {
            "cwhnumGroupId": groupId,
            "cwhstrSubgroupName": subGroupName,
            "gnumSeatId": getAuthUserData('userSeatId') || "10001"
        }

        const response = await axios.post("/api/v1/subgroup", data)
        ToastAlert('Subgroup Added Successfully', 'success');
       }

       if(openPage === "modify"){
        const data = {
            "cwhnumSubgroupId":selectedOption[0].cwhnumSubgroupId,
            "cwhnumGroupId": groupId,
            "cwhstrSubgroupName": subGroupName,
            "gnumIsValid": recordStatus,
            "gnumSeatId": getAuthUserData('userSeatId') 
        }

        const response = await axios.put("/api/v1/subgroup", data) 
        ToastAlert('Subgroup updated Successfully', 'success');
        setSelectedOption([])
       }
        reset();
        setConfirmSave(false);
        setOpenPage('home');
        getAllListData("1","");
       
    }

    const reset=()=>{
          setSubGroupName("");
          setSearchInput('');
          setValues({ ...values, "recordStatus": "1","groupId":"" });
    }

    return (

        
        <>
            <GlobalButtons onSave={saveValidate} onClear={reset} />
            <div className="row">
              
                <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Group Name : </label>
                    <div className="col-sm-8 align-content-center">
                        <span className="form-control-plaintext">{groupName || "-"}</span>
                    </div>
                </div>

                <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
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

                { openPage === "modify" &&
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
                }
            </div>
            </>

   
    )
}

export default SubGroupMasterForm
