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

    //dropdowns
    const [hintQuestionDrpDt, setHintQuestionDrpDt] = useState([]);
    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [supplierNameDrpDt, setSupplierNameDrpDt] = useState([]);
    const [districtNameDrpDt, setDistrictNameDrpDt] = useState([]);
    const [groupDrpData, setGroupDrpData] = useState([]);
    const [subGroupDrpData, setSubGroupDrpData] = useState([]);


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
            if (data) {
                setZoneListData(data)
            } else {
                setZoneListData([])
            }
        })
    }
    const getFacilityTypeListData = (status) => {
        fetchData(`api/v1/Facility/status?status=${status ? status : "1"}`).then((data) => {
            if (data) {
                setFacilityTypeListData(data)
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
            if (data) {
                setGenericDrugListData(data)
            } else {
                setGenericDrugListData([])
            }
        })
    }

    const getStateListData = (status) => {
        fetchData(`api/v1/State/${status ? status : "1"}`).then((data) => {
            if (data) {
                setStateListData(data)
            } else {
                setStateListData([])
            }
        })
    }

    //-----------------------------------------------MASTERS----------------------------------------------


    const getHintQuestionDrpData = () => {
        fetchData('/login/hntQueDropDown').then((data) => {
            if (data) {
                setHintQuestionDrpDt(data)
            } else {
                setHintQuestionDrpDt([])
            }
        })
    }

    const getSteteNameDrpData = () => {
        fetchData('/state/getstate').then((data) => {
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
        fetchData('/api/v1/GrpDrpdwn').then((data) => {
            if (data) {
                const drpData = data?.map((dt) => {
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
    const getSubGroupDrpData = (grpId) => {
        fetchData(`/api/v1/SubGrpDrpDwn/${grpId}`).then((data) => {
            if (data) {
                const drpData = data?.map((dt) => {
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

            //confirm box
            showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave,


            //-----------masters----------
            getZoneListData, zoneListData,
            getFacilityTypeListData, facilityTypeListData,
            getGenericDrugListData, genericDrugListData,
            getStateListData, stateListData
        }}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContextApi