import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../../dashboard/DashHeader'
import InputSelect from "../../InputSelect";
import { fetchData, fetchUpdateData } from "../../../utils/ApiHooks";
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext';

const StateConfigCwh = () => {
    const { getSteteNameDrpData, stateNameDrpDt } = useContext(LoginContext)

    const [centServerDrpDt, setCentServerDrpDt] = useState([]);
    const [jobForTestingDrpDt, setJobForTestingDrpDt] = useState([]);
    const [configData, setConfigData] = useState([]);

    const [errors, setErrors] = useState({
    })


    const [values, setValues] = useState({
        "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
        "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
        "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "", "isDbCredAvl": "", "stateDatabase": "", "jobForTesting": "",
        "jobId":"","jobName":"",
    });


    useEffect(() => {
        if (stateNameDrpDt?.length === 0) {
            getSteteNameDrpData();
        }
    }, [])


    useEffect(() => {
        if (values?.strStateId) {
            fetchDataByState(values?.strStateId);
        }
    }, [values?.strStateId]);

    
    useEffect(() => {
        if (values?.insertMethodOnCentralServer == "3" && values?.strStateId) {
            getJobDrpData(values?.strStateId);
            console.log('first')
        }
    }, [values?.strStateId,values?.insertMethodOnCentralServer]);

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    const fetchDataByState = async (stateId) => {
        try {
           
            fetchData(`/state/getStateConfig/${stateId}`).then((data) => {

              
                if (data) {
                    
                    setValues({
                        ...values,
                        strStateId: data?.cwhnumStateId,
                        stateServiceUrl: data?.cwhstrStateUrl,
                        centServiceUrl: data?.cwhstrCentralserverurl,
                        stateServiceUserName: data?.cwhstrStateserviceusername,
                        stateServicePass: data?.cwhstrStateservicepassword,
                        serviceConnTimeout: data?.cwhnumServiceconnecttimeout,
                        dataFetchSize: data?.cwhnumBatchsize,
                        dbDrivClass: data?.cwhstrDatabasedriverclassname,
                        dbUrl: data?.cwhstrDatabaseurl,
                        dbUserName: data?.cwhstrDatabaseusername,
                        dbPass: data?.cwhstrDatabasepassword,
                        stateDatabase: data?.cwhstrDatabaseName,
                        isDbCredAvl: data?.cwhnumIsdbcedentialavailable,
                        insertMethodOnCentralServer: data?.numIsDataInsertByEtlWar

                    })

                } 

            })

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const getJobDrpData = async(stateId) => {
        fetchData(`/state/getjob/${stateId}`).then((data) => {
            
            if (data) {
               
                const drpData = data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumJobId,
                        label: dt?.cwhstrJobName
                    }
                    return val;
                })
    
                setJobForTestingDrpDt(drpData)

            } else {
                setJobForTestingDrpDt([])
            }
        })
    }

    const saveDetail = async (e) => {
        e.preventDefault(); // prevent form from refreshing the page
    
      
        const data = {
            cwhnumStateId: values?.strStateId,
            cwhstrStateUrl: values?.stateServiceUrl,
            cwhnumThreadpoolSize: values?.dataFetchSize,
            cwhstrDatabaseName: values?.dbName,
            numIsDataInsertByEtlWar: values?.insertMethodOnCentralServer,
            cwhnumServiceconnecttimeout: values?.serviceConnTimeout,
            cwhnumBatchsize: values?.dataFetchSize,
            cwhstrCentralserverurl: values?.centServiceUrl,
            cwhstrStateserviceusername: values?.stateServiceUserName,
            cwhstrStateservicepassword: values?.stateServicePass,
            cwhnumIsdbcedentialavailable: values?.isDbCredAvl,
            cwhstrDatabasedriverclassname: values?.dbDrivClass,
            cwhstrDatabaseurl: values?.dbUrl,
            cwhstrDatabaseusername: values?.dbUserName,
            cwhstrDatabasepassword: values?.dbPass
          };
    
            const response = await fetchUpdateData("/state/updateStateConfig", data);  
            alert("Data Saved")
            console.log("===aftersave=="+response)
            reset();
        
    }
    

    const reset = () => {

        setValues({
            "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
            "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
            "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "",
        });
    }

    return (
        <div>
            <div className='text-left w-100 fw-bold p-1 heading-text' >State Configuration Master</div>

            <div className="row mt-3">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label">State Name : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="strStateId"
                            name="strStateId"
                            placeholder="Select Value"
                            options={stateNameDrpDt}
                            className="aliceblue-bg border-dark-subtle"
                            value={values?.strStateId}
                            onChange={handleValueChange}
                        />
                        {errors.strStateIdErr &&
                            <div className="required-input">
                                {errors?.strStateIdErr}
                            </div>
                        }
                    </div>
                </div>
            </div>

            {values?.strStateId !=="" &&
            <div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label">Insert Method On Central Server : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="insertMethodOnCentralServer"
                            name="insertMethodOnCentralServer"
                            options={[
                                { label: "Inside ETL War", value: "1" },
                                { label: "By Web service without data in Map", value: "0" },
                                { label: "By Web service with data in Map", value: "2" },
                                { label: "By Web service Provided By State", value: "3" }
                            ]}
                            className="aliceblue-bg border-dark-subtle"
                            value={values?.insertMethodOnCentralServer}
                            onChange={handleValueChange}
                        />
                        {errors.insertMethodOnCentralServerErr &&
                            <div className="required-input">
                                {errors?.insertMethodOnCentralServerErr}
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> State Service URL : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateServiceUrl'
                            id='stateServiceUrl'
                            onChange={handleValueChange}
                            value={values?.stateServiceUrl}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Central Service URL : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='centServiceUrl'
                            id='centServiceUrl'
                            onChange={handleValueChange}
                            value={values?.centServiceUrl}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label"> State Service UserName : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateServiceUserName'
                            id='stateServiceUserName'
                            onChange={handleValueChange}
                            value={values?.stateServiceUserName}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label">State Service Password : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='stateServicePass'
                            id='stateServicePass'
                            onChange={handleValueChange}
                            value={values?.stateServicePass}
                        />
                    </div>
                </div>
            </div>


            <div className="row mt-1">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Service Connect Timeout (in min.) : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='serviceConnTimeout'
                            id='serviceConnTimeout'
                            onChange={handleValueChange}
                            value={values?.serviceConnTimeout}
                        />
                    </div>
                </div>


                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label"> Data Fetch Size : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            name='dataFetchSize'
                            id='dataFetchSize'
                            onChange={handleValueChange}
                            value={values?.dataFetchSize}
                        />
                    </div>
                </div>
            </div>
            {values?.insertMethodOnCentralServer != "3" &&  // for 3rd Condition
                <div>
                    <div className="row mt-1">
                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label required-label">State Database : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    id="stateDatabase"
                                    name="stateDatabase"
                                    options={[
                                        { label: "Select Value", value: "0" },
                                        { label: "EDB", value: "EDB" },
                                        { label: "Oracle", value: "ORACLE" }
                                    ]}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={values?.stateDatabase}
                                    onChange={handleValueChange}
                                />
                                {errors.strStateIdErr &&
                                    <div className="required-input">
                                        {errors?.strStateIdErr}
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Is Database Credential Available : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputSelect
                                    id="isDbCredAvl"
                                    name="isDbCredAvl"
                                    options={[
                                        { label: "Yes", value: "1" },
                                        { label: "No", value: "0" }
                                    ]}
                                    className="aliceblue-bg border-dark-subtle"
                                    value={values?.isDbCredAvl}
                                    onChange={handleValueChange}
                                />
                                {errors.strStateIdErr &&
                                    <div className="required-input">
                                        {errors?.isDbCredAvlErr}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    {values?.isDbCredAvl == 1 &&
                        <div className="row mt-1">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Database Driver Class : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='dbDrivClass'
                                        id='dbDrivClass'
                                        onChange={handleValueChange}
                                        value={values?.dbDrivClass}
                                    />
                                </div>
                            </div>


                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label">  Database URL : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='dbUrl'
                                        id='dbUrl'
                                        onChange={handleValueChange}
                                        value={values?.dbUrl}
                                    />
                                </div>
                            </div>
                        </div>
                    }

                    {values?.isDbCredAvl == 1 &&
                        <div className="row mb-3 mt-1">
                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label"> Database User Name : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='dbUserName'
                                        id='dbUserName'
                                        onChange={handleValueChange}
                                        value={values?.dbUserName}
                                    />
                                </div>
                            </div>


                            <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label">Database Password : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        name='dbPass'
                                        id='dbPass'
                                        onChange={handleValueChange}
                                        value={values?.dbPass}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }

            {values.insertMethodOnCentralServer == "3" &&
                <div className="row mb-3 mt-1">
                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-4 col-form-label fix-label required-label"> Select Job For Testing : </label>
                        <div className="col-sm-8 align-content-center">
                            <InputSelect 
                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                name='jobForTesting'
                                placeholder="Select Value"
                                id='jobForTesting'
                                options={jobForTestingDrpDt}
                                onChange={handleValueChange}
                                value={values?.jobForTesting}
                            />
                        </div>
                    </div>
                </div>
            }

            <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}></div>

            <div className='text-center'>

                <>
                    <button className='btn btn-sm new-btn-blue py-0' onClick={saveDetail}>
                        <i className="fa fa-save me-1"></i>
                        Save</button>

                    <button className='btn btn-sm new-btn-blue py-0' onClick={reset}>
                        <i className="fa fa-broom me-1"></i>Clear</button>

                        <button className='btn btn-sm new-btn-blue py-0' onClick={reset}>
                        <i className="fa fa-broom me-1"></i>Test Url</button>
                </>

            </div>

            </div>}

        </div>
    )
}

export default StateConfigCwh
