import { createContext, useState } from "react";
import { fetchData } from "../../../utils/ApiHooks";

export const LoginContext = createContext();

const LoginContextApi = ({ children }) => {

    //Globals
    const [showCmsLogin, setShowCmsLogin] = useState(false);
    const [showForgotPass, setShowForgotPass] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [openPage, setOpenPage] = useState('home')

    //API Data
    const [widgetData, setWidgetData] = useState([]);

    //masters
    const [zoneListData, setZoneListData] = useState([]);
    const [facilityTypeListData, setFacilityTypeListData] = useState([]);
    const [genericDrugListData, setGenericDrugListData] = useState([]);
    const [stateListData, setStateListData] = useState([]);
    const [groupListData, setGroupListData] = useState([]);
    const [stateJobListData, setStateJobListData] = useState([]);

    //dropdowns
    const [hintQuestionDrpDt, setHintQuestionDrpDt] = useState([]);
    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [supplierNameDrpDt, setSupplierNameDrpDt] = useState([]);
    const [districtNameDrpDt, setDistrictNameDrpDt] = useState([]);
    const [groupDrpData, setGroupDrpData] = useState([]);
    const [subGroupDrpData, setSubGroupDrpData] = useState([]);
    const [facilityTypeDrpDt, setFacilityTypeDrpDt] = useState([]);
    const [drugTypeDrpData, setDrugTypeDrpData] = useState([]);
    const [zoneDrpData, setZoneDrpData] = useState([]);


    //confirm alert
    const [confirmSave, setConfirmSave] = useState(false);
    const [showConfirmSave, setShowConfirmSave] = useState(false);


    const getWidgetData = () => {
        fetchData('http://10.226.25.164:8024/hisutils/allWidgetConfiguration?dashboardFor=CENTRAL+DASHBOARD').then((data) => {
            if (data) {
                setWidgetData(data)
            } else {
                setWidgetData([])
            }
        })
    }


    //-----------------------------------------------MASTERS----------------------------------------------
    const getZoneListData = (status) => {
        fetchData(`api/v1/zones/status?status=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setZoneListData(data?.data)
            } else {
                setZoneListData([])
            }
        })
    }

    const getFacilityTypeListData = (status) => {
        fetchData(`api/v1/Facility/status?status=${status ? status : "1"}`).then((data) => {
            if (data.status == 1) {
                setFacilityTypeListData(data?.data)
            } else {
                setFacilityTypeListData([])
            }
        })
    }

    const getGenericDrugListData = (grpId, sbGrpId, status) => {
        const params = {
            groupId: grpId ? grpId : '0',
            subgroupId: sbGrpId ? sbGrpId : "0",
            isValid: status ? status : "1"
        }

        fetchData(`api/v1/drugs`, params).then((data) => {
            if (data?.status === 1) {
                setGenericDrugListData(data?.data)
            } else {
                setGenericDrugListData([])
            }
        })
    }

    const getStateListData = (status) => {
        fetchData(`api/v1/State/${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setStateListData(data?.data)
            } else {
                setStateListData([])
            }
        })
    }
    const getGroupListData = (status) => {
        fetchData(`api/v1/Group/status?status=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setGroupListData(data?.data)
            } else {
                setGroupListData([])
            }
        })
    }

    const getStateJobDetailsListData = (stateId, status) => {
        fetchData(`http://10.226.26.247:8025/api/v1/stateJobDetails/getJobDetailsByStateID?stateID=${stateId ? stateId : '0'}&isActive=${status ? status : "1"}`).then((data) => {
            if (data?.status === 1) {
                setStateJobListData(data?.data)
            } else {
                setStateJobListData([])
            }
        })
    }


    //----------------------------------Dropdowns----------------------------------------------------------
    const getHintQuestionDrpData = () => {
        fetchData('/login/hntQueDropDown').then((data) => {
            if (data?.status === 1) {
                setHintQuestionDrpDt(data?.data)
            } else {
                setHintQuestionDrpDt([])
            }
        })
    }

    const getSteteNameDrpData = () => {
        fetchData('http://10.226.29.102:8025/state/getstate').then((data) => {
            if (data) {

                const drpData = data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumStateId,
                        label: dt?.cwhstrStateName
                    }

                    return val;
                })

                setStateNameDrpDt(drpData)

            } else {
                setStateNameDrpDt([])
            }
        })
    }

    const getDistrictNameDrpData = (id) => {
        fetchData('/state/getstate').then((data) => {
            if (data) {

                const drpData = data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumStateId,
                        label: dt?.cwhstrStateName
                    }

                    return val;
                })

                setDistrictNameDrpDt(drpData)

            } else {
                setDistrictNameDrpDt([])
            }
        })
    }

    const getSupplierNameDrpData = () => {
        fetchData('/state/getstate').then((data) => {
            if (data) {

                const drpData = data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumStateId,
                        label: dt?.cwhstrStateName
                    }

                    return val;
                })

                setSupplierNameDrpDt(drpData)

            } else {
                setSupplierNameDrpDt([])
            }
        })
    }

    const getGroupDrpData = () => {
        fetchData('http://10.226.25.164:8025/api/v1/GrpDrpdwn').then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.id,
                        label: dt?.name
                    }

                    return val;
                })
                setGroupDrpData(drpData)

            } else {
                setGroupDrpData([])
            }
        })
    }

    const getDrugTypeDrpData = () => {
        fetchData('http://10.226.25.164:8025/api/v1/DrugTypeDropdown').then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumDrugTypeId,
                        label: dt?.cwhstrDrugTypeName
                    }
                    return val;
                })
                setDrugTypeDrpData(drpData)
            } else {
                setDrugTypeDrpData([])
            }
        })
    }

    const getSubGroupDrpData = (grpId) => {
        fetchData(`http://10.226.25.164:8025/api/v1/SubGrpDrpDwn/${grpId}`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.subgroupId,
                        label: dt?.subgroupName
                    }
                    return val;
                })
                setSubGroupDrpData(drpData)
            } else {
                setSubGroupDrpData([])
            }
        })
    }

    const getFacilityTypeDrpData = () => {
        fetchData('/api/v1/drpDwnFcltyTypMapMst').then((data) => {
            if (data?.status === 1) {
                setFacilityTypeDrpDt(data?.data)
            } else {
                setFacilityTypeDrpDt([])
            }
        })
    }

    const getZoneDrpData = () => {
        fetchData(`api/v1/zones/status?status=1`).then((data) => {
            if (data?.status === 1) {
                const drpData = data?.data?.map((dt) => {
                    const val = {
                        value: dt?.cwhnumZoneId,
                        label: dt?.cwhstrZoneName
                    }
                    return val;
                })
                setZoneDrpData(drpData)
            } else {
                setZoneDrpData([])
            }
        })
    }




    return (
        <LoginContext.Provider value={{
            widgetData, getWidgetData,
            showCmsLogin, setShowCmsLogin,
            showForgotPass, setShowForgotPass,
            getHintQuestionDrpData, hintQuestionDrpDt,
            getSteteNameDrpData, stateNameDrpDt,
            getSupplierNameDrpData, supplierNameDrpDt,
            getDistrictNameDrpData, districtNameDrpDt,
            selectedOption, setSelectedOption,
            openPage, setOpenPage,
            getGroupDrpData, groupDrpData, getSubGroupDrpData, subGroupDrpData,
            facilityTypeDrpDt, getFacilityTypeDrpData,
            drugTypeDrpData, getDrugTypeDrpData,
            zoneDrpData, getZoneDrpData,

            //confirm box
            showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave,


            //-----------masters----------
            getZoneListData, zoneListData,
            getFacilityTypeListData, facilityTypeListData,
            getGenericDrugListData, genericDrugListData,
            getStateListData, stateListData,
            getGroupListData, groupListData,
            getStateJobDetailsListData, stateJobListData
        }}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContextApi