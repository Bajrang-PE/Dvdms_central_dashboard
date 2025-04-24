import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from '../../InputSelect'
import GlobalTable from '../../GlobalTable'
import SubGroupMasterForm from '../forms/admin/SubGroupMasterForm'

const SubGroupMaster = () => {
    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [selectedGroupName, setSelectedGroupName] = useState("");
    const [selectedGroupId, setSelectedGroupId] = useState("");
    const { getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext)
    const [listData,setListData]=useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [values,setValues] = useState({
        "groupId":"","recordStatus":"1"
    })

    const [errors, setErrors] = useState({
        groupIdErr: ""
    })

    useEffect(()=>{
        if (stateNameDrpDt.length === 0) {
            getSteteNameDrpData();
        }
    },[])

    useEffect(()=>{
        getListData(values?.recordStatus,values?.groupId);
    },[values?.recordStatus,values?.groupId])

    useEffect(()=>{
       if(openPage === "add"){
        validate()
       }
    },[openPage])

    const getListData = async (recStatus, groupId) => {
        // try {
        //     const response = await axios.get(`http://10.226.17.20:8025/api/v1/districts/all?isActive=${recStatus}&stateId=${state ? state : 0}`);

        //     if (response.data && response.data.status === 1 && Array.isArray(response.data.data)) {
        //         setListData(response.data.data);
        //     } else {
        //         setListData([]); 
        //     }
        // } catch (error) {
        //     setListData([]); 
        // }
    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name === "groupId") {
            console.log("======gId===",name)
            const selectOption = stateNameDrpDt.find(opt => String(opt.value) === String(value));
            setSelectedGroupName(selectOption?.label || "");
            setSelectedGroupId(selectOption?.value || "")
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
            name: 'Subgroup Name',
            selector: row => row.cwhstrDistName,
            sortable: true,
        },
    ];

    const validate =()=>{
        
        if (!values?.groupId.trim()) {
            setErrors(prev => ({ ...prev, groupIdErr: "Please select value" }));
            setOpenPage("home")
        }
    }

    
    return (
        <div className="masters mx-3 my-2">

            { openPage === "home" &&
            <>
            <div className='text-left w-100 fw-bold p-1 heading-text' >Sub Group Master</div>

            <div className="row">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Group </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='groupId'
                            id='groupId'
                            placeholder={"Select Value"}
                            options={stateNameDrpDt}
                            value={values?.groupId}
                            onChange={handleValueChange}
                            errorMessage={errors?.groupIdErr}

                        />
                    </div>

                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Record Status : </label>
                    <div className="col-sm-8 align-content-center">
                    <InputSelect
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='recordStatus'
                            id='recordStatus'
                            options={[{ label: "Active", value: "1" },{label:"Inactive",value:"0"}]}
                            value={values?.recordStatus}
                            onChange={handleValueChange}

                        />
                    </div>
                </div>

                <div>
                <GlobalTable column={columns} data={listData} onAdd={null} onModify={null} onDelete={null} View={null}
                            onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </div>

            </div>
            </>}

            { openPage === "add" && selectedGroupName &&
            <>
                <div className='text-left w-100 fw-bold p-1 heading-text' >Sub Group Master</div>     
                <SubGroupMasterForm selectedGroupName={selectedGroupName} selectedGroupId={selectedGroupId} getData={getListData}/>
            </>
            }
        </div>
    )
}

export default SubGroupMaster