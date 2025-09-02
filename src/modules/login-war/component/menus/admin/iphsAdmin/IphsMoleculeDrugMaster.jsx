import React, { useContext, useEffect, useState } from 'react'
import { capitalizeFirstLetter, ToastAlert } from '../../../../utils/CommonFunction'
import { LoginContext } from '../../../../context/LoginContext';
import InputSelect from '../../../InputSelect';
import GlobalTable from '../../../GlobalTable';
import { fetchData, fetchDeleteData } from '../../../../../../utils/ApiHooks';
import IphsMoleculeDrugMasterForm from '../../forms/admin/iphsAdmin/IphsMoleculeDrugMasterForm';

const IphsMoleculeDrugMaster = () => {

  const { openPage, setOpenPage, selectedOption, setSelectedOption, confirmSave,
    setShowConfirmSave, setConfirmSave, iphsGroupDrpData, getIphsGroupDrpData, iphsSubGroupDrpData, getIphsSubGroupDrpData } = useContext(LoginContext);
  const [searchInput, setSearchInput] = useState('');
  const [listData, setListData] = useState([]);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
   const [filterData, setFilterData] = useState(listData);

  const [values, setValues] = useState({
    "groupId": "", "subGroupId": "", "record": "1"
  })

  const [errors, setErrors] = useState({
    "groupIdErr": "", "subGroupIdErr": ""
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
    getIphsGroupDrpData();
  }, [])

  useEffect(() => {
    if (!searchInput) {
      setFilterData(listData);
    } else {
      const lowercasedText = searchInput.toLowerCase();
      const newFilteredData = listData.filter(row => {
        const paramName = row?.drugName?.toLowerCase() || "";

        return paramName.includes(lowercasedText);
      });
      setFilterData(newFilteredData);
    }
  }, [searchInput, listData]);


  useEffect(() => {
    setValues(prev => ({ ...prev, "subGroupId": "" }))
    getIphsSubGroupDrpData(values?.groupId);
    if (values?.groupId) {
      getIphsSubGroupDrpData(values?.groupId);
      const selectedGrpName = iphsGroupDrpData.find((opt) => opt.value?.toString() === values?.groupId?.toString())?.label || "";
      const selectedGrpId = iphsGroupDrpData.find((opt) => opt.value?.toString() === values?.groupId?.toString())?.value || "";
      setSelectedGroupName(selectedGrpName)
      setSelectedGroupId(selectedGrpId)
    }
  }, [values?.groupId])

  useEffect(() => {
    setSelectedOption([])
    getListData();
  }, [values?.groupId, values?.subGroupId, values?.record])

  const getListData = () => {
    const val = {
      "groupID ": values?.groupId || 0,
      "subgroupID ": values?.subGroupId || 0,
      "isActive ": values?.record || 0
    }

    fetchData(`/api/v1/IphsMoleculeDrugMst/getMoleculeDrugs`, val).then(data => {
      if (data?.status === 1) {
        setListData(data.data)
      } else {
        setListData([])
      }
    })
  }

  const validate = () => {
    let isValid = true;
    if (!values?.groupId.trim()) {
      setErrors(prev => ({ ...prev, groupIdErr: "Please select IPHS group" }));
      setSelectedGroupName("")
      setSelectedGroupId("")
      isValid = false
    }
    return isValid;
  }

  const columns = [
    {
      name: (
        <input
          type="checkbox"
          checked={""}
          //onChange={(e) => handleSelectAll(e.target.checked)}
          disabled={listData.length === 0}
          className="form-check-input log-select"
        />
      ),
      cell: row => (
        <div style={{ position: 'absolute', top: 4, left: 10 }}>
          <input
            type="checkbox"
            checked={selectedOption[0]?.drugID === row.drugID}
            onChange={() => setSelectedOption([row])}
          />
        </div>
      ),
      width: "8%"
    },
    {
      name: 'IPHS Molecule Drug Name',
      selector: row => row.drugName,
      sortable: true,
    },
  ];

  const handleDeleteRecord = () => {
    if (selectedOption?.length > 0) {
      setOpenPage('delete');
      setShowConfirmSave(true);
    } else {
      ToastAlert("Please select a record", "warning");
    }
  }

  useEffect(() => {
    if (confirmSave && openPage === 'delete') {
      handleDelete();
    }
  }, [confirmSave])

  const handleDelete = () => {

    fetchDeleteData(`/api/v1/IphsMoleculeDrugMst/deleteMoleculeDrug?drugID=${selectedOption[0].drugID}&isActive=0`).then(data => {
      if (data?.status === 1) {
        ToastAlert("Data deleted successfully", "success")
        setSelectedOption([]);
        refresh();
      } else {
        ToastAlert('Error while deleting record!', 'error')
        setOpenPage("home")
      }

    })

  }

  const refresh = () => {
    setValues(prev => ({ ...prev, "groupId": "", "subGroupId": "", "record": "1" }))
    setOpenPage("home")
    setConfirmSave(false);
    getListData();
  }


  return (
    <>
      <div className='masters mx-3 my-2'>
        <div className='masters-header row'>
          <span className='col-6'><b>{`Iphs Molecule Drug Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
          {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
        </div>

        {(openPage === "home" || openPage === "delete") &&
          <>
            <div className='row mt-2'>
              <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Group</label>
                <div className="col-sm-8 align-content-center">
                  <InputSelect
                    id="groupId"
                    name="groupId"
                    placeholder={"Select Value"}
                    options={iphsGroupDrpData}
                    onChange={handleValueChange}
                    value={values?.groupId}
                    errorMessage={errors?.groupIdErr}
                  />

                </div>
              </div>

              <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fixed-label required-label">IPHS Subgroup</label>
                <div className="col-sm-8 align-content-center">
                  <InputSelect
                    id="subGroupId"
                    name="subGroupId"
                    placeholder={"Select Value"}
                    options={iphsSubGroupDrpData}
                    onChange={handleValueChange}
                    value={values?.subGroupId}
                  />
                </div>
              </div>

              <div className="form-group col-sm-4 row" style={{ paddingBottom: "1px" }}>
                <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                <div className="col-sm-8 align-content-center">
                  <InputSelect
                    id="record"
                    name="record"
                    placeholder={"Select Value"}
                    options={[{ label: "Active", value: "1" }, { label: "Inactive", value: "0" }]}
                    onChange={handleValueChange}
                    value={values?.record}
                  />
                </div>
              </div>

            </div>

            <hr className='my-2' />

            <div>
              <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null} onValidate={validate}
                onReport={null} setSearchInput={setSearchInput}  searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={false} isReport={true} setOpenPage={setOpenPage} />
            </div>
          </>
        }

        {(openPage === "add" || openPage === "modify") &&
          <IphsMoleculeDrugMasterForm selectedGroupName={selectedGroupName} selectedGroupId={selectedGroupId}
            valuesMain={values} setValuesMain={setValues} getListData={getListData} setSearchInput={setSearchInput}/>
        }

      </div>
    </>
  )
}

export default IphsMoleculeDrugMaster