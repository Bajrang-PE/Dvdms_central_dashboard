import React, { useContext, useEffect, useState } from 'react'
import InputField from '../../../../InputField';
import GlobalButtons from '../../../GlobalButtons';
import { LoginContext } from '../../../../../context/LoginContext';
import { ToastAlert } from '../../../../../utils/CommonFunction';
import { fetchPatchData, fetchPostData } from '../../../../../../../utils/ApiHooks';
import { getAuthUserData } from '../../../../../../../utils/CommonFunction';

const IphsGroupMasterForm = ({ setRecord, record, getListData, setSearchInput }) => {

    const [groupName, setGroupName] = useState("");
    const [groupNameErr, setGroupNameErr] = useState("");
    const [recordStatus, setRecordStatus] = useState("");
    const { confirmSave, setShowConfirmSave, openPage, setOpenPage, selectedOption,setSelectedOption, setConfirmSave } = useContext(LoginContext)


    const handleSave = () => {
        let isValid = true;
        if (!groupName.trim()) {
            setGroupNameErr("Group name is required")
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveData();
        }
    }, [confirmSave])

    const saveData = () => {

    if(openPage === "add"){
        const val ={
            "groupName":groupName,
            "gnumSeatid": getAuthUserData('userSeatId') || 11111
        }
        fetchPostData('http://10.226.26.247:8025/api/v1/IphsGroupMaster/addNewGroup',val).then(data=>{
            if(data.status == 1){
                ToastAlert("Data saved successfully", "success");
                refresh();    
            }else{
                ToastAlert("Error", "error");
            }
        })
    }

    if(openPage === "modify"){
        const val ={
            "groupName":groupName,
            "isValid":recordStatus,
            "gnumSeatid": getAuthUserData('userSeatId') || 11111
        }
        fetchPatchData(`http://10.226.26.247:8025/api/v1/IphsGroupMaster/modifyGroupStatus?groupID=${selectedOption[0].cwhnumIphsGroupID}`,val).then(data=>{
            if(data.status == 1){
                ToastAlert("Data updated successfully", "success");  
                setSelectedOption([]);
                refresh();             
            }else{
                ToastAlert("Error", "error");
            }
        })
    }
     
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            setGroupName(selectedOption[0].cwhstrIphsGroupName);
            setRecordStatus(record);  
        }

    }, [selectedOption, openPage])

    const refresh=()=>{
        setGroupName("");
        setOpenPage("home");
        setRecord("1");
        getListData(1);
        setConfirmSave(false);
        setSearchInput('');

    }

    const reset=()=>{
        setGroupName("");
    }

    return (
        <>
            <div>
                <GlobalButtons onSave={handleSave} onClear={reset} />
            </div>

            <div className='row mt-2'>
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fixed-label required-label">Group Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            id="groupName"
                            name="groupName"
                            onChange={(e) => {
                                setGroupName(e.target.value),
                                setGroupNameErr("")
                            }
                            }
                            value={groupName}
                            errorMessage={groupNameErr}
                        />
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


        </>
    )
}

export default IphsGroupMasterForm