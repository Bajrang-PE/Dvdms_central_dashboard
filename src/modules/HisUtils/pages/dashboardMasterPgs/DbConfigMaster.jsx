import React, { useContext, useEffect, useState } from 'react'
import NavbarHeader from '../../components/headers/NavbarHeader'
import InputField from '../../components/commons/InputField'
import InputSelect from '../../components/commons/InputSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAdd, faDatabase, faEdit, faFile, faRefresh, faTrash } from '@fortawesome/free-solid-svg-icons'
import { serverName } from '../../localData/DropDownData'
import { ToastAlert } from '../../utils/commonFunction'
import { HISContext } from '../../contextApi/HISContext'
import { fetchData, fetchUpdateData } from '../../../../utils/ApiHooks'

const DbConfigMaster = () => {
    const { dashboardForDt, getDashboardForDrpData, setSelectedOption, setLoading, setShowConfirmSave, confirmSave, setConfirmSave, singleConfigData, getDashConfigData, } = useContext(HISContext);

    const [values, setValues] = useState({
        "configurationFor": '', "serverName": "WEBSPHERE", "jndiServer": '', "jndiServer1": '', "jndiServer2": '', "jndiServer3": '', "driverClass": "", "userName": "", "connectionURL": "", "password": "", "staticReportHead1": "", "staticReportHead2": "", "staticReportHead3": "", "reportHeaderByQuery": "", "logoImageUrl": "", "staticDefaultLimit": ""
    })

    const [rows, setRows] = useState([]);
    const [newRow, setNewRow] = useState({
        "serviceReferenceNo": '',
        "serviceReferenceName": "",
        "serviceInitialServerURL": "",
        "serviceUserName": "",
        "servicePassword": "",
        "defaultMethod": "1"
    });
    // FOR RADIO BUTTONS
    const [isDbConnReq, setIsDbConnReq] = useState('1');
    const [isDashboardCached, setIsDashboardCached] = useState('Yes');
    const [isConsoleReq, setIsConsoleReq] = useState('Yes');
    const [isAccessReq, setIsAccessReq] = useState('No');
    const [isErrorReq, setIsErrorReq] = useState('Yes');
    const [isLogoReq, setIsLogoReq] = useState('Yes');
    const [logoPosition, setLogoPosition] = useState("Left");
    const [headingAlignment, setHeadingAlignment] = useState("Left");
    const [isLimitRecReq, setIsLimitRecReq] = useState('No');

    const [isEditing, setIsEditing] = useState(null);

    const [errors, setErrors] = useState({
        "configurationForErr": '', "serverNameErr": '', "driverClassErr": '', "connectionURLErr": '', "userNameErr": '', "passwordErr": '', "staticReportHead1Err": '', "reportHeaderByQueryErr": '', "jndiServerErr": '', "jndiServer1Err": '', "isDashboardCachedErr": '',
    })

    useEffect(() => {
        if (dashboardForDt?.length === 0) { getDashboardForDrpData(); }
        getDashConfigData();
    }, [])

    useEffect(() => {
        if (singleConfigData) {
            const dtd = singleConfigData?.databaseConfigVO;
            setValues({
                ...values,
                configurationFor: dtd?.dashboardFor,
                serverName: dtd?.serverName,
                jndiServer: dtd?.jndiForPrimaryServer,
                jndiServer1: dtd?.jndiForSecondaryServer1,
                jndiServer2: dtd?.jndiForSecondaryServer2,
                jndiServer3: dtd?.jndiForSecondaryServer3,
                driverClass: dtd?.driverClassName,
                userName: dtd?.userName,
                connectionURL: dtd?.url,
                password: dtd?.password,
                staticReportHead1: dtd?.reportHeader1,
                staticReportHead2: dtd?.reportHeader2,
                staticReportHead3: dtd?.reportHeader3,
                reportHeaderByQuery: dtd?.reportHeaderByQuery,
                logoImageUrl: dtd?.logoImage,
                staticDefaultLimit: dtd?.setDefaultLimit,
            })
            setIsDbConnReq(dtd?.isDbConnectionReq);
            setIsDashboardCached(dtd?.isDashboardConfigurationCached);
            setIsConsoleReq(dtd?.isLogAllMsgs);
            setIsAccessReq(dtd?.isLogAllAccess);
            setIsErrorReq(dtd?.isLogAllError);
            setIsLogoReq(dtd?.isLogoRequired);
            setLogoPosition(dtd?.logoPosition);
            setHeadingAlignment(dtd?.headingAlignment);
            setIsLimitRecReq(dtd?.isLimitRequired);
            setRows(dtd?.lstWebServiceClientConfigVO)
        }
    }, [singleConfigData])

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const error = name + 'Err'
        if (name) {
            setValues({ ...values, [name]: value })
        }
        if (error && name) {
            setErrors({ ...errors, [error]: '' })
        }
    }
    const handleEditRow = (index) => {
        setIsEditing(index);
        setNewRow(rows[index]);
    };

    const handleRemoveRow = (index) => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
    };

    const handleInputChange = (field, value) => {
        const err = field + 'Err'
        setNewRow({ ...newRow, [field]: value });
        // setErrors(prev => ({ ...prev, [err]: "" }));
    };

    const clearRow = () => {
        setNewRow({ "serviceReferenceNo": '', "serviceReferenceName": "", "serviceInitialServerURL": "", "serviceUserName": "", "servicePassword": "", "defaultMethod": "1" });
        setIsEditing(null);
    }

    const handleAddRow = () => {
        if (isEditing !== null) {
            const updatedRows = [...rows];
            updatedRows[isEditing] = newRow;
            setRows(updatedRows);
            // setValues({ ...values, ['helpDocs']: updatedRows })
            setIsEditing(null);
        } else {
            // let oldDt = values?.helpDocs?.length > 0 ? values?.helpDocs : [];
            setRows([...rows, newRow]);
            // oldDt?.push(newRow)
            // setValues({ ...values, ['helpDocs']: oldDt })
        }
        setNewRow({ "serviceReferenceNo": '', "serviceReferenceName": "", "serviceInitialServerURL": "", "serviceUserName": "", "servicePassword": "", "defaultMethod": "1" });
    };


    const checkDatabaseConnection = () => {
        fetchData("/hisutils/check-db-connection").then((data) => {
            if (data) {
                ToastAlert(data)
            } else {
                console.log('error')
            }
        })
    }


    const saveConfiguration = () => {
        setLoading(true);
        const { configurationFor, serverName, jndiServer, jndiServer1, jndiServer2, jndiServer3, driverClass, userName, connectionURL, password, staticReportHead1, staticReportHead2, staticReportHead3, reportHeaderByQuery, logoImageUrl, staticDefaultLimit } = values;

        const val = {
            "databaseConfigVO": {
                "dashboardFor": configurationFor,
                "driverClassName": driverClass,
                "userName": userName,
                "url": connectionURL,
                "password": password,
                "serverName": serverName,
                "jndiForPrimaryServer": jndiServer,
                "jndiForSecondaryServer1": jndiServer1,
                "jndiForSecondaryServer2": jndiServer2,
                "jndiForSecondaryServer3": jndiServer3,
                "isDbConnectionReq": isDbConnReq,
                "reportHeader1": staticReportHead1,
                "reportHeader2": staticReportHead2,
                "reportHeader3": staticReportHead3,
                "reportHeaderByQuery": reportHeaderByQuery,
                "logoImage": logoImageUrl,
                "isDashboardConfigurationCached": isDashboardCached,
                "maxServiceReferenceNo": 2,
                "lstWebServiceClientConfigVO": rows?.length > 0 ? rows : [],
                "isLogoRequired": isLogoReq,
                "logoPosition": logoPosition,
                "headingAlignment": headingAlignment,
                "isLogAllAccess": isAccessReq,
                "isLogAllError": isErrorReq,
                "isLogAllMsgs": isConsoleReq,
                "isLimitRequired": isLimitRecReq,
                "setDefaultLimit": staticDefaultLimit
            }
        }

        fetchUpdateData("/hisutils/dashboard-config-save", val).then((data) => {
            if (data) {
                ToastAlert("Data saved Successfully", "success");
                reset();
                setConfirmSave(false);
                setSelectedOption([])
                setLoading(false)
                getDashConfigData()
            } else {
                ToastAlert("Internal Error!", "error");
                setConfirmSave(false);
                setLoading(false)
            }
        });
    }

    const handleSaveConfig = () => {
        let isValid = true;
        if (!values?.configurationFor?.trim()) {
            setErrors(prev => ({ ...prev, 'configurationForErr': "configuration for is required" }));
            isValid = false;
        }
        if (!values?.serverName?.trim()) {
            setErrors(prev => ({ ...prev, 'serverNameErr': "server name is required" }));
            isValid = false;
        }

        if (isDbConnReq === '1' && !values?.driverClass?.trim()) {
            setErrors(prev => ({ ...prev, 'driverClassErr': "driver class is required" }));
            isValid = false;
        }
        if (isDbConnReq === '1' && !values?.connectionURL?.trim()) {
            setErrors(prev => ({ ...prev, 'connectionURLErr': "connection url is required" }));
            isValid = false;
        }
        if (isDbConnReq === '1' && !values?.userName?.trim()) {
            setErrors(prev => ({ ...prev, 'userNameErr': "user name is required" }));
            isValid = false;
        }
        if (isDbConnReq === '1' && !values?.password?.trim()) {
            setErrors(prev => ({ ...prev, 'passwordErr': "password is required" }));
            isValid = false;
        }
        if (isDbConnReq === '0' && !values?.jndiServer?.trim()) {
            setErrors(prev => ({ ...prev, 'jndiServerErr': "primary server is required" }));
            isValid = false;
        }
        if (isDbConnReq === '0' && !values?.jndiServer1?.trim()) {
            setErrors(prev => ({ ...prev, 'jndiServer1Err': "secondary server is required" }));
            isValid = false;
        }

        if (!values?.staticReportHead1?.trim()) {
            setErrors(prev => ({ ...prev, 'staticReportHead1Err': "report header is required" }));
            isValid = false;
        }
        if (!values?.reportHeaderByQuery?.trim()) {
            setErrors(prev => ({ ...prev, 'reportHeaderByQueryErr': "this field is required" }));
            isValid = false;
        }
        if (!isDashboardCached?.trim()) {
            setErrors(prev => ({ ...prev, 'isDashboardCachedErr': "this field is required" }));
            isValid = false;
        }

        if (isValid) {
            setShowConfirmSave(true)
        }
    }

    useEffect(() => {
        if (confirmSave) {
            saveConfiguration();
        }
    }, [confirmSave])

    const reset = () => {
        setValues({ "configurationFor": '', "serverName": "WEBSPHERE", "jndiServer": '', "jndiServer1": '', "jndiServer2": '', "jndiServer3": '', "driverClass": "", "userName": "", "connectionURL": "", "password": "", "staticReportHead1": "", "staticReportHead2": "", "staticReportHead3": "", "reportHeaderByQuery": "", "logoImageUrl": "", "staticDefaultLimit": "" });

        setErrors({ "configurationForErr": '', "serverNameErr": '', "driverClassErr": '', "connectionURLErr": '', "userNameErr": '', "passwordErr": '', "staticReportHead1Err": '', "reportHeaderByQueryErr": '', "jndiServerErr": '', "jndiServer1Err": '', "isDashboardCachedErr": '', });
        setLoading(false)
        setRows([])
    }


    return (
        <>
            <NavbarHeader />
            <div className='main-master-page'>
                <div className='form-card m-auto p-2'>
                    <b><h6 className='header-devider m-0'> Configuration Master</h6></b>
                    {/* <form action=""> */}
                    <div className='py-2 px-2'>
                        {/* SECTION DEVIDER config for and server*/}
                        <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0 required-label">Configuration For : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputSelect
                                            id="configurationFor"
                                            name="configurationFor"
                                            placeholder="Select value..."
                                            options={dashboardForDt}
                                            className="backcolorinput"
                                            value={values?.configurationFor}
                                            onChange={handleValueChange}
                                            errorMessage={errors?.configurationForErr}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0 required-label">Server Name : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputSelect
                                            className="backcolorinput"
                                            // placeholder="Select value..."
                                            id="serverName"
                                            name="serverName"
                                            options={serverName}
                                            value={values?.serverName}
                                            onChange={handleValueChange}
                                            errorMessage={errors?.serverNameErr}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION DEVIDER is dbconn req */}
                        <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        Is DB Connection String Required:
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="isDbConnReq"
                                                id="isDbConnReqYes"
                                                value={isDbConnReq}
                                                onChange={(e) => setIsDbConnReq('1')}
                                                checked={isDbConnReq === "1"}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="isDbConnReq"
                                                id="isDbConnReqNo"
                                                value={isDbConnReq}
                                                onChange={(e) => setIsDbConnReq('0')}
                                                checked={isDbConnReq === '0'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            {/* <div className='col-sm-6'>
                                </div> */}
                        </div>

                        {/* SECTION DEVIDER */}
                        {/* IF DB CONNECTION STRING NO */}
                        {isDbConnReq === '0' &&
                            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                                {/* //left columns */}
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0 required-label">JNDI for Primary Server : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="For Saving Dashboard Master,Running Data service"
                                                name='jndiServer'
                                                id='jndiServer'
                                                value={values?.jndiServer}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.jndiServerErr}

                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0 required-label">JNDI for Secondary Server 1(Reporting Server)  : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="For Running Dashboard"
                                                name='jndiServer1'
                                                id='jndiServer1'
                                                value={values?.jndiServer1}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.jndiServer1Err}

                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* right columns */}
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label fix-label pe-0">JNDI for Secondary Server 2(Reporting Server) : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="For Running Dashboard"
                                                name='jndiServer2'
                                                id='jndiServer2'
                                                value={values?.jndiServer2}
                                                onChange={handleValueChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label fix-label pe-0">JNDI for Secondary Server 3(Reporting Server) : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="For Running Dashboard"
                                                name='jndiServer3'
                                                id='jndiServer3'
                                                value={values?.jndiServer3}
                                                onChange={handleValueChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* SECTION DEVIDER */}
                        {/* IF DB CONNECTION STRING YES */}
                        {isDbConnReq === '1' &&
                            <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                                {/* //left columns */}
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0 required-label">Driver Class Name : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="Enter value..."
                                                name='driverClass'
                                                id='driverClass'
                                                value={values?.driverClass}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.driverClassErr}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0 required-label">UserName  : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="Enter value..."
                                                name='userName'
                                                id='userName'
                                                value={values?.userName}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.userNameErr}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* right columns */}
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Connection URL : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="Enter value..."
                                                name='connectionURL'
                                                id='connectionURL'
                                                value={values?.connectionURL}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.connectionURLErr}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Password : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="password"
                                                className="backcolorinput"
                                                placeholder="Enter value..."
                                                name='password'
                                                id='password'
                                                value={values?.password}
                                                onChange={handleValueChange}
                                                errorMessage={errors?.passwordErr}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {/* SECTION DEVIDER 4 logs radio*/}
                        <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0 required-label">
                                        Is Dashboard Configuration Cached :
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isDashboardCachedYes"
                                                name="isDashboardCached"
                                                value={isDashboardCached}
                                                onChange={(e) => setIsDashboardCached('Yes')}
                                                checked={isDashboardCached === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isDashboardCachedNo"
                                                name="isDashboardCached"
                                                value={isDashboardCached}
                                                onChange={(e) => setIsDashboardCached('No')}
                                                checked={isDashboardCached === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                        {errors?.isDashboardCachedErr &&
                                            <div className="required-input">
                                                {errors?.isDashboardCachedErr}
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        Is Access Log Required :
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isAccessReqYes"
                                                name="isAccessReq"
                                                value={isAccessReq}
                                                onChange={(e) => setIsAccessReq('Yes')}
                                                checked={isAccessReq === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isAccessReqNo"
                                                name="isAccessReq"
                                                value={isAccessReq}
                                                onChange={(e) => setIsAccessReq('No')}
                                                checked={isAccessReq === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        Is Console Log Required :
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isConsoleReqYes"
                                                name="isConsoleReq"
                                                value={isConsoleReq}
                                                onChange={(e) => setIsConsoleReq('Yes')}
                                                checked={isConsoleReq === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isConsoleReqNo"
                                                name="isConsoleReq"
                                                value={isConsoleReq}
                                                onChange={(e) => setIsConsoleReq('No')}
                                                checked={isConsoleReq === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        Is Error Log Required :
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isErrorReqYes"
                                                name="isErrorReq"
                                                value={isErrorReq}
                                                onChange={(e) => setIsErrorReq('Yes')}
                                                checked={isErrorReq === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isErrorReqNo"
                                                name="isErrorReq"
                                                value={isErrorReq}
                                                onChange={(e) => setIsErrorReq('No')}
                                                checked={isErrorReq === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION DEVIDER static header and report header*/}
                        <div iv className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0 required-label">Static Report Header1 : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            placeholder="Enter value..."
                                            name='staticReportHead1'
                                            id='staticReportHead1'
                                            value={values?.staticReportHead1}
                                            onChange={handleValueChange}
                                            errorMessage={errors?.staticReportHead1Err}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">Static Report Header2  : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            placeholder="Enter value..."
                                            name='staticReportHead2'
                                            id='staticReportHead2'
                                            value={values?.staticReportHead2}
                                            onChange={handleValueChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label fix-label pe-0">Static Report Header3 : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <InputField
                                            type="text"
                                            className="backcolorinput"
                                            placeholder="Enter value..."
                                            name='staticReportHead3'
                                            id='staticReportHead3'
                                            value={values?.staticReportHead3}
                                            onChange={handleValueChange}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">Report Header By Query : </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <textarea
                                            className="form-control backcolorinput"
                                            placeholder="Enter value..."
                                            rows="1"
                                            name='reportHeaderByQuery'
                                            id='reportHeaderByQuery'
                                            value={values?.reportHeaderByQuery}
                                            onChange={handleValueChange}
                                        ></textarea>
                                        {errors?.reportHeaderByQueryErr &&
                                            <div className="required-input">
                                                {errors?.reportHeaderByQueryErr}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SECTION DEVIDER logo details*/}
                        <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        Is Logo Required:
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isLogoReqYes"
                                                name="isLogoReq"
                                                value={isLogoReq}
                                                onChange={(e) => setIsLogoReq('Yes')}
                                                checked={isLogoReq === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isLogoReqNo"
                                                name="isLogoReq"
                                                value={isLogoReq}
                                                onChange={(e) => setIsLogoReq('No')}
                                                checked={isLogoReq === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {isLogoReq === 'Yes' &&
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label fix-label pe-0">Logo Image URL : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <textarea
                                                className="form-control backcolorinput"
                                                placeholder="Enter value..."
                                                rows="1"
                                                name='logoImageUrl'
                                                id='logoImageUrl'
                                                value={values?.logoImageUrl}
                                                onChange={handleValueChange}
                                            ></textarea>
                                        </div>

                                    </div>
                                }
                            </div>
                            {/* right columns */}
                            {isLogoReq === 'Yes' &&
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0">
                                            Logo Position:
                                        </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="logoPositionTop"
                                                    name="logoPosition"
                                                    value={logoPosition}
                                                    onChange={(e) => setLogoPosition("Top")}
                                                    checked={logoPosition === "Top"}
                                                />
                                                <label className="form-check-label" htmlFor="dbYes">
                                                    Top
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="logoPositionLeft"
                                                    name="logoPosition"
                                                    value={logoPosition}
                                                    onChange={(e) => setLogoPosition("Left")}
                                                    checked={logoPosition === "Left"}
                                                />
                                                <label className="form-check-label" htmlFor="dbNo">
                                                    Left
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0">
                                            Heading Alignment:
                                        </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="headingAlignmentCenter"
                                                    name="headingAlignment"
                                                    value={headingAlignment}
                                                    onChange={(e) => setHeadingAlignment("Center")}
                                                    checked={headingAlignment === "Center"}
                                                />
                                                <label className="form-check-label" htmlFor="dbYes">
                                                    Center
                                                </label>
                                            </div>
                                            <div className="form-check form-check-inline">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    id="headingAlignmentLeft"
                                                    name="headingAlignment"
                                                    value={headingAlignment}
                                                    onChange={(e) => setHeadingAlignment("Left")}
                                                    checked={headingAlignment === "Left"}
                                                />
                                                <label className="form-check-label" htmlFor="dbNo">
                                                    Left
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        {/* SECTION DEVIDER default limits*/}
                        <div className='row role-theme user-form' style={{ paddingBottom: "1px" }}>
                            {/* //left columns */}
                            <div className='col-sm-6'>
                                <div className="form-group row">
                                    <label className="col-sm-5 col-form-label pe-0">
                                        "Limit Records" Feature Required:
                                    </label>
                                    <div className="col-sm-7 ps-0 align-content-center">
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isLimitRecReqYes"
                                                name="isLimitRecReq"
                                                value={isLimitRecReq}
                                                onChange={(e) => setIsLimitRecReq('Yes')}
                                                checked={isLimitRecReq === 'Yes'}
                                            />
                                            <label className="form-check-label" htmlFor="dbYes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                id="isLimitRecReqNo"
                                                name="isLimitRecReq"
                                                value={isLimitRecReq}
                                                onChange={(e) => setIsLimitRecReq('No')}
                                                checked={isLimitRecReq === 'No'}
                                            />
                                            <label className="form-check-label" htmlFor="dbNo">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* right columns */}
                            {isLimitRecReq === 'Yes' &&
                                <div className='col-sm-6'>
                                    <div className="form-group row">
                                        <label className="col-sm-5 col-form-label pe-0">Static Set Default Limit : </label>
                                        <div className="col-sm-7 ps-0 align-content-center">
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                placeholder="Enter value..."
                                                name='staticDefaultLimit'
                                                id='staticDefaultLimit'
                                                value={values?.staticDefaultLimit}
                                                onChange={handleValueChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>

                        <div className="table-responsive row pt-1">
                            <table className="table table-borderless text-center mb-0">
                                <thead className="text-white">
                                    <tr className='header-devider m-0'>
                                        <th style={{ width: "15%" }}>Service Reference Name</th>
                                        <th style={{ width: "25%" }}>Server URL</th>
                                        <th style={{ width: "15%" }}>Default Method</th>
                                        <th style={{ width: "15%" }}>Service User Name</th>
                                        <th style={{ width: "15%" }}>Service Password</th>
                                        <th style={{ width: "15%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                name='serviceReferenceName'
                                                id='serviceReferenceName'
                                                value={newRow?.serviceReferenceName}
                                                onChange={(e) => handleInputChange("serviceReferenceName", e.target.value)}


                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                name='serviceInitialServerURL'
                                                id='serviceInitialServerURL'
                                                value={newRow?.serviceInitialServerURL}
                                                onChange={(e) => handleInputChange("serviceInitialServerURL", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputSelect
                                                className="backcolorinput"
                                                options={[{ value: 1, label: "GET" }, { value: 2, label: "POST" }]}
                                                id="defaultMethod"
                                                name="defaultMethod"
                                                value={newRow?.defaultMethod}
                                                onChange={(e) => handleInputChange("defaultMethod", e.target.value)}
                                            >
                                            </InputSelect>
                                        </td>
                                        <td>
                                            <InputField
                                                type="text"
                                                className="backcolorinput"
                                                name="serviceUserName"
                                                id='serviceUserName'
                                                value={newRow?.serviceUserName}
                                                onChange={(e) => handleInputChange("serviceUserName", e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <InputField
                                                type="password"
                                                className="backcolorinput"
                                                name="servicePassword"
                                                id='servicePassword'
                                                value={newRow?.servicePassword}
                                                onChange={(e) => handleInputChange("servicePassword", e.target.value)}
                                            />
                                        </td>
                                        <td className='px-0 action-buttons'>
                                            <button className='btn btn-sm me-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={() => handleAddRow()}><FontAwesomeIcon icon={faAdd} className="dropdown-gear-icon" size='sm' />{isEditing !== null ? "Modify" : "Add"}</button>

                                            <button className='btn btn-sm ms-1 py-0 px-0' style={{ background: "#34495e", color: "white" }} onClick={() => clearRow()}><FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon" size='sm' />Clear</button>
                                        </td>
                                    </tr>
                                    {rows?.map((row, index) => (
                                        <tr className='table-row-form text-start' key={index}>
                                            <td>{row?.serviceReferenceName || "---"}</td>
                                            <td>{row?.serviceInitialServerURL || "---"}</td>
                                            <td>{row?.defaultMethod || "---"}</td>
                                            <td>{row?.serviceUserName || "---"}</td>
                                            <td>{row?.servicePassword || "---"}</td>
                                            <td className=''>
                                                <div className='text-center'>
                                                    <button
                                                        className="btn btn-warning btn-sm me-1 py-0 px-1"
                                                        onClick={() => handleEditRow(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} className="dropdown-gear-icon" size='xs' />
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm ms-1 py-0 px-1"
                                                        onClick={() => handleRemoveRow(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} className="dropdown-gear-icon" size='xs' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* </form> */}
                    <div className='text-center py-1 rounded-2 configuration-buttons'>
                        <button className='btn btn-sm me-1' onClick={() => handleSaveConfig()}><FontAwesomeIcon icon={faFile} className="dropdown-gear-icon me-1" />Save</button>
                        <button className='btn btn-sm ms-1 me-1' onClick={() => checkDatabaseConnection()}><FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />Test DB Connection</button>
                        <button className='btn btn-sm ms-1 me-1'><FontAwesomeIcon icon={faRefresh} className="dropdown-gear-icon me-1" />Reset</button>
                        <button className='btn btn-sm ms-1 me-1'><FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />Port Xml Data</button>
                        <button className='btn btn-sm ms-1'><FontAwesomeIcon icon={faDatabase} className="dropdown-gear-icon me-1" />Clear All Cached Data</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default DbConfigMaster
