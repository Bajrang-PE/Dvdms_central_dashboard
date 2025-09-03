import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../../dashboard/DashHeader'
import InputSelect from "../../InputSelect";
import axios from 'axios';
import { LoginContext } from '../../../context/LoginContext';
import { fetchData, fetchUpdateData } from '../../../../../utils/ApiHooks';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import InputField from '../../InputField';

const StateConfigCwh = () => {
    const { getSteteNameDrpData, stateNameDrpDt, setShowConfirmSave, confirmSave, setConfirmSave } = useContext(LoginContext)

    const [centServerDrpDt, setCentServerDrpDt] = useState([]);
    const [jobForTestingDrpDt, setJobForTestingDrpDt] = useState([]);
    const [configData, setConfigData] = useState([]);

    const [errors, setErrors] = useState({
        stateDatabaseErr: "", jobForTestingErr: "", dataFetchSizeErr: "", serviceConnTimeoutErr: "",
        centServiceUrlErr: "", stateServiceUrlErr: "", dbDrivClassErr: "", dbUrlErr: "", dbUserNameErr: "",
        dbPassErr: "",
    })


    const [values, setValues] = useState({
        "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
        "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
        "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "", "isDbCredAvl": "", "stateDatabase": "", "jobForTesting": "",
        "jobId": "", "jobName": "",
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
    }, [values?.strStateId, values?.insertMethodOnCentralServer]);

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

            fetchData(`/api/v1/state/getStateConfig/${stateId}`).then((data) => {
console.log('data', data)
                if (data?.status === 1) {

                    setValues({
                        ...values,
                        strStateId: data.data?.cwhnumStateId ?? "",
                        stateServiceUrl: data.data?.cwhstrStateUrl ?? "",
                        centServiceUrl: data.data?.cwhstrCentralserverurl ?? "",
                        stateServiceUserName: data.data?.cwhstrStateserviceusername ?? "",
                        stateServicePass: data.data?.cwhstrStateservicepassword ?? "",
                        serviceConnTimeout: data.data?.cwhnumServiceconnecttimeout ?? "",
                        dataFetchSize: data.data?.cwhnumBatchsize ?? "",
                        dbDrivClass: data.data?.cwhstrDatabasedriverclassname ?? "",
                        dbUrl: data.data?.cwhstrDatabaseurl ?? "",
                        dbUserName: data.data?.cwhstrDatabaseusername ?? "",
                        dbPass: data.data?.cwhstrDatabasepassword ?? "",
                        stateDatabase: data.data?.cwhstrDatabaseName ?? "",
                        isDbCredAvl: data.data?.cwhnumIsdbcedentialavailable ?? "",
                        insertMethodOnCentralServer: data.data?.numIsDataInsertByEtlWar ?? ""
                    });


                }

            })

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const getJobDrpData = async (stateId) => {
        fetchData(`/api/v1/state/getjob/${stateId}`).then((data) => {

            if (data?.status === 1) {

                const drpData = data?.data?.map((dt) => {
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


    const validate = () => {

        let isValid = true;

        if (!values?.stateServiceUrl.trim()) {
            setErrors(prev => ({ ...prev, stateServiceUrlErr: "Please enter state service url " }));
            isValid = false;
        }

        if (!values?.centServiceUrl.trim()) {
            setErrors(prev => ({ ...prev, centServiceUrlErr: "Please enter central service url " }));
            isValid = false;
        }

        if (!String(values?.serviceConnTimeout).trim()) {
            setErrors(prev => ({ ...prev, serviceConnTimeoutErr: "Please enter service connect timeout  " }));
            isValid = false;
        }

        if (!String(values?.dataFetchSize).trim()) {
            setErrors(prev => ({ ...prev, dataFetchSizeErr: "Please enter data fetch size " }));
            isValid = false;
        }

        if (values?.insertMethodOnCentralServer == "3") {
            if (!values?.jobForTesting.trim()) {
                setErrors(prev => ({ ...prev, jobForTestingErr: "Please select job for testing " }));
                isValid = false;
            }
        }

        if (values?.insertMethodOnCentralServer != "3") {
            if (!values?.stateDatabase || values?.stateDatabase == "0") {
                setErrors(prev => ({ ...prev, stateDatabaseErr: "Please select state database " }));
                isValid = false;
            }
        }

        if (values?.isDbCredAvl == 1) {
            if (!values?.dbDrivClass) {
                setErrors(prev => ({ ...prev, dbDrivClassErr: "Database driver class is required" }))
                isValid = false;
            }
            if (!values?.dbUrl) {
                setErrors(prev => ({ ...prev, dbUrlErr: "Database url is required" }))
                isValid = false;
            }
            if (!values?.dbUserName) {
                setErrors(prev => ({ ...prev, dbUserNameErr: "Database user name is required" }))
                isValid = false;
            }

            if (!values?.dbPass) {
                setErrors(prev => ({ ...prev, dbPassErr: "Database password is required" }))
                isValid = false;
            }
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveDetail();
        }
    }, [confirmSave])

    const saveDetail = async () => {

        const data = {
            cwhnumStateId: values?.strStateId,
            cwhstrStateUrl: values?.stateServiceUrl,
            cwhnumThreadpoolSize: values?.dataFetchSize,
            cwhstrDatabaseName: values?.stateDatabase,
            numIsDataInsertByEtlWar: values?.insertMethodOnCentralServer,
            cwhnumServiceconnecttimeout: values?.serviceConnTimeout,
            cwhnumBatchsize: values?.dataFetchSize,
            cwhstrCentralserverurl: values?.centServiceUrl,
            cwhstrStateserviceusername: values?.stateServiceUserName,
            cwhstrStateservicepassword: values?.stateServicePass,
            cwhnumIsdbcedentialavailable: values?.insertMethodOnCentralServer == "3" ? "0" : values?.isDbCredAvl,
            cwhstrDatabasedriverclassname: values?.isDbCredAvl == "0" ? '' : values?.dbDrivClass,
            cwhstrDatabaseurl: values?.isDbCredAvl == "0" ? '' : values?.dbUrl,
            cwhstrDatabaseusername: values?.isDbCredAvl == "0" ? '' : values?.dbUserName,
            cwhstrDatabasepassword: values?.isDbCredAvl == "0" ? '' : values?.dbPass,
        };

        await fetchUpdateData("/api/v1/state", data).then(data => {
            if (data?.status === 1) {
                ToastAlert('State configuration saved successfully', 'success');
                setConfirmSave(false);
                reset();
            } else {
                ToastAlert('Error', 'error');
            }
        });


    }


    const reset = () => {

        setValues({
            "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
            "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
            "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "", "isDbCredAvl": "", "stateDatabase": "", "jobForTesting": "",
            "jobId": "", "jobName": "",
        });
    }

    return (
        <div className="masters mx-3 my-2">

            <div className='masters-header row'>
                <span className='col-6'><b>{`State Configuration Master`}</b></span>
            </div>

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

            {values?.strStateId !== "" &&
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
                                <InputField
                                    type="text"
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='stateServiceUrl'
                                    id='stateServiceUrl'
                                    onChange={handleValueChange}
                                    value={values?.stateServiceUrl}
                                    errorMessage={errors?.stateServiceUrlErr}
                                />
                            </div>
                        </div>


                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Central Service URL : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputField
                                    type="text"
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='centServiceUrl'
                                    id='centServiceUrl'
                                    onChange={handleValueChange}
                                    value={values?.centServiceUrl}
                                    errorMessage={errors?.centServiceUrlErr}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label"> State Service UserName : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputField
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
                                <InputField
                                    type="password"
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
                                <InputField
                                    type="text"
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='serviceConnTimeout'
                                    id='serviceConnTimeout'
                                    onChange={handleValueChange}
                                    value={values?.serviceConnTimeout}
                                    errorMessage={errors?.serviceConnTimeoutErr}
                                    maxLength={3}
                                    acceptType={'number'}
                                />
                            </div>
                        </div>


                        <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label"> Data Fetch Size : </label>
                            <div className="col-sm-8 align-content-center">
                                <InputField
                                    type="text"
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    name='dataFetchSize'
                                    id='dataFetchSize'
                                    onChange={handleValueChange}
                                    value={values?.dataFetchSize}
                                    errorMessage={errors?.dataFetchSizeErr}
                                    maxLength={5}
                                    acceptType={'number'}
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
                                            errorMessage={errors?.stateDatabaseErr}
                                        />

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
                                            <InputField
                                                type="text"
                                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                                name='dbDrivClass'
                                                id='dbDrivClass'
                                                onChange={handleValueChange}
                                                value={values?.dbDrivClass}
                                                errorMessage={errors?.dbDrivClassErr}
                                            />
                                        </div>
                                    </div>


                                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                        <label className="col-sm-4 col-form-label fix-label required-label">  Database URL : </label>
                                        <div className="col-sm-8 align-content-center">
                                            <InputField
                                                type="text"
                                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                                name='dbUrl'
                                                id='dbUrl'
                                                onChange={handleValueChange}
                                                value={values?.dbUrl}
                                                errorMessage={errors?.dbUrlErr}
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
                                            <InputField
                                                type="text"
                                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                                name='dbUserName'
                                                id='dbUserName'
                                                onChange={handleValueChange}
                                                value={values?.dbUserName}
                                                errorMessage={errors?.dbUserNameErr}
                                            />
                                        </div>
                                    </div>


                                    <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                                        <label className="col-sm-4 col-form-label fix-label required-label">Database Password : </label>
                                        <div className="col-sm-8 align-content-center">
                                            <InputField
                                                type="password"
                                                className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                                name='dbPass'
                                                id='dbPass'
                                                onChange={handleValueChange}
                                                value={values?.dbPass}
                                                errorMessage={errors?.dbPassErr}
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
                                        errorMessage={errors?.jobForTestingErr}
                                    />
                                </div>
                            </div>
                        </div>
                    }

                    <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}></div>

                    <div className='text-center'>

                        <>
                            <button className='btn btn-sm new-btn-blue py-0' onClick={validate}>
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
