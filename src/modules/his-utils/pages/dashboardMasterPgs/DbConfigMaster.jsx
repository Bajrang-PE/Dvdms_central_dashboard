import React, { useContext, useEffect, useReducer, useState } from "react";
import NavbarHeader from "../../components/headers/NavbarHeader";
import InputField from "../../components/commons/InputField";
import InputSelect from "../../components/commons/InputSelect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faDatabase,
  faEdit,
  faFile,
  faRefresh,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { ToastAlert } from "../../utils/commonFunction";
import { HISContext } from "../../contextApi/HISContext";
import { fetchUpdateData } from "../../../../utils/HisApiHooks";
import LogoUploader from "../../components/commons/LogoUploader";
import {
  DatabaseSelector,
  DBConfigForm,
} from "../../components/dashboardMasters/dashboardMaster/DatabaseSelector";

const DbConfigMaster = () => {
  const {
    setSelectedOption,
    setLoading,
    setShowConfirmSave,
    confirmSave,
    setConfirmSave,
    singleConfigData,
    getDashConfigData,
    clearAllCache,
  } = useContext(HISContext);

  const [values, setValues] = useState({
    staticReportHead1: "",
    staticReportHead2: "",
    staticReportHead3: "",
    reportHeaderByQuery: "",
    logoImageUrl: "",
    staticDefaultLimit: "",
    logoImageUrl1: "",
    logoImageUrl2: "",
    logoImageUrl3: "",
  });

  const [errors, setErrors] = useState({
    staticReportHead1Err: "",
    reportHeaderByQueryErr: "",
  });

  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({
    serviceReferenceNo: "",
    serviceReferenceName: "",
    serviceInitialServerURL: "",
    defaultMethod: "1",
  });
  // FOR RADIO BUTTONS
  const [isDbConnReq, setIsDbConnReq] = useState("1");
  const [isDashboardCached, setIsDashboardCached] = useState("Yes");
  const [isConsoleReq, setIsConsoleReq] = useState("Yes");
  const [isAccessReq, setIsAccessReq] = useState("No");
  const [isErrorReq, setIsErrorReq] = useState("Yes");
  const [isLogoReq, setIsLogoReq] = useState("Yes");
  const [logoPosition, setLogoPosition] = useState({
    logo1Position: "left",
    logo2Position: "right",
    logo3Position: "top",
  });
  const [headingAlignment, setHeadingAlignment] = useState("Left");
  const [isLimitRecReq, setIsLimitRecReq] = useState("No");
  const [isHeadByQueryReq, setIsHeadByQueryReq] = useState("No");
  const [logoCounts, setLogoCounts] = useState("1");
  const [isEditing, setIsEditing] = useState(null);

  const initialDBFormState = {
    postgresForm: false,
    oracleForm: false,
    edbForm: false,
    hostname: "",
    port: 0,
    serviceName: "",
    userName: "",
    password: "",
    currentDB: "",
  };

  function dbFormHandlerReducer(state, action) {
    switch (action.type) {
      case "postgres":
        return {
          ...state,
          postgresForm: !state.postgresForm,
          oracleForm: false,
          edbForm: false,
          currentDB: action.type,
        };
      case "oracle":
        return {
          ...state,
          oracleForm: !state.oracleForm,
          postgresForm: false,
          edbForm: false,
          currentDB: action.type,
        };

      case "edb":
        return {
          ...state,
          edbForm: !state.edbForm,
          oracleForm: false,
          postgresForm: false,
          currentDB: action.type,
        };

      case "updateHostname":
        return {
          ...state,
          hostname: action.payload,
        };

      case "updatePort":
        return {
          ...state,
          port: action.payload,
        };

      case "updateSID":
        return {
          ...state,
          serviceName: action.payload,
        };

      case "updateUsername":
        return {
          ...state,
          userName: action.payload,
        };

      case "updatePassword":
        return {
          ...state,
          password: action.payload,
        };

      case "reset":
        return {
          ...initialDBFormState,
        };

      default:
        return state;
    }
  }

  const [dbFormState, dispatcher] = useReducer(
    dbFormHandlerReducer,
    initialDBFormState
  );
  async function checkDBConnection(e) {
    e.preventDefault();

    if (
      dbFormState.hostname === "" ||
      dbFormState.port === 0 ||
      dbFormState.serviceName === "" ||
      dbFormState.userName === "" ||
      dbFormState.password === "" ||
      dbFormState.schema === ""
    ) {
      ToastAlert(
        "Please fill all the fields in Database form and then proceed",
        "failed"
      );
      return;
    }

    const requestData = {
      hostname: dbFormState.hostname,
      port: dbFormState.port,
      serviceName: dbFormState.serviceName,
      username: dbFormState.userName,
      password: dbFormState.password,
      dbType: dbFormState.currentDB,
    };

    try {
      const response = await fetch(
        "http://localhost:8024/hisutils/TestDatabaseConnection",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data?.status == 1) {
        ToastAlert(data?.message, "success");
      } else {
        ToastAlert(data?.message, "failed");
      }
    } catch (error) {
      console.error("Error connecting to DB:", error);
    }
  }

  //to set value of dashboard for auto
  const dashFor = localStorage.getItem("dfor");
  useEffect(() => {
    if (dashFor) {
      setValues({ ...values, configurationFor: dashFor });
    }
  }, [dashFor]);

  useEffect(() => {
    if (singleConfigData) {
      const dtd = singleConfigData?.databaseConfigVO;
      setValues({
        ...values,
        staticReportHead1: dtd?.reportHeader1,
        staticReportHead2: dtd?.reportHeader2,
        staticReportHead3: dtd?.reportHeader3,
        reportHeaderByQuery: dtd?.reportHeaderByQuery,
        logoImageUrl: dtd?.logoImage,
        logoImageUrl1: dtd?.logos[0]?.image,
        logoImageUrl2: dtd?.logos[1]?.image,
        logoImageUrl3: dtd?.logos[2]?.image,
        staticDefaultLimit: dtd?.setDefaultLimit,
      });
      setIsDbConnReq(dtd?.isDbConnectionReq || "1");
      setIsDashboardCached(dtd?.isDashboardConfigurationCached || "Yes");
      setIsConsoleReq(dtd?.isLogAllMsgs || "Yes");
      setIsAccessReq(dtd?.isLogAllAccess || "No");
      setIsErrorReq(dtd?.isLogAllError || "Yes");
      setIsLogoReq(dtd?.isLogoRequired || "Yes");
      setLogoPosition({
        logo1Position: dtd?.logos[0]?.position || "left",
        logo2Position: dtd?.logos[1]?.position || "right",
        logo3Position: dtd?.logos[2]?.position || "top",
      });
      setHeadingAlignment(dtd?.headingAlignment || "Left");
      setIsLimitRecReq(dtd?.isLimitRequired || "No");
      setRows(dtd?.lstWebServiceClientConfigVO || []);
      setLogoCounts(dtd?.logoCounts || "1");
      setIsHeadByQueryReq(dtd?.isHeadByQueryReq || "No");
    }
  }, [singleConfigData]);

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    const error = name + "Err";
    if (name) {
      setValues({ ...values, [name]: value });
    }
    if (error && name) {
      setErrors({ ...errors, [error]: "" });
    }
  };

  const handleLogoChange = (name, base64String) => {
    setValues((prev) => ({ ...prev, [name]: base64String }));
  };

  const handleEditRow = (index) => {
    setIsEditing(index);
    setNewRow(rows[index]);
  };

  const handleRemoveRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  function handleInputChange(field, value) {
    setNewRow({ ...newRow, [field]: value });
  }

  const clearRow = () => {
    setNewRow({
      serviceReferenceNo: "",
      serviceReferenceName: "",
      serviceInitialServerURL: "",
      serviceUserName: "",
      servicePassword: "",
      defaultMethod: "1",
    });
    setIsEditing(null);
  };

  const handleAddRow = () => {
    if (isEditing !== null) {
      const updatedRows = [...rows];
      updatedRows[isEditing] = newRow;
      setRows(updatedRows);
      // setValues({ ...values, ['helpDocs']: updatedRows })
      setIsEditing(null);
    } else {
      // let oldDt = values?.helpDocs?.length > 0 ? values?.helpDocs : [];
      if (rows?.length > 0) {
        setRows([...rows, newRow]);
      } else {
        setRows([newRow]);
      }
      // oldDt?.push(newRow)
      // setValues({ ...values, ['helpDocs']: oldDt })
    }
    setNewRow({
      serviceReferenceNo: "",
      serviceReferenceName: "",
      serviceInitialServerURL: "",
      serviceUserName: "",
      servicePassword: "",
      defaultMethod: "1",
    });
  };

  function saveConfiguration() {
    if (
      !dbFormState.oracleForm &&
      !dbFormState.postgresForm &&
      !dbFormState.edbForm
    ) {
      return;
    }
    setLoading(true);

    const {
      staticReportHead1,
      staticReportHead2,
      staticReportHead3,
      reportHeaderByQuery,
      staticDefaultLimit,
      logoImageUrl1,
      logoImageUrl2,
      logoImageUrl3,
    } = values;

    const val = {
      hostname: dbFormState.hostname,
      port: dbFormState.port,
      serviceName: dbFormState.serviceName,
      userName: dbFormState.userName,
      password: dbFormState.password,
      schema: dbFormState.schema,
      dbType: dbFormState.currentDB,
      isDbConnectionReq: isDbConnReq,
      reportHeader1: staticReportHead1,
      reportHeader2: staticReportHead2,
      reportHeader3: staticReportHead3,
      reportHeaderByQuery: reportHeaderByQuery,
      logos: [
        { image: logoImageUrl1, position: logoPosition?.logo1Position },
        { image: logoImageUrl2, position: logoPosition?.logo2Position },
        { image: logoImageUrl3, position: logoPosition?.logo3Position },
      ].slice(0, parseInt(logoCounts)),
      isDashboardConfigurationCached: isDashboardCached,
      maxServiceReferenceNo: 2,
      lstWebServiceClientConfigVO: rows?.length > 0 ? rows : [],
      isLogoRequired: isLogoReq,
      headingAlignment: headingAlignment,
      isLogAllAccess: isAccessReq,
      isLogAllError: isErrorReq,
      isLogAllMsgs: isConsoleReq,
      isLimitRequired: isLimitRecReq,
      setDefaultLimit: staticDefaultLimit,
      logoCounts: logoCounts,
      isHeadByQueryReq: isHeadByQueryReq,
    };

    fetchUpdateData("/hisutils/dashboard-config-save", val).then((data) => {
      if (data?.status === 1) {
        ToastAlert(data?.message, "success");
        reset();
        setConfirmSave(false);
        setSelectedOption([]);
        setLoading(false);
      } else {
        ToastAlert(data?.message, "error");
        setConfirmSave(false);
        setLoading(false);
      }
    });
  }

  function handleSaveConfig(e) {
    e.preventDefault();
    if (
      dbFormState.hostname === "" ||
      dbFormState.port === 0 ||
      dbFormState.serviceName === "" ||
      dbFormState.userName === "" ||
      dbFormState.password === "" ||
      dbFormState.schema === ""
    ) {
      ToastAlert(
        "Please fill all the fields in Database form and then proceed",
        "failed"
      );
      return;
    }

    if (!values?.staticReportHead1?.trim()) {
      setErrors((prev) => ({
        ...prev,
        staticReportHead1Err: "report header is required",
      }));
      return;
    }
    if (!values?.reportHeaderByQuery?.trim() && isHeadByQueryReq === "Yes") {
      setErrors((prev) => ({
        ...prev,
        reportHeaderByQueryErr: "this field is required",
      }));
      return;
    }

    setShowConfirmSave(true);
  }

  function reset() {
    //Reset Database Form
    dispatcher({ type: "reset" });

    setValues({
      staticReportHead1: "",
      staticReportHead2: "",
      staticReportHead3: "",
      reportHeaderByQuery: "",
      logoImageUrl: "",
      staticDefaultLimit: "",
      logoImageUrl1: "",
      logoImageUrl2: "",
      logoImageUrl3: "",
    });

    setErrors({
      staticReportHead1Err: "",
      reportHeaderByQueryErr: "",
      isDashboardCachedErr: "",
    });
    setLoading(false);
    setRows([]);
    setLogoPosition({
      logo1Position: "left",
      logo2Position: "right",
      logo3Position: "top",
    });
  }

  useEffect(
    function () {
      saveConfiguration();
    },
    [confirmSave]
  );

  return (
    <>
      <NavbarHeader />
      <div className="main-master-page">
        <div className="form-card m-auto p-2">
          <b>
            <h6 className="header-devider m-0 ps-1"> Configuration Master</h6>
          </b>
          {/* <form action=""> */}
          <div className="py-2 px-2">
            <h4>Please Select DB To Continue</h4>
            <DatabaseSelector dispatcher={dispatcher} />
            <AnimatePresence>
              {dbFormState.postgresForm && (
                <motion.div
                  key="postgres"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <DBConfigForm
                    formState={dbFormState}
                    dispatcher={dispatcher}
                    dbType={"postgres"}
                  />
                </motion.div>
              )}
              {dbFormState.oracleForm && (
                <motion.div
                  key="postgres"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <DBConfigForm
                    formState={dbFormState}
                    dispatcher={dispatcher}
                    dbType={"oracle"}
                  />
                </motion.div>
              )}
              {dbFormState.edbForm && (
                <motion.div
                  key="postgres"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <DBConfigForm
                    formState={dbFormState}
                    dispatcher={dispatcher}
                    dbType={"postgres"}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <b>
              <h6 className="header-devider my-1 ps-1">Header Details</h6>
            </b>
            {/* SECTION DEVIDER static header and report header*/}
            <div
              iv
              className="role-theme user-form db-connection-grid"
              style={{ paddingBottom: "1px" }}
            >
              {/* //left columns */}
              {/* <div className='col-sm-6'> */}
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0 required-label">
                  Static Report Header1 :{" "}
                </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name="staticReportHead1"
                    id="staticReportHead1"
                    value={values?.staticReportHead1}
                    onChange={handleValueChange}
                    errorMessage={errors?.staticReportHead1Err}
                  />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-5 col-form-label pe-0">
                  Static Report Header2 :{" "}
                </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name="staticReportHead2"
                    id="staticReportHead2"
                    value={values?.staticReportHead2}
                    onChange={handleValueChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-5 col-form-label fix-label pe-0">
                  Static Report Header3 :{" "}
                </label>
                <div className="col-sm-7 ps-0 align-content-center">
                  <InputField
                    type="text"
                    className="backcolorinput"
                    placeholder="Enter value..."
                    name="staticReportHead3"
                    id="staticReportHead3"
                    value={values?.staticReportHead3}
                    onChange={handleValueChange}
                  />
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
                      id="headingAlignmentLeft"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={() => setHeadingAlignment("Left")}
                      checked={headingAlignment === "Left"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      Left
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="headingAlignmentRight"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={() => setHeadingAlignment("right")}
                      checked={headingAlignment === "right"}
                    />
                    <label className="form-check-label" htmlFor="dbNo">
                      Right
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      id="headingAlignmentCenter"
                      name="headingAlignment"
                      value={headingAlignment}
                      onChange={() => setHeadingAlignment("Center")}
                      checked={headingAlignment === "Center"}
                    />
                    <label className="form-check-label" htmlFor="dbYes">
                      Center
                    </label>
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <div
              iv
              className="row role-theme user-form"
              style={{ paddingBottom: "1px" }}
            >
              {/* //left columns */}
              <div className="col-sm-6">
                <div className="form-group row">
                  <label className="col-sm-5 col-form-label pe-0">
                    Is Header By Query Required:
                  </label>
                  <div className="col-sm-7 ps-0 align-content-center">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isHeadByQueryReqYes"
                        name="isHeadByQueryReq"
                        value={isHeadByQueryReq}
                        onChange={() => setIsHeadByQueryReq("Yes")}
                        checked={isHeadByQueryReq === "Yes"}
                      />
                      <label className="form-check-label" htmlFor="dbYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="isHeadByQueryReqNo"
                        name="isHeadByQueryReq"
                        value={isHeadByQueryReq}
                        onChange={() => setIsHeadByQueryReq("No")}
                        checked={isHeadByQueryReq === "No"}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              <div className="col-sm-6">
                {isHeadByQueryReq === "Yes" && (
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label fix-label pe-0 required-label">
                      Report Header By Query :{" "}
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <textarea
                        className="form-control backcolorinput"
                        placeholder="Enter value..."
                        rows="1"
                        name="reportHeaderByQuery"
                        id="reportHeaderByQuery"
                        value={values?.reportHeaderByQuery}
                        onChange={handleValueChange}
                      ></textarea>
                      {errors?.reportHeaderByQueryErr && (
                        <div className="required-input">
                          {errors?.reportHeaderByQueryErr}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <b>
              <h6 className="header-devider my-1 ps-1">
                Logo Details -{" "}
                <span className="required-label">
                  <i>click on icon to uplaod logos</i>
                </span>
              </h6>
            </b>
            {/* SECTION DEVIDER logo details*/}
            <div
              className="row role-theme user-form"
              style={{ paddingBottom: "1px" }}
            >
              {/* //left columns */}
              <div className="col-sm-6">
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
                        onChange={() => setIsLogoReq("Yes")}
                        checked={isLogoReq === "Yes"}
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
                        onChange={() => setIsLogoReq("No")}
                        checked={isLogoReq === "No"}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              {isLogoReq === "Yes" && (
                <div className="col-sm-6">
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                      Logo Counts:
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionTop"
                          name="logoCounts"
                          value={logoCounts}
                          onChange={() => setLogoCounts("1")}
                          checked={logoCounts === "1"}
                        />
                        <label className="form-check-label" htmlFor="dbYes">
                          1
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionLeft"
                          name="logoPosition"
                          value={logoCounts}
                          onChange={() => setLogoCounts("2")}
                          checked={logoCounts === "2"}
                        />
                        <label className="form-check-label" htmlFor="dbNo">
                          2
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="logoPositionLeft"
                          name="logoPosition"
                          value={logoCounts}
                          onChange={() => setLogoCounts("3")}
                          checked={logoCounts === "3"}
                        />
                        <label className="form-check-label" htmlFor="dbNo">
                          3
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isLogoReq === "Yes" && (
              <div
                className="row role-theme user-form"
                style={{ paddingBottom: "1px" }}
              >
                {/* //left columns */}
                <div className="col-sm-6">
                  {(logoCounts === "1" ||
                    logoCounts === "2" ||
                    logoCounts === "3") && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 1 File :{" "}
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name="logoImageUrl1"
                          value={values.logoImageUrl1}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  )}
                  {(logoCounts === "2" || logoCounts === "3") && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 2 File :{" "}
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name="logoImageUrl2"
                          value={values.logoImageUrl2}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  )}
                  {logoCounts === "3" && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 3 File :{" "}
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <LogoUploader
                          name="logoImageUrl3"
                          value={values.logoImageUrl3}
                          onChange={handleLogoChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* right columns */}

                <div className="col-sm-6">
                  {(logoCounts === "1" ||
                    logoCounts === "2" ||
                    logoCounts === "3") && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 1 Position:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionLeft"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo1Position: "left",
                              })
                            }
                            checked={logoPosition?.logo1Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Left
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionTop"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo1Position: "top",
                              })
                            }
                            checked={logoPosition?.logo1Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            Center
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo1PositionRight"
                            name="logo1Position"
                            value={logoPosition?.logo1Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo1Position: "right",
                              })
                            }
                            checked={logoPosition?.logo1Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Right
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {(logoCounts === "2" || logoCounts === "3") && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 2 Position:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionLeft"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo2Position: "left",
                              })
                            }
                            checked={logoPosition?.logo2Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Left
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionTop"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo2Position: "top",
                              })
                            }
                            checked={logoPosition?.logo2Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            Center
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo2PositionRight"
                            name="logo2Position"
                            value={logoPosition?.logo2Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo2Position: "right",
                              })
                            }
                            checked={logoPosition?.logo2Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Right
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                  {logoCounts === "3" && (
                    <div className="form-group row">
                      <label className="col-sm-5 col-form-label pe-0">
                        Logo 3 Position:
                      </label>
                      <div className="col-sm-7 ps-0 align-content-center">
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionLeft"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo3Position: "left",
                              })
                            }
                            checked={logoPosition?.logo3Position === "left"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Left
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionTop"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo3Position: "top",
                              })
                            }
                            checked={logoPosition?.logo3Position === "top"}
                          />
                          <label className="form-check-label" htmlFor="dbYes">
                            Center
                          </label>
                        </div>

                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="logo3PositionRight"
                            name="logo3Position"
                            value={logoPosition?.logo3Position}
                            onChange={() =>
                              setLogoPosition({
                                ...logoPosition,
                                logo3Position: "right",
                              })
                            }
                            checked={logoPosition?.logo3Position === "right"}
                          />
                          <label className="form-check-label" htmlFor="dbNo">
                            Right
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* SECTION DEVIDER default limits*/}
            <div
              className="row role-theme user-form"
              style={{ paddingBottom: "1px" }}
            >
              {/* //left columns */}
              <div className="col-sm-6">
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
                        onChange={() => setIsLimitRecReq("Yes")}
                        checked={isLimitRecReq === "Yes"}
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
                        onChange={() => setIsLimitRecReq("No")}
                        checked={isLimitRecReq === "No"}
                      />
                      <label className="form-check-label" htmlFor="dbNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              {/* right columns */}
              {isLimitRecReq === "Yes" && (
                <div className="col-sm-6">
                  <div className="form-group row">
                    <label className="col-sm-5 col-form-label pe-0">
                      Static Set Default Limit :{" "}
                    </label>
                    <div className="col-sm-7 ps-0 align-content-center">
                      <InputField
                        type="text"
                        className="backcolorinput"
                        placeholder="Enter value..."
                        name="staticDefaultLimit"
                        id="staticDefaultLimit"
                        value={values?.staticDefaultLimit}
                        onChange={handleValueChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="table-responsive row pt-1">
              <table className="table table-borderless text-center mb-0">
                <thead className="text-white">
                  <tr className="header-devider m-0">
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
                        name="serviceReferenceName"
                        id="serviceReferenceName"
                        value={newRow?.serviceReferenceName}
                        onChange={(e) =>
                          handleInputChange(
                            "serviceReferenceName",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <InputField
                        type="text"
                        className="backcolorinput"
                        name="serviceInitialServerURL"
                        id="serviceInitialServerURL"
                        value={newRow?.serviceInitialServerURL}
                        onChange={(e) =>
                          handleInputChange(
                            "serviceInitialServerURL",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <InputSelect
                        className="backcolorinput"
                        options={[
                          { value: 1, label: "GET" },
                          { value: 2, label: "POST" },
                        ]}
                        id="defaultMethod"
                        name="defaultMethod"
                        value={newRow?.defaultMethod}
                        onChange={(e) =>
                          handleInputChange("defaultMethod", e.target.value)
                        }
                      ></InputSelect>
                    </td>
                    <td>
                      <InputField
                        type="text"
                        className="backcolorinput"
                        name="serviceUserName"
                        id="serviceUserName"
                        value={newRow?.serviceUserName}
                        onChange={(e) =>
                          handleInputChange("serviceUserName", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <InputField
                        type="password"
                        className="backcolorinput"
                        name="servicePassword"
                        id="servicePassword"
                        value={newRow?.servicePassword}
                        onChange={(e) =>
                          handleInputChange("servicePassword", e.target.value)
                        }
                      />
                    </td>
                    <td className="px-0 action-buttons">
                      <button
                        className="btn btn-sm me-1 py-0 px-0"
                        style={{ background: "#34495e", color: "white" }}
                        onClick={() => handleAddRow()}
                      >
                        <FontAwesomeIcon
                          icon={faAdd}
                          className="dropdown-gear-icon"
                          size="sm"
                        />
                        {isEditing !== null ? "Modify" : "Add"}
                      </button>

                      <button
                        className="btn btn-sm ms-1 py-0 px-0"
                        style={{ background: "#34495e", color: "white" }}
                        onClick={() => clearRow()}
                      >
                        <FontAwesomeIcon
                          icon={faRefresh}
                          className="dropdown-gear-icon"
                          size="sm"
                        />
                        Clear
                      </button>
                    </td>
                  </tr>
                  {rows?.map((row, index) => (
                    <tr className="table-row-form text-start" key={index}>
                      <td>{row?.serviceReferenceName || "---"}</td>
                      <td>{row?.serviceInitialServerURL || "---"}</td>
                      <td>{row?.defaultMethod || "---"}</td>
                      <td>{row?.serviceUserName || "---"}</td>
                      <td>{row?.servicePassword || "---"}</td>
                      <td className="">
                        <div className="text-center">
                          <button
                            className="btn btn-warning btn-sm me-1 py-0 px-1"
                            onClick={() => handleEditRow(index)}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="dropdown-gear-icon"
                              size="xs"
                            />
                          </button>
                          <button
                            className="btn btn-danger btn-sm ms-1 py-0 px-1"
                            onClick={() => handleRemoveRow(index)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="dropdown-gear-icon"
                              size="xs"
                            />
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
          <div className="text-center py-1 rounded-2 configuration-buttons">
            <button className="btn btn-sm me-1" onClick={handleSaveConfig}>
              <FontAwesomeIcon
                icon={faFile}
                className="dropdown-gear-icon me-1"
              />
              Save
            </button>
            <button
              className="btn btn-sm ms-1 me-1"
              onClick={checkDBConnection}
            >
              <FontAwesomeIcon
                icon={faDatabase}
                className="dropdown-gear-icon me-1"
              />
              Test DB Connection
            </button>
            <button className="btn btn-sm ms-1 me-1" onClick={reset}>
              <FontAwesomeIcon
                icon={faRefresh}
                className="dropdown-gear-icon me-1"
              />
              Reset
            </button>
            <button
              className="btn btn-sm ms-1 me-1"
              onClick={getDashConfigData}
            >
              <FontAwesomeIcon
                icon={faDatabase}
                className="dropdown-gear-icon me-1"
              />
              Refresh Data
            </button>
            <button className="btn btn-sm ms-1" onClick={clearAllCache}>
              <FontAwesomeIcon
                icon={faDatabase}
                className="dropdown-gear-icon me-1"
              />
              Clear All Cached Data
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DbConfigMaster;
