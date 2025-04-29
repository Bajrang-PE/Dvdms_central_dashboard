import React, { useContext, useEffect, useState } from 'react'
import InputSelect from '../../InputSelect'
import { LoginContext } from '../../../context/LoginContext'
import GlobalTable from '../../GlobalTable'
import { fetchData } from '../../../../../utils/ApiHooks'
import OutsourceMasterForm from '../forms/OutsourceMasterForm'

const OutsourceMaster = () => {

    const [values,setValues]=useState({
        "stateId":"","facilityTypeId":"","date":"","recordStatus":"1"
    })

    const{getSteteNameDrpData,stateNameDrpDt,openPage,setOpenPage,selectedOption,setSelectedOption,getFacilityTypeDrpData,facilityTypeDrpDt}=useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const[listData,setListData]=useState([]);
     const [selectAll, setSelectAll] = useState(false);

    useEffect(()=>{
        getSteteNameDrpData()
        getFacilityTypeDrpData()
    },[])

    useEffect(()=>{
        getListData();
    },[values?.stateId,values?.facilityTypeId,values?.date,values?.recordStatus])

    const getListData=()=>{
        //alert("fetching data")
        //fetchData("");
    }


    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        // if (name === "stateId") {
        //     const selectedOption = stateNameDrpDt.find(opt => opt.value.toString() === value.toString());
        //     const selectedStateLabel = selectedOption?.label || "";
        //     console.log("Selected Option: ", selectedOption);
        //     setSelectedStateName(selectedStateLabel);
        // }

        if (name) {
            setValues({ ...values, [name]: value });
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
            { (openPage === "home" || openPage === "view" || openPage === "delete") &&
                <>
                <div className='text-left w-100 fw-bold p-1 heading-text' >Outsource Master</div>

                <div className="row">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">State</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                name='stateId'
                                id='stateId'
                                placeholder={"Select Value"}
                                options={stateNameDrpDt}
                                value={values?.stateId}
                                onChange={handleValueChange}

                            />

                        </div>
                    </div>

                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Facility Type</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                name='facilityTypeId'
                                id='facilityTypeId'
                                placeholder={"Select Value"}
                                options={facilityTypeDrpDt}
                                value={values?.facilityTypeId}
                                onChange={handleValueChange}

                            />

                        </div>

                    </div>
                </div>

                <div className="row">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Date</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                name='date'
                                id='date'
                                placeholder={"Select Value"}
                                options={[{ label: "India", value: "101" }]}
                                value={values?.date}
                                onChange={handleValueChange}

                            />

                        </div>

                    </div>

                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect
                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
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

                <div>
                        <GlobalTable column={columns} data={listData} onAdd={null} onModify={null} onDelete={null} View={null}
                            onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />
                </div>
                </>
                }

                { (openPage === "add" || openPage === "modify") &&
                  <OutsourceMasterForm />
                }

            </div>
        </>
    )
}

export default OutsourceMaster