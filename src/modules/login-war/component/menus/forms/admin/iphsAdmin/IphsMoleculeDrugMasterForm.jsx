import React, { useContext, useEffect, useState } from 'react'
import GlobalButtons from '../../../GlobalButtons'
import InputField from '../../../../InputField'
import InputSelect from '../../../../InputSelect'
import { LoginContext } from '../../../../../context/LoginContext'
import { ToastAlert } from '../../../../../utils/CommonFunction'
import { fetchPostData, fetchUpdateData } from '../../../../../../../utils/ApiHooks'

const IphsMoleculeDrugMasterForm = ({ selectedGroupName, selectedGroupId, getListData, valuesMain, setValuesMain,setSearchInput}) => {

  const { iphsSubGroupDrpData, getIphsSubGroupDrpData, openPage, setOpenPage, setConfirmSave, confirmSave, setShowConfirmSave, selectedOption, setSelectedOption } = useContext(LoginContext);
  const [values, setValues] = useState({
    "molDrugName": "", "subGroupId": ""
  })

  const [errors, setErrors] = useState({
    "molDrugNameErr": "", "subGroupIdErr": ""
  })

  useEffect(() => {
    getIphsSubGroupDrpData(selectedGroupId);
  }, [openPage])

  const handelValueChange = (e) => {
    const { value, name } = e.target;
    const errName = name + "Err";
    if (name) {
      setValues({ ...values, [name]: value });
      setErrors({ ...errors, [errName]: "" });
    }
  }

  useEffect(() => {
    if (selectedOption?.length > 0 && openPage === 'modify') {
      setValues(prev => ({ ...prev, subGroupId: selectedOption[0]?.subgroupID }))
      setValues(prev => ({ ...prev, molDrugName: selectedOption[0]?.drugName }))
    }

  }, [selectedOption, openPage])

  const handleSave = () => {

    let isValid = true;
    if (!String(values?.subGroupId).trim()) {
      setErrors(prev => ({ ...prev, subGroupIdErr: "Please select iphhs subgroup name" }))
      isValid = false;
    }
    if (!values?.molDrugName.trim()) {
      setErrors(prev => ({ ...prev, molDrugNameErr: "Please enter iphs molecule drug name" }))
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
    if (openPage === "add") {
      const val = {
        //"drugID": 0,
        "drugName": values?.molDrugName,
        "groupID": selectedGroupId,
        "subgroupID": values?.subGroupId
      }
      fetchPostData("http://10.226.26.247:8025/api/v1/IphsMoleculeDrugMst/createMoleculeDrug", val).then(data => {
        if (data?.status === 1) {
          ToastAlert("Data saved successfully", "success")
          refresh();

        } else {
          ToastAlert("Error", "error")
        }
      })
    }
    else if (openPage === "modify") {
      const val = {
        "drugID": selectedOption[0]?.drugID,
        "drugName": values?.molDrugName,
        "groupID": selectedGroupId,
        "subgroupID": values?.subGroupId
      }
      fetchUpdateData(`http://10.226.26.247:8025/api/v1/IphsMoleculeDrugMst/modifyMoleculeDrug?drugID=${selectedOption[0]?.drugID}`, val).then(data => {
        if (data?.status === 1) {
          ToastAlert("Data updated successfully", "success")
          setSelectedOption([])
          refresh();
        } else {
          ToastAlert("Error", "error")
        }
      })

    }
  }

  const refresh = () => {
    setValuesMain(prev => ({ ...prev, "groupId": "","subGroupId": "", "record": "1" }))
    setOpenPage("home")
    setConfirmSave(false);
    getListData();
    setSearchInput('');
  }

  const reset = () => {
    setValues(prev => ({ ...prev, "molDrugName": "", "subGroupId": "" }))
  }

  return (
    <>
      <GlobalButtons onSave={handleSave} onClear={reset} />
      <hr className='my-2' />

      <div className='row mt-2'>
        <div className="col-sm-4 row">
          <label className="col-sm-6 col-form-label fixed-label required-label">IPHS Group Name : </label>
          <div className="col-sm-6">
            {selectedGroupName}
          </div>
        </div>

        <div className="col-sm-4 row">
          <label className="col-sm-6 col-form-label fixed-label required-label">IPHS Subgroup Name</label>
          <div className="col-sm-6">
            <InputSelect
              id="subGroupId"
              name="subGroupId"
              placeholder={"Select Value"}
              options={iphsSubGroupDrpData}
              onChange={handelValueChange}
              value={values?.subGroupId}
              errorMessage={errors?.subGroupIdErr}
            />
          </div>
        </div>

        <div className="col-sm-4 row">
          <label className="col-sm-6 col-form-label fixed-label required-label"> IPHS Molecule Drug Name 	</label>
          <div className="col-sm-6">
            <InputField
              type="text"
              id="molDrugName"
              name="molDrugName"
              onChange={handelValueChange}
              value={values?.molDrugName}
              errorMessage={errors?.molDrugNameErr}
            />

          </div>
        </div>

      </div>
    </>
  )
}

export default IphsMoleculeDrugMasterForm