import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext'
import GlobalTable from '../../GlobalTable'
import { fetchData } from '../../../../../utils/ApiHooks'
import OutsourceMasterForm from '../forms/OutsourceMasterForm'
import { capitalizeFirstLetter } from '../../../utils/CommonFunction'

const OutsourceMaster = () => {

    
    const [values,setValues]=useState({
        "stateId":"","facilityTypeId":"","date":"","recordStatus":"1"
    })

    const [errors,setErrors]=useState({
        "stateIdErr":"","facilityTypeIdErr":"","dateErr":""
    })

    const{getSteteNameDrpData,stateNameDrpDt,openPage,setOpenPage,selectedOption,setSelectedOption,getFacilityTypeDrpData,facilityTypeDrpDt,getDateDrpData,dateDrpDt}=useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [listData,setListData]=useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedState,setSelectedState] = useState("")
    const [selectedFacility,setSelectedFacility] = useState("")

    useEffect(() => {
        if (openPage === "add") {
            validate()
        }
    }, [openPage])

    const validate = () => {
        if (!values?.stateId.trim()) {
            setErrors(prev => ({ ...prev, stateIdErr: "Please select state" }));
            setOpenPage("home")
        }
        if (!values?.facilityTypeId.trim()) {
            setErrors(prev => ({ ...prev, facilityTypeIdErr: "Please select facility type" }));
            setOpenPage("home")
        }
    }

    useEffect(()=>{
        getSteteNameDrpData()
        getFacilityTypeDrpData()
        getDateDrpData()
    },[])

    useEffect(()=>{
        getListData();
    },[values?.stateId,values?.facilityTypeId,values?.date,values?.recordStatus])

    const getListData=()=>{

         const val = {
            "stateID": values?.stateId,
            "facilityTypeID": values?.facilityTypeId,
            "isValid": values?.recordStatus,
            "date": values?.date.toString()
          }

      fetchData('http://10.226.26.247:8025/api/v1/outsourceMaster/getOutsourceMappingDetails',val).then(data =>{
        if(data.status == 1){
           setListData(data)
        }else{
            setListData([])
        }
      })
    }

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "stateId") {
            const selectedOption = stateNameDrpDt.find(opt => opt.value.toString() === value.toString());
            const selectedStateLabel = selectedOption?.label || "";
            setSelectedState(selectedStateLabel);
        }
        if (name === "facilityTypeId") {
            const selectedOption = facilityTypeDrpDt.find(opt => opt.value.toString() === value.toString());
            const selectedFacilityLabel = selectedOption?.label || "";
            setSelectedFacility(selectedFacilityLabel);
        }

        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const columns = [
        {
            name: (
                <input
                    type="checkbox"    
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={listData.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.cwhnumDistId === row.cwhnumDistId}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Store Name',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
        {
            name: 'State',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
        {
            name: 'Number of Tests',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
    ];

    return (
        <>
            <div className="masters mx-3 my-2">

            <div className='masters-header row'>
                <span className='col-6'><b>{`Outsource Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
            </div>

            { (openPage === "home" || openPage === "view" || openPage === "delete") &&
                <>
                <div className="row">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">State</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg border-dark-subtle"
                                name='stateId'
                                id='stateId'
                                placeholder={"Select Value"}
                                options={stateNameDrpDt}
                                value={values?.stateId}
                                onChange={handleValueChange}
                                errorMessage={errors?.stateIdErr}

                            />

                        </div>
                    </div>

                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Facility Type</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg border-dark-subtle"
                                name='facilityTypeId'
                                id='facilityTypeId'
                                placeholder={"Select Value"}
                                options={facilityTypeDrpDt}
                                value={values?.facilityTypeId}
                                onChange={handleValueChange}
                                errorMessage={errors?.facilityTypeIdErr}

                            />

                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Date</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg border-dark-subtle"
                                name='date'
                                id='date'
                                placeholder={"Select Value"}
                                options={dateDrpDt}
                                value={values?.date}
                                onChange={handleValueChange}
                                errorMessage={errors?.dateErr}

                            />

                        </div>

                    </div>

                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg border-dark-subtle"
                                name='recordStatus'
                                id='recordStatus'
                                options={[{ label: "Active", value: "1" },
                                    { label: "Inactive", value: "0" }
                                ]}
                               value={values?.recordStatus}
                               onChange={handleValueChange}

                            />

                        </div>

                    </div>
                </div>

                <hr className='my-2' />

                <div>
                        <GlobalTable column={columns} data={listData} onAdd={null} onModify={null} onDelete={null} View={null}
                            onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </div>
                </>
                }

                { (openPage === "add" || openPage === "modify") &&
                  <OutsourceMasterForm stateDtl={selectedState} facilityDtl={selectedFacility} 
                  stId={values?.stateId} facilityId= {values?.facilityTypeId}
                  />
                }

            </div>
        </>
    )
}

export default OutsourceMaster