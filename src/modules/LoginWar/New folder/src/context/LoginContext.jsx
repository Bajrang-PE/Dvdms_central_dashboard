import { createContext, useState } from "react";
import { fetchData } from "../utils/ApiHooks";

export const LoginContext = createContext();

const LoginContextApi = ({ children }) => {

    //Globals
    const [showCmsLogin, setShowCmsLogin] = useState(false);
    const [showForgotPass, setShowForgotPass] = useState(false);
    const [selectedOption, setSelectedOption] = useState([]);
    const [openPage, setOpenPage] = useState('home')
    //API Data
    const [widgetData, setWidgetData] = useState([]);
    const [zoneListData, setZoneListData] = useState([]);

    //dropdowns
    const [hintQuestionDrpDt, setHintQuestionDrpDt] = useState([]);
    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);


    const getWidgetData = () => {
        fetchData('http://10.226.25.164:8024/hisutils/allWidgetConfiguration?dashboardFor=CENTRAL+DASHBOARD').then((data) => {
            if (data) {
                setWidgetData(data)
            } else {
                setWidgetData([])
            }
        })
    }

    const getZoneListData = (status) => {
        fetchData(`api/v1/zones/status?status=${status ? status : "1"}`).then((data) => {
            if (data) {
                setZoneListData(data)
            } else {
                setZoneListData([])
            }
        })
    }

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

    return (
        <LoginContext.Provider value={{
            widgetData, getWidgetData,
            showCmsLogin, setShowCmsLogin,
            showForgotPass, setShowForgotPass,
            getHintQuestionDrpData, hintQuestionDrpDt,
            getSteteNameDrpData, stateNameDrpDt,
            selectedOption, setSelectedOption,
            openPage, setOpenPage,
            getZoneListData, zoneListData
        }}>
            {children}
        </LoginContext.Provider>
    )

}

export default LoginContextApi