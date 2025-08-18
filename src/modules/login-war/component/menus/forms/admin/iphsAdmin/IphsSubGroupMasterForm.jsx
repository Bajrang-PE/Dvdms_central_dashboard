import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../../../InputSelect'
import InputField from '../../../../InputField'
import GlobalButtons from '../../../GlobalButtons'
import { fetchPatchData, fetchPostData } from '../../../../../../../utils/ApiHooks'
import { ToastAlert } from '../../../../../utils/CommonFunction'
import { LoginContext } from '../../../../../context/LoginContext'
import { getAuthUserData } from '../../../../../../../utils/CommonFunction'

const IphsSubGroupMasterForm = ({ setSearchInput, selectedGroupName, selectedGroupId, setGroupId, setRecord }) => {

    const [subGroupName, setSubGroupName] = useState("")
    const [subGroupNameErr, setSubGroupNameErr] = useState("")
    const [recordStatus, setRecordStatus] = useState("")
    const { confirmSave, setShowConfirmSave, openPage, setOpenPage, selectedOption, setSelectedOption, setConfirmSave } = useContext(LoginContext)

    const handleSave = () => {
        let isValid = true;
        if (!subGroupName.trim()) {
            setSubGroupNameErr("Subgroup name is required");
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }

    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === "modify") {
            setSubGroupName(selectedOption[0]?.cwhstrIphsSubgroupName)
        }

    }, [selectedOption, openPage])


    useEffect(() => {
        if (confirmSave) {
            saveData();
        }
    }, [confirmSave])

    const saveData = () => {

        if (openPage === "add") {
            const val = {
                "groupID": selectedGroupId,
                "subgroupName": subGroupName,
                "seatID": getAuthUserData('userSeatId') || 11111,
            }

            fetchPostData(`http://10.226.26.247:8025/api/v1/IphsSubGroupMaster/saveSubgroup`, val).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data saved successfully", "success");
                    refresh();
                } else {
                    ToastAlert(data?.message, "error");
                }
            })

        }

        if (openPage === "modify") {
            const val = {
                "subgroupName": subGroupName,
            }

            fetchPatchData(`http://10.226.26.247:8025/api/v1/IphsSubGroupMaster/modifySubgroup?subGroupID=${selectedOption[0].cwhnumIphsSubgroupID}`, val).then(data => {
                if (data?.status === 1) {
                    ToastAlert("Data updated successfully", "success");
                    setSelectedOption([]);
                    refresh();
                } else {
                    ToastAlert(data?.message, "error")
                }
            })
        }
    }

    const refresh = () => {
        setOpenPage("home");
        setGroupId("");
        setRecord("1");
        setConfirmSave(false);
        setSearchInput('');
    }

    return (
        <>
            <div>
                <GlobalButtons onSave={handleSave} onClear={null} />
            </div>

            <div className='row mt-2'>
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Group Name</label>
                    <div className="col-sm-8 align-content-center">
                        {selectedGroupName}
                    </div>
                </div>

                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Subgroup Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="text"
                            id="subGroupName"
                            name="subGroupName"
                            placeholder={"Enter iphs subgroup name"}
                            onChange={(e) => {
                                setSubGroupName(e.target.value);
                                setSubGroupNameErr("");
                            }}
                            value={subGroupName}
                            errorMessage={subGroupNameErr}
                        />

                    </div>
                </div>

            </div>

        </>
    )
}

export default IphsSubGroupMasterForm