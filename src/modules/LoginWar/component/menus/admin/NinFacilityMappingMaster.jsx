import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext';
import { fetchData } from '../../../utils/ApiHooks';

const NinFacilityMappingMaster = () => {

    const [suppId,setSuppId] = useState("");
    const [stateId,setStateId] =useState("");
    const [recStatus,setRecStatus] =useState("0");
    const [districtId,setDistrictId] =useState("");
    const [facilityTypeId,setFacilityTypeId] =useState("");
    const [facilityTypeDrpDt ,setFacilityTypeDrpDt] = useState([]);

    const { openPage, setOpenPage, getSteteNameDrpData, stateNameDrpDt, getDrpData, supplierNameDrpDt,getDistrictNameDrpData,districtNameDrpDt } = useContext(LoginContext);

    useEffect(()=>{
        if (stateNameDrpDt?.length === 0){getSteteNameDrpData()};
        getFacilityTypeDrpData();
    },[])

    useEffect(()=>{
        if(stateId){
        getDistrictNameDrpData(stateId);}

    },[stateId])

    const getFacilityTypeDrpData=()=>{
         fetchData('/state/getstate').then((data) => {
                    if (data) {
        
                        const drpData = data?.map((dt) => {
                            const val = {
                                value: dt?.cwhnumStateId,
                                label: dt?.cwhstrStateName
                            }
        
                            return val;
                        })
        
                        setFacilityTypeDrpDt(drpData)
        
                    } else {
                        setFacilityTypeDrpDt([])
                    }
                })
    }


    const handleSave=()=>{
       alert("Handle save called")
   }

  return (
    
    <div className="masters mx-3 my-2">
             <div className='text-left w-100 fw-bold p-1 heading-text'>Nin Facility Mapping Master</div>

             <div className="row mt-2">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">State Name :</label>
                    <div className="col-sm-8">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateId'
                            id='stateId'
                            placeholder="Select value"
                            options={stateNameDrpDt}
                            onChange={(e) => setStateId(e.target.value)}
                            value={stateId}
                        />
                    </div>
                </div>

                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">District Name :</label>
                    <div className="col-sm-8">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='districtId'
                            id='districtId'
                            placeholder="Select value"
                            options={districtNameDrpDt}
                            onChange={(e) => setDistrictId(e.target.value)}
                            value={districtId}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">Facility Type</label>
                    <div className="col-sm-8">
                        <InputSelect
                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                        id='facilityTypeId'
                        name='facilityTypeId'
                        placeholder="All"
                        options={facilityTypeDrpDt}
                        onChange={(e)=>setFacilityTypeId(e.target.value)}
                        value={facilityTypeId}
                        />

                    </div>

                </div>

                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fix-label required-label">Status </label>
                    <div className="col-sm-8">
                    <InputSelect
                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                        id='recStatus'
                        name='recStatus'
                        options={[{label:"Mapped",value:"1"},{label:"Unmapped",value:"0"}]}
                        onChange={(e)=>setRecStatus(e.target.value)}
                        value={recStatus}
                        />
                    </div>
                </div>

            </div>

            <div className="row mt-2 ">
                <div className="col-sm-6 d-flex flex-column align-items-center">
                <label className="col-sm-4 col-form-label fix-label required-label text-center">State Facility Name  </label>
                   <div className="col-sm-6">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateId'
                            id='stateId'
                            placeholder="Select value"
                            options={stateNameDrpDt}
                            onChange={(e) => setStateId(e.target.value)}
                            value={stateId}
                        />
                    </div>

                </div>

                <div className="col-sm-6 d-flex flex-column align-items-center">
                <label className="col-sm-4 col-form-label fix-label required-label text-center">NIN Facility Name </label>
                <div className="col-sm-6">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateId'
                            id='stateId'
                            placeholder="Select value"
                            options={stateNameDrpDt}
                            onChange={(e) => setStateId(e.target.value)}
                            value={stateId}
                        />
                    </div>
                    
                </div>

            </div>

            <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
            </div>

            <div className='text-center'>
                <button className='btn btn-sm new-btn-blue py-0' onClick={handleSave} >
                    <i className="fa fa-save me-1"></i>
                    Map</button>
                <button className='btn btn-sm new-btn-blue py-0' >  <i className="fa fa-broom me-1"></i>Clear</button>
            </div>

    </div>
  )
}

export default NinFacilityMappingMaster