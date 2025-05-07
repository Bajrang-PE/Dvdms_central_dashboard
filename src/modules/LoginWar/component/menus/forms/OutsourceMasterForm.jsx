import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from '../../InputSelect'
import InputField from '../../InputField'
import GlobalButtons from '../GlobalButtons'
import { fetchPostData } from '../../../../../utils/ApiHooks'
import { ToastAlert } from '../../../utils/CommonFunction'

const OutsourceMasterForm = (props) => {
    const stateName = props.stateDtl;
    const facilityName = props.facilityDtl;
    const stateId = props.stId;
    const facilityTypeId = props.facilityId;

    const { openPage, setOpenPage, selectedOption, testTypeDrpData, getTestTypeDrpData, hospNameDrpData, getHospNameDrpData } = useContext(LoginContext)
    const [singleData, setSingleData] = useState([]);
    const [values, setValues] = useState({
        "hospId": "", "date": ""
    })
    const [errors, setErrors] = useState({
        "hospIdErr": "", "dateErr": ""
    })

    const [rows, setRows] = useState(
        [{ test: '', number: '', agency: '' }]
    );

    const addRow = () => {
        setRows([...rows, { test: '', number: '', agency: '' }]);
    };

    const removeRow = (index) => {
        if (rows.length === 1) return; // prevent removing last row
        setRows(rows.filter((_, i) => i !== index));
    };

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
    };

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
            setErrors({ ...errors, [errName]: "" })
        }
    }

    const getSingleData = (id) => {
        // fetchData(`api/v1/zones/${id}`).then(data => {
        //     if (data?.status ===1 ) {
        //         setSingleData([data?.data]);
        //     } else {
        //         ToastAlert('Error while fetching data!', 'error')
        //     }
        // })
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            getSingleData(selectedOption[0]?.cwhnumZoneId)
        }
    }, [selectedOption, openPage])

    useEffect(() => {
        if (openPage === 'add') {
            getTestTypeDrpData();
            getHospNameDrpData(stateId, facilityTypeId)
        }
    }, [openPage])

    useEffect(() => {
        if (singleData?.length > 0) {
            // setZoneName(singleData[0]?.cwhstrZoneName)
            // setRecordStatus(singleData[0]?.status)
        }
    }, [singleData])

    const handleSave = () => {
        const val = rows?.map(dt => ({
            "stateID": stateId,
            "hospitalID": values?.hospId,
            "facilityTypeID": facilityTypeId,
            "date": values?.date,
            "testID": dt.test,
            "agencyName": dt.agency,
            "testsConducted": dt.number
        }))
        fetchPostData('http://10.226.26.247:8025/api/v1/outsourceMaster/createNewTest', val).then(data => {
            if (data.status == 1) {
                ToastAlert('Data saved successfully', 'success');
                refresh();
            } else {
                ToastAlert('Error', 'error');
            }
        })

    }

    const refresh=()=>{
        setRows([]);
        setOpenPage("home")
    }


    return (

        <>


            <div className="row">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fixed-label required-label">State</label>
                    <div className="col-sm-8 align-content-center">
                        {stateName}
                    </div>
                </div>

                <div className="form-goup col-sm-6 row">
                    <label className="col-sm-4 col-form-label fixed-label required-label">Facility Type</label>
                    <div className="col-sm-8 align-content-center">
                        {facilityName}
                    </div>
                </div>

            </div>

            <div className="row">
                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fixed-label required-label">Hospital Name</label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="hospId"
                            name="hospId"
                            placeholder={"Select Value"}
                            options={hospNameDrpData}
                            onChange={handleValueChange}
                            value={values?.hospId}

                        />

                    </div>
                </div>

                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fixed-label required-label">Date</label>
                    <div className="col-sm-8 align-content-center">
                        <InputField
                            type="date"
                            id="date"
                            name="date"
                            onChange={handleValueChange}
                            value={values?.date}
                        />

                    </div>
                </div>

            </div>

            <div className='pt-3 w-100'>

                <table className="w-100 border border-gray-300">
                    <thead className="heading-text">
                        <tr className='text-center'>
                            <td>Test Name</td>
                            <td>Number of Tests</td>
                            <td>Agency Name</td>
                            <th>
                                <button className='btn cms-login-btn m-1 btn-sm ' onClick={addRow}>
                                    <i className="fa fa-plus me-1"></i>
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows?.map((row, index) => (
                            <tr className='text-center' key={index}>
                                <td>
                                    {/* <input type='text' className='w-100' 
                                    value={row?.test} 
                                    onChange={(e) => handleChange(index, "test", e.target.value)}>
                                    </input> */}

                                    <InputSelect
                                        id="test"
                                        name="test"
                                        className='w-100'
                                        placeholder={"Select Test Name"}
                                        options={testTypeDrpData}
                                        onChange={(e) => handleChange(index, "test", e.target.value)}
                                        value={row?.test}
                                    />

                                </td>
                                <td>
                                    <input type='number' className='w-100' value={row?.number} onChange={(e) => handleChange(index, "number", e.target.value)}></input>
                                </td>
                                <td>
                                    <input type='text' className='w-100' value={row?.agency}
                                        onChange={(e) => handleChange(index, "agency", e.target.value)}></input>
                                </td>
                                <td>
                                    <button className='btn cms-login-btn m-1 btn-sm' onClick={() => removeRow(index)}>
                                        <i className="fa fa-minus me-1"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <div>
                <GlobalButtons onSave={handleSave} onClear={null} />
            </div>
        </>

    )
}

export default OutsourceMasterForm