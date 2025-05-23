import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext'
import InputSelect from '../../InputSelect'
import InputField from '../../InputField'
import GlobalButtons from '../GlobalButtons'
import { fetchData, fetchPatchData, fetchPostData, fetchUpdateData } from '../../../../../utils/ApiHooks'
import { ToastAlert } from '../../../utils/CommonFunction'

const OutsourceMasterForm = (props) => {
    const stateName = props.stateDtl;
    const facilityName = props.facilityDtl;
    const stateId = props.stId;
    const facilityTypeId = props.facilityId;

    const { openPage, setOpenPage, selectedOption, setSelectedOption, testTypeDrpData, getTestTypeDrpData, hospNameDrpData, getHospNameDrpData } = useContext(LoginContext)
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

        const hasIncompleteRow = rows.some(
            (row) => !row.test || !row.number || !row.agency
        );

        if (hasIncompleteRow) {
            alert('Please complete the existing row before adding a new one.');
            return;
        }

        const newRow = { test: '', number: '', agency: '' };
        const updatedRows = [...rows, newRow];
        const isDuplicateExists = updatedRows.some((row, index, self) =>
            self.findIndex(
                (r) =>
                    r.test === row.test &&
                    //r.number === row.number &&
                    r.agency.trim().toLowerCase() === row.agency.trim().toLowerCase()
            ) !== index
        );
        if (isDuplicateExists) {
            alert('Duplicate row detected.Please remove duplicate row');
            return;
        }
        setRows(updatedRows);
        
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
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const getSingleData = (id) => {
        fetchData(`http://10.226.26.247:8025/api/v1/outsourceMaster/getTestdetails?recordID=${id}`).then(data => {
            if (data?.status === 1) {
                setSingleData(data?.data);
            } else {
                ToastAlert('Error while fetching data!', 'error')
            }
        })
    }

    useEffect(() => {
        if (selectedOption?.length > 0 && openPage === 'modify') {
            getTestTypeDrpData();
            getSingleData(selectedOption[0]?.recordID)
        }
    }, [selectedOption, openPage])

    useEffect(() => {
        if (singleData?.length > 0) {
            const formattedData = singleData.map(item => ({
                test: item.cwhnumTestId,
                number: item.cwhnumTestRaised,
                agency: item.cwhstrAgencyName,
            }));
            setRows(formattedData);      
        }
    }, [singleData])

    useEffect(() => {
        if (openPage === 'add') {
            getTestTypeDrpData();
            getHospNameDrpData(stateId, facilityTypeId)
        }
    }, [openPage])


    const handleSave = (e) => {
      
        e.preventDefault();

        const hasIncompleteRow = rows.some(
            (row) => !row.test || !row.number || !row.agency
        );

        if (hasIncompleteRow) {
            alert('Please fill all fields.');
            return;
        }

        const newRow = { test: '', number: '', agency: '' };
        const updatedRows = [...rows, newRow];

        const isDuplicateExists = updatedRows.some((row, index, self) =>
            self.findIndex(
                (r) =>
                    r.test === row.test &&
                    //r.number === row.number &&
                    r.agency.trim().toLowerCase() === row.agency.trim().toLowerCase()
            ) !== index
        );
        if (isDuplicateExists) {
            alert('Duplicate row detected.Please remove duplicate row');
            return;
        }

    
        if (openPage === "add") {
            const val = rows?.map(dt => ({
                "stateID": Number(stateId),
                "hospitalID": Number(values?.hospId),
                "facilityTypeID": Number(facilityTypeId),
                "testID": Number(dt.test),
                "testsConducted": Number(dt.number),
                "agencyName": dt.agency,
                "date": values?.date
            }))

            fetch('http://10.226.26.247:8025/api/v1/outsourceMaster/createNewTest', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(val)
            }).then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            }).then(data => {
                console.log("Success:", data);
                ToastAlert('Data saved successfully', 'success');
                setOpenPage("home")
                refresh();
            }).catch(error => {
                console.error("Error:", error);
            });
        }

        //modify
        if (openPage === "modify") {

            const val = rows?.map(dt => ({           
                "stateID": Number(stateId),
                "hospitalID": Number(values?.hospId),
                "facilityTypeID": Number(facilityTypeId),
                "date": selectedOption[0].date,
                "testID": Number(dt.test),
                "agencyName": dt.agency,
                "testsConducted": Number(dt.number),
                "isValid": 1
            }))

            console.log("================================")
            console.log(JSON.stringify(val,null,2))

            fetchUpdateData(`http://10.226.26.247:8025/api/v1/outsourceMaster/updateTestData?recordID=${selectedOption[0].recordID}`,val).then(data=>{
                if(data?.status === 1){
                    ToastAlert("Data updated successfully","success")
                    setOpenPage("home")
                    refresh();
                }else{
                    ToastAlert("Error","error")
                }
               })

        }
        
    }

    const refresh = () => {
        setRows([{ test: '', number: '', agency: '' }]);
        setValues({ ...values, "hospId": "", "date": "" });
        setSelectedOption([]);
        //setOpenPage("home");
    }

    useEffect(() => {
        if (openPage === "add") {
            if (values?.hospId && values?.date) {
                const val = {
                    "stateID": stateId,
                    "storeID": values?.hospId,
                    "date": values?.date,
                }
                fetchData(`http://10.226.26.247:8025/api/v1/outsourceMaster/checkIfAlreadyPresent`, val).then(data => {
                    if (data.status == 1) {
                        ToastAlert("An entry already exists for the selected date with the same hospital name. Please modify the existing entry.", "warning");
                        setValues(prev => ({ ...prev, date: "" }))
                    }
                })
            }
        }
    }, [values?.hospId, values?.date])

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
                    {openPage === "add" &&
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
                    }
                    {openPage === "modify" &&
                        <div className="col-sm-8 align-content-center">
                            {selectedOption[0].storeName}
                        </div>
                    }
                </div>

                <div className="form-group col-sm-6 row">
                    <label className="col-sm-4 col-form-label fixed-label required-label">Date</label>
                    {openPage === "add" &&
                        <div className="col-sm-8 align-content-center">
                            <InputField
                                type="date"
                                id="date"
                                name="date"
                                onChange={handleValueChange}
                                value={values?.date}
                            />

                        </div>
                    }
                    {openPage === "modify" &&
                        <div className="col-sm-8 align-content-center">
                            {selectedOption[0].date.slice(0, 10)}
                        </div>
                    }
                </div>

            </div>
            <hr className='my-2' />

            {(openPage === "add" || openPage === "modify") &&
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
                                            onChange={(e) => handleChange(index, "agency", e.target.value)}
                                        ></input>
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
            }

            <div>
                <GlobalButtons onSave={handleSave} onClear={refresh} />
            </div>
        </>

    )
}

export default OutsourceMasterForm